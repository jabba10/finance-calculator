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
"[project]/src/pages/businesscalculatorsuite.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "card": "businesscalculatorsuite-module__uZk7oW__card",
  "cardArrow": "businesscalculatorsuite-module__uZk7oW__cardArrow",
  "cardCategory": "businesscalculatorsuite-module__uZk7oW__cardCategory",
  "cardDesc": "businesscalculatorsuite-module__uZk7oW__cardDesc",
  "cardLink": "businesscalculatorsuite-module__uZk7oW__cardLink",
  "cardMeta": "businesscalculatorsuite-module__uZk7oW__cardMeta",
  "cardTitle": "businesscalculatorsuite-module__uZk7oW__cardTitle",
  "cardsGrid": "businesscalculatorsuite-module__uZk7oW__cardsGrid",
  "categoryDesc": "businesscalculatorsuite-module__uZk7oW__categoryDesc",
  "categoryIcon": "businesscalculatorsuite-module__uZk7oW__categoryIcon",
  "categorySection": "businesscalculatorsuite-module__uZk7oW__categorySection",
  "categoryTitle": "businesscalculatorsuite-module__uZk7oW__categoryTitle",
  "checkIcon": "businesscalculatorsuite-module__uZk7oW__checkIcon",
  "clearSearch": "businesscalculatorsuite-module__uZk7oW__clearSearch",
  "content": "businesscalculatorsuite-module__uZk7oW__content",
  "ctaButtons": "businesscalculatorsuite-module__uZk7oW__ctaButtons",
  "ctaNote": "businesscalculatorsuite-module__uZk7oW__ctaNote",
  "ctaSection": "businesscalculatorsuite-module__uZk7oW__ctaSection",
  "ctaText": "businesscalculatorsuite-module__uZk7oW__ctaText",
  "ctaTitle": "businesscalculatorsuite-module__uZk7oW__ctaTitle",
  "footer": "businesscalculatorsuite-module__uZk7oW__footer",
  "footerContent": "businesscalculatorsuite-module__uZk7oW__footerContent",
  "footerNote": "businesscalculatorsuite-module__uZk7oW__footerNote",
  "footerText": "businesscalculatorsuite-module__uZk7oW__footerText",
  "hero": "businesscalculatorsuite-module__uZk7oW__hero",
  "heroContent": "businesscalculatorsuite-module__uZk7oW__heroContent",
  "highlight": "businesscalculatorsuite-module__uZk7oW__highlight",
  "hint": "businesscalculatorsuite-module__uZk7oW__hint",
  "icon": "businesscalculatorsuite-module__uZk7oW__icon",
  "mainContent": "businesscalculatorsuite-module__uZk7oW__mainContent",
  "noResults": "businesscalculatorsuite-module__uZk7oW__noResults",
  "noResultsIcon": "businesscalculatorsuite-module__uZk7oW__noResultsIcon",
  "page": "businesscalculatorsuite-module__uZk7oW__page",
  "primaryButton": "businesscalculatorsuite-module__uZk7oW__primaryButton",
  "quickAccess": "businesscalculatorsuite-module__uZk7oW__quickAccess",
  "quickAccessGrid": "businesscalculatorsuite-module__uZk7oW__quickAccessGrid",
  "quickArrow": "businesscalculatorsuite-module__uZk7oW__quickArrow",
  "quickCard": "businesscalculatorsuite-module__uZk7oW__quickCard",
  "quickCardLink": "businesscalculatorsuite-module__uZk7oW__quickCardLink",
  "quickContent": "businesscalculatorsuite-module__uZk7oW__quickContent",
  "quickDesc": "businesscalculatorsuite-module__uZk7oW__quickDesc",
  "quickIcon": "businesscalculatorsuite-module__uZk7oW__quickIcon",
  "quickTitle": "businesscalculatorsuite-module__uZk7oW__quickTitle",
  "searchContainer": "businesscalculatorsuite-module__uZk7oW__searchContainer",
  "searchIcon": "businesscalculatorsuite-module__uZk7oW__searchIcon",
  "searchInput": "businesscalculatorsuite-module__uZk7oW__searchInput",
  "searchResults": "businesscalculatorsuite-module__uZk7oW__searchResults",
  "searchWrapper": "businesscalculatorsuite-module__uZk7oW__searchWrapper",
  "secondaryButton": "businesscalculatorsuite-module__uZk7oW__secondaryButton",
  "sectionTitle": "businesscalculatorsuite-module__uZk7oW__sectionTitle",
  "subtitle": "businesscalculatorsuite-module__uZk7oW__subtitle",
  "title": "businesscalculatorsuite-module__uZk7oW__title",
  "trustIcon": "businesscalculatorsuite-module__uZk7oW__trustIcon",
  "trustIndicators": "businesscalculatorsuite-module__uZk7oW__trustIndicators",
  "trustItem": "businesscalculatorsuite-module__uZk7oW__trustItem",
  "valueCard": "businesscalculatorsuite-module__uZk7oW__valueCard",
  "valueContent": "businesscalculatorsuite-module__uZk7oW__valueContent",
  "valueGrid": "businesscalculatorsuite-module__uZk7oW__valueGrid",
  "valueIcon": "businesscalculatorsuite-module__uZk7oW__valueIcon",
  "valueProposition": "businesscalculatorsuite-module__uZk7oW__valueProposition",
  "valueTitle": "businesscalculatorsuite-module__uZk7oW__valueTitle",
});
}),
"[project]/src/pages/suite.jsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
// components/BusinessCalculatorSuite.jsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/pages/businesscalculatorsuite.module.css [client] (css module)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
const BusinessCalculatorSuite = ()=>{
    _s();
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    // === Full List of 54 Calculators (copied exactly from BlogPost.jsx) ===
    const calculators = [
        {
            id: 1,
            title: 'Simple',
            icon: '🧮',
            path: '/simple-calculator',
            description: 'A basic arithmetic calculator for addition, subtraction, multiplication, and division.'
        },
        {
            id: 2,
            title: 'Tax',
            icon: '🧾',
            path: '/tax-calculator',
            description: 'Calculate income tax or sales tax based on your location, earnings, and filing status.'
        },
        {
            id: 3,
            title: 'Loan',
            icon: '🏦',
            path: '/loan-calculator',
            description: 'Determine monthly loan payments, total interest paid, and view a full amortization schedule.'
        },
        {
            id: 4,
            title: 'Break-even',
            icon: '⚖️',
            path: '/break-even-calculator',
            description: 'Find the exact sales volume needed to cover all fixed and variable costs.'
        },
        {
            id: 5,
            title: 'Cashflow',
            icon: '💸',
            path: '/cashflow-calculator',
            description: 'Track and project business or personal cash inflows and outflows.'
        },
        {
            id: 6,
            title: 'CAC',
            icon: '🎯',
            path: '/cac-calculator',
            description: 'Calculate Customer Acquisition Cost to measure how much you spend to gain a new customer.'
        },
        {
            id: 7,
            title: 'Markup',
            icon: '🏷️',
            path: '/markup-calculator',
            description: 'Set profitable product prices by applying a markup percentage to cost.'
        },
        {
            id: 8,
            title: 'Profit Margin',
            icon: '📉',
            path: '/profit-margin-calculator',
            description: 'Compute gross and net profit margins to understand profitability as a percentage of revenue.'
        },
        {
            id: 9,
            title: 'ROI',
            icon: '📈',
            path: '/roi-calculator',
            description: 'Measure Return on Investment for marketing campaigns, real estate, stocks, or any capital expenditure.'
        },
        {
            id: 10,
            title: 'NPV',
            icon: '📊',
            path: '/npv-calculator',
            description: 'Calculate Net Present Value of future cash flows to determine if an investment will yield positive returns.'
        },
        {
            id: 11,
            title: 'Payroll',
            icon: '📋',
            path: '/payroll-calculator',
            description: 'Estimate total payroll costs including wages, overtime, taxes, and deductions.'
        },
        {
            id: 12,
            title: 'Gross Profit',
            icon: '💰',
            path: '/gross-profit-calculator',
            description: 'Calculate gross profit by subtracting cost of goods sold from total revenue.'
        },
        {
            id: 13,
            title: 'EBITDA',
            icon: '💼',
            path: '/ebitda-calculator',
            description: 'Determine Earnings Before Interest, Taxes, Depreciation, and Amortization.'
        },
        {
            id: 14,
            title: 'Inventory',
            icon: '📦',
            path: '/inventory-turnover-calculator',
            description: 'Analyze inventory turnover ratio to measure how often stock is sold and replaced.'
        },
        {
            id: 15,
            title: 'Working Capital',
            icon: '💳',
            path: '/working-capital-calculator',
            description: 'Assess short-term financial health by calculating current assets minus liabilities.'
        },
        {
            id: 16,
            title: 'Debt/Equity',
            icon: '📉',
            path: '/debt-to-equity-calculator',
            description: 'Evaluate financial leverage by comparing total debt to shareholders equity.'
        },
        {
            id: 17,
            title: 'Current Ratio',
            icon: '🔍',
            path: '/current-ratio-calculator',
            description: 'Measure ability to pay short-term obligations using current assets.'
        },
        {
            id: 18,
            title: 'ROE',
            icon: '🏦',
            path: '/roe-calculator',
            description: 'Calculate Return on Equity to assess profit generation from shareholder investments.'
        },
        {
            id: 19,
            title: 'Valuation',
            icon: '🏢',
            path: '/business-valuation-calculator',
            description: 'Estimate the fair market value of your business using revenue and industry multiples.'
        },
        {
            id: 20,
            title: 'EVA',
            icon: '💡',
            path: '/eva-calculator',
            description: 'Compute Economic Value Added — the profit after covering cost of capital.'
        },
        {
            id: 21,
            title: 'WACC',
            icon: '📉',
            path: '/wacc-calculator',
            description: 'Find Weighted Average Cost of Capital used in valuation and finance decisions.'
        },
        {
            id: 22,
            title: '401K',
            icon: '🏦',
            path: '/retirement-calculator',
            description: 'Project retirement savings growth with employer match and compound interest.'
        },
        {
            id: 23,
            title: 'CD',
            icon: '🔒',
            path: '/cd-calculator',
            description: 'Calculate maturity amount and interest earned on a Certificate of Deposit.'
        },
        {
            id: 24,
            title: 'Bonds',
            icon: '📜',
            path: '/government-bonds-calculator',
            description: 'Estimate yield, return, and interest income from government bonds.'
        },
        {
            id: 25,
            title: 'Leverage',
            icon: '⚙️',
            path: '/operating-leverage-calculator',
            description: 'Analyze how fixed costs affect profitability when sales volume changes.'
        },
        {
            id: 26,
            title: 'Cash Flow',
            icon: '🔄',
            path: '/free-cash-flow-calculator',
            description: 'Calculate Free Cash Flow available for expansion, dividends, or debt reduction.'
        },
        {
            id: 27,
            title: 'Lease/Buy',
            icon: '🚗',
            path: '/lease-vs-buy-calculator',
            description: 'Compare leasing vs buying a vehicle or equipment to make smarter decisions.'
        },
        {
            id: 28,
            title: 'Pension',
            icon: '👵',
            path: '/pension-planning-calculator',
            description: 'Estimate monthly pension income in retirement based on service and salary history.'
        },
        {
            id: 29,
            title: 'Tax Bracket',
            icon: '🔖',
            path: '/tax-bracket-calculator',
            description: 'Determine your federal and state tax brackets and marginal tax rate.'
        },
        {
            id: 30,
            title: 'Education',
            icon: '🎓',
            path: '/education-cost-calculator',
            description: 'Plan for future education expenses including tuition and living costs.'
        },
        {
            id: 31,
            title: 'Crypto',
            icon: '₿',
            path: '/crypto-investment-calculator',
            description: 'Track crypto investment performance, calculate gains/losses, and estimate taxes.'
        },
        {
            id: 32,
            title: 'Debt',
            icon: '💳',
            path: '/credit-card-payoff-calculator',
            description: 'Create a payoff plan for credit card debt using snowball or avalanche methods.'
        },
        {
            id: 33,
            title: 'Purchasing Power',
            icon: '🌍',
            path: '/purchasing-power-parity-calculator',
            description: 'See how inflation or exchange rates affect the real value of money.'
        },
        {
            id: 34,
            title: 'Development',
            icon: '🏗️',
            path: '/development-feasibility-calculator',
            description: 'Analyze real estate development feasibility before breaking ground.'
        },
        {
            id: 35,
            title: 'Occupancy',
            icon: '🏢',
            path: '/occupancy-cost-calculator',
            description: 'Compare occupancy costs for office, retail, or industrial space.'
        },
        {
            id: 36,
            title: 'Litigation',
            icon: '⚖️',
            path: '/litigation-cost-calculator',
            description: 'Estimate legal fees, court costs, and settlement expenses.'
        },
        {
            id: 37,
            title: 'Monte Carlo',
            icon: '🎲',
            path: '/monte-carlo-simulation-calculator',
            description: 'Use probabilistic modeling to simulate financial outcomes and risk.'
        },
        {
            id: 38,
            title: 'Game Theory',
            icon: '♟️',
            path: '/game-theory-payoff-calculator',
            description: 'Model strategic interactions between competitors or players.'
        },
        {
            id: 39,
            title: 'Financial Literacy',
            icon: '📚',
            path: '/financial-literacy-score-calculator',
            description: 'Test your knowledge of personal finance and improve financial IQ.'
        },
        {
            id: 40,
            title: 'Staking',
            icon: '🔗',
            path: '/staking-rewards-calculator',
            description: 'Calculate potential rewards from staking cryptocurrencies over time.'
        },
        {
            id: 41,
            title: 'Time Value of Money',
            icon: '⏳',
            path: '/time-value-of-money-calculator',
            description: 'Understand how money grows or loses value over time due to interest.'
        },
        {
            id: 42,
            title: 'Discounted Cash Flow',
            icon: '📉',
            path: '/discounted-cash-flow-calculator',
            description: 'Value a business or investment by discounting future cash flows.'
        },
        {
            id: 43,
            title: 'Duration Convexity',
            icon: '📉',
            path: '/duration-convexity-calculator',
            description: 'Measure bond price sensitivity to interest rate changes.'
        },
        {
            id: 44,
            title: 'Option Pricing',
            icon: '💱',
            path: '/option-pricing-calculator',
            description: 'Price call and put options using models like Black-Scholes.'
        },
        {
            id: 45,
            title: 'HE-LOC',
            icon: '🏠',
            path: '/he-loc-calculator',
            description: 'Calculate payments and limits for a Home Equity Line of Credit.'
        },
        {
            id: 46,
            title: 'Accounts Receivable Turnover',
            icon: '📬',
            path: '/accounts-receivable-turnover-calculator',
            description: 'Measure how quickly a company collects payments from customers.'
        },
        {
            id: 47,
            title: 'Legal Retainer',
            icon: '⚖️',
            path: '/legal-retainer-calculator',
            description: 'Track remaining balance and usage of a legal retainer fee.'
        },
        {
            id: 48,
            title: 'Flipping Profit',
            icon: '🔄',
            path: '/flipping-profit-calculator',
            description: 'Estimate profit from flipping houses, cars, or collectibles.'
        },
        {
            id: 49,
            title: 'Mortgage Refinance',
            icon: '🏡',
            path: '/mortgage-refinance-break-even-calculator',
            description: 'Determine break-even point after refinancing a mortgage.'
        },
        {
            id: 50,
            title: 'Worker Classification',
            icon: '👷',
            path: '/worker-classification-calculator',
            description: 'Determine if a worker is an employee or independent contractor.'
        },
        {
            id: 51,
            title: 'Property Taxes',
            icon: '🏠',
            path: '/property-tax-calculator',
            description: 'Calculate annual or monthly property tax based on home value.'
        },
        {
            id: 52,
            title: 'Car Loan',
            icon: '🚗',
            path: '/car-loan-calculator',
            description: 'Estimate monthly payments and total cost of financing a car.'
        },
        {
            id: 53,
            title: 'Social Security',
            icon: '👵',
            path: '/social-security-calculator',
            description: 'Forecast Social Security retirement benefits based on earnings history.'
        },
        {
            id: 54,
            title: 'PPF',
            icon: '🇮🇳',
            path: '/ppf-calculator',
            description: 'Plan savings and project maturity in India Public Provident Fund.'
        },
        {
            id: 55,
            title: 'Mortgage Calculator',
            icon: '🏡',
            path: '/mortgage-calculator',
            description: 'Calculate monthly payments and total cost of financing a mortgage.'
        },
        {
            id: 56,
            title: 'Compound Interest Calculator',
            icon: '📉',
            path: '/compound-interest-calculator',
            description: 'Calculate compound interest over time based on principal, rate, and time.'
        }
    ];
    const filteredCalculators = calculators.filter((calc)=>calc.title.toLowerCase().includes(searchTerm.toLowerCase()) || calc.description.toLowerCase().includes(searchTerm.toLowerCase()));
    // SEO Metadata
    const siteUrl = 'https://www.financecalculatorfree.com';
    const pageTitle = '54 Free Business & Finance Calculators | ROI, Break-even, Loan, Tax Tools';
    const pageDescription = 'Access 54 free financial calculators with accurate formulas. No signup. 100% private.';
    const imagePreview = `${siteUrl}/images/business-calculators-preview.jpg`;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("html", {
                        lang: "en"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.jsx",
                        lineNumber: 85,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        charSet: "utf-8"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.jsx",
                        lineNumber: 86,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "viewport",
                        content: "width=device-width, initial-scale=1"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.jsx",
                        lineNumber: 87,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                        children: pageTitle
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.jsx",
                        lineNumber: 88,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "description",
                        content: pageDescription
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.jsx",
                        lineNumber: 89,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "keywords",
                        content: "business calculator, ROI, loan, tax, NPV, CAC, free tools"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.jsx",
                        lineNumber: 90,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "author",
                        content: "Calci"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.jsx",
                        lineNumber: 91,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "robots",
                        content: "index, follow"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.jsx",
                        lineNumber: 92,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                        rel: "canonical",
                        href: `${siteUrl}/suite`
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.jsx",
                        lineNumber: 95,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:type",
                        content: "website"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.jsx",
                        lineNumber: 98,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:url",
                        content: `${siteUrl}/suite`
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.jsx",
                        lineNumber: 99,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:title",
                        content: pageTitle
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.jsx",
                        lineNumber: 100,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:description",
                        content: pageDescription
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.jsx",
                        lineNumber: 101,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:image",
                        content: imagePreview
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.jsx",
                        lineNumber: 102,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:image:alt",
                        content: "Collection of 54 business finance calculators"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.jsx",
                        lineNumber: 103,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:site_name",
                        content: "Calci"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.jsx",
                        lineNumber: 104,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:locale",
                        content: "en_US"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.jsx",
                        lineNumber: 105,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "twitter:card",
                        content: "summary_large_image"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.jsx",
                        lineNumber: 108,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "twitter:site",
                        content: "@calci"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.jsx",
                        lineNumber: 109,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "twitter:title",
                        content: pageTitle
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.jsx",
                        lineNumber: 110,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "twitter:description",
                        content: pageDescription
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.jsx",
                        lineNumber: 111,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "twitter:image",
                        content: imagePreview
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.jsx",
                        lineNumber: 112,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "twitter:image:alt",
                        content: "Free financial calculators for entrepreneurs and investors"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.jsx",
                        lineNumber: 113,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("script", {
                        type: "application/ld+json",
                        children: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'WebPage',
                            name: pageTitle,
                            description: pageDescription,
                            url: `${siteUrl}/suite`,
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
                                        name: 'Calculator Suite',
                                        item: `${siteUrl}/suite`
                                    }
                                ]
                            }
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.jsx",
                        lineNumber: 116,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("script", {
                        type: "application/ld+json",
                        children: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'CollectionPage',
                            name: 'Business & Finance Calculator Suite',
                            description: 'A comprehensive suite of 54 financial calculators for business owners, finance professionals, and investors.',
                            hasPart: calculators.slice(0, 10).map((calc)=>({
                                    '@type': 'WebPage',
                                    name: calc.title + ' Calculator',
                                    url: `${siteUrl}${calc.path}`,
                                    description: calc.description
                                }))
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.jsx",
                        lineNumber: 133,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("script", {
                        type: "application/ld+json",
                        children: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'ItemList',
                            name: 'Popular Business Calculators',
                            description: 'List of top business finance calculators available on the suite page.',
                            url: `${siteUrl}/suite`,
                            numberOfItems: calculators.length,
                            itemListOrder: 'http://schema.org/ItemListOrderUnordered',
                            itemListElement: calculators.slice(0, 20).map((calc, index)=>({
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
                        fileName: "[project]/src/pages/suite.jsx",
                        lineNumber: 148,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/suite.jsx",
                lineNumber: 83,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].page,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].hero,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].title,
                                children: "Business & Finance Toolkit"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/suite.jsx",
                                lineNumber: 174,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].subtitle,
                                children: [
                                    calculators.length,
                                    " essential calculators for entrepreneurs, finance teams, and investors."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/suite.jsx",
                                lineNumber: 175,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].searchContainer,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        placeholder: "Search calculators... (e.g., mortgage, ROI)",
                                        value: searchTerm,
                                        onChange: (e)=>setSearchTerm(e.target.value),
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].searchInput,
                                        "aria-label": "Search calculators"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/suite.jsx",
                                        lineNumber: 181,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].hint,
                                        children: [
                                            "Press ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                children: "/"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/suite.jsx",
                                                lineNumber: 189,
                                                columnNumber: 46
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            " to focus search"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/suite.jsx",
                                        lineNumber: 189,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/suite.jsx",
                                lineNumber: 180,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/suite.jsx",
                        lineNumber: 173,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].gridSection,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].container,
                            children: searchTerm && filteredCalculators.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].noResults,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: [
                                        "❌ No calculator found for ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: [
                                                '"',
                                                searchTerm,
                                                '"'
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/suite.jsx",
                                            lineNumber: 199,
                                            columnNumber: 45
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        ". Try another term."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/suite.jsx",
                                    lineNumber: 198,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/pages/suite.jsx",
                                lineNumber: 197,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cardsGrid,
                                children: filteredCalculators.map((calc)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: calc.path,
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cardLink,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].card,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].icon,
                                                    children: calc.icon
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/suite.jsx",
                                                    lineNumber: 207,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].content,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cardTitle,
                                                            children: calc.title
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/suite.jsx",
                                                            lineNumber: 209,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cardDesc,
                                                            children: calc.description
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/suite.jsx",
                                                            lineNumber: 210,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/suite.jsx",
                                                    lineNumber: 208,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/suite.jsx",
                                            lineNumber: 206,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, calc.id, false, {
                                        fileName: "[project]/src/pages/suite.jsx",
                                        lineNumber: 205,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0)))
                            }, void 0, false, {
                                fileName: "[project]/src/pages/suite.jsx",
                                lineNumber: 203,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/pages/suite.jsx",
                            lineNumber: 195,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.jsx",
                        lineNumber: 194,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/suite.jsx",
                lineNumber: 171,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true);
};
_s(BusinessCalculatorSuite, "a1cMJ8t0eYFnsCEdGcHtaGJdbCM=");
_c = BusinessCalculatorSuite;
const __TURBOPACK__default__export__ = BusinessCalculatorSuite;
var _c;
__turbopack_context__.k.register(_c, "BusinessCalculatorSuite");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/suite.jsx [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/suite";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/src/pages/suite.jsx [client] (ecmascript)");
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
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/src/pages/suite\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/suite.jsx [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__e18a4cb3._.js.map