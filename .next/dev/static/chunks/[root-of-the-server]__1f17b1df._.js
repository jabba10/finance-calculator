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
  "statCard": "businesscalculatorsuite-module__uZk7oW__statCard",
  "statLabel": "businesscalculatorsuite-module__uZk7oW__statLabel",
  "statNumber": "businesscalculatorsuite-module__uZk7oW__statNumber",
  "statsContent": "businesscalculatorsuite-module__uZk7oW__statsContent",
  "statsGrid": "businesscalculatorsuite-module__uZk7oW__statsGrid",
  "statsSection": "businesscalculatorsuite-module__uZk7oW__statsSection",
  "statsTitle": "businesscalculatorsuite-module__uZk7oW__statsTitle",
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
"[project]/src/pages/suite.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__N_SSG",
    ()=>__N_SSG,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
// components/BusinessCalculatorSuite.jsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/script.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/pages/businesscalculatorsuite.module.css [client] (css module)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
const BusinessCalculatorSuite = ({ currentDate, lastModifiedDate })=>{
    _s();
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    // ALL 56 Calculators with proper organization
    const calculatorCategories = [
        {
            name: "Basic & Essential",
            icon: "🧮",
            calculators: [
                {
                    id: 1,
                    title: 'Simple',
                    icon: '🧮',
                    path: '/simple-calculator',
                    description: 'Basic arithmetic calculator for addition, subtraction, multiplication, and division.'
                },
                {
                    id: 2,
                    title: 'Tax',
                    icon: '🧾',
                    path: '/tax-calculator',
                    description: 'Calculate income tax or sales tax based on location, earnings, and filing status.'
                },
                {
                    id: 3,
                    title: 'Loan',
                    icon: '🏦',
                    path: '/loan-calculator',
                    description: 'Determine monthly loan payments, total interest, and amortization schedule.'
                },
                {
                    id: 5,
                    title: 'Cashflow',
                    icon: '💸',
                    path: '/cashflow-calculator',
                    description: 'Track and project business or personal cash inflows and outflows.'
                },
                {
                    id: 11,
                    title: 'Payroll',
                    icon: '📋',
                    path: '/payroll-calculator',
                    description: 'Estimate total payroll costs including wages, overtime, taxes, and deductions.'
                },
                {
                    id: 56,
                    title: 'Compound Interest',
                    icon: '📉',
                    path: '/compound-interest-calculator',
                    description: 'Calculate compound interest over time based on principal, rate, and time.'
                }
            ]
        },
        {
            name: "Business Analysis",
            icon: "📊",
            calculators: [
                {
                    id: 4,
                    title: 'Break-even',
                    icon: '⚖️',
                    path: '/break-even-calculator',
                    description: 'Find sales volume needed to cover all fixed and variable costs.'
                },
                {
                    id: 6,
                    title: 'CAC',
                    icon: '🎯',
                    path: '/cac-calculator',
                    description: 'Calculate Customer Acquisition Cost to measure spend per new customer.'
                },
                {
                    id: 7,
                    title: 'Markup',
                    icon: '🏷️',
                    path: '/markup-calculator',
                    description: 'Set profitable product prices by applying markup percentage to cost.'
                },
                {
                    id: 8,
                    title: 'Profit Margin',
                    icon: '📉',
                    path: '/profit-margin-calculator',
                    description: 'Compute gross and net profit margins to understand profitability.'
                },
                {
                    id: 9,
                    title: 'ROI',
                    icon: '📈',
                    path: '/roi-calculator',
                    description: 'Measure Return on Investment for campaigns, real estate, stocks, or capital expenditure.'
                },
                {
                    id: 12,
                    title: 'Gross Profit',
                    icon: '💰',
                    path: '/gross-profit-calculator',
                    description: 'Calculate gross profit by subtracting cost of goods sold from revenue.'
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
                    description: 'Analyze inventory turnover ratio to measure stock sales and replacement.'
                },
                {
                    id: 15,
                    title: 'Working Capital',
                    icon: '💳',
                    path: '/working-capital-calculator',
                    description: 'Assess short-term financial health with current assets minus liabilities.'
                },
                {
                    id: 46,
                    title: 'Accounts Receivable',
                    icon: '📬',
                    path: '/accounts-receivable-turnover-calculator',
                    description: 'Measure how quickly a company collects payments from customers.'
                }
            ]
        },
        {
            name: "Financial Metrics",
            icon: "📈",
            calculators: [
                {
                    id: 10,
                    title: 'NPV',
                    icon: '📊',
                    path: '/npv-calculator',
                    description: 'Calculate Net Present Value of future cash flows for investment decisions.'
                },
                {
                    id: 16,
                    title: 'Debt/Equity',
                    icon: '📉',
                    path: '/debt-to-equity-calculator',
                    description: 'Evaluate financial leverage by comparing total debt to equity.'
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
                    description: 'Calculate Return on Equity to assess profit generation from investments.'
                },
                {
                    id: 19,
                    title: 'Valuation',
                    icon: '🏢',
                    path: '/business-valuation-calculator',
                    description: 'Estimate fair market value using revenue and industry multiples.'
                },
                {
                    id: 20,
                    title: 'EVA',
                    icon: '💡',
                    path: '/eva-calculator',
                    description: 'Compute Economic Value Added — profit after covering cost of capital.'
                },
                {
                    id: 21,
                    title: 'WACC',
                    icon: '📉',
                    path: '/wacc-calculator',
                    description: 'Find Weighted Average Cost of Capital for valuation decisions.'
                },
                {
                    id: 26,
                    title: 'Free Cash Flow',
                    icon: '🔄',
                    path: '/free-cash-flow-calculator',
                    description: 'Calculate Free Cash Flow available for expansion or dividends.'
                },
                {
                    id: 42,
                    title: 'Discounted Cash Flow',
                    icon: '📉',
                    path: '/discounted-cash-flow-calculator',
                    description: 'Value a business by discounting future cash flows.'
                }
            ]
        },
        {
            name: "Personal Finance",
            icon: "👨‍👩‍👧‍👦",
            calculators: [
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
                    id: 28,
                    title: 'Pension',
                    icon: '👵',
                    path: '/pension-planning-calculator',
                    description: 'Estimate monthly pension income in retirement based on service history.'
                },
                {
                    id: 30,
                    title: 'Education',
                    icon: '🎓',
                    path: '/education-cost-calculator',
                    description: 'Plan for future education expenses including tuition and living costs.'
                },
                {
                    id: 32,
                    title: 'Credit Card',
                    icon: '💳',
                    path: '/credit-card-payoff-calculator',
                    description: 'Create payoff plan for credit card debt using snowball or avalanche methods.'
                },
                {
                    id: 45,
                    title: 'Heloc',
                    icon: '🏠',
                    path: '/heloc-calculator',
                    description: 'Calculate payments and limits for a Home Equity Line of Credit.'
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
                }
            ]
        },
        {
            name: "Real Estate & Property",
            icon: "🏠",
            calculators: [
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
                    id: 55,
                    title: 'Mortgage',
                    icon: '🏡',
                    path: '/mortgage-calculator',
                    description: 'Calculate monthly payments and total cost of financing a mortgage.'
                },
                {
                    id: 27,
                    title: 'Lease/Buy',
                    icon: '🚗',
                    path: '/lease-vs-buy-calculator',
                    description: 'Compare leasing vs buying a vehicle or equipment for smarter decisions.'
                }
            ]
        },
        {
            name: "Investment & Trading",
            icon: "💹",
            calculators: [
                {
                    id: 24,
                    title: 'Bonds',
                    icon: '📜',
                    path: '/government-bonds-calculator',
                    description: 'Estimate yield, return, and interest income from government bonds.'
                },
                {
                    id: 31,
                    title: 'Crypto',
                    icon: '₿',
                    path: '/crypto-investment-calculator',
                    description: 'Track crypto investment performance, calculate gains/losses, and estimate taxes.'
                },
                {
                    id: 37,
                    title: 'Monte Carlo',
                    icon: '🎲',
                    path: '/monte-carlo-simulation-calculator',
                    description: 'Use probabilistic modeling to simulate financial outcomes and risk.'
                },
                {
                    id: 40,
                    title: 'Staking',
                    icon: '🔗',
                    path: '/staking-rewards-calculator',
                    description: 'Calculate potential rewards from staking cryptocurrencies over time.'
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
                    id: 25,
                    title: 'Leverage',
                    icon: '⚙️',
                    path: '/operating-leverage-calculator',
                    description: 'Analyze how fixed costs affect profitability when sales volume changes.'
                },
                {
                    id: 38,
                    title: 'Game Theory',
                    icon: '♟️',
                    path: '/game-theory-payoff-calculator',
                    description: 'Model strategic interactions between competitors or players.'
                }
            ]
        },
        {
            name: "Tax & Legal",
            icon: "⚖️",
            calculators: [
                {
                    id: 29,
                    title: 'Tax Bracket',
                    icon: '🔖',
                    path: '/tax-bracket-calculator',
                    description: 'Determine federal and state tax brackets and marginal tax rate.'
                },
                {
                    id: 33,
                    title: 'Purchasing Power',
                    icon: '🌍',
                    path: '/purchasing-power-parity-calculator',
                    description: 'See how inflation or exchange rates affect the real value of money.'
                },
                {
                    id: 36,
                    title: 'Litigation',
                    icon: '⚖️',
                    path: '/litigation-cost-calculator',
                    description: 'Estimate legal fees, court costs, and settlement expenses.'
                },
                {
                    id: 39,
                    title: 'Financial Literacy',
                    icon: '📚',
                    path: '/financial-literacy-score-calculator',
                    description: 'Test knowledge of personal finance and improve financial IQ.'
                },
                {
                    id: 41,
                    title: 'Time Value',
                    icon: '⏳',
                    path: '/time-value-of-money-calculator',
                    description: 'Understand how money grows or loses value over time due to interest.'
                },
                {
                    id: 47,
                    title: 'Legal Retainer',
                    icon: '⚖️',
                    path: '/legal-retainer-calculator',
                    description: 'Track remaining balance and usage of a legal retainer fee.'
                },
                {
                    id: 50,
                    title: 'Worker Classification',
                    icon: '👷',
                    path: '/worker-classification-calculator',
                    description: 'Determine if a worker is an employee or independent contractor.'
                }
            ]
        }
    ];
    // Flatten all calculators for search
    const allCalculators = calculatorCategories.flatMap((cat)=>cat.calculators);
    const totalCalculators = allCalculators.length;
    const filteredCalculators = allCalculators.filter((calc)=>calc.title.toLowerCase().includes(searchTerm.toLowerCase()) || calc.description.toLowerCase().includes(searchTerm.toLowerCase()) || calculatorCategories.find((cat)=>cat.calculators.includes(calc))?.name.toLowerCase().includes(searchTerm.toLowerCase()));
    // Focus search input with '/' key
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BusinessCalculatorSuite.useEffect": ()=>{
            const handleKeyPress = {
                "BusinessCalculatorSuite.useEffect.handleKeyPress": (e)=>{
                    if (e.key === '/' && !e.target.matches('input, textarea, select')) {
                        e.preventDefault();
                        const searchInput = document.querySelector(`.${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].searchInput}`);
                        if (searchInput) searchInput.focus();
                    }
                }
            }["BusinessCalculatorSuite.useEffect.handleKeyPress"];
            window.addEventListener('keydown', handleKeyPress);
            return ({
                "BusinessCalculatorSuite.useEffect": ()=>window.removeEventListener('keydown', handleKeyPress)
            })["BusinessCalculatorSuite.useEffect"];
        }
    }["BusinessCalculatorSuite.useEffect"], []);
    // SEO Metadata
    const siteUrl = 'https://www.financecalculatorfree.com';
    const pageTitle = `${totalCalculators} Free Business & Finance Calculators | Expert Financial Tools ${new Date().getFullYear()}`;
    const pageDescription = `Access ${totalCalculators} free financial calculators with accurate formulas. Used by 10,000+ business owners. No signup. 100% private. Make smarter financial decisions today.`;
    const imagePreview = `${siteUrl}/images/business-calculators-preview.jpg`;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("html", {
                        lang: "en"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.js",
                        lineNumber: 147,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        charSet: "utf-8"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.js",
                        lineNumber: 148,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "viewport",
                        content: "width=device-width, initial-scale=1"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.js",
                        lineNumber: 149,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                        children: pageTitle
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.js",
                        lineNumber: 150,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "description",
                        content: pageDescription
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.js",
                        lineNumber: 151,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "keywords",
                        content: `business calculator, financial tools, ROI calculator, loan calculator, tax calculator, investment calculator, free finance tools, business planning, financial analysis, profit margin calculator, ${totalCalculators} calculators`
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.js",
                        lineNumber: 152,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "author",
                        content: "Calci Financial Experts"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.js",
                        lineNumber: 153,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "robots",
                        content: "index, follow"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.js",
                        lineNumber: 154,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "date",
                        content: currentDate
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.js",
                        lineNumber: 155,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "last-modified",
                        content: lastModifiedDate
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.js",
                        lineNumber: 156,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                        rel: "canonical",
                        href: `${siteUrl}/suite`
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.js",
                        lineNumber: 159,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:type",
                        content: "website"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.js",
                        lineNumber: 162,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:url",
                        content: `${siteUrl}/suite`
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.js",
                        lineNumber: 163,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:title",
                        content: pageTitle
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.js",
                        lineNumber: 164,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:description",
                        content: pageDescription
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.js",
                        lineNumber: 165,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:image",
                        content: imagePreview
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.js",
                        lineNumber: 166,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:image:alt",
                        content: `Collection of ${totalCalculators} business finance calculators for entrepreneurs`
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.js",
                        lineNumber: 167,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:site_name",
                        content: "Calci Finance Tools"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.js",
                        lineNumber: 168,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:locale",
                        content: "en_US"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.js",
                        lineNumber: 169,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "twitter:card",
                        content: "summary_large_image"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.js",
                        lineNumber: 172,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "twitter:site",
                        content: "@calcifinance"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.js",
                        lineNumber: 173,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "twitter:title",
                        content: pageTitle
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.js",
                        lineNumber: 174,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "twitter:description",
                        content: pageDescription
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.js",
                        lineNumber: 175,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "twitter:image",
                        content: imagePreview
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.js",
                        lineNumber: 176,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "twitter:image:alt",
                        content: `Free financial calculators for entrepreneurs and investors`
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.js",
                        lineNumber: 177,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "twitter:creator",
                        content: "@calcifinance"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.js",
                        lineNumber: 178,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "theme-color",
                        content: "#ffffff"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.js",
                        lineNumber: 181,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "apple-mobile-web-app-capable",
                        content: "yes"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.js",
                        lineNumber: 182,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "apple-mobile-web-app-status-bar-style",
                        content: "default"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.js",
                        lineNumber: 183,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                        rel: "apple-touch-icon",
                        href: "/apple-touch-icon.png"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.js",
                        lineNumber: 184,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/suite.js",
                lineNumber: 145,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                id: "main-schema",
                type: "application/ld+json",
                strategy: "afterInteractive",
                children: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'WebPage',
                    name: pageTitle,
                    description: pageDescription,
                    url: `${siteUrl}/suite`,
                    datePublished: currentDate,
                    dateModified: lastModifiedDate,
                    author: {
                        '@type': 'Organization',
                        name: 'Calci Financial Experts',
                        url: siteUrl,
                        sameAs: [
                            'https://twitter.com/calcifinance',
                            'https://linkedin.com/company/calcifinance'
                        ]
                    },
                    publisher: {
                        '@type': 'Organization',
                        name: 'Calci',
                        logo: {
                            '@type': 'ImageObject',
                            url: `${siteUrl}/logo.png`
                        }
                    },
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
                    },
                    mainEntity: {
                        '@type': 'ItemList',
                        name: 'Business & Finance Calculator Collection',
                        description: 'Comprehensive suite of financial calculators for business analysis',
                        numberOfItems: totalCalculators,
                        itemListElement: allCalculators.slice(0, 20).map((calc, index)=>({
                                '@type': 'ListItem',
                                position: index + 1,
                                item: {
                                    '@type': 'SoftwareApplication',
                                    name: `${calc.title} Calculator`,
                                    url: `${siteUrl}${calc.path}`,
                                    applicationCategory: 'BusinessApplication',
                                    operatingSystem: 'Web',
                                    offers: {
                                        '@type': 'Offer',
                                        price: '0',
                                        priceCurrency: 'USD'
                                    },
                                    aggregateRating: {
                                        '@type': 'AggregateRating',
                                        ratingValue: '4.8',
                                        ratingCount: '150'
                                    }
                                }
                            }))
                    }
                })
            }, void 0, false, {
                fileName: "[project]/src/pages/suite.js",
                lineNumber: 188,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                id: "faq-schema",
                type: "application/ld+json",
                strategy: "afterInteractive",
                children: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'FAQPage',
                    mainEntity: [
                        {
                            '@type': 'Question',
                            name: 'Are these financial calculators really free?',
                            acceptedAnswer: {
                                '@type': 'Answer',
                                text: `Yes, all ${totalCalculators} calculators are completely free with no hidden costs, registration requirements, or usage limits. We believe financial education should be accessible to everyone.`,
                                datePublished: currentDate
                            }
                        },
                        {
                            '@type': 'Question',
                            name: 'How accurate are the calculations?',
                            acceptedAnswer: {
                                '@type': 'Answer',
                                text: 'Our calculators use industry-standard formulas and are regularly reviewed by certified financial analysts. They provide professional-grade accuracy suitable for business planning and financial analysis.',
                                datePublished: currentDate
                            }
                        },
                        {
                            '@type': 'Question',
                            name: 'Is my financial data secure?',
                            acceptedAnswer: {
                                '@type': 'Answer',
                                text: 'Absolutely. All calculations happen locally in your browser. We never store, track, or transmit your financial data. Your privacy is our top priority.',
                                datePublished: currentDate
                            }
                        },
                        {
                            '@type': 'Question',
                            name: 'Who should use these calculators?',
                            acceptedAnswer: {
                                '@type': 'Answer',
                                text: 'Our tools are designed for entrepreneurs, small business owners, finance professionals, investors, and anyone making important financial decisions. From startups to established businesses, everyone can benefit.',
                                datePublished: currentDate
                            }
                        }
                    ]
                })
            }, void 0, false, {
                fileName: "[project]/src/pages/suite.js",
                lineNumber: 255,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].page,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].hero,
                        role: "banner",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].heroContent,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].title,
                                    children: [
                                        "Master Your Finances with ",
                                        totalCalculators,
                                        " Expert Calculators"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/suite.js",
                                    lineNumber: 308,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].subtitle,
                                    children: [
                                        "Used by 10,000+ business owners worldwide. Make data-driven financial decisions with confidence.",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].highlight,
                                            children: " No registration required • 100% Free • Professional Accuracy"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/suite.js",
                                            lineNumber: 311,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/suite.js",
                                    lineNumber: 309,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].trustIndicators,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].trustItem,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].trustIcon,
                                                    children: "🔢"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/suite.js",
                                                    lineNumber: 317,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        totalCalculators,
                                                        " Tools"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/suite.js",
                                                    lineNumber: 318,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/suite.js",
                                            lineNumber: 316,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].trustItem,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].trustIcon,
                                                    children: "🔒"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/suite.js",
                                                    lineNumber: 321,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "100% Private"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/suite.js",
                                                    lineNumber: 322,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/suite.js",
                                            lineNumber: 320,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].trustItem,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].trustIcon,
                                                    children: "📈"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/suite.js",
                                                    lineNumber: 325,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Industry Formulas"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/suite.js",
                                                    lineNumber: 326,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/suite.js",
                                            lineNumber: 324,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].trustItem,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].trustIcon,
                                                    children: "🎯"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/suite.js",
                                                    lineNumber: 329,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "10,000+ Users"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/suite.js",
                                                    lineNumber: 330,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/suite.js",
                                            lineNumber: 328,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/suite.js",
                                    lineNumber: 315,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].searchContainer,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].searchWrapper,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    placeholder: `Search ${totalCalculators} calculators... (try "mortgage", "ROI", or "tax")`,
                                                    value: searchTerm,
                                                    onChange: (e)=>setSearchTerm(e.target.value),
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].searchInput,
                                                    "aria-label": "Search financial calculators",
                                                    autoComplete: "off",
                                                    spellCheck: "false"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/suite.js",
                                                    lineNumber: 337,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].searchIcon,
                                                    children: "🔍"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/suite.js",
                                                    lineNumber: 347,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/suite.js",
                                            lineNumber: 336,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].hint,
                                            children: [
                                                "Quick tip: Press ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                    children: "/"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/suite.js",
                                                    lineNumber: 349,
                                                    columnNumber: 59
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " to focus search instantly"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/suite.js",
                                            lineNumber: 349,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/suite.js",
                                    lineNumber: 335,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/suite.js",
                            lineNumber: 307,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/pages/suite.js",
                        lineNumber: 306,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].mainContent,
                        role: "main",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].quickAccess,
                                "aria-label": "Quick access calculators",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].sectionTitle,
                                        children: "Most Popular Tools"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/suite.js",
                                        lineNumber: 357,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].quickAccessGrid,
                                        children: allCalculators.filter((calc)=>[
                                                'Loan',
                                                'Mortgage',
                                                'ROI',
                                                'Tax',
                                                'Compound Interest',
                                                'Break-even'
                                            ].includes(calc.title)).slice(0, 6).map((calc)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: calc.path,
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].quickCardLink,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].quickCard,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].quickIcon,
                                                            children: calc.icon
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/suite.js",
                                                            lineNumber: 364,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].quickContent,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].quickTitle,
                                                                    children: calc.title
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/suite.js",
                                                                    lineNumber: 366,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].quickDesc,
                                                                    children: calc.description
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/suite.js",
                                                                    lineNumber: 367,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/suite.js",
                                                            lineNumber: 365,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].quickArrow,
                                                            children: "→"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/suite.js",
                                                            lineNumber: 369,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/suite.js",
                                                    lineNumber: 363,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, calc.id, false, {
                                                fileName: "[project]/src/pages/suite.js",
                                                lineNumber: 362,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)))
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/suite.js",
                                        lineNumber: 358,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/suite.js",
                                lineNumber: 356,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            searchTerm ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].searchResults,
                                "aria-label": "Search results",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].sectionTitle,
                                        children: [
                                            "Found ",
                                            filteredCalculators.length,
                                            " calculator",
                                            filteredCalculators.length !== 1 ? 's' : '',
                                            ' for "',
                                            searchTerm,
                                            '"'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/suite.js",
                                        lineNumber: 379,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    filteredCalculators.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].noResults,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].noResultsIcon,
                                                children: "🔍"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/suite.js",
                                                lineNumber: 384,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                children: "No calculators found"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/suite.js",
                                                lineNumber: 385,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: 'Try searching for different terms like "loan", "investment", or "tax"'
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/suite.js",
                                                lineNumber: 386,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setSearchTerm(''),
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].clearSearch,
                                                "aria-label": "Clear search and show all calculators",
                                                children: [
                                                    "View All ",
                                                    totalCalculators,
                                                    " Calculators"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/suite.js",
                                                lineNumber: 387,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/suite.js",
                                        lineNumber: 383,
                                        columnNumber: 17
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
                                                            fileName: "[project]/src/pages/suite.js",
                                                            lineNumber: 400,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].content,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cardTitle,
                                                                    children: [
                                                                        calc.title,
                                                                        " Calculator"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/suite.js",
                                                                    lineNumber: 402,
                                                                    columnNumber: 27
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cardDesc,
                                                                    children: calc.description
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/suite.js",
                                                                    lineNumber: 403,
                                                                    columnNumber: 27
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cardMeta,
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cardCategory,
                                                                        children: [
                                                                            calculatorCategories.find((cat)=>cat.calculators.includes(calc))?.icon,
                                                                            calculatorCategories.find((cat)=>cat.calculators.includes(calc))?.name
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/suite.js",
                                                                        lineNumber: 405,
                                                                        columnNumber: 29
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/suite.js",
                                                                    lineNumber: 404,
                                                                    columnNumber: 27
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/suite.js",
                                                            lineNumber: 401,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cardArrow,
                                                            children: "→"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/suite.js",
                                                            lineNumber: 411,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/suite.js",
                                                    lineNumber: 399,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, calc.id, false, {
                                                fileName: "[project]/src/pages/suite.js",
                                                lineNumber: 398,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)))
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/suite.js",
                                        lineNumber: 396,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/suite.js",
                                lineNumber: 378,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: calculatorCategories.map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].categorySection,
                                        "aria-label": `${category.name} calculators`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].categoryTitle,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].categoryIcon,
                                                        children: category.icon
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/suite.js",
                                                        lineNumber: 424,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    category.name,
                                                    " (",
                                                    category.calculators.length,
                                                    ")"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/suite.js",
                                                lineNumber: 423,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].categoryDesc,
                                                children: [
                                                    "Essential tools for ",
                                                    category.name.toLowerCase(),
                                                    " analysis and decision-making"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/suite.js",
                                                lineNumber: 427,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cardsGrid,
                                                children: category.calculators.map((calc)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                        href: calc.path,
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cardLink,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].card,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].icon,
                                                                    children: calc.icon
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/suite.js",
                                                                    lineNumber: 434,
                                                                    columnNumber: 27
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].content,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cardTitle,
                                                                            children: [
                                                                                calc.title,
                                                                                " Calculator"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/pages/suite.js",
                                                                            lineNumber: 436,
                                                                            columnNumber: 29
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cardDesc,
                                                                            children: calc.description
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/suite.js",
                                                                            lineNumber: 437,
                                                                            columnNumber: 29
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/suite.js",
                                                                    lineNumber: 435,
                                                                    columnNumber: 27
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cardArrow,
                                                                    children: "→"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/suite.js",
                                                                    lineNumber: 439,
                                                                    columnNumber: 27
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/suite.js",
                                                            lineNumber: 433,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, calc.id, false, {
                                                        fileName: "[project]/src/pages/suite.js",
                                                        lineNumber: 432,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)))
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/suite.js",
                                                lineNumber: 430,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, category.name, true, {
                                        fileName: "[project]/src/pages/suite.js",
                                        lineNumber: 422,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)))
                            }, void 0, false),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].statsSection,
                                "aria-label": "Calculator statistics",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].statsContent,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].statsTitle,
                                            children: "Comprehensive Financial Toolkit"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/suite.js",
                                            lineNumber: 452,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].statsGrid,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].statCard,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].statNumber,
                                                            children: totalCalculators
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/suite.js",
                                                            lineNumber: 455,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].statLabel,
                                                            children: "Calculators"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/suite.js",
                                                            lineNumber: 456,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/suite.js",
                                                    lineNumber: 454,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].statCard,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].statNumber,
                                                            children: calculatorCategories.length
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/suite.js",
                                                            lineNumber: 459,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].statLabel,
                                                            children: "Categories"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/suite.js",
                                                            lineNumber: 460,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/suite.js",
                                                    lineNumber: 458,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].statCard,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].statNumber,
                                                            children: "10,000+"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/suite.js",
                                                            lineNumber: 463,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].statLabel,
                                                            children: "Monthly Users"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/suite.js",
                                                            lineNumber: 464,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/suite.js",
                                                    lineNumber: 462,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].statCard,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].statNumber,
                                                            children: "100%"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/suite.js",
                                                            lineNumber: 467,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].statLabel,
                                                            children: "Free Forever"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/suite.js",
                                                            lineNumber: 468,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/suite.js",
                                                    lineNumber: 466,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/suite.js",
                                            lineNumber: 453,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/suite.js",
                                    lineNumber: 451,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/pages/suite.js",
                                lineNumber: 450,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].valueProposition,
                                "aria-label": "Why choose our calculators",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].valueContent,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].valueTitle,
                                            children: "Why Trust Our Financial Calculators?"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/suite.js",
                                            lineNumber: 477,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].valueGrid,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].valueCard,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].valueIcon,
                                                            children: "🎓"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/suite.js",
                                                            lineNumber: 480,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            children: "Expert-Designed"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/suite.js",
                                                            lineNumber: 481,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            children: "Created by certified financial analysts with 15+ years of industry experience"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/suite.js",
                                                            lineNumber: 482,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/suite.js",
                                                    lineNumber: 479,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].valueCard,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].valueIcon,
                                                            children: "⚡"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/suite.js",
                                                            lineNumber: 485,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            children: "Lightning Fast"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/suite.js",
                                                            lineNumber: 486,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            children: "Get instant results without delays—perfect for quick business decisions"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/suite.js",
                                                            lineNumber: 487,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/suite.js",
                                                    lineNumber: 484,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].valueCard,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].valueIcon,
                                                            children: "🔒"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/suite.js",
                                                            lineNumber: 490,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            children: "100% Private"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/suite.js",
                                                            lineNumber: 491,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            children: "Your data never leaves your browser—no tracking, no storage, no worries"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/suite.js",
                                                            lineNumber: 492,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/suite.js",
                                                    lineNumber: 489,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].valueCard,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].valueIcon,
                                                            children: "📱"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/suite.js",
                                                            lineNumber: 495,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            children: "Mobile Optimized"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/suite.js",
                                                            lineNumber: 496,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            children: "Works perfectly on any device—desktop, tablet, or smartphone"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/suite.js",
                                                            lineNumber: 497,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/suite.js",
                                                    lineNumber: 494,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/suite.js",
                                            lineNumber: 478,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/suite.js",
                                    lineNumber: 476,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/pages/suite.js",
                                lineNumber: 475,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ctaSection,
                                "aria-label": "Get started with financial tools",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ctaContent,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ctaTitle,
                                            children: "Ready to Transform Your Financial Decisions?"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/suite.js",
                                            lineNumber: 506,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ctaText,
                                            children: "Join 10,000+ business owners who use our tools daily for smarter financial planning. No learning curve—just accurate results."
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/suite.js",
                                            lineNumber: 507,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ctaButtons,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/loan-calculator",
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].primaryButton,
                                                    children: "Start with Loan Calculator"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/suite.js",
                                                    lineNumber: 512,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/roi-calculator",
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].secondaryButton,
                                                    children: "Try ROI Calculator"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/suite.js",
                                                    lineNumber: 515,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/suite.js",
                                            lineNumber: 511,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ctaNote,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$businesscalculatorsuite$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].checkIcon,
                                                    children: "✓"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/suite.js",
                                                    lineNumber: 520,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " All ",
                                                totalCalculators,
                                                " tools are completely free forever"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/suite.js",
                                            lineNumber: 519,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/suite.js",
                                    lineNumber: 505,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/pages/suite.js",
                                lineNumber: 504,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/suite.js",
                        lineNumber: 354,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/suite.js",
                lineNumber: 304,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true);
};
_s(BusinessCalculatorSuite, "7rx4CbQaIs/5ckJbHkVuL5O30v0=");
_c = BusinessCalculatorSuite;
var __N_SSG = true;
const __TURBOPACK__default__export__ = BusinessCalculatorSuite;
var _c;
__turbopack_context__.k.register(_c, "BusinessCalculatorSuite");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/suite.js [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/suite";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/src/pages/suite.js [client] (ecmascript)");
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

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/suite.js [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__1f17b1df._.js.map