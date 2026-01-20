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
  "activeCategory": "blogpost-module__dFBGiq__activeCategory",
  "calculatorLink": "blogpost-module__dFBGiq__calculatorLink",
  "cardBody": "blogpost-module__dFBGiq__cardBody",
  "cardCategory": "blogpost-module__dFBGiq__cardCategory",
  "cardDescription": "blogpost-module__dFBGiq__cardDescription",
  "cardFooter": "blogpost-module__dFBGiq__cardFooter",
  "cardHeader": "blogpost-module__dFBGiq__cardHeader",
  "cardIcon": "blogpost-module__dFBGiq__cardIcon",
  "cardTitle": "blogpost-module__dFBGiq__cardTitle",
  "cardTitleContainer": "blogpost-module__dFBGiq__cardTitleContainer",
  "cardsContainer": "blogpost-module__dFBGiq__cardsContainer",
  "categoryButton": "blogpost-module__dFBGiq__categoryButton",
  "categoryContainer": "blogpost-module__dFBGiq__categoryContainer",
  "categoryCount": "blogpost-module__dFBGiq__categoryCount",
  "categoryGrid": "blogpost-module__dFBGiq__categoryGrid",
  "categoryIcon": "blogpost-module__dFBGiq__categoryIcon",
  "categoryName": "blogpost-module__dFBGiq__categoryName",
  "categorySection": "blogpost-module__dFBGiq__categorySection",
  "clearFilters": "blogpost-module__dFBGiq__clearFilters",
  "ctaButtons": "blogpost-module__dFBGiq__ctaButtons",
  "ctaContainer": "blogpost-module__dFBGiq__ctaContainer",
  "ctaIcon": "blogpost-module__dFBGiq__ctaIcon",
  "ctaSection": "blogpost-module__dFBGiq__ctaSection",
  "ctaText": "blogpost-module__dFBGiq__ctaText",
  "ctaTitle": "blogpost-module__dFBGiq__ctaTitle",
  "eduIcon": "blogpost-module__dFBGiq__eduIcon",
  "educationCard": "blogpost-module__dFBGiq__educationCard",
  "educationContainer": "blogpost-module__dFBGiq__educationContainer",
  "educationGrid": "blogpost-module__dFBGiq__educationGrid",
  "educationSection": "blogpost-module__dFBGiq__educationSection",
  "educationTitle": "blogpost-module__dFBGiq__educationTitle",
  "footer": "blogpost-module__dFBGiq__footer",
  "footerContent": "blogpost-module__dFBGiq__footerContent",
  "footerNote": "blogpost-module__dFBGiq__footerNote",
  "footerText": "blogpost-module__dFBGiq__footerText",
  "formulaCard": "blogpost-module__dFBGiq__formulaCard",
  "formulaContainer": "blogpost-module__dFBGiq__formulaContainer",
  "formulaDisplay": "blogpost-module__dFBGiq__formulaDisplay",
  "formulaLabel": "blogpost-module__dFBGiq__formulaLabel",
  "formulasGrid": "blogpost-module__dFBGiq__formulasGrid",
  "hero": "blogpost-module__dFBGiq__hero",
  "heroContent": "blogpost-module__dFBGiq__heroContent",
  "linkArrow": "blogpost-module__dFBGiq__linkArrow",
  "linkText": "blogpost-module__dFBGiq__linkText",
  "main": "blogpost-module__dFBGiq__main",
  "noResults": "blogpost-module__dFBGiq__noResults",
  "noResultsIcon": "blogpost-module__dFBGiq__noResultsIcon",
  "pageWrapper": "blogpost-module__dFBGiq__pageWrapper",
  "primaryButton": "blogpost-module__dFBGiq__primaryButton",
  "resultsInfo": "blogpost-module__dFBGiq__resultsInfo",
  "resultsTitle": "blogpost-module__dFBGiq__resultsTitle",
  "searchContainer": "blogpost-module__dFBGiq__searchContainer",
  "searchIcon": "blogpost-module__dFBGiq__searchIcon",
  "searchInput": "blogpost-module__dFBGiq__searchInput",
  "searchWrapper": "blogpost-module__dFBGiq__searchWrapper",
  "secondaryButton": "blogpost-module__dFBGiq__secondaryButton",
  "sectionTitle": "blogpost-module__dFBGiq__sectionTitle",
  "subtitle": "blogpost-module__dFBGiq__subtitle",
  "title": "blogpost-module__dFBGiq__title",
  "variableDescription": "blogpost-module__dFBGiq__variableDescription",
  "variableItem": "blogpost-module__dFBGiq__variableItem",
  "variableSymbol": "blogpost-module__dFBGiq__variableSymbol",
  "variablesContainer": "blogpost-module__dFBGiq__variablesContainer",
  "variablesLabel": "blogpost-module__dFBGiq__variablesLabel",
  "variablesList": "blogpost-module__dFBGiq__variablesList",
});
}),
"[project]/src/pages/blog.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__N_SSG",
    ()=>__N_SSG,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
// components/FormulaPage.jsx
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/script.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/pages/blogpost.module.css [client] (css module)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
const FormulaPage = ({ currentDate, lastModifiedDate })=>{
    _s();
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [activeCategory, setActiveCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('all');
    const formulaCategories = [
        {
            id: 'all',
            name: 'All Formulas',
            icon: '📚',
            count: 61
        },
        {
            id: 'business',
            name: 'Business',
            icon: '💼',
            count: 22
        },
        {
            id: 'personal',
            name: 'Personal Finance',
            icon: '👨‍👩‍👧‍👦',
            count: 20
        },
        {
            id: 'investment',
            name: 'Investment',
            icon: '📈',
            count: 12
        },
        {
            id: 'real-estate',
            name: 'Real Estate',
            icon: '🏠',
            count: 7
        }
    ];
    const allFormulas = [
        {
            id: 1,
            title: 'Compound Interest',
            category: 'personal',
            icon: '💰',
            path: '/compound-interest-calculator',
            description: 'Calculate how your money grows over time with compound interest.',
            formula: 'A = P(1 + r/n)^(nt)',
            variables: [
                {
                    symbol: 'A',
                    description: 'Future value of investment/loan'
                },
                {
                    symbol: 'P',
                    description: 'Principal investment amount'
                },
                {
                    symbol: 'r',
                    description: 'Annual interest rate (decimal)'
                },
                {
                    symbol: 'n',
                    description: 'Number of times interest compounds per year'
                },
                {
                    symbol: 't',
                    description: 'Time in years'
                }
            ]
        },
        {
            id: 2,
            title: 'Loan Payment (Amortization)',
            category: 'personal',
            icon: '🏦',
            path: '/loan-calculator',
            description: 'Calculate monthly loan payments for any type of loan.',
            formula: 'PMT = P × [r(1+r)^n] / [(1+r)^n - 1]',
            variables: [
                {
                    symbol: 'PMT',
                    description: 'Monthly payment'
                },
                {
                    symbol: 'P',
                    description: 'Principal loan amount'
                },
                {
                    symbol: 'r',
                    description: 'Monthly interest rate (annual rate ÷ 12)'
                },
                {
                    symbol: 'n',
                    description: 'Total number of payments'
                }
            ]
        },
        {
            id: 3,
            title: 'Return on Investment (ROI)',
            category: 'investment',
            icon: '📊',
            path: '/roi-calculator',
            description: 'Measure profitability of an investment relative to its cost.',
            formula: 'ROI = [(Gain - Cost) ÷ Cost] × 100%',
            variables: [
                {
                    symbol: 'ROI',
                    description: 'Return on Investment percentage'
                },
                {
                    symbol: 'Gain',
                    description: 'Return from investment'
                },
                {
                    symbol: 'Cost',
                    description: 'Cost of investment'
                }
            ]
        },
        {
            id: 4,
            title: 'Net Present Value (NPV)',
            category: 'investment',
            icon: '📈',
            path: '/npv-calculator',
            description: 'Determine present value of future cash flows.',
            formula: 'NPV = Σ [CFₜ ÷ (1 + r)^t] - Initial Investment',
            variables: [
                {
                    symbol: 'NPV',
                    description: 'Net Present Value'
                },
                {
                    symbol: 'CFₜ',
                    description: 'Cash flow at time t'
                },
                {
                    symbol: 'r',
                    description: 'Discount rate'
                },
                {
                    symbol: 't',
                    description: 'Time period'
                }
            ]
        },
        {
            id: 5,
            title: 'Break-even Point',
            category: 'business',
            icon: '⚖️',
            path: '/break-even-calculator',
            description: 'Find sales volume needed to cover all costs.',
            formula: 'Break-even Units = Fixed Costs ÷ (Price - Variable Cost)',
            variables: [
                {
                    symbol: 'Fixed Costs',
                    description: 'Costs that dont change with production'
                },
                {
                    symbol: 'Price',
                    description: 'Selling price per unit'
                },
                {
                    symbol: 'Variable Cost',
                    description: 'Cost per unit produced'
                }
            ]
        },
        {
            id: 6,
            title: 'Profit Margin',
            category: 'business',
            icon: '📉',
            path: '/profit-margin-calculator',
            description: 'Calculate profitability as percentage of revenue.',
            formula: 'Profit Margin = (Net Profit ÷ Revenue) × 100%',
            variables: [
                {
                    symbol: 'Net Profit',
                    description: 'Revenue minus all expenses'
                },
                {
                    symbol: 'Revenue',
                    description: 'Total sales income'
                }
            ]
        },
        {
            id: 7,
            title: 'Mortgage Payment',
            category: 'real-estate',
            icon: '🏡',
            path: '/mortgage-calculator',
            description: 'Calculate monthly mortgage payments.',
            formula: 'M = P × [r(1+r)^n] ÷ [(1+r)^n - 1]',
            variables: [
                {
                    symbol: 'M',
                    description: 'Monthly mortgage payment'
                },
                {
                    symbol: 'P',
                    description: 'Principal loan amount'
                },
                {
                    symbol: 'r',
                    description: 'Monthly interest rate'
                },
                {
                    symbol: 'n',
                    description: 'Total number of payments'
                }
            ]
        },
        {
            id: 8,
            title: 'Future Value of Annuity',
            category: 'personal',
            icon: '💰',
            path: '/annuity-calculator',
            description: 'Calculate future value of regular deposits.',
            formula: 'FVA = PMT × [(1 + r)^n - 1] ÷ r',
            variables: [
                {
                    symbol: 'FVA',
                    description: 'Future Value of Annuity'
                },
                {
                    symbol: 'PMT',
                    description: 'Periodic payment amount'
                },
                {
                    symbol: 'r',
                    description: 'Interest rate per period'
                },
                {
                    symbol: 'n',
                    description: 'Number of periods'
                }
            ]
        },
        {
            id: 9,
            title: 'Debt-to-Income Ratio',
            category: 'personal',
            icon: '💳',
            path: '/debt-to-income-calculator',
            description: 'Assess ability to manage monthly debt payments.',
            formula: 'DTI = (Total Monthly Debt ÷ Gross Monthly Income) × 100%',
            variables: [
                {
                    symbol: 'DTI',
                    description: 'Debt-to-Income Ratio'
                },
                {
                    symbol: 'Total Monthly Debt',
                    description: 'Sum of all monthly debt payments'
                },
                {
                    symbol: 'Gross Monthly Income',
                    description: 'Monthly income before taxes'
                }
            ]
        },
        {
            id: 10,
            title: 'Customer Acquisition Cost',
            category: 'business',
            icon: '🎯',
            path: '/cac-calculator',
            description: 'Calculate cost to acquire a new customer.',
            formula: 'CAC = Total Marketing Costs ÷ Number of New Customers',
            variables: [
                {
                    symbol: 'CAC',
                    description: 'Customer Acquisition Cost'
                },
                {
                    symbol: 'Total Marketing Costs',
                    description: 'All marketing and sales expenses'
                },
                {
                    symbol: 'New Customers',
                    description: 'Customers acquired in period'
                }
            ]
        },
        {
            id: 11,
            title: 'Gross Profit',
            category: 'business',
            icon: '💵',
            path: '/gross-profit-calculator',
            description: 'Calculate profit after cost of goods sold.',
            formula: 'Gross Profit = Revenue - Cost of Goods Sold',
            variables: [
                {
                    symbol: 'Revenue',
                    description: 'Total sales'
                },
                {
                    symbol: 'COGS',
                    description: 'Cost of Goods Sold'
                }
            ]
        },
        {
            id: 12,
            title: 'EBITDA',
            category: 'business',
            icon: '📊',
            path: '/ebitda-calculator',
            description: 'Earnings before interest, taxes, depreciation, amortization.',
            formula: 'EBITDA = Net Income + Interest + Taxes + Depreciation + Amortization',
            variables: [
                {
                    symbol: 'Net Income',
                    description: 'Profit after all expenses'
                },
                {
                    symbol: 'Interest',
                    description: 'Interest expenses'
                },
                {
                    symbol: 'Taxes',
                    description: 'Tax expenses'
                },
                {
                    symbol: 'Depreciation',
                    description: 'Depreciation expenses'
                },
                {
                    symbol: 'Amortization',
                    description: 'Amortization expenses'
                }
            ]
        },
        {
            id: 13,
            title: 'Working Capital',
            category: 'business',
            icon: '💼',
            path: '/working-capital-calculator',
            description: 'Measure short-term financial health.',
            formula: 'Working Capital = Current Assets - Current Liabilities',
            variables: [
                {
                    symbol: 'Current Assets',
                    description: 'Assets convertible to cash within year'
                },
                {
                    symbol: 'Current Liabilities',
                    description: 'Debts due within year'
                }
            ]
        },
        {
            id: 14,
            title: 'Current Ratio',
            category: 'business',
            icon: '📋',
            path: '/current-ratio-calculator',
            description: 'Measure ability to pay short-term obligations.',
            formula: 'Current Ratio = Current Assets ÷ Current Liabilities',
            variables: [
                {
                    symbol: 'Current Assets',
                    description: 'Assets convertible to cash within year'
                },
                {
                    symbol: 'Current Liabilities',
                    description: 'Debts due within year'
                }
            ]
        },
        {
            id: 15,
            title: 'Debt-to-Equity Ratio',
            category: 'business',
            icon: '⚖️',
            path: '/debt-to-equity-calculator',
            description: 'Measure financial leverage.',
            formula: 'D/E = Total Liabilities ÷ Shareholders Equity',
            variables: [
                {
                    symbol: 'Total Liabilities',
                    description: 'All debts and obligations'
                },
                {
                    symbol: 'Shareholders Equity',
                    description: 'Assets minus liabilities'
                }
            ]
        },
        {
            id: 16,
            title: 'Return on Equity',
            category: 'investment',
            icon: '🏦',
            path: '/roe-calculator',
            description: 'Measure profitability relative to equity.',
            formula: 'ROE = (Net Income ÷ Shareholders Equity) × 100%',
            variables: [
                {
                    symbol: 'Net Income',
                    description: 'Profit after all expenses'
                },
                {
                    symbol: 'Shareholders Equity',
                    description: 'Assets minus liabilities'
                }
            ]
        },
        {
            id: 17,
            title: 'Weighted Average Cost of Capital',
            category: 'investment',
            icon: '📉',
            path: '/wacc-calculator',
            description: 'Calculate average cost of capital.',
            formula: 'WACC = (E/V × Re) + (D/V × Rd × (1 - Tc))',
            variables: [
                {
                    symbol: 'E',
                    description: 'Market value of equity'
                },
                {
                    symbol: 'V',
                    description: 'Total market value'
                },
                {
                    symbol: 'Re',
                    description: 'Cost of equity'
                },
                {
                    symbol: 'D',
                    description: 'Market value of debt'
                },
                {
                    symbol: 'Rd',
                    description: 'Cost of debt'
                },
                {
                    symbol: 'Tc',
                    description: 'Corporate tax rate'
                }
            ]
        },
        {
            id: 18,
            title: 'Discounted Cash Flow',
            category: 'investment',
            icon: '💹',
            path: '/discounted-cash-flow-calculator',
            description: 'Value investment based on future cash flows.',
            formula: 'DCF = Σ [CFₜ ÷ (1 + r)^t]',
            variables: [
                {
                    symbol: 'CFₜ',
                    description: 'Cash flow at time t'
                },
                {
                    symbol: 'r',
                    description: 'Discount rate'
                },
                {
                    symbol: 't',
                    description: 'Time period'
                }
            ]
        },
        {
            id: 19,
            title: 'Inventory Turnover',
            category: 'business',
            icon: '📦',
            path: '/inventory-turnover-calculator',
            description: 'Measure how quickly inventory sells.',
            formula: 'Turnover = Cost of Goods Sold ÷ Average Inventory',
            variables: [
                {
                    symbol: 'COGS',
                    description: 'Cost of Goods Sold'
                },
                {
                    symbol: 'Average Inventory',
                    description: '(Beginning + Ending Inventory) ÷ 2'
                }
            ]
        },
        {
            id: 20,
            title: 'Accounts Receivable Turnover',
            category: 'business',
            icon: '📬',
            path: '/accounts-receivable-turnover-calculator',
            description: 'Measure collection efficiency.',
            formula: 'Turnover = Net Credit Sales ÷ Average Accounts Receivable',
            variables: [
                {
                    symbol: 'Net Credit Sales',
                    description: 'Sales on credit minus returns'
                },
                {
                    symbol: 'Average AR',
                    description: '(Beginning + Ending AR) ÷ 2'
                }
            ]
        },
        {
            id: 21,
            title: 'Markup Calculation',
            category: 'business',
            icon: '🏷️',
            path: '/markup-calculator',
            description: 'Calculate selling price based on cost and markup.',
            formula: 'Selling Price = Cost × (1 + Markup %)',
            variables: [
                {
                    symbol: 'Cost',
                    description: 'Cost of product'
                },
                {
                    symbol: 'Markup %',
                    description: 'Desired profit percentage'
                }
            ]
        },
        {
            id: 22,
            title: 'Tax Calculation',
            category: 'personal',
            icon: '🧾',
            path: '/tax-calculator',
            description: 'Calculate income tax based on brackets.',
            formula: 'Tax = (Income - Deductions) × Tax Rate',
            variables: [
                {
                    symbol: 'Income',
                    description: 'Gross income'
                },
                {
                    symbol: 'Deductions',
                    description: 'Allowable deductions'
                },
                {
                    symbol: 'Tax Rate',
                    description: 'Applicable tax bracket rate'
                }
            ]
        },
        {
            id: 23,
            title: 'Property Tax',
            category: 'real-estate',
            icon: '🏠',
            path: '/property-tax-calculator',
            description: 'Calculate annual property tax.',
            formula: 'Property Tax = Assessed Value × Tax Rate',
            variables: [
                {
                    symbol: 'Assessed Value',
                    description: 'Value determined by assessor'
                },
                {
                    symbol: 'Tax Rate',
                    description: 'Local property tax rate'
                }
            ]
        },
        {
            id: 24,
            title: 'Capital Gains Tax',
            category: 'investment',
            icon: '📈',
            path: '/capital-gains-calculator',
            description: 'Calculate tax on investment profits.',
            formula: 'Capital Gains = Sale Price - Purchase Price - Costs',
            variables: [
                {
                    symbol: 'Sale Price',
                    description: 'Price asset sold for'
                },
                {
                    symbol: 'Purchase Price',
                    description: 'Original purchase price'
                },
                {
                    symbol: 'Costs',
                    description: 'Associated costs and fees'
                }
            ]
        },
        {
            id: 25,
            title: 'Operating Leverage',
            category: 'business',
            icon: '⚙️',
            path: '/operating-leverage-calculator',
            description: 'Measure sensitivity of operating income to sales.',
            formula: 'DOL = %Δ EBIT ÷ %Δ Sales',
            variables: [
                {
                    symbol: 'DOL',
                    description: 'Degree of Operating Leverage'
                },
                {
                    symbol: 'EBIT',
                    description: 'Earnings Before Interest and Taxes'
                },
                {
                    symbol: 'Sales',
                    description: 'Revenue'
                }
            ]
        },
        {
            id: 26,
            title: 'Free Cash Flow',
            category: 'business',
            icon: '💸',
            path: '/free-cash-flow-calculator',
            description: 'Calculate cash available for expansion, dividends.',
            formula: 'FCF = Operating Cash Flow - Capital Expenditures',
            variables: [
                {
                    symbol: 'Operating Cash Flow',
                    description: 'Cash from operations'
                },
                {
                    symbol: 'Capital Expenditures',
                    description: 'Investments in fixed assets'
                }
            ]
        },
        {
            id: 27,
            title: 'Economic Value Added',
            category: 'business',
            icon: '💡',
            path: '/eva-calculator',
            description: 'Measure true economic profit.',
            formula: 'EVA = NOPAT - (WACC × Capital)',
            variables: [
                {
                    symbol: 'NOPAT',
                    description: 'Net Operating Profit After Tax'
                },
                {
                    symbol: 'WACC',
                    description: 'Weighted Average Cost of Capital'
                },
                {
                    symbol: 'Capital',
                    description: 'Total capital invested'
                }
            ]
        },
        {
            id: 28,
            title: 'Present Value',
            category: 'investment',
            icon: '⏳',
            path: '/present-value-calculator',
            description: 'Calculate present value of future sum.',
            formula: 'PV = FV ÷ (1 + r)^n',
            variables: [
                {
                    symbol: 'PV',
                    description: 'Present Value'
                },
                {
                    symbol: 'FV',
                    description: 'Future Value'
                },
                {
                    symbol: 'r',
                    description: 'Discount rate'
                },
                {
                    symbol: 'n',
                    description: 'Number of periods'
                }
            ]
        },
        {
            id: 29,
            title: 'Internal Rate of Return',
            category: 'investment',
            icon: '📊',
            path: '/irr-calculator',
            description: 'Calculate rate that makes NPV zero.',
            formula: '0 = Σ [CFₜ ÷ (1 + IRR)^t] - Initial Investment',
            variables: [
                {
                    symbol: 'CFₜ',
                    description: 'Cash flow at time t'
                },
                {
                    symbol: 'IRR',
                    description: 'Internal Rate of Return'
                },
                {
                    symbol: 't',
                    description: 'Time period'
                }
            ]
        },
        {
            id: 30,
            title: 'Payback Period',
            category: 'investment',
            icon: '⏱️',
            path: '/payback-period-calculator',
            description: 'Calculate time to recover investment.',
            formula: 'Payback Period = Initial Investment ÷ Annual Cash Flow',
            variables: [
                {
                    symbol: 'Initial Investment',
                    description: 'Total initial investment'
                },
                {
                    symbol: 'Annual Cash Flow',
                    description: 'Yearly cash inflow'
                }
            ]
        },
        {
            id: 31,
            title: 'Gross Rent Multiplier',
            category: 'real-estate',
            icon: '🏢',
            path: '/grm-calculator',
            description: 'Measure property value relative to rent.',
            formula: 'GRM = Property Price ÷ Gross Annual Rent',
            variables: [
                {
                    symbol: 'Property Price',
                    description: 'Purchase price'
                },
                {
                    symbol: 'Gross Annual Rent',
                    description: 'Yearly rental income'
                }
            ]
        },
        {
            id: 32,
            title: 'Cap Rate',
            category: 'real-estate',
            icon: '🏠',
            path: '/cap-rate-calculator',
            description: 'Calculate return on real estate investment.',
            formula: 'Cap Rate = NOI ÷ Property Value',
            variables: [
                {
                    symbol: 'NOI',
                    description: 'Net Operating Income'
                },
                {
                    symbol: 'Property Value',
                    description: 'Current market value'
                }
            ]
        },
        {
            id: 33,
            title: 'Cash-on-Cash Return',
            category: 'real-estate',
            icon: '💰',
            path: '/cash-on-cash-calculator',
            description: 'Measure return on cash invested.',
            formula: 'CoC = Annual Pre-tax Cash Flow ÷ Total Cash Invested',
            variables: [
                {
                    symbol: 'Annual Pre-tax Cash Flow',
                    description: 'Yearly cash flow before tax'
                },
                {
                    symbol: 'Total Cash Invested',
                    description: 'Initial cash investment'
                }
            ]
        },
        {
            id: 34,
            title: 'Loan-to-Value Ratio',
            category: 'real-estate',
            icon: '🏦',
            path: '/ltv-calculator',
            description: 'Measure loan amount relative to property value.',
            formula: 'LTV = Loan Amount ÷ Property Value',
            variables: [
                {
                    symbol: 'Loan Amount',
                    description: 'Mortgage amount'
                },
                {
                    symbol: 'Property Value',
                    description: 'Appraised property value'
                }
            ]
        },
        {
            id: 35,
            title: 'Debt Service Coverage Ratio',
            category: 'business',
            icon: '📋',
            path: '/dscr-calculator',
            description: 'Measure ability to service debt.',
            formula: 'DSCR = NOI ÷ Total Debt Service',
            variables: [
                {
                    symbol: 'NOI',
                    description: 'Net Operating Income'
                },
                {
                    symbol: 'Total Debt Service',
                    description: 'Total debt payments'
                }
            ]
        },
        {
            id: 36,
            title: 'Quick Ratio',
            category: 'business',
            icon: '⚡',
            path: '/quick-ratio-calculator',
            description: 'Measure immediate liquidity.',
            formula: 'Quick Ratio = (Current Assets - Inventory) ÷ Current Liabilities',
            variables: [
                {
                    symbol: 'Current Assets',
                    description: 'Assets convertible to cash within year'
                },
                {
                    symbol: 'Inventory',
                    description: 'Value of inventory'
                },
                {
                    symbol: 'Current Liabilities',
                    description: 'Debts due within year'
                }
            ]
        },
        {
            id: 37,
            title: 'Asset Turnover',
            category: 'business',
            icon: '🔄',
            path: '/asset-turnover-calculator',
            description: 'Measure efficiency in using assets.',
            formula: 'Asset Turnover = Revenue ÷ Total Assets',
            variables: [
                {
                    symbol: 'Revenue',
                    description: 'Total sales'
                },
                {
                    symbol: 'Total Assets',
                    description: 'Average total assets'
                }
            ]
        },
        {
            id: 38,
            title: 'Earnings Per Share',
            category: 'investment',
            icon: '📊',
            path: '/eps-calculator',
            description: 'Calculate profit per share.',
            formula: 'EPS = (Net Income - Preferred Dividends) ÷ Outstanding Shares',
            variables: [
                {
                    symbol: 'Net Income',
                    description: 'Total profit'
                },
                {
                    symbol: 'Preferred Dividends',
                    description: 'Dividends to preferred shareholders'
                },
                {
                    symbol: 'Outstanding Shares',
                    description: 'Number of common shares'
                }
            ]
        },
        {
            id: 39,
            title: 'Price-to-Earnings Ratio',
            category: 'investment',
            icon: '💹',
            path: '/pe-ratio-calculator',
            description: 'Measure stock valuation.',
            formula: 'P/E = Stock Price ÷ EPS',
            variables: [
                {
                    symbol: 'Stock Price',
                    description: 'Current market price per share'
                },
                {
                    symbol: 'EPS',
                    description: 'Earnings Per Share'
                }
            ]
        },
        {
            id: 40,
            title: 'Dividend Yield',
            category: 'investment',
            icon: '📈',
            path: '/dividend-yield-calculator',
            description: 'Calculate dividend return.',
            formula: 'Dividend Yield = Annual Dividend ÷ Stock Price',
            variables: [
                {
                    symbol: 'Annual Dividend',
                    description: 'Yearly dividend per share'
                },
                {
                    symbol: 'Stock Price',
                    description: 'Current market price'
                }
            ]
        },
        // ADDED: Millionaire Calculator
        {
            id: 41,
            title: 'Millionaire Calculator',
            category: 'personal',
            icon: '💎',
            path: '/millionaire-calculator',
            description: 'Calculate how long it takes to become a millionaire with your current savings and investments.',
            formula: 'Years = [ln(Million) - ln(Principal)] ÷ [ln(1 + Annual Return)]',
            variables: [
                {
                    symbol: 'Years',
                    description: 'Time needed to reach $1 million'
                },
                {
                    symbol: 'Principal',
                    description: 'Initial investment amount'
                },
                {
                    symbol: 'Annual Return',
                    description: 'Expected annual return rate'
                },
                {
                    symbol: 'Monthly Contributions',
                    description: 'Regular monthly investments'
                }
            ]
        },
        // ADDED: Early Retirement Calculator
        {
            id: 42,
            title: 'Early Retirement Calculator',
            category: 'personal',
            icon: '🏖️',
            path: '/early-retirement-calculator',
            description: 'Calculate how much you need to save to retire early based on your desired lifestyle.',
            formula: 'Retirement Savings = Annual Expenses × 25 (4% Rule)',
            variables: [
                {
                    symbol: 'Retirement Savings',
                    description: 'Total needed for retirement'
                },
                {
                    symbol: 'Annual Expenses',
                    description: 'Yearly living expenses in retirement'
                },
                {
                    symbol: 'Safe Withdrawal Rate',
                    description: 'Percentage you can withdraw annually (typically 4%)'
                },
                {
                    symbol: 'Years to Retirement',
                    description: 'Time until planned retirement'
                }
            ]
        },
        // ADDED: Inflation-Adjusted Calculator
        {
            id: 43,
            title: 'Inflation-Adjusted Calculator',
            category: 'personal',
            icon: '📉',
            path: '/inflation-adjusted-calculator',
            description: 'Calculate the real value of money over time accounting for inflation.',
            formula: 'Future Value = Present Value × (1 + Inflation Rate)^Years',
            variables: [
                {
                    symbol: 'Future Value',
                    description: 'Amount needed in future to equal todays value'
                },
                {
                    symbol: 'Present Value',
                    description: 'Current amount of money'
                },
                {
                    symbol: 'Inflation Rate',
                    description: 'Annual inflation rate'
                },
                {
                    symbol: 'Years',
                    description: 'Number of years into the future'
                }
            ]
        },
        // ADDED: Rent Increase Calculator
        {
            id: 44,
            title: 'Rent Increase Calculator',
            category: 'real-estate',
            icon: '🏢',
            path: '/rent-increase-calculator',
            description: 'Calculate future rent costs and total payments with annual increases.',
            formula: 'Future Rent = Current Rent × (1 + Annual Increase)^Years',
            variables: [
                {
                    symbol: 'Future Rent',
                    description: 'Monthly rent after specified years'
                },
                {
                    symbol: 'Current Rent',
                    description: 'Current monthly rent'
                },
                {
                    symbol: 'Annual Increase',
                    description: 'Yearly rent increase percentage'
                },
                {
                    symbol: 'Years',
                    description: 'Number of years'
                }
            ]
        },
        // ADDED: Subscription Cost Calculator
        {
            id: 45,
            title: 'Subscription Cost Calculator',
            category: 'personal',
            icon: '📱',
            path: '/subscription-cost-calculator',
            description: 'Calculate total annual and lifetime costs of your subscriptions.',
            formula: 'Annual Cost = Σ(Monthly Subscription × 12)',
            variables: [
                {
                    symbol: 'Annual Cost',
                    description: 'Total yearly subscription expenses'
                },
                {
                    symbol: 'Monthly Subscription',
                    description: 'Cost of each monthly service'
                },
                {
                    symbol: 'Number of Services',
                    description: 'Total subscription services'
                },
                {
                    symbol: 'Years',
                    description: 'Duration of subscriptions'
                }
            ]
        }
    ];
    const filteredFormulas = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "FormulaPage.useMemo[filteredFormulas]": ()=>{
            let filtered = allFormulas;
            if (activeCategory !== 'all') {
                filtered = filtered.filter({
                    "FormulaPage.useMemo[filteredFormulas]": (formula)=>formula.category === activeCategory
                }["FormulaPage.useMemo[filteredFormulas]"]);
            }
            if (searchTerm) {
                filtered = filtered.filter({
                    "FormulaPage.useMemo[filteredFormulas]": (formula)=>formula.title.toLowerCase().includes(searchTerm.toLowerCase()) || formula.description.toLowerCase().includes(searchTerm.toLowerCase()) || formula.formula.toLowerCase().includes(searchTerm.toLowerCase())
                }["FormulaPage.useMemo[filteredFormulas]"]);
            }
            return filtered;
        }
    }["FormulaPage.useMemo[filteredFormulas]"], [
        searchTerm,
        activeCategory
    ]);
    // SEO Metadata
    const siteUrl = 'https://www.financecalculatorfree.com';
    const pageTitle = 'Essential Financial Formulas | Master Finance with 45+ Key Formulas';
    const pageDescription = 'Complete guide to 45+ essential financial formulas for business, investment, personal finance, and real estate. Free calculators with detailed explanations and examples.';
    const totalFormulas = allFormulas.length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                        children: pageTitle
                    }, void 0, false, {
                        fileName: "[project]/src/pages/blog.js",
                        lineNumber: 682,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "description",
                        content: pageDescription
                    }, void 0, false, {
                        fileName: "[project]/src/pages/blog.js",
                        lineNumber: 683,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "keywords",
                        content: "financial formulas, business formulas, investment formulas, finance equations, ROI formula, NPV formula, compound interest formula, financial calculations"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/blog.js",
                        lineNumber: 684,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "author",
                        content: "Calci Financial Experts"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/blog.js",
                        lineNumber: 685,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "robots",
                        content: "index, follow"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/blog.js",
                        lineNumber: 686,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "date",
                        content: currentDate
                    }, void 0, false, {
                        fileName: "[project]/src/pages/blog.js",
                        lineNumber: 687,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "last-modified",
                        content: lastModifiedDate
                    }, void 0, false, {
                        fileName: "[project]/src/pages/blog.js",
                        lineNumber: 688,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:title",
                        content: pageTitle
                    }, void 0, false, {
                        fileName: "[project]/src/pages/blog.js",
                        lineNumber: 691,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:description",
                        content: pageDescription
                    }, void 0, false, {
                        fileName: "[project]/src/pages/blog.js",
                        lineNumber: 692,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:type",
                        content: "website"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/blog.js",
                        lineNumber: 693,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:url",
                        content: `${siteUrl}/formulas`
                    }, void 0, false, {
                        fileName: "[project]/src/pages/blog.js",
                        lineNumber: 694,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:image",
                        content: `${siteUrl}/images/financial-formulas-og.jpg`
                    }, void 0, false, {
                        fileName: "[project]/src/pages/blog.js",
                        lineNumber: 695,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:site_name",
                        content: "Calci Finance Tools"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/blog.js",
                        lineNumber: 696,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "twitter:card",
                        content: "summary_large_image"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/blog.js",
                        lineNumber: 699,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "twitter:title",
                        content: pageTitle
                    }, void 0, false, {
                        fileName: "[project]/src/pages/blog.js",
                        lineNumber: 700,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "twitter:description",
                        content: pageDescription
                    }, void 0, false, {
                        fileName: "[project]/src/pages/blog.js",
                        lineNumber: 701,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "twitter:image",
                        content: `${siteUrl}/images/financial-formulas-twitter.jpg`
                    }, void 0, false, {
                        fileName: "[project]/src/pages/blog.js",
                        lineNumber: 702,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                        rel: "canonical",
                        href: `${siteUrl}/formulas`
                    }, void 0, false, {
                        fileName: "[project]/src/pages/blog.js",
                        lineNumber: 705,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/blog.js",
                lineNumber: 681,
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
                    url: `${siteUrl}/formulas`,
                    datePublished: currentDate,
                    dateModified: lastModifiedDate,
                    author: {
                        '@type': 'Organization',
                        name: 'Calci Financial Experts',
                        url: siteUrl
                    },
                    mainEntity: {
                        '@type': 'ItemList',
                        name: 'Financial Formulas Collection',
                        description: 'Comprehensive collection of essential financial formulas',
                        numberOfItems: totalFormulas,
                        itemListElement: allFormulas.slice(0, 20).map((formula, index)=>({
                                '@type': 'ListItem',
                                position: index + 1,
                                item: {
                                    '@type': 'CreativeWork',
                                    name: `${formula.title} Formula`,
                                    description: formula.description,
                                    educationalLevel: 'Intermediate',
                                    learningResourceType: 'Formula'
                                }
                            }))
                    }
                })
            }, void 0, false, {
                fileName: "[project]/src/pages/blog.js",
                lineNumber: 709,
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
                            name: 'Why are financial formulas important?',
                            acceptedAnswer: {
                                '@type': 'Answer',
                                text: 'Financial formulas provide the mathematical foundation for making informed business, investment, and personal finance decisions. They help quantify risk, project returns, and analyze financial performance objectively.',
                                datePublished: currentDate
                            }
                        },
                        {
                            '@type': 'Question',
                            name: 'How can I use these formulas?',
                            acceptedAnswer: {
                                '@type': 'Answer',
                                text: 'Each formula comes with a free calculator tool that does the math for you. Simply input your numbers to get instant results, or study the formula to understand the underlying principles.',
                                datePublished: currentDate
                            }
                        },
                        {
                            '@type': 'Question',
                            name: 'Are these formulas used by professionals?',
                            acceptedAnswer: {
                                '@type': 'Answer',
                                text: 'Yes, these are industry-standard formulas used by financial analysts, accountants, investors, and business professionals worldwide. They form the basis of modern financial analysis.',
                                datePublished: currentDate
                            }
                        }
                    ]
                })
            }, void 0, false, {
                fileName: "[project]/src/pages/blog.js",
                lineNumber: 747,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].pageWrapper,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].hero,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].heroContent,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].title,
                                    children: "Master Financial Formulas: The Complete Guide"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/blog.js",
                                    lineNumber: 791,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].subtitle,
                                    children: [
                                        "Access ",
                                        totalFormulas,
                                        " essential financial formulas with detailed explanations, free calculators, and real-world applications. Used by 10,000+ finance professionals."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/blog.js",
                                    lineNumber: 792,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].searchContainer,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].searchWrapper,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                placeholder: "Search formulas (e.g., 'ROI', 'NPV', 'compound interest')",
                                                value: searchTerm,
                                                onChange: (e)=>setSearchTerm(e.target.value),
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].searchInput,
                                                "aria-label": "Search financial formulas"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/blog.js",
                                                lineNumber: 800,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].searchIcon,
                                                children: "🔍"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/blog.js",
                                                lineNumber: 808,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/blog.js",
                                        lineNumber: 799,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/blog.js",
                                    lineNumber: 798,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/blog.js",
                            lineNumber: 790,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/pages/blog.js",
                        lineNumber: 789,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].main,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].categorySection,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].categoryContainer,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].sectionTitle,
                                            children: "Formula Categories"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/blog.js",
                                            lineNumber: 818,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].categoryGrid,
                                            children: formulaCategories.map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].categoryButton} ${activeCategory === category.id ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].activeCategory : ''}`,
                                                    onClick: ()=>setActiveCategory(category.id),
                                                    "aria-label": `Filter formulas by ${category.name}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].categoryIcon,
                                                            children: category.icon
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/blog.js",
                                                            lineNumber: 827,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].categoryName,
                                                            children: category.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/blog.js",
                                                            lineNumber: 828,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].categoryCount,
                                                            children: category.count
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/blog.js",
                                                            lineNumber: 829,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, category.id, true, {
                                                    fileName: "[project]/src/pages/blog.js",
                                                    lineNumber: 821,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)))
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/blog.js",
                                            lineNumber: 819,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/blog.js",
                                    lineNumber: 817,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/pages/blog.js",
                                lineNumber: 816,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultsInfo,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultsTitle,
                                    children: [
                                        filteredFormulas.length,
                                        " ",
                                        filteredFormulas.length === 1 ? 'Formula' : 'Formulas',
                                        " Found",
                                        activeCategory !== 'all' && ` in ${formulaCategories.find((c)=>c.id === activeCategory)?.name}`,
                                        searchTerm && ` for "${searchTerm}"`
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/blog.js",
                                    lineNumber: 838,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/pages/blog.js",
                                lineNumber: 837,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formulasGrid,
                                children: filteredFormulas.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].noResults,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].noResultsIcon,
                                            children: "🔍"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/blog.js",
                                            lineNumber: 849,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            children: "No formulas found"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/blog.js",
                                            lineNumber: 850,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: "Try a different search term or select another category"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/blog.js",
                                            lineNumber: 851,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                setSearchTerm('');
                                                setActiveCategory('all');
                                            },
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].clearFilters,
                                            children: "Show All Formulas"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/blog.js",
                                            lineNumber: 852,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/blog.js",
                                    lineNumber: 848,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cardsContainer,
                                    children: filteredFormulas.map((formula)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formulaCard,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cardHeader,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cardIcon,
                                                            children: formula.icon
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/blog.js",
                                                            lineNumber: 867,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cardTitleContainer,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cardTitle,
                                                                    children: formula.title
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/blog.js",
                                                                    lineNumber: 869,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cardCategory,
                                                                    children: [
                                                                        formulaCategories.find((c)=>c.id === formula.category)?.icon,
                                                                        formulaCategories.find((c)=>c.id === formula.category)?.name
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/blog.js",
                                                                    lineNumber: 870,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/blog.js",
                                                            lineNumber: 868,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/blog.js",
                                                    lineNumber: 866,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cardBody,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cardDescription,
                                                            children: formula.description
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/blog.js",
                                                            lineNumber: 878,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formulaContainer,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formulaLabel,
                                                                    children: "Formula:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/blog.js",
                                                                    lineNumber: 881,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formulaDisplay,
                                                                    children: formula.formula
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/blog.js",
                                                                    lineNumber: 882,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/blog.js",
                                                            lineNumber: 880,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        formula.variables && formula.variables.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].variablesContainer,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].variablesLabel,
                                                                    children: "Variables:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/blog.js",
                                                                    lineNumber: 887,
                                                                    columnNumber: 27
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].variablesList,
                                                                    children: formula.variables.map((variable, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].variableItem,
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].variableSymbol,
                                                                                    children: variable.symbol
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/blog.js",
                                                                                    lineNumber: 891,
                                                                                    columnNumber: 33
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].variableDescription,
                                                                                    children: variable.description
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/blog.js",
                                                                                    lineNumber: 892,
                                                                                    columnNumber: 33
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            ]
                                                                        }, index, true, {
                                                                            fileName: "[project]/src/pages/blog.js",
                                                                            lineNumber: 890,
                                                                            columnNumber: 31
                                                                        }, ("TURBOPACK compile-time value", void 0)))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/blog.js",
                                                                    lineNumber: 888,
                                                                    columnNumber: 27
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/blog.js",
                                                            lineNumber: 886,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/blog.js",
                                                    lineNumber: 877,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cardFooter,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                        href: formula.path,
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].calculatorLink,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].linkText,
                                                                children: "Use Calculator"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/blog.js",
                                                                lineNumber: 902,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].linkArrow,
                                                                children: "→"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/blog.js",
                                                                lineNumber: 903,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/blog.js",
                                                        lineNumber: 901,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/blog.js",
                                                    lineNumber: 900,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, formula.id, true, {
                                            fileName: "[project]/src/pages/blog.js",
                                            lineNumber: 865,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)))
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/blog.js",
                                    lineNumber: 863,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/pages/blog.js",
                                lineNumber: 846,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ctaSection,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ctaContainer,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ctaIcon,
                                            children: "📚"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/blog.js",
                                            lineNumber: 915,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ctaTitle,
                                            children: "Need Help Applying These Formulas?"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/blog.js",
                                            lineNumber: 916,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ctaText,
                                            children: "Each formula comes with a free calculator tool that does the math for you. No manual calculations needed - just input your numbers and get instant results."
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/blog.js",
                                            lineNumber: 917,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ctaButtons,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/suite",
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].primaryButton,
                                                    children: "Explore All Calculators"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/blog.js",
                                                    lineNumber: 922,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/learn",
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].secondaryButton,
                                                    children: "Learn Finance Basics"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/blog.js",
                                                    lineNumber: 925,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/blog.js",
                                            lineNumber: 921,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/blog.js",
                                    lineNumber: 914,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/pages/blog.js",
                                lineNumber: 913,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].educationSection,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].educationContainer,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].educationTitle,
                                            children: "Why Master Financial Formulas?"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/blog.js",
                                            lineNumber: 935,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].educationGrid,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].educationCard,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].eduIcon,
                                                            children: "🎯"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/blog.js",
                                                            lineNumber: 938,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            children: "Make Better Decisions"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/blog.js",
                                                            lineNumber: 939,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            children: "Quantify risks and returns to make informed financial choices with confidence."
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/blog.js",
                                                            lineNumber: 940,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/blog.js",
                                                    lineNumber: 937,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].educationCard,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].eduIcon,
                                                            children: "📈"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/blog.js",
                                                            lineNumber: 943,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            children: "Improve Analysis"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/blog.js",
                                                            lineNumber: 944,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            children: "Understand the numbers behind business performance and investment opportunities."
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/blog.js",
                                                            lineNumber: 945,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/blog.js",
                                                    lineNumber: 942,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].educationCard,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].eduIcon,
                                                            children: "💼"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/blog.js",
                                                            lineNumber: 948,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            children: "Advance Your Career"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/blog.js",
                                                            lineNumber: 949,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            children: "Master financial analysis skills valued by employers across all industries."
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/blog.js",
                                                            lineNumber: 950,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/blog.js",
                                                    lineNumber: 947,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].educationCard,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$blogpost$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].eduIcon,
                                                            children: "💰"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/blog.js",
                                                            lineNumber: 953,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            children: "Increase Wealth"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/blog.js",
                                                            lineNumber: 954,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            children: "Apply formulas to optimize investments, reduce debt, and grow your net worth."
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/blog.js",
                                                            lineNumber: 955,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/blog.js",
                                                    lineNumber: 952,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/blog.js",
                                            lineNumber: 936,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/blog.js",
                                    lineNumber: 934,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/pages/blog.js",
                                lineNumber: 933,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/blog.js",
                        lineNumber: 814,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/blog.js",
                lineNumber: 787,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true);
};
_s(FormulaPage, "eEzTqFgNEXOSITEWr64vlPJIzck=");
_c = FormulaPage;
var __N_SSG = true;
const __TURBOPACK__default__export__ = FormulaPage;
var _c;
__turbopack_context__.k.register(_c, "FormulaPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/blog.js [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/blog";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/src/pages/blog.js [client] (ecmascript)");
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

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/blog.js [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__495e621b._.js.map