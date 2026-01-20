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
"[project]/src/pages/blogpost.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "arrow": "blogpost-module__dFBGiq__arrow",
  "card": "blogpost-module__dFBGiq__card",
  "cardLink": "blogpost-module__dFBGiq__cardLink",
  "cardsGrid": "blogpost-module__dFBGiq__cardsGrid",
  "container": "blogpost-module__dFBGiq__container",
  "ctaButton": "blogpost-module__dFBGiq__ctaButton",
  "ctaSection": "blogpost-module__dFBGiq__ctaSection",
  "description": "blogpost-module__dFBGiq__description",
  "formula": "blogpost-module__dFBGiq__formula",
  "gridSection": "blogpost-module__dFBGiq__gridSection",
  "hero": "blogpost-module__dFBGiq__hero",
  "linkText": "blogpost-module__dFBGiq__linkText",
  "main": "blogpost-module__dFBGiq__main",
  "pageWrapper": "blogpost-module__dFBGiq__pageWrapper",
  "searchInput": "blogpost-module__dFBGiq__searchInput",
  "sectionSubtitle": "blogpost-module__dFBGiq__sectionSubtitle",
  "singleCard": "blogpost-module__dFBGiq__singleCard",
  "subtitle": "blogpost-module__dFBGiq__subtitle",
});
}),
"[project]/src/pages/blog.jsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
// components/BlogPost.jsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/pages/blogpost.module.css [client] (css module)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
const BlogPost = ()=>{
    _s();
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const calculatorsContent = [
        {
            id: 1,
            title: 'Simple',
            path: '/simple-calculator',
            description: 'A basic arithmetic calculator for addition, subtraction, multiplication, and division. Perfect for quick everyday calculations without complexity or distractions.',
            formula: 'Result = a ± × ÷ b'
        },
        {
            id: 2,
            title: 'Tax',
            path: '/tax-calculator',
            description: 'Calculate income tax or sales tax based on your location, earnings, and filing status. Understand your take-home pay and tax obligations with ease.',
            formula: 'Tax = Income × Tax Rate'
        },
        {
            id: 3,
            title: 'Loan',
            path: '/loan-calculator',
            description: 'Determine monthly loan payments, total interest paid, and view a full amortization schedule. Ideal for personal loans, auto loans, or financing decisions.',
            formula: 'PMT = P × (r(1+r)^n) / ((1+r)^n - 1)'
        },
        {
            id: 4,
            title: 'Break-even',
            path: '/break-even-calculator',
            description: 'Find the exact sales volume needed to cover all fixed and variable costs. Essential for startups, small businesses, and financial planning.',
            formula: 'Break-even = Fixed Costs / (Price - Variable Cost)'
        },
        {
            id: 5,
            title: 'Cashflow',
            path: '/cashflow-calculator',
            description: 'Track and project business or personal cash inflows and outflows to ensure liquidity and avoid shortfalls in critical periods.',
            formula: 'Net Cash Flow = Cash In - Cash Out'
        },
        {
            id: 6,
            title: 'CAC',
            path: '/cac-calculator',
            description: 'Calculate Customer Acquisition Cost to measure how much you spend to gain a new customer. Helps evaluate marketing efficiency and ROI.',
            formula: 'CAC = Total Marketing Costs / New Customers Acquired'
        },
        {
            id: 7,
            title: 'Markup',
            path: '/markup-calculator',
            description: 'Set profitable product prices by applying a markup percentage to cost. Useful for retailers, wholesalers, and e-commerce businesses.',
            formula: 'Price = Cost × (1 + Markup %)'
        },
        {
            id: 8,
            title: 'Profit Margin',
            path: '/profit-margin-calculator',
            description: 'Compute gross and net profit margins to understand profitability as a percentage of revenue. Key metric for business health analysis.',
            formula: 'Profit Margin % = (Profit / Revenue) × 100'
        },
        {
            id: 9,
            title: 'ROI',
            path: '/roi-calculator',
            description: 'Measure Return on Investment for marketing campaigns, real estate, stocks, or any capital expenditure to assess performance and efficiency.',
            formula: 'ROI % = ((Gain - Cost) / Cost) × 100'
        },
        {
            id: 10,
            title: 'NPV',
            path: '/npv-calculator',
            description: 'Calculate Net Present Value of future cash flows to determine if an investment will yield positive returns after adjusting for time value of money.',
            formula: 'NPV = Σ [CFₜ / (1 + r)ᵗ] - Initial Investment'
        },
        {
            id: 11,
            title: 'Payroll',
            path: '/payroll-calculator',
            description: 'Estimate total payroll costs including wages, overtime, taxes, and deductions for employees or contractors.',
            formula: 'Total Payroll = Gross Pay + Employer Taxes + Benefits'
        },
        {
            id: 12,
            title: 'Gross Profit',
            path: '/gross-profit-calculator',
            description: 'Calculate gross profit by subtracting cost of goods sold from total revenue. A fundamental metric for pricing and production decisions.',
            formula: 'Gross Profit = Revenue - COGS'
        },
        {
            id: 13,
            title: 'EBITDA',
            path: '/ebitda-calculator',
            description: 'Determine Earnings Before Interest, Taxes, Depreciation, and Amortization — a key indicator of operational profitability and business value.',
            formula: 'EBITDA = Net Income + Interest + Taxes + D + A'
        },
        {
            id: 14,
            title: 'Inventory',
            path: '/inventory-turnover-calculator',
            description: 'Analyze inventory turnover ratio to measure how often stock is sold and replaced over a period. Helps optimize supply chain and reduce holding costs.',
            formula: 'Turnover = COGS / Average Inventory'
        },
        {
            id: 15,
            title: 'Working Capital',
            path: '/working-capital-calculator',
            description: 'Assess short-term financial health by calculating the difference between current assets and current liabilities.',
            formula: 'Working Capital = Current Assets - Current Liabilities'
        },
        {
            id: 16,
            title: 'Debt/Equity',
            path: '/debt-to-equity-calculator',
            description: 'Evaluate financial leverage by comparing total debt to shareholders equity. A critical ratio for investors and lenders.',
            formula: 'D/E = Total Debt / Shareholders’ Equity'
        },
        {
            id: 17,
            title: 'Current Ratio',
            path: '/current-ratio-calculator',
            description: 'Measure a companies ability to pay short-term obligations using current assets. A healthy current ratio indicates strong liquidity.',
            formula: 'Current Ratio = Current Assets / Current Liabilities'
        },
        {
            id: 18,
            title: 'ROE',
            path: '/roe-calculator',
            description: 'Calculate Return on Equity to assess how effectively a company generates profits from shareholders investments.',
            formula: 'ROE % = Net Income / Shareholders’ Equity × 100'
        },
        {
            id: 19,
            title: 'Valuation',
            path: '/business-valuation-calculator',
            description: 'Estimate the fair market value of your business using revenue, profit, and industry multiples for sale, investment, or partnership purposes.',
            formula: 'Valuation = EBITDA × Industry Multiple'
        },
        {
            id: 20,
            title: 'EVA',
            path: '/eva-calculator',
            description: 'Compute Economic Value Added — the profit a company generates after covering the cost of capital. Measures true economic profit.',
            formula: 'EVA = NOPAT - (WACC × Capital Invested)'
        },
        {
            id: 21,
            title: 'WACC',
            path: '/wacc-calculator',
            description: 'Find Weighted Average Cost of Capital used in valuation, investment analysis, and corporate finance decisions.',
            formula: 'WACC = (E/V × Re) + (D/V × Rd × (1 - Tc))'
        },
        {
            id: 22,
            title: '401K',
            path: '/401k-calculator',
            description: 'Project retirement savings growth with employer match, contributions, and compound interest over time.',
            formula: 'FV = PMT × [((1 + r)^n - 1) / r]'
        },
        {
            id: 23,
            title: 'CD',
            path: '/cd-calculator',
            description: 'Calculate maturity amount and interest earned on a Certificate of Deposit with fixed rate and term length.',
            formula: 'A = P(1 + r/n)^(nt)'
        },
        {
            id: 24,
            title: 'Bonds',
            path: '/government-bonds-calculator',
            description: 'Estimate yield, return, and interest income from government bonds like Treasury securities or municipal bonds.',
            formula: 'Yield = (Annual Interest / Bond Price) × 100'
        },
        {
            id: 25,
            title: 'Leverage',
            path: '/operating-leverage-calculator',
            description: 'Analyze how fixed costs affect profitability when sales volume changes. Useful for cost structure optimization.',
            formula: 'DOL = %Δ EBIT / %Δ Sales'
        },
        {
            id: 26,
            title: 'Cash Flow',
            path: '/free-cash-flow-calculator',
            description: 'Calculate Free Cash Flow — the cash a business generates after expenses, which can be used for expansion, dividends, or debt reduction.',
            formula: 'FCF = Operating Cash Flow - CapEx'
        },
        {
            id: 27,
            title: 'Lease/Buy',
            path: '/lease-vs-buy-calculator',
            description: 'Compare the total cost of leasing versus buying a vehicle or equipment to make smarter financing decisions.',
            formula: 'Total Cost = Σ Payments + Residual Value (if buying)'
        },
        {
            id: 28,
            title: 'Pension',
            path: '/pension-planning-calculator',
            description: 'Estimate monthly pension income in retirement based on years of service, salary history, and plan type.',
            formula: 'Pension = Avg Salary × Years × Multiplier'
        },
        {
            id: 29,
            title: 'Tax Bracket',
            path: '/tax-bracket-calculator',
            description: 'Determine your federal and state tax brackets and marginal tax rate based on income and filing status.',
            formula: 'Bracket = Income Range with Fixed Marginal Rate'
        },
        {
            id: 30,
            title: 'Education',
            path: '/education-cost-calculator',
            description: 'Plan for future education expenses including tuition, books, and living costs for college or training programs.',
            formula: 'Total Cost = Tuition + Fees + Living Expenses'
        },
        {
            id: 31,
            title: 'Crypto',
            path: '/crypto-investment-calculator',
            description: 'Track cryptocurrency investment performance, calculate gains/losses, and estimate tax liabilities.',
            formula: 'Profit = (Sell Price - Buy Price) × Quantity'
        },
        {
            id: 32,
            title: 'Debt',
            path: '/credit-card-payoff-calculator',
            description: 'Create a payoff plan for credit card debt using snowball or avalanche methods to become debt-free faster.',
            formula: 'Months = -log(1 - r×B/P) / log(1 + r)'
        },
        {
            id: 33,
            title: 'Purchasing Power',
            path: '/purchasing-power-parity-calculator',
            description: 'See how inflation or currency exchange rates affect the real value of money across time or countries.',
            formula: 'PPP = Price in Country A / Price in Country B'
        },
        {
            id: 34,
            title: 'Development',
            path: '/development-feasibility-calculator',
            description: 'Analyze real estate development feasibility by projecting costs, revenue, and profitability before breaking ground.',
            formula: 'Profit = Gross Revenue - Total Costs'
        },
        {
            id: 35,
            title: 'Occupancy',
            path: '/occupancy-cost-calculator',
            description: 'Compare occupancy costs for office, retail, or industrial space including rent, utilities, taxes, and maintenance.',
            formula: 'OCC % = Annual Occupancy Cost / Gross Revenue'
        },
        {
            id: 36,
            title: 'Litigation',
            path: '/litigation-cost-calculator',
            description: 'Estimate potential legal fees, court costs, and settlement expenses for civil disputes or lawsuits.',
            formula: 'Total Cost = Attorney Fees + Court Fees + Settlement'
        },
        {
            id: 37,
            title: 'Monte Carlo',
            path: '/monte-carlo-simulation-calculator',
            description: 'Use probabilistic modeling to simulate financial outcomes and assess risk in investments or business decisions.',
            formula: 'Outcome = f(Random Variables)'
        },
        {
            id: 38,
            title: 'Game Theory',
            path: '/game-theory-payoff-calculator',
            description: 'Model strategic interactions between competitors or players to predict optimal decisions and outcomes.',
            formula: 'Payoff = Utility(Player, Strategy Profile)'
        },
        {
            id: 39,
            title: 'Financial Literacy',
            path: '/financial-literacy-score-calculator',
            description: 'Test your knowledge of personal finance, investing, budgeting, and credit with a scoring tool to improve financial IQ.',
            formula: 'Score = (Correct Answers / Total) × 100'
        },
        {
            id: 40,
            title: 'Staking',
            path: '/staking-rewards-calculator',
            description: 'Calculate potential rewards from staking cryptocurrencies like Ethereum, Cardano, or Solana over time.',
            formula: 'Rewards = Principal × APR × Time'
        },
        {
            id: 41,
            title: 'Time Value of Money',
            path: '/time-value-of-money-calculator',
            description: 'Understand how money grows or loses value over time due to interest rates and inflation — essential for smart investing.',
            formula: 'FV = PV × (1 + r)^n'
        },
        {
            id: 42,
            title: 'Discounted Cash Flow',
            path: '/discounted-cash-flow-calculator',
            description: 'Value a business or investment by discounting projected future cash flows to their present value.',
            formula: 'DCF = Σ [CFₜ / (1 + r)ᵗ]'
        },
        {
            id: 43,
            title: 'Duration Convexity',
            path: '/duration-convexity-calculator',
            description: 'Measure bond price sensitivity to interest rate changes using duration and convexity metrics.',
            formula: 'ΔP/P ≈ -Duration × Δy + ½ × Convexity × (Δy)²'
        },
        {
            id: 44,
            title: 'Option Pricing',
            path: '/option-pricing-calculator',
            description: 'Price call and put options using models like Black-Scholes to evaluate derivatives and trading strategies.',
            formula: 'C = S₀N(d₁) - Xe^(-rT)N(d₂)'
        },
        {
            id: 45,
            title: 'HE-LOC',
            path: '/he-loc-calculator',
            description: 'Calculate payments, interest, and credit limits for a Home Equity Line of Credit (HELOC) based on home value and loan-to-value ratio.',
            formula: 'Credit Limit = Home Value × LTV - Mortgage Balance'
        },
        {
            id: 46,
            title: 'Accounts Receivable Turnover',
            path: '/accounts-receivable-turnover-calculator',
            description: 'Measure how quickly a company collects payments from customers, indicating efficiency in credit and collections.',
            formula: 'Turnover = Net Credit Sales / Avg Accounts Receivable'
        },
        {
            id: 47,
            title: 'Legal Retainer',
            path: '/legal-retainer-calculator',
            description: 'Track remaining balance and usage of a legal retainer fee over time as hours are billed.',
            formula: 'Remaining = Initial Retainer - (Rate × Hours Billed)'
        },
        {
            id: 48,
            title: 'Flipping Profit',
            path: '/flipping-profit-calculator',
            description: 'Estimate profit from flipping houses, cars, sneakers, or collectibles after accounting for purchase, repair, and selling costs.',
            formula: 'Profit = Sale Price - (Purchase + Repair + Fees)'
        },
        {
            id: 49,
            title: 'Mortgage Refinance',
            path: '/mortgage-refinance-break-even-calculator',
            description: 'Determine how long it takes to recover closing costs after refinancing a mortgage — the break-even point.',
            formula: 'Break-even Months = Closing Costs / Monthly Savings'
        },
        {
            id: 50,
            title: 'Worker Classification',
            path: '/worker-classification-calculator',
            description: 'Help determine whether a worker should be classified as an employee or independent contractor for tax and legal compliance.',
            formula: 'Classification = Behavioral + Financial + Relationship Control'
        },
        {
            id: 51,
            title: 'Property Taxes',
            path: '/property-tax-calculator',
            description: 'Calculate annual or monthly property tax based on assessed home value and local tax rates.',
            formula: 'Tax = Assessed Value × Tax Rate'
        },
        {
            id: 52,
            title: 'Car Loan',
            path: '/car-loan-calculator',
            description: 'Estimate monthly payments, total interest, and total cost of financing a new or used car.',
            formula: 'PMT = P × (r(1+r)^n) / ((1+r)^n - 1)'
        },
        {
            id: 53,
            title: 'Social Security',
            path: '/social-security-calculator',
            description: 'Forecast your Social Security retirement benefits based on earnings history and retirement age.',
            formula: 'Benefit = Average Indexed Earnings × PIA Formula'
        },
        {
            id: 54,
            title: 'PPF',
            path: '/ppf-calculator',
            description: 'Plan savings and project maturity amount in India Public Provident Fund (PPF), a tax-free long-term investment scheme.',
            formula: 'A = P × [(1 + r)^n - 1] / r'
        },
        {
            id: 55,
            title: 'Mortgage Calculator',
            path: '/mortgage-calculator',
            description: 'Calculate monthly payments, total interest, and total cost of financing a home loan.',
            formula: 'PMT = P × (r(1+r)^n) / ((1+r)^n - 1)'
        },
        {
            id: 56,
            title: 'Compound Interest Calculator',
            path: '/compound-interest-calculator',
            description: 'Calculate compound interest over time based on principal, interest rate, and time period.',
            formula: 'A = P(1 + r/n)^(nt)'
        }
    ];
    const filteredCalculators = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "BlogPost.useMemo[filteredCalculators]": ()=>{
            return calculatorsContent.filter({
                "BlogPost.useMemo[filteredCalculators]": (calculator)=>calculator.title.toLowerCase().includes(searchTerm.toLowerCase()) || calculator.description.toLowerCase().includes(searchTerm.toLowerCase())
            }["BlogPost.useMemo[filteredCalculators]"]);
        }
    }["BlogPost.useMemo[filteredCalculators]"], [
        searchTerm
    ]);
    // SEO Metadata
    const siteUrl = 'https://www.financecalculatorfree.com';
    const pageTitle = '54 Free Financial Calculators | ROI, Break-even, Loan, Tax, Mortgage Tools';
    const pageDescription = 'Access 54 free financial calculators for ROI, break-even, loans, tax, mortgage, NPV, CAC, and more. No signup. Private. Accurate formulas.';
    const imagePreview = `${siteUrl}/images/financial-calculators-suite.jpg`;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].pageWrapper,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("script", {
                type: "application/ld+json",
                children: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'WebPage',
                    name: pageTitle,
                    description: pageDescription,
                    url: `${siteUrl}/calculators`,
                    breadcrumb: {
                        '@type': 'BreadcrumbList',
                        itemListElement: [
                            {
                                '@type': 'ListItem',
                                position: 1,
                                name: 'Home',
                                item: siteUrl
                            },
                            {
                                '@type': 'ListItem',
                                position: 2,
                                name: 'Financial Calculators',
                                item: `${siteUrl}/calculators`
                            }
                        ]
                    }
                })
            }, void 0, false, {
                fileName: "[project]/src/pages/blog.jsx",
                lineNumber: 422,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("script", {
                type: "application/ld+json",
                children: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'CollectionPage',
                    name: 'Financial Calculators Suite',
                    description: 'A complete collection of 54 financial calculators for personal finance, business, investing, and retirement planning.',
                    url: `${siteUrl}/calculators`,
                    mainEntity: {
                        '@type': 'ItemList',
                        numberOfItems: calculatorsContent.length,
                        itemListElement: calculatorsContent.slice(0, 10).map((calc, index)=>({
                                '@type': 'ListItem',
                                position: index + 1,
                                item: {
                                    '@type': 'Tool',
                                    name: `${calc.title} Calculator`,
                                    url: `${siteUrl}${calc.path}`,
                                    description: calc.description
                                }
                            }))
                    }
                })
            }, void 0, false, {
                fileName: "[project]/src/pages/blog.jsx",
                lineNumber: 449,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("script", {
                type: "application/ld+json",
                children: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'ItemList',
                    name: 'Top Financial Calculators',
                    description: 'List of the most useful financial calculators for entrepreneurs, investors, and finance professionals.',
                    url: `${siteUrl}/calculators`,
                    numberOfItems: calculatorsContent.length,
                    itemListOrder: 'http://schema.org/ItemListOrderUnordered',
                    itemListElement: calculatorsContent.slice(0, 20).map((calc, index)=>({
                            '@type': 'ListItem',
                            position: index + 1,
                            item: {
                                '@type': 'Tool',
                                name: calc.title + ' Calculator',
                                url: `${siteUrl}${calc.path}`,
                                description: calc.description
                            }
                        }))
                })
            }, void 0, false, {
                fileName: "[project]/src/pages/blog.jsx",
                lineNumber: 474,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].main,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].hero,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                children: "Financial Calculators Suite"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/blog.jsx",
                                lineNumber: 498,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].subtitle,
                                children: "Comprehensive collection of financial calculators for all your needs"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/blog.jsx",
                                lineNumber: 499,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/blog.jsx",
                        lineNumber: 497,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].gridSection,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].container,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    children: "All Calculators"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/blog.jsx",
                                    lineNumber: 506,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].sectionSubtitle,
                                    children: [
                                        filteredCalculators.length,
                                        " tools available — select any to get started"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/blog.jsx",
                                    lineNumber: 507,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    placeholder: "Search calculators...",
                                    value: searchTerm,
                                    onChange: (e)=>setSearchTerm(e.target.value),
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].searchInput,
                                    "aria-label": "Search calculators"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/blog.jsx",
                                    lineNumber: 511,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cardsGrid} ${filteredCalculators.length === 1 ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].singleCard : ''}`,
                                    children: filteredCalculators.map((calc)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: calc.path,
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cardLink,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].card,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        children: calc.title
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/blog.jsx",
                                                        lineNumber: 524,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].description,
                                                        children: calc.description
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/blog.jsx",
                                                        lineNumber: 525,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formula,
                                                        children: calc.formula
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/blog.jsx",
                                                        lineNumber: 526,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].linkText,
                                                        children: [
                                                            "Use ",
                                                            calc.title,
                                                            " Calculator →"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/blog.jsx",
                                                        lineNumber: 527,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/blog.jsx",
                                                lineNumber: 523,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, calc.id, false, {
                                            fileName: "[project]/src/pages/blog.jsx",
                                            lineNumber: 522,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)))
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/blog.jsx",
                                    lineNumber: 520,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/blog.jsx",
                            lineNumber: 505,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/pages/blog.jsx",
                        lineNumber: 504,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ctaSection,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].container,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    children: "Need a Custom Calculator?"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/blog.jsx",
                                    lineNumber: 537,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "We can create specialized calculators tailored to your unique requirements."
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/blog.jsx",
                                    lineNumber: 538,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/contactus",
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ctaButton,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].buttonText,
                                            children: "Request a Calculator"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/blog.jsx",
                                            lineNumber: 540,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].arrow,
                                            children: "→"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/blog.jsx",
                                            lineNumber: 541,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/blog.jsx",
                                    lineNumber: 539,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/blog.jsx",
                            lineNumber: 536,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/pages/blog.jsx",
                        lineNumber: 535,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/blog.jsx",
                lineNumber: 496,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/pages/blog.jsx",
        lineNumber: 420,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(BlogPost, "g5Ris7o160DHaapHSZVUds9wl1s=");
_c = BlogPost;
const __TURBOPACK__default__export__ = BlogPost;
var _c;
__turbopack_context__.k.register(_c, "BlogPost");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/blog.jsx [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/blog";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/src/pages/blog.jsx [client] (ecmascript)");
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
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/src/pages/blog\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/blog.jsx [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__26896baf._.js.map