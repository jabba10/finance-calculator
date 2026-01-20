(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[turbopack]/browser/dev/hmr-client/hmr-client.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/// <reference path="../../../shared/runtime-types.d.ts" />
/// <reference path="../../runtime/base/dev-globals.d.ts" />
/// <reference path="../../runtime/base/dev-protocol.d.ts" />
/// <reference path="../../runtime/base/dev-extensions.ts" />
__turbopack_context__.s([
    "connect",
    ()=>connect,
    "setHooks",
    ()=>setHooks,
    "subscribeToUpdate",
    ()=>subscribeToUpdate
]);
function connect({ addMessageListener, sendMessage, onUpdateError = console.error }) {
    addMessageListener((msg)=>{
        switch(msg.type){
            case 'turbopack-connected':
                handleSocketConnected(sendMessage);
                break;
            default:
                try {
                    if (Array.isArray(msg.data)) {
                        for(let i = 0; i < msg.data.length; i++){
                            handleSocketMessage(msg.data[i]);
                        }
                    } else {
                        handleSocketMessage(msg.data);
                    }
                    applyAggregatedUpdates();
                } catch (e) {
                    console.warn('[Fast Refresh] performing full reload\n\n' + "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" + 'You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n' + 'Consider migrating the non-React component export to a separate file and importing it into both files.\n\n' + 'It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n' + 'Fast Refresh requires at least one parent function component in your React tree.');
                    onUpdateError(e);
                    location.reload();
                }
                break;
        }
    });
    const queued = globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS;
    if (queued != null && !Array.isArray(queued)) {
        throw new Error('A separate HMR handler was already registered');
    }
    globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS = {
        push: ([chunkPath, callback])=>{
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    };
    if (Array.isArray(queued)) {
        for (const [chunkPath, callback] of queued){
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    }
}
const updateCallbackSets = new Map();
function sendJSON(sendMessage, message) {
    sendMessage(JSON.stringify(message));
}
function resourceKey(resource) {
    return JSON.stringify({
        path: resource.path,
        headers: resource.headers || null
    });
}
function subscribeToUpdates(sendMessage, resource) {
    sendJSON(sendMessage, {
        type: 'turbopack-subscribe',
        ...resource
    });
    return ()=>{
        sendJSON(sendMessage, {
            type: 'turbopack-unsubscribe',
            ...resource
        });
    };
}
function handleSocketConnected(sendMessage) {
    for (const key of updateCallbackSets.keys()){
        subscribeToUpdates(sendMessage, JSON.parse(key));
    }
}
// we aggregate all pending updates until the issues are resolved
const chunkListsWithPendingUpdates = new Map();
function aggregateUpdates(msg) {
    const key = resourceKey(msg.resource);
    let aggregated = chunkListsWithPendingUpdates.get(key);
    if (aggregated) {
        aggregated.instruction = mergeChunkListUpdates(aggregated.instruction, msg.instruction);
    } else {
        chunkListsWithPendingUpdates.set(key, msg);
    }
}
function applyAggregatedUpdates() {
    if (chunkListsWithPendingUpdates.size === 0) return;
    hooks.beforeRefresh();
    for (const msg of chunkListsWithPendingUpdates.values()){
        triggerUpdate(msg);
    }
    chunkListsWithPendingUpdates.clear();
    finalizeUpdate();
}
function mergeChunkListUpdates(updateA, updateB) {
    let chunks;
    if (updateA.chunks != null) {
        if (updateB.chunks == null) {
            chunks = updateA.chunks;
        } else {
            chunks = mergeChunkListChunks(updateA.chunks, updateB.chunks);
        }
    } else if (updateB.chunks != null) {
        chunks = updateB.chunks;
    }
    let merged;
    if (updateA.merged != null) {
        if (updateB.merged == null) {
            merged = updateA.merged;
        } else {
            // Since `merged` is an array of updates, we need to merge them all into
            // one, consistent update.
            // Since there can only be `EcmascriptMergeUpdates` in the array, there is
            // no need to key on the `type` field.
            let update = updateA.merged[0];
            for(let i = 1; i < updateA.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateA.merged[i]);
            }
            for(let i = 0; i < updateB.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateB.merged[i]);
            }
            merged = [
                update
            ];
        }
    } else if (updateB.merged != null) {
        merged = updateB.merged;
    }
    return {
        type: 'ChunkListUpdate',
        chunks,
        merged
    };
}
function mergeChunkListChunks(chunksA, chunksB) {
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    return chunks;
}
function mergeChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted' || updateA.type === 'deleted' && updateB.type === 'added') {
        return undefined;
    }
    if (updateA.type === 'partial') {
        invariant(updateA.instruction, 'Partial updates are unsupported');
    }
    if (updateB.type === 'partial') {
        invariant(updateB.instruction, 'Partial updates are unsupported');
    }
    return undefined;
}
function mergeChunkListEcmascriptMergedUpdates(mergedA, mergedB) {
    const entries = mergeEcmascriptChunkEntries(mergedA.entries, mergedB.entries);
    const chunks = mergeEcmascriptChunksUpdates(mergedA.chunks, mergedB.chunks);
    return {
        type: 'EcmascriptMergedUpdate',
        entries,
        chunks
    };
}
function mergeEcmascriptChunkEntries(entriesA, entriesB) {
    return {
        ...entriesA,
        ...entriesB
    };
}
function mergeEcmascriptChunksUpdates(chunksA, chunksB) {
    if (chunksA == null) {
        return chunksB;
    }
    if (chunksB == null) {
        return chunksA;
    }
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeEcmascriptChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    if (Object.keys(chunks).length === 0) {
        return undefined;
    }
    return chunks;
}
function mergeEcmascriptChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted') {
        // These two completely cancel each other out.
        return undefined;
    }
    if (updateA.type === 'deleted' && updateB.type === 'added') {
        const added = [];
        const deleted = [];
        const deletedModules = new Set(updateA.modules ?? []);
        const addedModules = new Set(updateB.modules ?? []);
        for (const moduleId of addedModules){
            if (!deletedModules.has(moduleId)) {
                added.push(moduleId);
            }
        }
        for (const moduleId of deletedModules){
            if (!addedModules.has(moduleId)) {
                deleted.push(moduleId);
            }
        }
        if (added.length === 0 && deleted.length === 0) {
            return undefined;
        }
        return {
            type: 'partial',
            added,
            deleted
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'partial') {
        const added = new Set([
            ...updateA.added ?? [],
            ...updateB.added ?? []
        ]);
        const deleted = new Set([
            ...updateA.deleted ?? [],
            ...updateB.deleted ?? []
        ]);
        if (updateB.added != null) {
            for (const moduleId of updateB.added){
                deleted.delete(moduleId);
            }
        }
        if (updateB.deleted != null) {
            for (const moduleId of updateB.deleted){
                added.delete(moduleId);
            }
        }
        return {
            type: 'partial',
            added: [
                ...added
            ],
            deleted: [
                ...deleted
            ]
        };
    }
    if (updateA.type === 'added' && updateB.type === 'partial') {
        const modules = new Set([
            ...updateA.modules ?? [],
            ...updateB.added ?? []
        ]);
        for (const moduleId of updateB.deleted ?? []){
            modules.delete(moduleId);
        }
        return {
            type: 'added',
            modules: [
                ...modules
            ]
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'deleted') {
        // We could eagerly return `updateB` here, but this would potentially be
        // incorrect if `updateA` has added modules.
        const modules = new Set(updateB.modules ?? []);
        if (updateA.added != null) {
            for (const moduleId of updateA.added){
                modules.delete(moduleId);
            }
        }
        return {
            type: 'deleted',
            modules: [
                ...modules
            ]
        };
    }
    // Any other update combination is invalid.
    return undefined;
}
function invariant(_, message) {
    throw new Error(`Invariant: ${message}`);
}
const CRITICAL = [
    'bug',
    'error',
    'fatal'
];
function compareByList(list, a, b) {
    const aI = list.indexOf(a) + 1 || list.length;
    const bI = list.indexOf(b) + 1 || list.length;
    return aI - bI;
}
const chunksWithIssues = new Map();
function emitIssues() {
    const issues = [];
    const deduplicationSet = new Set();
    for (const [_, chunkIssues] of chunksWithIssues){
        for (const chunkIssue of chunkIssues){
            if (deduplicationSet.has(chunkIssue.formatted)) continue;
            issues.push(chunkIssue);
            deduplicationSet.add(chunkIssue.formatted);
        }
    }
    sortIssues(issues);
    hooks.issues(issues);
}
function handleIssues(msg) {
    const key = resourceKey(msg.resource);
    let hasCriticalIssues = false;
    for (const issue of msg.issues){
        if (CRITICAL.includes(issue.severity)) {
            hasCriticalIssues = true;
        }
    }
    if (msg.issues.length > 0) {
        chunksWithIssues.set(key, msg.issues);
    } else if (chunksWithIssues.has(key)) {
        chunksWithIssues.delete(key);
    }
    emitIssues();
    return hasCriticalIssues;
}
const SEVERITY_ORDER = [
    'bug',
    'fatal',
    'error',
    'warning',
    'info',
    'log'
];
const CATEGORY_ORDER = [
    'parse',
    'resolve',
    'code generation',
    'rendering',
    'typescript',
    'other'
];
function sortIssues(issues) {
    issues.sort((a, b)=>{
        const first = compareByList(SEVERITY_ORDER, a.severity, b.severity);
        if (first !== 0) return first;
        return compareByList(CATEGORY_ORDER, a.category, b.category);
    });
}
const hooks = {
    beforeRefresh: ()=>{},
    refresh: ()=>{},
    buildOk: ()=>{},
    issues: (_issues)=>{}
};
function setHooks(newHooks) {
    Object.assign(hooks, newHooks);
}
function handleSocketMessage(msg) {
    sortIssues(msg.issues);
    handleIssues(msg);
    switch(msg.type){
        case 'issues':
            break;
        case 'partial':
            // aggregate updates
            aggregateUpdates(msg);
            break;
        default:
            // run single update
            const runHooks = chunkListsWithPendingUpdates.size === 0;
            if (runHooks) hooks.beforeRefresh();
            triggerUpdate(msg);
            if (runHooks) finalizeUpdate();
            break;
    }
}
function finalizeUpdate() {
    hooks.refresh();
    hooks.buildOk();
    // This is used by the Next.js integration test suite to notify it when HMR
    // updates have been completed.
    // TODO: Only run this in test environments (gate by `process.env.__NEXT_TEST_MODE`)
    if (globalThis.__NEXT_HMR_CB) {
        globalThis.__NEXT_HMR_CB();
        globalThis.__NEXT_HMR_CB = null;
    }
}
function subscribeToChunkUpdate(chunkListPath, sendMessage, callback) {
    return subscribeToUpdate({
        path: chunkListPath
    }, sendMessage, callback);
}
function subscribeToUpdate(resource, sendMessage, callback) {
    const key = resourceKey(resource);
    let callbackSet;
    const existingCallbackSet = updateCallbackSets.get(key);
    if (!existingCallbackSet) {
        callbackSet = {
            callbacks: new Set([
                callback
            ]),
            unsubscribe: subscribeToUpdates(sendMessage, resource)
        };
        updateCallbackSets.set(key, callbackSet);
    } else {
        existingCallbackSet.callbacks.add(callback);
        callbackSet = existingCallbackSet;
    }
    return ()=>{
        callbackSet.callbacks.delete(callback);
        if (callbackSet.callbacks.size === 0) {
            callbackSet.unsubscribe();
            updateCallbackSets.delete(key);
        }
    };
}
function triggerUpdate(msg) {
    const key = resourceKey(msg.resource);
    const callbackSet = updateCallbackSets.get(key);
    if (!callbackSet) {
        return;
    }
    for (const callback of callbackSet.callbacks){
        callback(msg);
    }
    if (msg.type === 'notFound') {
        // This indicates that the resource which we subscribed to either does not exist or
        // has been deleted. In either case, we should clear all update callbacks, so if a
        // new subscription is created for the same resource, it will send a new "subscribe"
        // message to the server.
        // No need to send an "unsubscribe" message to the server, it will have already
        // dropped the update stream before sending the "notFound" message.
        updateCallbackSets.delete(key);
    }
}
}),
"[project]/src/pages/homepage.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "calculatorsSection": "homepage-module__XyMAXq__calculatorsSection",
  "card": "homepage-module__XyMAXq__card",
  "cardAction": "homepage-module__XyMAXq__cardAction",
  "cardDesc": "homepage-module__XyMAXq__cardDesc",
  "cardIcon": "homepage-module__XyMAXq__cardIcon",
  "cardLink": "homepage-module__XyMAXq__cardLink",
  "cardTitle": "homepage-module__XyMAXq__cardTitle",
  "cardsGrid": "homepage-module__XyMAXq__cardsGrid",
  "container": "homepage-module__XyMAXq__container",
  "hero": "homepage-module__XyMAXq__hero",
  "heroSubtitle": "homepage-module__XyMAXq__heroSubtitle",
  "heroTitle": "homepage-module__XyMAXq__heroTitle",
  "highlight": "homepage-module__XyMAXq__highlight",
  "homepage": "homepage-module__XyMAXq__homepage",
  "icon": "homepage-module__XyMAXq__icon",
  "loadMoreBtn": "homepage-module__XyMAXq__loadMoreBtn",
  "sectionSubtitle": "homepage-module__XyMAXq__sectionSubtitle",
  "simpleCta": "homepage-module__XyMAXq__simpleCta",
  "valueProp": "homepage-module__XyMAXq__valueProp",
  "valueProps": "homepage-module__XyMAXq__valueProps",
});
}),
"[project]/src/pages/index.jsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
// app/page.js or components/Homepage.jsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$homepage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/pages/homepage.module.css [client] (css module)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
const Homepage = ()=>{
    _s();
    const [visibleCalculators, setVisibleCalculators] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(6);
    // === Full List of 54 Calculators (paths matched exactly from BlogPost.jsx) ===
    const calculators = [
        {
            id: 1,
            title: 'Simple',
            icon: '🧮',
            description: 'A basic arithmetic calculator for addition, subtraction, multiplication, and division.',
            path: '/simple-calculator'
        },
        {
            id: 2,
            title: 'Tax',
            icon: '🧾',
            description: 'Calculate income tax or sales tax based on your location, earnings, and filing status.',
            path: '/tax-calculator'
        },
        {
            id: 3,
            title: 'Loan',
            icon: '🏦',
            description: 'Determine monthly loan payments, total interest paid, and view a full amortization schedule.',
            path: '/loan-calculator'
        },
        {
            id: 4,
            title: 'Break-even',
            icon: '⚖️',
            description: 'Find the exact sales volume needed to cover all fixed and variable costs.',
            path: '/break-even-calculator'
        },
        {
            id: 5,
            title: 'Cashflow',
            icon: '💸',
            description: 'Track and project business or personal cash inflows and outflows.',
            path: '/cashflow-calculator'
        },
        {
            id: 6,
            title: 'CAC',
            icon: '🎯',
            description: 'Calculate Customer Acquisition Cost to measure how much you spend to gain a new customer.',
            path: '/cac-calculator'
        },
        {
            id: 7,
            title: 'Markup',
            icon: '🏷️',
            description: 'Set profitable product prices by applying a markup percentage to cost.',
            path: '/markup-calculator'
        },
        {
            id: 8,
            title: 'Profit Margin',
            icon: '📉',
            description: 'Compute gross and net profit margins to understand profitability.',
            path: '/profit-margin-calculator'
        },
        {
            id: 9,
            title: 'ROI',
            icon: '📈',
            description: 'Measure Return on Investment for marketing campaigns, real estate, stocks, or any capital expenditure.',
            path: '/roi-calculator'
        },
        {
            id: 10,
            title: 'NPV',
            icon: '📊',
            description: 'Calculate Net Present Value of future cash flows to determine investment returns.',
            path: '/npv-calculator'
        },
        {
            id: 11,
            title: 'Payroll',
            icon: '📋',
            description: 'Estimate total payroll costs including wages, overtime, taxes, and deductions.',
            path: '/payroll-calculator'
        },
        {
            id: 12,
            title: 'Gross Profit',
            icon: '💰',
            description: 'Calculate gross profit by subtracting cost of goods sold from total revenue.',
            path: '/gross-profit-calculator'
        },
        {
            id: 13,
            title: 'EBITDA',
            icon: '💼',
            description: 'Determine Earnings Before Interest, Taxes, Depreciation, and Amortization.',
            path: '/ebitda-calculator'
        },
        {
            id: 14,
            title: 'Inventory',
            icon: '📦',
            description: 'Analyze inventory turnover ratio to measure how often stock is sold and replaced.',
            path: '/inventory-turnover-calculator'
        },
        {
            id: 15,
            title: 'Working Capital',
            icon: '💳',
            description: 'Assess short-term financial health by calculating current assets minus liabilities.',
            path: '/working-capital-calculator'
        },
        {
            id: 16,
            title: 'Debt/Equity',
            icon: '📉',
            description: 'Evaluate financial leverage by comparing total debt to shareholders equity.',
            path: '/debt-to-equity-calculator'
        },
        {
            id: 17,
            title: 'Current Ratio',
            icon: '🔍',
            description: 'Measure ability to pay short-term obligations using current assets.',
            path: '/current-ratio-calculator'
        },
        {
            id: 18,
            title: 'ROE',
            icon: '🏦',
            description: 'Calculate Return on Equity to assess profit generation from shareholder investments.',
            path: '/roe-calculator'
        },
        {
            id: 19,
            title: 'Valuation',
            icon: '🏢',
            description: 'Estimate the fair market value of your business using revenue and multiples.',
            path: '/business-valuation-calculator'
        },
        {
            id: 20,
            title: 'EVA',
            icon: '💡',
            description: 'Compute Economic Value Added — the profit after covering cost of capital.',
            path: '/eva-calculator'
        },
        {
            id: 21,
            title: 'WACC',
            icon: '📉',
            description: 'Find Weighted Average Cost of Capital for valuation and finance decisions.',
            path: '/wacc-calculator'
        },
        {
            id: 22,
            title: '401K',
            icon: '🏦',
            description: 'Project retirement savings growth with employer match and compound interest.',
            path: '/retirement-calculator'
        },
        {
            id: 23,
            title: 'CD',
            icon: '🔒',
            description: 'Calculate maturity amount and interest earned on a Certificate of Deposit.',
            path: '/cd-calculator'
        },
        {
            id: 24,
            title: 'Bonds',
            icon: '📜',
            description: 'Estimate yield and return from government bonds like Treasury securities.',
            path: '/government-bonds-calculator'
        },
        {
            id: 25,
            title: 'Leverage',
            icon: '⚙️',
            description: 'Analyze how fixed costs affect profitability when sales volume changes.',
            path: '/operating-leverage-calculator'
        },
        {
            id: 26,
            title: 'Cash Flow',
            icon: '🔄',
            description: 'Calculate Free Cash Flow available for expansion, dividends, or debt reduction.',
            path: '/free-cash-flow-calculator'
        },
        {
            id: 27,
            title: 'Lease/Buy',
            icon: '🚗',
            description: 'Compare leasing vs buying a vehicle or equipment to make smarter decisions.',
            path: '/lease-vs-buy-calculator'
        },
        {
            id: 28,
            title: 'Pension',
            icon: '👵',
            description: 'Estimate monthly pension income in retirement based on service and salary.',
            path: '/pension-planning-calculator'
        },
        {
            id: 29,
            title: 'Tax Bracket',
            icon: '🔖',
            description: 'Determine your federal and state tax brackets and marginal tax rate.',
            path: '/tax-bracket-calculator'
        },
        {
            id: 30,
            title: 'Education',
            icon: '🎓',
            description: 'Plan for future education expenses including tuition and living costs.',
            path: '/education-cost-calculator'
        },
        {
            id: 31,
            title: 'Crypto',
            icon: '₿',
            description: 'Track crypto investment performance and estimate gains, losses, and taxes.',
            path: '/crypto-investment-calculator'
        },
        {
            id: 32,
            title: 'Debt',
            icon: '💳',
            description: 'Create a payoff plan for credit card debt using snowball or avalanche methods.',
            path: '/credit-card-payoff-calculator'
        },
        {
            id: 33,
            title: 'Purchasing Power',
            icon: '🌍',
            description: 'See how inflation or exchange rates affect the real value of money.',
            path: '/purchasing-power-parity-calculator'
        },
        {
            id: 34,
            title: 'Development',
            icon: '🏗️',
            description: 'Analyze real estate development feasibility before breaking ground.',
            path: '/development-feasibility-calculator'
        },
        {
            id: 35,
            title: 'Occupancy',
            icon: '🏢',
            description: 'Compare occupancy costs for office, retail, or industrial space.',
            path: '/occupancy-cost-calculator'
        },
        {
            id: 36,
            title: 'Litigation',
            icon: '⚖️',
            description: 'Estimate legal fees, court costs, and settlement expenses.',
            path: '/litigation-cost-calculator'
        },
        {
            id: 37,
            title: 'Monte Carlo',
            icon: '🎲',
            description: 'Use probabilistic modeling to simulate financial outcomes and risk.',
            path: '/monte-carlo-simulation-calculator'
        },
        {
            id: 38,
            title: 'Game Theory',
            icon: '♟️',
            description: 'Model strategic interactions between competitors or players.',
            path: '/game-theory-payoff-calculator'
        },
        {
            id: 39,
            title: 'Financial Literacy',
            icon: '📚',
            description: 'Test your knowledge of personal finance and improve financial IQ.',
            path: '/financial-literacy-score-calculator'
        },
        {
            id: 40,
            title: 'Staking',
            icon: '🔗',
            description: 'Calculate potential rewards from staking cryptocurrencies over time.',
            path: '/staking-rewards-calculator'
        },
        {
            id: 41,
            title: 'Time Value of Money',
            icon: '⏳',
            description: 'Understand how money grows or loses value over time due to interest.',
            path: '/time-value-of-money-calculator'
        },
        {
            id: 42,
            title: 'Discounted Cash Flow',
            icon: '📉',
            description: 'Value a business or investment by discounting future cash flows.',
            path: '/discounted-cash-flow-calculator'
        },
        {
            id: 43,
            title: 'Duration Convexity',
            icon: '📉',
            description: 'Measure bond price sensitivity to interest rate changes.',
            path: '/duration-convexity-calculator'
        },
        {
            id: 44,
            title: 'Option Pricing',
            icon: '💱',
            description: 'Price call and put options using models like Black-Scholes.',
            path: '/option-pricing-calculator'
        },
        {
            id: 45,
            title: 'HE-LOC',
            icon: '🏠',
            description: 'Calculate payments and limits for a Home Equity Line of Credit.',
            path: '/he-loc-calculator'
        },
        {
            id: 46,
            title: 'Accounts Receivable Turnover',
            icon: '📬',
            description: 'Measure how quickly a company collects payments from customers.',
            path: '/accounts-receivable-turnover-calculator'
        },
        {
            id: 47,
            title: 'Legal Retainer',
            icon: '⚖️',
            description: 'Track remaining balance and usage of a legal retainer fee.',
            path: '/legal-retainer-calculator'
        },
        {
            id: 48,
            title: 'Flipping Profit',
            icon: '🔄',
            description: 'Estimate profit from flipping houses, cars, or collectibles.',
            path: '/flipping-profit-calculator'
        },
        {
            id: 49,
            title: 'Mortgage Refinance',
            icon: '🏡',
            description: 'Determine break-even point after refinancing a mortgage.',
            path: '/mortgage-refinance-break-even-calculator'
        },
        {
            id: 50,
            title: 'Worker Classification',
            icon: '👷',
            description: 'Determine if a worker is an employee or independent contractor.',
            path: '/worker-classification-calculator'
        },
        {
            id: 51,
            title: 'Property Taxes',
            icon: '🏠',
            description: 'Calculate annual or monthly property tax based on home value.',
            path: '/property-tax-calculator'
        },
        {
            id: 52,
            title: 'Car Loan',
            icon: '🚗',
            description: 'Estimate monthly payments and total cost of financing a car.',
            path: '/car-loan-calculator'
        },
        {
            id: 53,
            title: 'Social Security',
            icon: '👵',
            description: 'Forecast Social Security retirement benefits based on earnings history.',
            path: '/social-security-calculator'
        },
        {
            id: 54,
            title: 'PPF',
            icon: '🇮🇳',
            description: 'Plan savings and project maturity in India Public Provident Fund.',
            path: '/ppf-calculator'
        }
    ];
    const loadMoreCalculators = ()=>{
        setVisibleCalculators((prev)=>Math.min(prev + 6, calculators.length));
    };
    // SEO Metadata - Enhanced with dozens of keywords
    const siteUrl = 'https://www.financecalculatorfree.com';
    const pageTitle = '57 Free Financial Calculators | Business, Investment & Personal Finance Tools 2024';
    const pageDescription = 'Access 57+ free financial calculators for business planning, investment analysis, loan calculations, tax planning, retirement, and personal finance. No signup required. 100% private.';
    const imagePreview = `${siteUrl}/images/financial-calculators-preview.jpg`;
    // Comprehensive SEO Keywords Collections
    const singleKeywords = [
        'calculator',
        'finance',
        'business',
        'investment',
        'loan',
        'tax',
        'mortgage',
        'retirement',
        'ROI',
        'NPV',
        'profit',
        'cashflow',
        'budget',
        'savings',
        'debt',
        'equity',
        'valuation',
        'amortization',
        'interest',
        'compound',
        '401k',
        'IRA',
        'stocks',
        'bonds',
        'crypto',
        'realestate',
        'payroll',
        'EBITDA',
        'WACC',
        'DCF'
    ];
    const twoWordKeywords = [
        'financial calculator',
        'business calculator',
        'loan calculator',
        'tax calculator',
        'mortgage calculator',
        'investment calculator',
        'retirement calculator',
        'ROI calculator',
        'profit calculator',
        'cash flow',
        'debt calculator',
        'equity calculator',
        'savings calculator',
        'budget calculator',
        'amortization calculator',
        'interest calculator',
        'compound interest',
        'stock calculator',
        'bond calculator',
        'crypto calculator',
        'real estate',
        'payroll calculator',
        'business valuation',
        'financial planning',
        'wealth management',
        'risk assessment',
        'credit score',
        'net worth'
    ];
    const longTailKeywords = [
        'free online financial calculators for business',
        'how to calculate return on investment for small business',
        'best loan amortization calculator with extra payments',
        'free tax calculation tools for self-employed',
        'mortgage payment calculator with PMI and taxes',
        'retirement savings calculator with social security',
        'business valuation calculator for small companies',
        'cash flow analysis calculator for startups',
        'investment return calculator with dividends',
        'debt payoff calculator snowball vs avalanche method',
        'compound interest calculator with monthly contributions',
        'commercial real estate investment analysis calculator',
        'small business loan calculator monthly payments',
        'capital budgeting calculator NPV IRR payback period',
        'financial ratio analysis calculator for businesses',
        'cryptocurrency investment calculator tax implications',
        '401k retirement calculator employer match',
        'small business break even point calculator',
        'student loan repayment calculator different plans',
        'home equity line of credit calculator payments',
        'car loan calculator with trade in value',
        'credit card payoff calculator minimum payments',
        'small business profit margin calculator',
        'inventory turnover ratio calculator manufacturing',
        'working capital requirement calculator seasonal',
        'discounted cash flow valuation calculator startup',
        'small business tax deduction calculator self employed',
        'commercial lease calculator net effective rent',
        'business loan calculator SBA 7a term',
        'investment property calculator cash on cash',
        'retirement income calculator with inflation',
        'college savings calculator 529 plan',
        'small business financial planning tools free',
        'business acquisition loan calculator seller financing',
        'commercial mortgage calculator balloon payment',
        'startup funding calculator equity dilution',
        'small business valuation calculator multiples',
        'financial independence calculator FIRE movement',
        'debt to income ratio calculator mortgage',
        'small business cash flow forecast template',
        'investment portfolio rebalancing calculator',
        'business expansion loan calculator ROI',
        'commercial property valuation calculator cap rate',
        'small business line of credit calculator',
        'angel investment calculator equity stake',
        'franchise financing calculator initial investment',
        'equipment financing calculator lease vs buy',
        'small business insurance cost calculator',
        'import export business calculator duties',
        'ecommerce business calculator shipping costs',
        'restaurant business calculator food costs',
        'construction business calculator project bidding',
        'consulting business calculator hourly rate',
        'manufacturing business calculator unit cost',
        'nonprofit organization calculator fundraising',
        'agriculture business calculator crop yield',
        'transportation business calculator fuel costs'
    ];
    const allKeywords = [
        ...singleKeywords,
        ...twoWordKeywords,
        ...longTailKeywords
    ].join(', ');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("html", {
                        lang: "en"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.jsx",
                        lineNumber: 162,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        charSet: "utf-8"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.jsx",
                        lineNumber: 163,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "viewport",
                        content: "width=device-width, initial-scale=1"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.jsx",
                        lineNumber: 164,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                        children: pageTitle
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.jsx",
                        lineNumber: 165,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "description",
                        content: pageDescription
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.jsx",
                        lineNumber: 166,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "keywords",
                        content: allKeywords
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.jsx",
                        lineNumber: 167,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "author",
                        content: "Calci Financial Tools"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.jsx",
                        lineNumber: 168,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "robots",
                        content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.jsx",
                        lineNumber: 169,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "subject",
                        content: "Financial Calculators & Business Tools"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.jsx",
                        lineNumber: 172,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "classification",
                        content: "Finance, Business, Calculators, Investment Tools"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.jsx",
                        lineNumber: 173,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "topic",
                        content: "Financial Planning and Business Analysis"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.jsx",
                        lineNumber: 174,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "summary",
                        content: "Free financial calculators for business and personal finance"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.jsx",
                        lineNumber: 175,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "url",
                        content: siteUrl
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.jsx",
                        lineNumber: 176,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "google-site-verification",
                        content: "your_verification_code"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.jsx",
                        lineNumber: 179,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "msvalidate.01",
                        content: "your_bing_verification"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.jsx",
                        lineNumber: 180,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "geo.region",
                        content: "US"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.jsx",
                        lineNumber: 183,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "geo.placename",
                        content: "United States"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.jsx",
                        lineNumber: 184,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "geo.position",
                        content: "39.8283;-98.5795"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.jsx",
                        lineNumber: 185,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "ICBM",
                        content: "39.8283, -98.5795"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.jsx",
                        lineNumber: 186,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                        rel: "canonical",
                        href: siteUrl
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.jsx",
                        lineNumber: 189,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                        rel: "alternate",
                        href: siteUrl,
                        hrefLang: "x-default"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.jsx",
                        lineNumber: 192,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                        rel: "alternate",
                        href: siteUrl,
                        hrefLang: "en"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.jsx",
                        lineNumber: 193,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                        rel: "alternate",
                        href: `${siteUrl}/es`,
                        hrefLang: "es"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.jsx",
                        lineNumber: 194,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                        rel: "preconnect",
                        href: "https://fonts.googleapis.com"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.jsx",
                        lineNumber: 197,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                        rel: "preconnect",
                        href: "https://fonts.gstatic.com",
                        crossOrigin: "true"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.jsx",
                        lineNumber: 198,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:type",
                        content: "website"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.jsx",
                        lineNumber: 201,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:url",
                        content: siteUrl
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.jsx",
                        lineNumber: 202,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:title",
                        content: pageTitle
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.jsx",
                        lineNumber: 203,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:description",
                        content: pageDescription
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.jsx",
                        lineNumber: 204,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:image",
                        content: imagePreview
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.jsx",
                        lineNumber: 205,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:image:alt",
                        content: "Comprehensive Financial Calculators Collection"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.jsx",
                        lineNumber: 206,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:site_name",
                        content: "Calci Financial Calculators"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.jsx",
                        lineNumber: 207,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:locale",
                        content: "en_US"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.jsx",
                        lineNumber: 208,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:see_also",
                        content: siteUrl
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.jsx",
                        lineNumber: 209,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "fb:app_id",
                        content: "your_facebook_app_id"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.jsx",
                        lineNumber: 212,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "fb:pages",
                        content: "your_facebook_page_id"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.jsx",
                        lineNumber: 213,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "twitter:card",
                        content: "summary_large_image"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.jsx",
                        lineNumber: 216,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "twitter:site",
                        content: "@calcifinance"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.jsx",
                        lineNumber: 217,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "twitter:creator",
                        content: "@calcifinance"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.jsx",
                        lineNumber: 218,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "twitter:title",
                        content: pageTitle
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.jsx",
                        lineNumber: 219,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "twitter:description",
                        content: pageDescription
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.jsx",
                        lineNumber: 220,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "twitter:image",
                        content: imagePreview
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.jsx",
                        lineNumber: 221,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "twitter:image:alt",
                        content: "Free Financial Calculators for Business and Personal Use"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.jsx",
                        lineNumber: 222,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "pinterest",
                        content: "nopin",
                        description: "Financial calculators and business tools"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.jsx",
                        lineNumber: 225,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("script", {
                        type: "application/ld+json",
                        children: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'WebPage',
                            name: pageTitle,
                            description: pageDescription,
                            url: siteUrl,
                            mainEntity: {
                                '@type': 'ItemList',
                                numberOfItems: calculators.length,
                                itemListElement: calculators.slice(0, 10).map((calc, index)=>({
                                        '@type': 'ListItem',
                                        position: index + 1,
                                        item: {
                                            '@type': 'FinancialProduct',
                                            name: `${calc.title} Calculator`,
                                            description: calc.description,
                                            url: `${siteUrl}${calc.path}`
                                        }
                                    }))
                            },
                            breadcrumb: {
                                '@type': 'BreadcrumbList',
                                itemListElement: [
                                    {
                                        '@type': 'ListItem',
                                        position: 1,
                                        name: 'Home',
                                        item: siteUrl
                                    }
                                ]
                            },
                            publisher: {
                                '@type': 'Organization',
                                name: 'Calci Financial Tools',
                                url: siteUrl,
                                logo: `${siteUrl}/images/logo.png`,
                                sameAs: [
                                    'https://twitter.com/calcifinance',
                                    'https://www.linkedin.com/company/calci-finance',
                                    'https://www.facebook.com/calcifinance'
                                ]
                            }
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.jsx",
                        lineNumber: 228,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("script", {
                        type: "application/ld+json",
                        children: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'CollectionPage',
                            name: 'Free Financial Calculators Collection',
                            description: 'A comprehensive collection of 57+ financial calculators with real formulas for business, investment, and personal finance.',
                            url: siteUrl,
                            hasPart: calculators.slice(0, 15).map((calc)=>({
                                    '@type': 'WebPage',
                                    name: calc.title + ' Calculator',
                                    url: `${siteUrl}${calc.path}`,
                                    description: calc.description,
                                    isAccessibleForFree: true
                                })),
                            about: {
                                '@type': 'Thing',
                                name: 'Financial Planning and Analysis'
                            },
                            audience: {
                                '@type': 'Audience',
                                audienceType: [
                                    'Small Business Owners',
                                    'Investors',
                                    'Financial Analysts',
                                    'Individuals'
                                ]
                            }
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.jsx",
                        lineNumber: 269,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("script", {
                        type: "application/ld+json",
                        children: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'FAQPage',
                            mainEntity: [
                                {
                                    '@type': 'Question',
                                    name: 'Are these financial calculators really free to use?',
                                    acceptedAnswer: {
                                        '@type': 'Answer',
                                        text: 'Yes, all 57+ financial calculators are completely free to use with no registration required. We believe in providing accessible financial tools for everyone.'
                                    }
                                },
                                {
                                    '@type': 'Question',
                                    name: 'Do you store my financial data?',
                                    acceptedAnswer: {
                                        '@type': 'Answer',
                                        text: 'No, all calculations are performed locally in your browser. We do not store, transmit, or collect any of your financial data or inputs.'
                                    }
                                },
                                {
                                    '@type': 'Question',
                                    name: 'What types of financial calculations can I perform?',
                                    acceptedAnswer: {
                                        '@type': 'Answer',
                                        text: 'Our calculator suite covers business finance (ROI, break-even, valuation), personal finance (loans, mortgages, retirement), investments (stocks, bonds, crypto), and specialized tools for specific industries and scenarios.'
                                    }
                                }
                            ]
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.jsx",
                        lineNumber: 295,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/index.jsx",
                lineNumber: 160,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$homepage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].homepage,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$homepage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].hero,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$homepage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].heroTitle,
                                children: [
                                    "Master Your Finances With ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$homepage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].highlight,
                                        children: "Smart Calculators"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/index.jsx",
                                        lineNumber: 333,
                                        columnNumber: 39
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/index.jsx",
                                lineNumber: 332,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$homepage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].heroSubtitle,
                                children: "57 precision tools powered by real financial formulas — no sign-up, just results."
                            }, void 0, false, {
                                fileName: "[project]/src/pages/index.jsx",
                                lineNumber: 335,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/suite",
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$homepage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].simpleCta,
                                children: "Explore All Calculators →"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/index.jsx",
                                lineNumber: 338,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/index.jsx",
                        lineNumber: 331,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$homepage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].valueProps,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$homepage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].container,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$homepage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].valueProp,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$homepage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].icon,
                                            children: "📊"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/index.jsx",
                                            lineNumber: 347,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            children: "Formula Accuracy"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/index.jsx",
                                            lineNumber: 348,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: "Industry-standard math — no guesswork."
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/index.jsx",
                                            lineNumber: 349,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/index.jsx",
                                    lineNumber: 346,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$homepage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].valueProp,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$homepage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].icon,
                                            children: "🔐"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/index.jsx",
                                            lineNumber: 352,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            children: "Private & Secure"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/index.jsx",
                                            lineNumber: 353,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: "Your inputs stay on your device."
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/index.jsx",
                                            lineNumber: 354,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/index.jsx",
                                    lineNumber: 351,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$homepage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].valueProp,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$homepage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].icon,
                                            children: "📘"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/index.jsx",
                                            lineNumber: 357,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            children: "Learn the Math"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/index.jsx",
                                            lineNumber: 358,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: "We show the logic behind every result."
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/index.jsx",
                                            lineNumber: 359,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/index.jsx",
                                    lineNumber: 356,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/index.jsx",
                            lineNumber: 345,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.jsx",
                        lineNumber: 344,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$homepage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].calculatorsSection,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$homepage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].container,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    children: "Financial Tools"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/index.jsx",
                                    lineNumber: 367,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$homepage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].sectionSubtitle,
                                    children: "Interactive calculators to help you make smarter decisions"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/index.jsx",
                                    lineNumber: 368,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$homepage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cardsGrid,
                                    children: calculators.slice(0, visibleCalculators).map((calc)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: calc.path,
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$homepage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cardLink,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$homepage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].card,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$homepage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cardIcon,
                                                        children: calc.icon
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/index.jsx",
                                                        lineNumber: 374,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$homepage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cardTitle,
                                                        children: calc.title
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/index.jsx",
                                                        lineNumber: 375,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$homepage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cardDesc,
                                                        children: calc.description
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/index.jsx",
                                                        lineNumber: 376,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$homepage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cardAction,
                                                        children: [
                                                            "Use ",
                                                            calc.title,
                                                            " →"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/index.jsx",
                                                        lineNumber: 377,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/index.jsx",
                                                lineNumber: 373,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, calc.id, false, {
                                            fileName: "[project]/src/pages/index.jsx",
                                            lineNumber: 372,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)))
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/index.jsx",
                                    lineNumber: 370,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                visibleCalculators < calculators.length && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$homepage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].loadMoreBtn,
                                    onClick: loadMoreCalculators,
                                    children: "Show More Calculators"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/index.jsx",
                                    lineNumber: 384,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/index.jsx",
                            lineNumber: 366,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/pages/index.jsx",
                        lineNumber: 365,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/index.jsx",
                lineNumber: 329,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true);
};
_s(Homepage, "AGxCP23430Bvc2At5LzDgO4zDi8=");
_c = Homepage;
const __TURBOPACK__default__export__ = Homepage;
var _c;
__turbopack_context__.k.register(_c, "Homepage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/index.jsx [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/src/pages/index.jsx [client] (ecmascript)");
    }
]);
// @ts-expect-error module.hot exists
if (module.hot) {
    // @ts-expect-error module.hot exists
    module.hot.dispose(function() {
        window.__NEXT_P.push([
            PAGE_PATH
        ]);
    });
}
}),
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/src/pages/index\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/index.jsx [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__f295339d._.js.map