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
"[project]/src/pages/grossprofitcalculator.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "actionList": "grossprofitcalculator-module__n2aAKW__actionList",
  "actionSection": "grossprofitcalculator-module__n2aAKW__actionSection",
  "actionSteps": "grossprofitcalculator-module__n2aAKW__actionSteps",
  "actionTitle": "grossprofitcalculator-module__n2aAKW__actionTitle",
  "allocationBar": "grossprofitcalculator-module__n2aAKW__allocationBar",
  "allocationLabel": "grossprofitcalculator-module__n2aAKW__allocationLabel",
  "allocationLegend": "grossprofitcalculator-module__n2aAKW__allocationLegend",
  "allocationSubBar": "grossprofitcalculator-module__n2aAKW__allocationSubBar",
  "allocationValue": "grossprofitcalculator-module__n2aAKW__allocationValue",
  "allocationVisualization": "grossprofitcalculator-module__n2aAKW__allocationVisualization",
  "articleCard": "grossprofitcalculator-module__n2aAKW__articleCard",
  "articleSection": "grossprofitcalculator-module__n2aAKW__articleSection",
  "articleSubtitle": "grossprofitcalculator-module__n2aAKW__articleSubtitle",
  "articleTitle": "grossprofitcalculator-module__n2aAKW__articleTitle",
  "badge": "grossprofitcalculator-module__n2aAKW__badge",
  "badgeContainer": "grossprofitcalculator-module__n2aAKW__badgeContainer",
  "benchmarksTable": "grossprofitcalculator-module__n2aAKW__benchmarksTable",
  "calculatorCard": "grossprofitcalculator-module__n2aAKW__calculatorCard",
  "calculatorLayout": "grossprofitcalculator-module__n2aAKW__calculatorLayout",
  "chartBar": "grossprofitcalculator-module__n2aAKW__chartBar",
  "chartBarContainer": "grossprofitcalculator-module__n2aAKW__chartBarContainer",
  "chartBarGroup": "grossprofitcalculator-module__n2aAKW__chartBarGroup",
  "chartBarLabel": "grossprofitcalculator-module__n2aAKW__chartBarLabel",
  "chartBarValue": "grossprofitcalculator-module__n2aAKW__chartBarValue",
  "chartBars": "grossprofitcalculator-module__n2aAKW__chartBars",
  "chartContainer": "grossprofitcalculator-module__n2aAKW__chartContainer",
  "chartTitle": "grossprofitcalculator-module__n2aAKW__chartTitle",
  "cogsBreakdown": "grossprofitcalculator-module__n2aAKW__cogsBreakdown",
  "cogsGrid": "grossprofitcalculator-module__n2aAKW__cogsGrid",
  "cogsInput": "grossprofitcalculator-module__n2aAKW__cogsInput",
  "cogsLabel": "grossprofitcalculator-module__n2aAKW__cogsLabel",
  "cogsLegend": "grossprofitcalculator-module__n2aAKW__cogsLegend",
  "cogsNumberInput": "grossprofitcalculator-module__n2aAKW__cogsNumberInput",
  "cogsPieChart": "grossprofitcalculator-module__n2aAKW__cogsPieChart",
  "cogsPortion": "grossprofitcalculator-module__n2aAKW__cogsPortion",
  "cogsWrapper": "grossprofitcalculator-module__n2aAKW__cogsWrapper",
  "container": "grossprofitcalculator-module__n2aAKW__container",
  "ctaCard": "grossprofitcalculator-module__n2aAKW__ctaCard",
  "ctaText": "grossprofitcalculator-module__n2aAKW__ctaText",
  "ctaTitle": "grossprofitcalculator-module__n2aAKW__ctaTitle",
  "currencySymbol": "grossprofitcalculator-module__n2aAKW__currencySymbol",
  "disclaimer": "grossprofitcalculator-module__n2aAKW__disclaimer",
  "educationalContent": "grossprofitcalculator-module__n2aAKW__educationalContent",
  "expertQuote": "grossprofitcalculator-module__n2aAKW__expertQuote",
  "faqAnswer": "grossprofitcalculator-module__n2aAKW__faqAnswer",
  "faqCard": "grossprofitcalculator-module__n2aAKW__faqCard",
  "faqItem": "grossprofitcalculator-module__n2aAKW__faqItem",
  "faqQuestion": "grossprofitcalculator-module__n2aAKW__faqQuestion",
  "faqTitle": "grossprofitcalculator-module__n2aAKW__faqTitle",
  "footer": "grossprofitcalculator-module__n2aAKW__footer",
  "footerContent": "grossprofitcalculator-module__n2aAKW__footerContent",
  "footerNote": "grossprofitcalculator-module__n2aAKW__footerNote",
  "footerText": "grossprofitcalculator-module__n2aAKW__footerText",
  "formulaBox": "grossprofitcalculator-module__n2aAKW__formulaBox",
  "formulaCard": "grossprofitcalculator-module__n2aAKW__formulaCard",
  "goldenRuleCard": "grossprofitcalculator-module__n2aAKW__goldenRuleCard",
  "header": "grossprofitcalculator-module__n2aAKW__header",
  "headerContent": "grossprofitcalculator-module__n2aAKW__headerContent",
  "inputGroup": "grossprofitcalculator-module__n2aAKW__inputGroup",
  "inputLabel": "grossprofitcalculator-module__n2aAKW__inputLabel",
  "inputSubtitle": "grossprofitcalculator-module__n2aAKW__inputSubtitle",
  "inputWrapper": "grossprofitcalculator-module__n2aAKW__inputWrapper",
  "insightsCard": "grossprofitcalculator-module__n2aAKW__insightsCard",
  "insightsTitle": "grossprofitcalculator-module__n2aAKW__insightsTitle",
  "legendCogs": "grossprofitcalculator-module__n2aAKW__legendCogs",
  "legendColor": "grossprofitcalculator-module__n2aAKW__legendColor",
  "legendItem": "grossprofitcalculator-module__n2aAKW__legendItem",
  "legendProfit": "grossprofitcalculator-module__n2aAKW__legendProfit",
  "legendRevenue": "grossprofitcalculator-module__n2aAKW__legendRevenue",
  "legendText": "grossprofitcalculator-module__n2aAKW__legendText",
  "mainContent": "grossprofitcalculator-module__n2aAKW__mainContent",
  "mainTitle": "grossprofitcalculator-module__n2aAKW__mainTitle",
  "numberInput": "grossprofitcalculator-module__n2aAKW__numberInput",
  "pieChartContainer": "grossprofitcalculator-module__n2aAKW__pieChartContainer",
  "pieSegment": "grossprofitcalculator-module__n2aAKW__pieSegment",
  "profitPortion": "grossprofitcalculator-module__n2aAKW__profitPortion",
  "profitVisualization": "grossprofitcalculator-module__n2aAKW__profitVisualization",
  "quoteFooter": "grossprofitcalculator-module__n2aAKW__quoteFooter",
  "radioGroup": "grossprofitcalculator-module__n2aAKW__radioGroup",
  "radioInput": "grossprofitcalculator-module__n2aAKW__radioInput",
  "radioLabel": "grossprofitcalculator-module__n2aAKW__radioLabel",
  "radioText": "grossprofitcalculator-module__n2aAKW__radioText",
  "recommendationBox": "grossprofitcalculator-module__n2aAKW__recommendationBox",
  "recommendationText": "grossprofitcalculator-module__n2aAKW__recommendationText",
  "resultItem": "grossprofitcalculator-module__n2aAKW__resultItem",
  "resultLabel": "grossprofitcalculator-module__n2aAKW__resultLabel",
  "resultSubtext": "grossprofitcalculator-module__n2aAKW__resultSubtext",
  "resultValue": "grossprofitcalculator-module__n2aAKW__resultValue",
  "resultsCard": "grossprofitcalculator-module__n2aAKW__resultsCard",
  "resultsGrid": "grossprofitcalculator-module__n2aAKW__resultsGrid",
  "revenuePortion": "grossprofitcalculator-module__n2aAKW__revenuePortion",
  "ruleColumn": "grossprofitcalculator-module__n2aAKW__ruleColumn",
  "scenarioButton": "grossprofitcalculator-module__n2aAKW__scenarioButton",
  "scenarioButtons": "grossprofitcalculator-module__n2aAKW__scenarioButtons",
  "sectionTitle": "grossprofitcalculator-module__n2aAKW__sectionTitle",
  "selectInput": "grossprofitcalculator-module__n2aAKW__selectInput",
  "slider": "grossprofitcalculator-module__n2aAKW__slider",
  "strategyCard": "grossprofitcalculator-module__n2aAKW__strategyCard",
  "strategyGrid": "grossprofitcalculator-module__n2aAKW__strategyGrid",
  "subtitle": "grossprofitcalculator-module__n2aAKW__subtitle",
  "table": "grossprofitcalculator-module__n2aAKW__table",
  "totalCogsDisplay": "grossprofitcalculator-module__n2aAKW__totalCogsDisplay",
  "valueDisplay": "grossprofitcalculator-module__n2aAKW__valueDisplay",
  "warningList": "grossprofitcalculator-module__n2aAKW__warningList",
});
}),
"[project]/src/pages/gross-profit-calculator.jsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__N_SSG",
    ()=>__N_SSG,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/script.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/pages/grossprofitcalculator.module.css [client] (css module)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
const GrossProfitCalculator = ({ currentDate, lastModifiedDate })=>{
    _s();
    const [revenue, setRevenue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(100000);
    const [cogs, setCogs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        materials: 30000,
        labor: 25000,
        overhead: 15000,
        shipping: 5000,
        production: 10000,
        other: 5000
    });
    const [businessType, setBusinessType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('manufacturing');
    const [reportingPeriod, setReportingPeriod] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('monthly');
    const [results, setResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [chartData, setChartData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const industryBenchmarks = {
        'manufacturing': {
            excellent: 60,
            good: 50,
            average: 40,
            poor: 30
        },
        'retail': {
            excellent: 50,
            good: 40,
            average: 30,
            poor: 20
        },
        'software': {
            excellent: 85,
            good: 75,
            average: 65,
            poor: 50
        },
        'restaurant': {
            excellent: 70,
            good: 60,
            average: 50,
            poor: 40
        },
        'consulting': {
            excellent: 90,
            good: 80,
            average: 70,
            poor: 60
        },
        'ecommerce': {
            excellent: 45,
            good: 35,
            average: 25,
            poor: 15
        }
    };
    const periodMultipliers = {
        'daily': 30,
        'weekly': 4.33,
        'monthly': 1,
        'quarterly': 1 / 3,
        'yearly': 1 / 12
    };
    const calculateGrossProfit = ()=>{
        const totalCOGS = Object.values(cogs).reduce((sum, cost)=>sum + cost, 0);
        const grossProfit = revenue - totalCOGS;
        const grossMargin = grossProfit / revenue * 100;
        const benchmark = industryBenchmarks[businessType];
        const multiplier = periodMultipliers[reportingPeriod];
        const monthlyGrossProfit = grossProfit * multiplier;
        const annualizedGrossProfit = monthlyGrossProfit * 12;
        let performanceRating = 'Excellent';
        let ratingColor = '#4CAF50';
        let recommendation = '';
        let ratingIcon = '🚀';
        if (grossMargin >= benchmark.excellent) {
            performanceRating = 'Excellent';
            ratingColor = '#4CAF50';
            recommendation = 'Exceptional gross margin. Focus on scaling while maintaining efficiency.';
            ratingIcon = '🚀';
        } else if (grossMargin >= benchmark.good) {
            performanceRating = 'Good';
            ratingColor = '#8BC34A';
            recommendation = 'Strong gross margin. Look for opportunities to optimize costs further.';
            ratingIcon = '✅';
        } else if (grossMargin >= benchmark.average) {
            performanceRating = 'Average';
            ratingColor = '#FFC107';
            recommendation = 'Average performance. Review cost structure and pricing strategy.';
            ratingIcon = '⚠️';
        } else {
            performanceRating = 'Poor';
            ratingColor = '#F44336';
            recommendation = 'Gross margin needs improvement. Immediate cost reduction required.';
            ratingIcon = '❌';
        }
        const cogsBreakdown = Object.entries(cogs).filter(([_, amount])=>amount > 0).map(([type, amount])=>({
                name: type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1'),
                amount,
                percentage: amount / totalCOGS * 100,
                color: getCogsColor(type)
            }));
        const comparisonData = [
            {
                label: 'Your Margin',
                value: grossMargin,
                color: '#000000'
            },
            {
                label: 'Industry Excellent',
                value: benchmark.excellent,
                color: '#4CAF50'
            },
            {
                label: 'Industry Good',
                value: benchmark.good,
                color: '#8BC34A'
            },
            {
                label: 'Industry Average',
                value: benchmark.average,
                color: '#FFC107'
            },
            {
                label: 'Industry Poor',
                value: benchmark.poor,
                color: '#F44336'
            }
        ];
        const profitPerDollar = grossProfit / revenue;
        const breakEvenPoint = totalCOGS / (revenue - totalCOGS);
        setResults({
            grossProfit: Math.round(grossProfit * 100) / 100,
            grossMargin: Math.round(grossMargin * 100) / 100,
            monthlyGrossProfit: Math.round(monthlyGrossProfit * 100) / 100,
            annualizedGrossProfit: Math.round(annualizedGrossProfit * 100) / 100,
            totalCOGS,
            performanceRating,
            ratingColor,
            recommendation,
            ratingIcon,
            profitPerDollar: Math.round(profitPerDollar * 10000) / 100,
            breakEvenPoint: Math.round(breakEvenPoint * 100) / 100,
            revenuePercentage: 100,
            costPercentage: totalCOGS / revenue * 100,
            profitPercentage: grossMargin,
            benchmarkAverage: benchmark.average
        });
        setChartData({
            cogsBreakdown,
            comparison: comparisonData
        });
    };
    const getCogsColor = (type)=>{
        const colors = {
            'materials': '#2196F3',
            'labor': '#FF9800',
            'overhead': '#9C27B0',
            'shipping': '#4CAF50',
            'production': '#FF5722',
            'other': '#607D8B'
        };
        return colors[type] || '#795548';
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GrossProfitCalculator.useEffect": ()=>{
            calculateGrossProfit();
        }
    }["GrossProfitCalculator.useEffect"], [
        revenue,
        cogs,
        businessType,
        reportingPeriod
    ]);
    const formatCurrency = (value)=>{
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };
    const formatPercentage = (value)=>{
        return `${value.toFixed(2)}%`;
    };
    const updateCOGS = (costType, value)=>{
        setCogs((prev)=>({
                ...prev,
                [costType]: Math.max(0, parseInt(value) || 0)
            }));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                        children: "Advanced Gross Profit Calculator | Profit Margin Analysis Tool"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                        lineNumber: 158,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "description",
                        content: "Professional gross profit calculator with industry benchmarks. Calculate gross profit margin, analyze cost structure, and optimize business profitability."
                    }, void 0, false, {
                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                        lineNumber: 159,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "keywords",
                        content: "gross profit calculator, profit margin calculator, COGS calculator, business profitability, financial analysis, cost of goods sold"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                        lineNumber: 160,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "date",
                        content: currentDate
                    }, void 0, false, {
                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                        lineNumber: 161,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "last-modified",
                        content: lastModifiedDate
                    }, void 0, false, {
                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                        lineNumber: 162,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "viewport",
                        content: "width=device-width, initial-scale=1"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                        lineNumber: 163,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                        rel: "canonical",
                        href: "https://www.financecalculatorfree.com/gross-profit-calculator"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                        lineNumber: 164,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:title",
                        content: "Advanced Gross Profit Calculator | Profit Margin Analysis Tool"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                        lineNumber: 167,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:description",
                        content: "Calculate your gross profit margin and compare against industry benchmarks. Analyze cost structure and optimize business profitability."
                    }, void 0, false, {
                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                        lineNumber: 168,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:type",
                        content: "website"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                        lineNumber: 169,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:url",
                        content: "https://www.financecalculatorfree.com/gross-profit-calculator"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                        lineNumber: 170,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "twitter:card",
                        content: "summary_large_image"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                        lineNumber: 173,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "twitter:title",
                        content: "Professional Gross Profit Calculator"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                        lineNumber: 174,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "twitter:description",
                        content: "Analyze your gross profit margin and compare against industry benchmarks."
                    }, void 0, false, {
                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                        lineNumber: 175,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                lineNumber: 157,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                id: "gross-profit-calculator-schema",
                type: "application/ld+json",
                dangerouslySetInnerHTML: {
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SoftwareApplication",
                        "name": "Advanced Gross Profit Calculator",
                        "description": "Professional business profitability tool for calculating and analyzing gross profit margins",
                        "applicationCategory": "BusinessApplication",
                        "operatingSystem": "Web",
                        "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "USD"
                        },
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": "4.9",
                            "ratingCount": "1200",
                            "bestRating": "5",
                            "worstRating": "1"
                        },
                        "datePublished": currentDate,
                        "dateModified": currentDate,
                        "author": {
                            "@type": "Organization",
                            "name": "Financial Analytics Pro",
                            "url": "https://www.financecalculatorfree.com"
                        },
                        "featureList": [
                            "Industry Benchmark Comparisons",
                            "Cost Structure Analysis",
                            "Profit Margin Optimization",
                            "Time Period Adjustments",
                            "Break-even Analysis"
                        ]
                    })
                }
            }, void 0, false, {
                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                lineNumber: 179,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                id: "faq-schema",
                type: "application/ld+json",
                dangerouslySetInnerHTML: {
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": [
                            {
                                "@type": "Question",
                                "name": "What is a good gross profit margin for my business?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Good gross margins vary by industry. Manufacturing: 40-60%, Retail: 30-50%, Software: 65-85%, Restaurants: 50-70%. The key is comparing to industry averages while maintaining competitive pricing.",
                                    "datePublished": currentDate
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "What costs should be included in COGS?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Include all direct costs: raw materials, direct labor, manufacturing overhead, shipping/freight, production supplies, and any other costs directly tied to producing goods or services.",
                                    "datePublished": currentDate
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "How can I improve my gross profit margin?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Focus on: 1) Reducing material costs through better sourcing, 2) Improving production efficiency, 3) Increasing prices strategically, 4) Reducing waste and rework, 5) Optimizing inventory management.",
                                    "datePublished": currentDate
                                }
                            }
                        ]
                    })
                }
            }, void 0, false, {
                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                lineNumber: 221,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].container,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].header,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].headerContent,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].mainTitle,
                                    children: "Advanced Gross Profit Calculator"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                    lineNumber: 265,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].subtitle,
                                    children: "Analyze Your Profit Margins and Optimize Business Profitability"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                    lineNumber: 266,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].badgeContainer,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].badge,
                                            children: [
                                                "Updated: ",
                                                currentDate
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                            lineNumber: 268,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].badge,
                                            children: "Industry Benchmarks"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                            lineNumber: 269,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].badge,
                                            children: "Cost Structure Analysis"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                            lineNumber: 270,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                    lineNumber: 267,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                            lineNumber: 264,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                        lineNumber: 263,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].mainContent,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].calculatorLayout,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].calculatorCard,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].sectionTitle,
                                                children: "Calculate Your Gross Profit"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                lineNumber: 279,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputGroup,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputLabel,
                                                    children: [
                                                        "Total Revenue",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputWrapper,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].currencySymbol,
                                                                    children: "$"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                    lineNumber: 285,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "range",
                                                                    min: "1000",
                                                                    max: "10000000",
                                                                    step: "1000",
                                                                    value: revenue,
                                                                    onChange: (e)=>setRevenue(parseInt(e.target.value)),
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].slider
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                    lineNumber: 286,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    min: "1000",
                                                                    max: "10000000",
                                                                    step: "1000",
                                                                    value: revenue,
                                                                    onChange: (e)=>setRevenue(parseInt(e.target.value) || 0),
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].numberInput
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                    lineNumber: 295,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                            lineNumber: 284,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].valueDisplay,
                                                            children: formatCurrency(revenue)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                            lineNumber: 305,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                    lineNumber: 282,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                lineNumber: 281,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputGroup,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputSubtitle,
                                                        children: "Cost of Goods Sold (COGS)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                        lineNumber: 310,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cogsGrid,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cogsInput,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cogsLabel,
                                                                        children: "Raw Materials"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                        lineNumber: 314,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cogsWrapper,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].currencySymbol,
                                                                                children: "$"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                lineNumber: 316,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "number",
                                                                                min: "0",
                                                                                max: "1000000",
                                                                                step: "100",
                                                                                value: cogs.materials,
                                                                                onChange: (e)=>updateCOGS('materials', e.target.value),
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cogsNumberInput
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                lineNumber: 317,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                        lineNumber: 315,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                lineNumber: 313,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cogsInput,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cogsLabel,
                                                                        children: "Direct Labor"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                        lineNumber: 330,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cogsWrapper,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].currencySymbol,
                                                                                children: "$"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                lineNumber: 332,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "number",
                                                                                min: "0",
                                                                                max: "1000000",
                                                                                step: "100",
                                                                                value: cogs.labor,
                                                                                onChange: (e)=>updateCOGS('labor', e.target.value),
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cogsNumberInput
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                lineNumber: 333,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                        lineNumber: 331,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                lineNumber: 329,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cogsInput,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cogsLabel,
                                                                        children: "Manufacturing Overhead"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                        lineNumber: 346,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cogsWrapper,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].currencySymbol,
                                                                                children: "$"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                lineNumber: 348,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "number",
                                                                                min: "0",
                                                                                max: "1000000",
                                                                                step: "100",
                                                                                value: cogs.overhead,
                                                                                onChange: (e)=>updateCOGS('overhead', e.target.value),
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cogsNumberInput
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                lineNumber: 349,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                        lineNumber: 347,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                lineNumber: 345,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cogsInput,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cogsLabel,
                                                                        children: "Shipping & Freight"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                        lineNumber: 362,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cogsWrapper,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].currencySymbol,
                                                                                children: "$"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                lineNumber: 364,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "number",
                                                                                min: "0",
                                                                                max: "1000000",
                                                                                step: "100",
                                                                                value: cogs.shipping,
                                                                                onChange: (e)=>updateCOGS('shipping', e.target.value),
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cogsNumberInput
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                lineNumber: 365,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                        lineNumber: 363,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                lineNumber: 361,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cogsInput,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cogsLabel,
                                                                        children: "Production Supplies"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                        lineNumber: 378,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cogsWrapper,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].currencySymbol,
                                                                                children: "$"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                lineNumber: 380,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "number",
                                                                                min: "0",
                                                                                max: "1000000",
                                                                                step: "100",
                                                                                value: cogs.production,
                                                                                onChange: (e)=>updateCOGS('production', e.target.value),
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cogsNumberInput
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                lineNumber: 381,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                        lineNumber: 379,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                lineNumber: 377,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cogsInput,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cogsLabel,
                                                                        children: "Other Direct Costs"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                        lineNumber: 394,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cogsWrapper,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].currencySymbol,
                                                                                children: "$"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                lineNumber: 396,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "number",
                                                                                min: "0",
                                                                                max: "1000000",
                                                                                step: "100",
                                                                                value: cogs.other,
                                                                                onChange: (e)=>updateCOGS('other', e.target.value),
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cogsNumberInput
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                lineNumber: 397,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                        lineNumber: 395,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                lineNumber: 393,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                        lineNumber: 312,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].totalCogsDisplay,
                                                        children: [
                                                            "Total COGS: ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                children: formatCurrency(Object.values(cogs).reduce((sum, cost)=>sum + cost, 0))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                lineNumber: 411,
                                                                columnNumber: 31
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                        lineNumber: 410,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                lineNumber: 309,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputGroup,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputLabel,
                                                    children: [
                                                        "Business Type",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                            value: businessType,
                                                            onChange: (e)=>setBusinessType(e.target.value),
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].selectInput,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "manufacturing",
                                                                    children: "Manufacturing"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                    lineNumber: 423,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "retail",
                                                                    children: "Retail"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                    lineNumber: 424,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "software",
                                                                    children: "Software/SaaS"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                    lineNumber: 425,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "restaurant",
                                                                    children: "Restaurant/Food Service"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                    lineNumber: 426,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "consulting",
                                                                    children: "Consulting/Professional Services"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                    lineNumber: 427,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "ecommerce",
                                                                    children: "E-commerce"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                    lineNumber: 428,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                            lineNumber: 418,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                    lineNumber: 416,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                lineNumber: 415,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputGroup,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputLabel,
                                                    children: [
                                                        "Reporting Period",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].radioGroup,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].radioLabel,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "radio",
                                                                            name: "reportingPeriod",
                                                                            value: "daily",
                                                                            checked: reportingPeriod === 'daily',
                                                                            onChange: (e)=>setReportingPeriod(e.target.value),
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].radioInput
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                            lineNumber: 438,
                                                                            columnNumber: 23
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].radioText,
                                                                            children: "Daily"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                            lineNumber: 446,
                                                                            columnNumber: 23
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                    lineNumber: 437,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].radioLabel,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "radio",
                                                                            name: "reportingPeriod",
                                                                            value: "weekly",
                                                                            checked: reportingPeriod === 'weekly',
                                                                            onChange: (e)=>setReportingPeriod(e.target.value),
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].radioInput
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                            lineNumber: 449,
                                                                            columnNumber: 23
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].radioText,
                                                                            children: "Weekly"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                            lineNumber: 457,
                                                                            columnNumber: 23
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                    lineNumber: 448,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].radioLabel,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "radio",
                                                                            name: "reportingPeriod",
                                                                            value: "monthly",
                                                                            checked: reportingPeriod === 'monthly',
                                                                            onChange: (e)=>setReportingPeriod(e.target.value),
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].radioInput
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                            lineNumber: 460,
                                                                            columnNumber: 23
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].radioText,
                                                                            children: "Monthly"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                            lineNumber: 468,
                                                                            columnNumber: 23
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                    lineNumber: 459,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].radioLabel,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "radio",
                                                                            name: "reportingPeriod",
                                                                            value: "quarterly",
                                                                            checked: reportingPeriod === 'quarterly',
                                                                            onChange: (e)=>setReportingPeriod(e.target.value),
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].radioInput
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                            lineNumber: 471,
                                                                            columnNumber: 23
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].radioText,
                                                                            children: "Quarterly"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                            lineNumber: 479,
                                                                            columnNumber: 23
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                    lineNumber: 470,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].radioLabel,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "radio",
                                                                            name: "reportingPeriod",
                                                                            value: "yearly",
                                                                            checked: reportingPeriod === 'yearly',
                                                                            onChange: (e)=>setReportingPeriod(e.target.value),
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].radioInput
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                            lineNumber: 482,
                                                                            columnNumber: 23
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].radioText,
                                                                            children: "Yearly"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                            lineNumber: 490,
                                                                            columnNumber: 23
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                    lineNumber: 481,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                            lineNumber: 436,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                    lineNumber: 434,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                lineNumber: 433,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                        lineNumber: 278,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultsCard,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].sectionTitle,
                                                children: "Profitability Analysis"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                lineNumber: 499,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            results && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultsGrid,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultItem,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultLabel,
                                                                        children: "Gross Profit"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                        lineNumber: 505,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultValue,
                                                                        style: {
                                                                            color: results.ratingColor
                                                                        },
                                                                        children: formatCurrency(results.grossProfit)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                        lineNumber: 506,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultSubtext,
                                                                        children: [
                                                                            results.ratingIcon,
                                                                            " ",
                                                                            results.performanceRating
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                        lineNumber: 509,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                lineNumber: 504,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultItem,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultLabel,
                                                                        children: "Gross Margin"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                        lineNumber: 514,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultValue,
                                                                        style: {
                                                                            color: results.ratingColor
                                                                        },
                                                                        children: formatPercentage(results.grossMargin)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                        lineNumber: 515,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultSubtext,
                                                                        children: "Profit Percentage"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                        lineNumber: 518,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                lineNumber: 513,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultItem,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultLabel,
                                                                        children: "Profit per $ Revenue"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                        lineNumber: 521,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultValue,
                                                                        children: [
                                                                            "$",
                                                                            results.profitPerDollar.toFixed(2)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                        lineNumber: 522,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultSubtext,
                                                                        children: "Per dollar of revenue"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                        lineNumber: 523,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                lineNumber: 520,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultItem,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultLabel,
                                                                        children: "Monthly Gross Profit"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                        lineNumber: 526,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultValue,
                                                                        children: formatCurrency(results.monthlyGrossProfit)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                        lineNumber: 527,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultSubtext,
                                                                        children: "Adjusted for period"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                        lineNumber: 528,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                lineNumber: 525,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                        lineNumber: 503,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartContainer,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartTitle,
                                                                children: "Industry Benchmark Comparison"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                lineNumber: 534,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartBars,
                                                                children: chartData.comparison && chartData.comparison.map((data, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartBarGroup,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartBarLabel,
                                                                                children: data.label
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                lineNumber: 538,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartBarContainer,
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartBar,
                                                                                    style: {
                                                                                        width: `${Math.min(data.value, 100)}%`,
                                                                                        backgroundColor: data.color
                                                                                    },
                                                                                    title: `${data.label}: ${formatPercentage(data.value)}`
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                    lineNumber: 540,
                                                                                    columnNumber: 29
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                lineNumber: 539,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartBarValue,
                                                                                children: formatPercentage(data.value)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                lineNumber: 549,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, index, true, {
                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                        lineNumber: 537,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                lineNumber: 535,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                        lineNumber: 533,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cogsBreakdown,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartTitle,
                                                                children: "Cost Structure Analysis"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                lineNumber: 557,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cogsPieChart,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].pieChartContainer,
                                                                        children: chartData.cogsBreakdown && chartData.cogsBreakdown.map((cost, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].pieSegment,
                                                                                style: {
                                                                                    backgroundColor: cost.color,
                                                                                    transform: `rotate(${cost.percentage * 3.6}deg)`
                                                                                },
                                                                                title: `${cost.name}: ${formatCurrency(cost.amount)} (${formatPercentage(cost.percentage)})`
                                                                            }, index, false, {
                                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                lineNumber: 561,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                        lineNumber: 559,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cogsLegend,
                                                                        children: chartData.cogsBreakdown && chartData.cogsBreakdown.map((cost, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].legendItem,
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].legendColor,
                                                                                        style: {
                                                                                            backgroundColor: cost.color
                                                                                        }
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                        lineNumber: 575,
                                                                                        columnNumber: 29
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].legendText,
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                                children: [
                                                                                                    cost.name,
                                                                                                    ":"
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                                lineNumber: 580,
                                                                                                columnNumber: 31
                                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                                            " ",
                                                                                            formatCurrency(cost.amount),
                                                                                            " (",
                                                                                            formatPercentage(cost.percentage),
                                                                                            ")"
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                        lineNumber: 579,
                                                                                        columnNumber: 29
                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                ]
                                                                            }, index, true, {
                                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                lineNumber: 574,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                        lineNumber: 572,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                lineNumber: 558,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                        lineNumber: 556,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].insightsCard,
                                                        style: {
                                                            borderLeftColor: results.ratingColor
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].insightsTitle,
                                                                children: "📊 Profit Optimization Recommendations"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                lineNumber: 590,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].recommendationBox,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].recommendationText,
                                                                        children: results.recommendation
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                        lineNumber: 592,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].actionSteps,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].actionTitle,
                                                                                children: "Key Improvement Strategies:"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                lineNumber: 595,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].actionList,
                                                                                children: results.performanceRating === 'Poor' || results.performanceRating === 'Average' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                            children: "Negotiate better terms with suppliers for raw materials"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                            lineNumber: 599,
                                                                                            columnNumber: 31
                                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                            children: "Improve production efficiency to reduce labor costs"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                            lineNumber: 600,
                                                                                            columnNumber: 31
                                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                            children: "Review pricing strategy for potential increases"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                            lineNumber: 601,
                                                                                            columnNumber: 31
                                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                            children: "Reduce waste and rework in production process"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                            lineNumber: 602,
                                                                                            columnNumber: 31
                                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                            children: "Optimize inventory management to minimize carrying costs"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                            lineNumber: 603,
                                                                                            columnNumber: 31
                                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                                    ]
                                                                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                            children: "Maintain strong supplier relationships for continued cost advantages"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                            lineNumber: 607,
                                                                                            columnNumber: 31
                                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                            children: "Invest in technology to further improve production efficiency"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                            lineNumber: 608,
                                                                                            columnNumber: 31
                                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                            children: "Consider strategic price increases for premium positioning"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                            lineNumber: 609,
                                                                                            columnNumber: 31
                                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                            children: "Expand into higher-margin product lines or services"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                            lineNumber: 610,
                                                                                            columnNumber: 31
                                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                            children: "Invest in quality improvements to reduce warranty costs"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                            lineNumber: 611,
                                                                                            columnNumber: 31
                                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                                    ]
                                                                                }, void 0, true)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                lineNumber: 596,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                        lineNumber: 594,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                lineNumber: 591,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                        lineNumber: 589,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].profitVisualization,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartTitle,
                                                                children: "Revenue Allocation Analysis"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                lineNumber: 621,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].allocationVisualization,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].allocationBar,
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].revenuePortion,
                                                                            style: {
                                                                                width: '100%'
                                                                            },
                                                                            title: `Total Revenue: ${formatCurrency(revenue)}`,
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].allocationLabel,
                                                                                    children: "Total Revenue"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                    lineNumber: 629,
                                                                                    columnNumber: 27
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].allocationValue,
                                                                                    children: formatCurrency(revenue)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                    lineNumber: 630,
                                                                                    columnNumber: 27
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                            lineNumber: 624,
                                                                            columnNumber: 25
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                        lineNumber: 623,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].allocationSubBar,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cogsPortion,
                                                                                style: {
                                                                                    width: `${results.costPercentage}%`
                                                                                },
                                                                                title: `COGS: ${formatCurrency(results.totalCOGS)} (${formatPercentage(results.costPercentage)})`,
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].allocationLabel,
                                                                                        children: "COGS"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                        lineNumber: 639,
                                                                                        columnNumber: 27
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].allocationValue,
                                                                                        children: formatCurrency(results.totalCOGS)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                        lineNumber: 640,
                                                                                        columnNumber: 27
                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                lineNumber: 634,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].profitPortion,
                                                                                style: {
                                                                                    width: `${results.profitPercentage}%`
                                                                                },
                                                                                title: `Gross Profit: ${formatCurrency(results.grossProfit)} (${formatPercentage(results.profitPercentage)})`,
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].allocationLabel,
                                                                                        children: "Gross Profit"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                        lineNumber: 647,
                                                                                        columnNumber: 27
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].allocationValue,
                                                                                        children: formatCurrency(results.grossProfit)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                        lineNumber: 648,
                                                                                        columnNumber: 27
                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                lineNumber: 642,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                        lineNumber: 633,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].allocationLegend,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].legendItem,
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].legendColor} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].legendRevenue}`
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                        lineNumber: 653,
                                                                                        columnNumber: 27
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        children: [
                                                                                            "Total Revenue: ",
                                                                                            formatCurrency(revenue)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                        lineNumber: 654,
                                                                                        columnNumber: 27
                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                lineNumber: 652,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].legendItem,
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].legendColor} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].legendCogs}`
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                        lineNumber: 657,
                                                                                        columnNumber: 27
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        children: [
                                                                                            "COGS: ",
                                                                                            formatCurrency(results.totalCOGS),
                                                                                            " (",
                                                                                            formatPercentage(results.costPercentage),
                                                                                            ")"
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                        lineNumber: 658,
                                                                                        columnNumber: 27
                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                lineNumber: 656,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].legendItem,
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].legendColor} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].legendProfit}`
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                        lineNumber: 661,
                                                                                        columnNumber: 27
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        children: [
                                                                                            "Gross Profit: ",
                                                                                            formatCurrency(results.grossProfit),
                                                                                            " (",
                                                                                            formatPercentage(results.profitPercentage),
                                                                                            ")"
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                        lineNumber: 662,
                                                                                        columnNumber: 27
                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                lineNumber: 660,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                        lineNumber: 651,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                lineNumber: 622,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                        lineNumber: 620,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                        lineNumber: 498,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                lineNumber: 276,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].educationalContent,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleCard,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleTitle,
                                                children: "Mastering Gross Profit: The Foundation of Business Profitability"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                lineNumber: 675,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSection,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSubtitle,
                                                        children: "Understanding Gross Profit: Your Core Profitability Metric"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                        lineNumber: 678,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: "Gross profit measures how efficiently your business produces goods or services. It represents the money left over after subtracting the direct costs of production (Cost of Goods Sold) from your total revenue. This metric is the foundation of all profitability analysis and determines your capacity to cover operating expenses and generate net profit."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                        lineNumber: 679,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formulaCard,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                children: "Calculation Formula:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                lineNumber: 682,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formulaBox,
                                                                children: "Gross Profit = Total Revenue - Cost of Goods Sold (COGS)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                lineNumber: 683,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formulaBox,
                                                                children: "Gross Margin = (Gross Profit ÷ Total Revenue) × 100"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                lineNumber: 686,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                children: "Example: $100,000 revenue - $60,000 COGS = $40,000 gross profit (40% margin)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                lineNumber: 689,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                        lineNumber: 681,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                lineNumber: 677,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSection,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSubtitle,
                                                        children: "Industry Gross Margin Benchmarks"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                        lineNumber: 694,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].benchmarksTable,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].table,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                                children: "Industry"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                lineNumber: 700,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                                children: "Excellent"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                lineNumber: 701,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                                children: "Good"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                lineNumber: 702,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                                children: "Average"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                lineNumber: 703,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                                children: "Poor"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                lineNumber: 704,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                        lineNumber: 699,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                    lineNumber: 698,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "Software/SaaS"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                    lineNumber: 709,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "≥ 85%"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                    lineNumber: 710,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "75-85%"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                    lineNumber: 711,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "65-75%"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                    lineNumber: 712,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "< 65%"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                    lineNumber: 713,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                            lineNumber: 708,
                                                                            columnNumber: 23
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "Manufacturing"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                    lineNumber: 716,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "≥ 60%"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                    lineNumber: 717,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "50-60%"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                    lineNumber: 718,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "40-50%"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                    lineNumber: 719,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "< 40%"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                    lineNumber: 720,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                            lineNumber: 715,
                                                                            columnNumber: 23
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "Retail"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                    lineNumber: 723,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "≥ 50%"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                    lineNumber: 724,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "40-50%"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                    lineNumber: 725,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "30-40%"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                    lineNumber: 726,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "< 30%"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                    lineNumber: 727,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                            lineNumber: 722,
                                                                            columnNumber: 23
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "Restaurants"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                    lineNumber: 730,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "≥ 70%"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                    lineNumber: 731,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "60-70%"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                    lineNumber: 732,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "50-60%"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                    lineNumber: 733,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "< 50%"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                                    lineNumber: 734,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                            lineNumber: 729,
                                                                            columnNumber: 23
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                    lineNumber: 707,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                            lineNumber: 697,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                        lineNumber: 696,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                lineNumber: 693,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSection,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSubtitle,
                                                        children: "The Golden Rule: Understanding Contribution Margin"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                        lineNumber: 742,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].goldenRuleCard,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ruleColumn,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        children: "💰 Gross Margin vs Net Margin"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                        lineNumber: 745,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        children: "Gross margin measures production efficiency. Net margin (after all expenses) measures overall profitability. A strong gross margin gives you room for operating expenses."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                        lineNumber: 746,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                lineNumber: 744,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ruleColumn,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        children: "📊 Contribution to Fixed Costs"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                        lineNumber: 749,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        children: "Gross profit must first cover all fixed costs (rent, salaries, marketing). What remains is your net profit. Higher gross margin means faster coverage of fixed costs."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                        lineNumber: 750,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                lineNumber: 748,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ruleColumn,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        children: "⚖️ Break-Even Analysis"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                        lineNumber: 753,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        children: "Break-even point = Fixed Costs ÷ Gross Margin %. Lower margins require higher sales volume to break even. Higher margins mean faster profitability."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                        lineNumber: 754,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                lineNumber: 752,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                        lineNumber: 743,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                lineNumber: 741,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSection,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSubtitle,
                                                        children: "Advanced Gross Profit Optimization Strategies"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                        lineNumber: 760,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].strategyGrid,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].strategyCard,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        children: "🏭 Improve Production Efficiency"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                        lineNumber: 764,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        children: "Implement lean manufacturing, reduce setup times, minimize waste, and optimize workflow. Small efficiency gains can significantly impact gross margins."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                        lineNumber: 765,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                lineNumber: 763,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].strategyCard,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        children: "🤝 Strategic Supplier Management"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                        lineNumber: 769,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        children: "Negotiate volume discounts, establish long-term partnerships, diversify suppliers, and consider vertical integration for critical components."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                        lineNumber: 770,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                lineNumber: 768,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].strategyCard,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        children: "💰 Value-Based Pricing"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                        lineNumber: 774,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        children: "Price based on value delivered, not just costs incurred. Premium products/services should command premium margins to reflect their value."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                        lineNumber: 775,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                lineNumber: 773,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].strategyCard,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        children: "📦 Optimize Product Mix"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                        lineNumber: 779,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        children: "Focus on high-margin products/services. Use contribution margin analysis to prioritize production and marketing efforts toward most profitable items."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                        lineNumber: 780,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                lineNumber: 778,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                        lineNumber: 762,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                lineNumber: 759,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSection,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSubtitle,
                                                        children: "Common COGS Calculation Mistakes to Avoid"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                        lineNumber: 786,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].warningList,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: "Including Indirect Costs:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                        lineNumber: 788,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    " Administrative salaries, marketing, and rent should not be in COGS"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                lineNumber: 788,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: "Inconsistent Inventory Valuation:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                        lineNumber: 789,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    " Switching between FIFO, LIFO, or weighted average methods"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                lineNumber: 789,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: "Ignoring Overhead Allocation:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                        lineNumber: 790,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    " Not properly allocating manufacturing overhead to products"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                lineNumber: 790,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: "Missing Components:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                        lineNumber: 791,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    " Forgetting shipping, freight, or import duties in COGS"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                lineNumber: 791,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: "Timing Mismatches:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                        lineNumber: 792,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    " Recognizing revenue before corresponding costs are incurred"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                lineNumber: 792,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                        lineNumber: 787,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                lineNumber: 785,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSection,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSubtitle,
                                                        children: "Expert Insights from Financial Analysts"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                        lineNumber: 797,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("blockquote", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].expertQuote,
                                                        children: [
                                                            "\"Gross margin is the first line of defense in profitability. Companies with consistently high gross margins have more strategic flexibility - they can invest more in R&D, withstand price competition better, and weather economic downturns more easily. It's not just a number; it's a measure of business model strength.\"",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].quoteFooter,
                                                                children: "— CFO, Manufacturing Company, 20+ years experience"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                                lineNumber: 800,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                        lineNumber: 798,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                lineNumber: 796,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                        lineNumber: 674,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqCard,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqTitle,
                                                children: "Frequently Asked Questions"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                lineNumber: 807,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqItem,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqQuestion,
                                                        children: "What's the difference between gross profit and net profit?"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                        lineNumber: 810,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqAnswer,
                                                        children: "Gross profit = Revenue - COGS (direct production costs). Net profit = Gross profit - All other expenses (operating expenses, taxes, interest). Gross profit measures production efficiency; net profit measures overall business profitability."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                        lineNumber: 811,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                lineNumber: 809,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqItem,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqQuestion,
                                                        children: "Should employee salaries be included in COGS?"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                        lineNumber: 815,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqAnswer,
                                                        children: "Only direct labor (employees directly involved in production) should be in COGS. Administrative, sales, and management salaries are operating expenses. For service businesses, billable hours of service providers are typically included."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                        lineNumber: 816,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                lineNumber: 814,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqItem,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqQuestion,
                                                        children: "How often should I calculate gross profit?"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                        lineNumber: 820,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqAnswer,
                                                        children: "Calculate gross profit monthly for regular monitoring, and track trends over time. Segment by product line, customer type, or geographic region for more actionable insights into profitability drivers."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                        lineNumber: 821,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                lineNumber: 819,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqItem,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqQuestion,
                                                        children: "What's a healthy gross margin for growth?"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                        lineNumber: 825,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqAnswer,
                                                        children: "For sustainable growth, aim for gross margins at least 10-15% above your industry average. This provides cushion for investment in growth initiatives, marketing, and R&D while maintaining healthy profitability."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                        lineNumber: 826,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                lineNumber: 824,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                        lineNumber: 806,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                lineNumber: 673,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].actionSection,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ctaCard,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ctaTitle,
                                            children: "Optimize Your Business Profitability"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                            lineNumber: 834,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ctaText,
                                            children: "Use our calculator to benchmark your gross margins against industry standards and develop a data-driven profit optimization plan. Test different scenarios to maximize your business profitability."
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                            lineNumber: 835,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$grossprofitcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].disclaimer,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Disclaimer:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                                    lineNumber: 838,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " This calculator provides estimates for educational and planning purposes. Industry benchmarks are based on aggregated data and may not reflect specific market conditions or business models. Actual optimal gross margins vary based on business stage, market position, competitive landscape, and strategic objectives. Consult with qualified financial advisors before making significant business decisions."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                            lineNumber: 837,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                    lineNumber: 833,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                                lineNumber: 832,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                        lineNumber: 275,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/gross-profit-calculator.jsx",
                lineNumber: 261,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true);
};
_s(GrossProfitCalculator, "buhwdcNyWQYenL3EKc22xlslN4o=");
_c = GrossProfitCalculator;
var __N_SSG = true;
const __TURBOPACK__default__export__ = GrossProfitCalculator;
var _c;
__turbopack_context__.k.register(_c, "GrossProfitCalculator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/gross-profit-calculator.jsx [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/gross-profit-calculator";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/src/pages/gross-profit-calculator.jsx [client] (ecmascript)");
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
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/src/pages/gross-profit-calculator\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/gross-profit-calculator.jsx [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__bad5b341._.js.map