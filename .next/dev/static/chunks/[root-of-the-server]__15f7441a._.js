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
"[project]/src/pages/debttoincomecalculator.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "actionList": "debttoincomecalculator-module__VyIUGW__actionList",
  "actionSection": "debttoincomecalculator-module__VyIUGW__actionSection",
  "actionSteps": "debttoincomecalculator-module__VyIUGW__actionSteps",
  "actionTitle": "debttoincomecalculator-module__VyIUGW__actionTitle",
  "articleCard": "debttoincomecalculator-module__VyIUGW__articleCard",
  "articleSection": "debttoincomecalculator-module__VyIUGW__articleSection",
  "articleSubtitle": "debttoincomecalculator-module__VyIUGW__articleSubtitle",
  "articleTitle": "debttoincomecalculator-module__VyIUGW__articleTitle",
  "badge": "debttoincomecalculator-module__VyIUGW__badge",
  "badgeContainer": "debttoincomecalculator-module__VyIUGW__badgeContainer",
  "calculatorCard": "debttoincomecalculator-module__VyIUGW__calculatorCard",
  "calculatorLayout": "debttoincomecalculator-module__VyIUGW__calculatorLayout",
  "chartBar": "debttoincomecalculator-module__VyIUGW__chartBar",
  "chartBarContainer": "debttoincomecalculator-module__VyIUGW__chartBarContainer",
  "chartBarGroup": "debttoincomecalculator-module__VyIUGW__chartBarGroup",
  "chartBarLabel": "debttoincomecalculator-module__VyIUGW__chartBarLabel",
  "chartBarValue": "debttoincomecalculator-module__VyIUGW__chartBarValue",
  "chartBars": "debttoincomecalculator-module__VyIUGW__chartBars",
  "chartContainer": "debttoincomecalculator-module__VyIUGW__chartContainer",
  "chartTitle": "debttoincomecalculator-module__VyIUGW__chartTitle",
  "container": "debttoincomecalculator-module__VyIUGW__container",
  "ctaCard": "debttoincomecalculator-module__VyIUGW__ctaCard",
  "ctaText": "debttoincomecalculator-module__VyIUGW__ctaText",
  "ctaTitle": "debttoincomecalculator-module__VyIUGW__ctaTitle",
  "currencySymbol": "debttoincomecalculator-module__VyIUGW__currencySymbol",
  "debtBreakdown": "debttoincomecalculator-module__VyIUGW__debtBreakdown",
  "debtGrid": "debttoincomecalculator-module__VyIUGW__debtGrid",
  "debtInput": "debttoincomecalculator-module__VyIUGW__debtInput",
  "debtLabel": "debttoincomecalculator-module__VyIUGW__debtLabel",
  "debtLegend": "debttoincomecalculator-module__VyIUGW__debtLegend",
  "debtNumberInput": "debttoincomecalculator-module__VyIUGW__debtNumberInput",
  "debtPieChart": "debttoincomecalculator-module__VyIUGW__debtPieChart",
  "debtPortion": "debttoincomecalculator-module__VyIUGW__debtPortion",
  "debtWrapper": "debttoincomecalculator-module__VyIUGW__debtWrapper",
  "disclaimer": "debttoincomecalculator-module__VyIUGW__disclaimer",
  "educationalContent": "debttoincomecalculator-module__VyIUGW__educationalContent",
  "expertQuote": "debttoincomecalculator-module__VyIUGW__expertQuote",
  "faqAnswer": "debttoincomecalculator-module__VyIUGW__faqAnswer",
  "faqCard": "debttoincomecalculator-module__VyIUGW__faqCard",
  "faqItem": "debttoincomecalculator-module__VyIUGW__faqItem",
  "faqQuestion": "debttoincomecalculator-module__VyIUGW__faqQuestion",
  "faqTitle": "debttoincomecalculator-module__VyIUGW__faqTitle",
  "footer": "debttoincomecalculator-module__VyIUGW__footer",
  "footerContent": "debttoincomecalculator-module__VyIUGW__footerContent",
  "footerNote": "debttoincomecalculator-module__VyIUGW__footerNote",
  "footerText": "debttoincomecalculator-module__VyIUGW__footerText",
  "formulaBox": "debttoincomecalculator-module__VyIUGW__formulaBox",
  "formulaCard": "debttoincomecalculator-module__VyIUGW__formulaCard",
  "goldenRuleCard": "debttoincomecalculator-module__VyIUGW__goldenRuleCard",
  "header": "debttoincomecalculator-module__VyIUGW__header",
  "headerContent": "debttoincomecalculator-module__VyIUGW__headerContent",
  "incomeDebtSplit": "debttoincomecalculator-module__VyIUGW__incomeDebtSplit",
  "incomePortion": "debttoincomecalculator-module__VyIUGW__incomePortion",
  "inputGroup": "debttoincomecalculator-module__VyIUGW__inputGroup",
  "inputLabel": "debttoincomecalculator-module__VyIUGW__inputLabel",
  "inputSubtitle": "debttoincomecalculator-module__VyIUGW__inputSubtitle",
  "inputWrapper": "debttoincomecalculator-module__VyIUGW__inputWrapper",
  "insightsCard": "debttoincomecalculator-module__VyIUGW__insightsCard",
  "insightsTitle": "debttoincomecalculator-module__VyIUGW__insightsTitle",
  "legendColor": "debttoincomecalculator-module__VyIUGW__legendColor",
  "legendDebt": "debttoincomecalculator-module__VyIUGW__legendDebt",
  "legendIncome": "debttoincomecalculator-module__VyIUGW__legendIncome",
  "legendItem": "debttoincomecalculator-module__VyIUGW__legendItem",
  "legendText": "debttoincomecalculator-module__VyIUGW__legendText",
  "mainContent": "debttoincomecalculator-module__VyIUGW__mainContent",
  "mainTitle": "debttoincomecalculator-module__VyIUGW__mainTitle",
  "numberInput": "debttoincomecalculator-module__VyIUGW__numberInput",
  "percentageSymbol": "debttoincomecalculator-module__VyIUGW__percentageSymbol",
  "pieChartContainer": "debttoincomecalculator-module__VyIUGW__pieChartContainer",
  "pieSegment": "debttoincomecalculator-module__VyIUGW__pieSegment",
  "quoteFooter": "debttoincomecalculator-module__VyIUGW__quoteFooter",
  "radioGroup": "debttoincomecalculator-module__VyIUGW__radioGroup",
  "radioInput": "debttoincomecalculator-module__VyIUGW__radioInput",
  "radioLabel": "debttoincomecalculator-module__VyIUGW__radioLabel",
  "radioText": "debttoincomecalculator-module__VyIUGW__radioText",
  "recommendationBox": "debttoincomecalculator-module__VyIUGW__recommendationBox",
  "recommendationText": "debttoincomecalculator-module__VyIUGW__recommendationText",
  "requirementsTable": "debttoincomecalculator-module__VyIUGW__requirementsTable",
  "resultItem": "debttoincomecalculator-module__VyIUGW__resultItem",
  "resultLabel": "debttoincomecalculator-module__VyIUGW__resultLabel",
  "resultSubtext": "debttoincomecalculator-module__VyIUGW__resultSubtext",
  "resultValue": "debttoincomecalculator-module__VyIUGW__resultValue",
  "resultsCard": "debttoincomecalculator-module__VyIUGW__resultsCard",
  "resultsGrid": "debttoincomecalculator-module__VyIUGW__resultsGrid",
  "ruleColumn": "debttoincomecalculator-module__VyIUGW__ruleColumn",
  "ruleNote": "debttoincomecalculator-module__VyIUGW__ruleNote",
  "scenarioButton": "debttoincomecalculator-module__VyIUGW__scenarioButton",
  "scenarioButtons": "debttoincomecalculator-module__VyIUGW__scenarioButtons",
  "sectionTitle": "debttoincomecalculator-module__VyIUGW__sectionTitle",
  "selectInput": "debttoincomecalculator-module__VyIUGW__selectInput",
  "slider": "debttoincomecalculator-module__VyIUGW__slider",
  "splitBar": "debttoincomecalculator-module__VyIUGW__splitBar",
  "splitLabel": "debttoincomecalculator-module__VyIUGW__splitLabel",
  "splitLegend": "debttoincomecalculator-module__VyIUGW__splitLegend",
  "splitPercentage": "debttoincomecalculator-module__VyIUGW__splitPercentage",
  "splitVisualization": "debttoincomecalculator-module__VyIUGW__splitVisualization",
  "strategyCard": "debttoincomecalculator-module__VyIUGW__strategyCard",
  "strategyGrid": "debttoincomecalculator-module__VyIUGW__strategyGrid",
  "subtitle": "debttoincomecalculator-module__VyIUGW__subtitle",
  "table": "debttoincomecalculator-module__VyIUGW__table",
  "totalDebtDisplay": "debttoincomecalculator-module__VyIUGW__totalDebtDisplay",
  "valueDisplay": "debttoincomecalculator-module__VyIUGW__valueDisplay",
  "yearsSymbol": "debttoincomecalculator-module__VyIUGW__yearsSymbol",
});
}),
"[project]/src/pages/debt-to-income-calculator.js [client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/pages/debttoincomecalculator.module.css [client] (css module)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
const DebtToIncomeCalculator = ({ currentDate, lastModifiedDate })=>{
    _s();
    const [grossMonthlyIncome, setGrossMonthlyIncome] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(8000);
    const [monthlyDebts, setMonthlyDebts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        mortgage: 1500,
        autoLoan: 400,
        creditCards: 300,
        studentLoans: 250,
        personalLoans: 150,
        otherDebts: 100
    });
    const [loanType, setLoanType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('mortgage');
    const [creditScore, setCreditScore] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('good');
    const [results, setResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [chartData, setChartData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const lenderRequirements = {
        'mortgage': {
            excellent: 36,
            good: 43,
            acceptable: 50,
            poor: 57
        },
        'auto': {
            excellent: 8,
            good: 15,
            acceptable: 20,
            poor: 25
        },
        'personal': {
            excellent: 10,
            good: 20,
            acceptable: 30,
            poor: 40
        },
        'credit-card': {
            excellent: 15,
            good: 25,
            acceptable: 35,
            poor: 45
        }
    };
    const creditScoreLevels = {
        'excellent': {
            min: 740,
            color: '#4CAF50',
            label: 'Excellent (740+)'
        },
        'good': {
            min: 670,
            color: '#8BC34A',
            label: 'Good (670-739)'
        },
        'fair': {
            min: 580,
            color: '#FFC107',
            label: 'Fair (580-669)'
        },
        'poor': {
            min: 300,
            color: '#F44336',
            label: 'Poor (300-579)'
        }
    };
    const calculateDTI = ()=>{
        const totalMonthlyDebt = Object.values(monthlyDebts).reduce((sum, debt)=>sum + debt, 0);
        const dtiRatio = totalMonthlyDebt / grossMonthlyIncome * 100;
        const creditInfo = creditScoreLevels[creditScore];
        const loanRequirements = lenderRequirements[loanType];
        const maxAllowedDTI = loanRequirements ? loanRequirements[creditScore] : 43;
        let approvalStatus = '';
        let approvalColor = '#4CAF50';
        let recommendation = '';
        let statusIcon = '✅';
        if (dtiRatio <= maxAllowedDTI) {
            approvalStatus = 'Likely Approved';
            approvalColor = '#4CAF50';
            recommendation = 'Your DTI ratio meets lender requirements. Consider additional financial goals.';
            statusIcon = '✅';
        } else if (dtiRatio <= maxAllowedDTI + 5) {
            approvalStatus = 'Borderline';
            approvalColor = '#FFC107';
            recommendation = 'Slightly above preferred ratio. Consider reducing debts before applying.';
            statusIcon = '⚠️';
        } else {
            approvalStatus = 'Needs Improvement';
            approvalColor = '#F44336';
            recommendation = 'DTI ratio too high. Focus on debt reduction before applying for new credit.';
            statusIcon = '❌';
        }
        const debtBreakdown = Object.entries(monthlyDebts).filter(([_, amount])=>amount > 0).map(([type, amount])=>({
                name: type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1'),
                amount,
                percentage: amount / totalMonthlyDebt * 100
            }));
        const comparisonData = [
            {
                label: 'Your DTI',
                value: dtiRatio,
                color: '#000000'
            },
            {
                label: 'Excellent',
                value: loanRequirements.excellent,
                color: '#4CAF50'
            },
            {
                label: 'Good',
                value: loanRequirements.good,
                color: '#8BC34A'
            },
            {
                label: 'Acceptable',
                value: loanRequirements.acceptable,
                color: '#FFC107'
            },
            {
                label: 'Poor',
                value: loanRequirements.poor,
                color: '#F44336'
            }
        ];
        setResults({
            dtiRatio: Math.round(dtiRatio * 100) / 100,
            totalMonthlyDebt,
            approvalStatus,
            approvalColor,
            recommendation,
            statusIcon,
            maxAllowedDTI,
            disposableIncome: grossMonthlyIncome - totalMonthlyDebt,
            debtToIncomePercentage: dtiRatio,
            incomePercentage: 100 - dtiRatio,
            creditScoreInfo: creditInfo
        });
        setChartData({
            debtBreakdown,
            comparison: comparisonData
        });
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DebtToIncomeCalculator.useEffect": ()=>{
            calculateDTI();
        }
    }["DebtToIncomeCalculator.useEffect"], [
        grossMonthlyIncome,
        monthlyDebts,
        loanType,
        creditScore
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
    const updateDebt = (debtType, value)=>{
        setMonthlyDebts((prev)=>({
                ...prev,
                [debtType]: Math.max(0, parseInt(value) || 0)
            }));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                        children: "Advanced Debt-to-Income Ratio Calculator | Loan Approval Analysis"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                        lineNumber: 128,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "description",
                        content: "Professional DTI calculator with lender requirements. Analyze your debt-to-income ratio, check loan eligibility, and improve your financial profile."
                    }, void 0, false, {
                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                        lineNumber: 129,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "keywords",
                        content: "debt to income calculator, DTI ratio, loan approval, mortgage calculator, credit score, financial health"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                        lineNumber: 130,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "date",
                        content: currentDate
                    }, void 0, false, {
                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                        lineNumber: 131,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "last-modified",
                        content: lastModifiedDate
                    }, void 0, false, {
                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                        lineNumber: 132,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "viewport",
                        content: "width=device-width, initial-scale=1"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                        lineNumber: 133,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                        rel: "canonical",
                        href: "https://www.financecalculatorfree.com/debt-to-income-calculator"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                        lineNumber: 134,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:title",
                        content: "Advanced Debt-to-Income Ratio Calculator | Loan Approval Analysis"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                        lineNumber: 137,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:description",
                        content: "Calculate your DTI ratio and check loan eligibility with our professional calculator. Compare against lender requirements and improve your financial profile."
                    }, void 0, false, {
                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                        lineNumber: 138,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:type",
                        content: "website"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                        lineNumber: 139,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:url",
                        content: "https://www.financecalculatorfree.com/debt-to-income-calculator"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                        lineNumber: 140,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "twitter:card",
                        content: "summary_large_image"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                        lineNumber: 143,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "twitter:title",
                        content: "Professional Debt-to-Income Calculator"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                        lineNumber: 144,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "twitter:description",
                        content: "Analyze your DTI ratio and check loan eligibility against lender requirements."
                    }, void 0, false, {
                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                        lineNumber: 145,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                lineNumber: 127,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                id: "debt-to-income-calculator-schema",
                type: "application/ld+json",
                dangerouslySetInnerHTML: {
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SoftwareApplication",
                        "name": "Advanced Debt-to-Income Ratio Calculator",
                        "description": "Professional financial calculator for analyzing debt-to-income ratios and loan eligibility",
                        "applicationCategory": "FinanceApplication",
                        "operatingSystem": "Web",
                        "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "USD"
                        },
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": "4.8",
                            "ratingCount": "1100",
                            "bestRating": "5",
                            "worstRating": "1"
                        },
                        "datePublished": currentDate,
                        "dateModified": currentDate,
                        "author": {
                            "@type": "Organization",
                            "name": "Financial Tools Pro",
                            "url": "https://www.financecalculatorfree.com"
                        },
                        "featureList": [
                            "Lender Requirement Comparisons",
                            "Loan Type Analysis",
                            "Credit Score Integration",
                            "Debt Breakdown Visualization",
                            "Approval Probability Assessment"
                        ]
                    })
                }
            }, void 0, false, {
                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                lineNumber: 149,
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
                                "name": "What is a good debt-to-income ratio for mortgage approval?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "For conventional mortgages, most lenders prefer a DTI ratio below 43%. With excellent credit, some lenders may accept up to 50%. FHA loans can go up to 57% with compensating factors.",
                                    "datePublished": currentDate
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "How does credit score affect DTI requirements?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Higher credit scores typically allow for higher DTI ratios. Excellent credit (740+) might get you approved at 50% DTI, while lower scores may require ratios below 43%.",
                                    "datePublished": currentDate
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "What debts are included in DTI calculation?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "All monthly debt payments are included: mortgage/rent, auto loans, credit card minimum payments, student loans, personal loans, and any other recurring debt obligations.",
                                    "datePublished": currentDate
                                }
                            }
                        ]
                    })
                }
            }, void 0, false, {
                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                lineNumber: 191,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].container,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].header,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].headerContent,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].mainTitle,
                                    children: "Advanced Debt-to-Income Ratio Calculator"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                    lineNumber: 235,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].subtitle,
                                    children: "Analyze Your Loan Eligibility and Improve Your Financial Profile"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                    lineNumber: 236,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].badgeContainer,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].badge,
                                            children: [
                                                "Updated: ",
                                                currentDate
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                            lineNumber: 238,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].badge,
                                            children: "Lender Requirements"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                            lineNumber: 239,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].badge,
                                            children: "Credit Score Aware"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                            lineNumber: 240,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                    lineNumber: 237,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/debt-to-income-calculator.js",
                            lineNumber: 234,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                        lineNumber: 233,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].mainContent,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].calculatorLayout,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].calculatorCard,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].sectionTitle,
                                                children: "Calculate Your DTI Ratio"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                lineNumber: 249,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputGroup,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputLabel,
                                                    children: [
                                                        "Gross Monthly Income",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputWrapper,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].currencySymbol,
                                                                    children: "$"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                    lineNumber: 255,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "range",
                                                                    min: "1000",
                                                                    max: "50000",
                                                                    step: "100",
                                                                    value: grossMonthlyIncome,
                                                                    onChange: (e)=>setGrossMonthlyIncome(parseInt(e.target.value)),
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].slider
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                    lineNumber: 256,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    min: "1000",
                                                                    max: "50000",
                                                                    step: "100",
                                                                    value: grossMonthlyIncome,
                                                                    onChange: (e)=>setGrossMonthlyIncome(parseInt(e.target.value) || 0),
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].numberInput
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                    lineNumber: 265,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                            lineNumber: 254,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].valueDisplay,
                                                            children: [
                                                                formatCurrency(grossMonthlyIncome),
                                                                "/month"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                            lineNumber: 275,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                    lineNumber: 252,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                lineNumber: 251,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputGroup,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputSubtitle,
                                                        children: "Monthly Debt Payments"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                        lineNumber: 280,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].debtGrid,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].debtInput,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].debtLabel,
                                                                        children: "Mortgage/Rent"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                        lineNumber: 284,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].debtWrapper,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].currencySymbol,
                                                                                children: "$"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                lineNumber: 286,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "number",
                                                                                min: "0",
                                                                                max: "10000",
                                                                                step: "50",
                                                                                value: monthlyDebts.mortgage,
                                                                                onChange: (e)=>updateDebt('mortgage', e.target.value),
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].debtNumberInput
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                lineNumber: 287,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                        lineNumber: 285,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                lineNumber: 283,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].debtInput,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].debtLabel,
                                                                        children: "Auto Loans"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                        lineNumber: 300,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].debtWrapper,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].currencySymbol,
                                                                                children: "$"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                lineNumber: 302,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "number",
                                                                                min: "0",
                                                                                max: "5000",
                                                                                step: "50",
                                                                                value: monthlyDebts.autoLoan,
                                                                                onChange: (e)=>updateDebt('autoLoan', e.target.value),
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].debtNumberInput
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                lineNumber: 303,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                        lineNumber: 301,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                lineNumber: 299,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].debtInput,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].debtLabel,
                                                                        children: "Credit Cards"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                        lineNumber: 316,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].debtWrapper,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].currencySymbol,
                                                                                children: "$"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                lineNumber: 318,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "number",
                                                                                min: "0",
                                                                                max: "5000",
                                                                                step: "25",
                                                                                value: monthlyDebts.creditCards,
                                                                                onChange: (e)=>updateDebt('creditCards', e.target.value),
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].debtNumberInput
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                lineNumber: 319,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                        lineNumber: 317,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                lineNumber: 315,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].debtInput,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].debtLabel,
                                                                        children: "Student Loans"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                        lineNumber: 332,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].debtWrapper,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].currencySymbol,
                                                                                children: "$"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                lineNumber: 334,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "number",
                                                                                min: "0",
                                                                                max: "5000",
                                                                                step: "25",
                                                                                value: monthlyDebts.studentLoans,
                                                                                onChange: (e)=>updateDebt('studentLoans', e.target.value),
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].debtNumberInput
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                lineNumber: 335,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                        lineNumber: 333,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                lineNumber: 331,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].debtInput,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].debtLabel,
                                                                        children: "Personal Loans"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                        lineNumber: 348,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].debtWrapper,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].currencySymbol,
                                                                                children: "$"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                lineNumber: 350,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "number",
                                                                                min: "0",
                                                                                max: "5000",
                                                                                step: "25",
                                                                                value: monthlyDebts.personalLoans,
                                                                                onChange: (e)=>updateDebt('personalLoans', e.target.value),
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].debtNumberInput
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                lineNumber: 351,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                        lineNumber: 349,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                lineNumber: 347,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].debtInput,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].debtLabel,
                                                                        children: "Other Debts"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                        lineNumber: 364,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].debtWrapper,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].currencySymbol,
                                                                                children: "$"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                lineNumber: 366,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "number",
                                                                                min: "0",
                                                                                max: "5000",
                                                                                step: "25",
                                                                                value: monthlyDebts.otherDebts,
                                                                                onChange: (e)=>updateDebt('otherDebts', e.target.value),
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].debtNumberInput
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                lineNumber: 367,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                        lineNumber: 365,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                lineNumber: 363,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                        lineNumber: 282,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].totalDebtDisplay,
                                                        children: [
                                                            "Total Monthly Debt: ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                children: formatCurrency(Object.values(monthlyDebts).reduce((sum, debt)=>sum + debt, 0))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                lineNumber: 381,
                                                                columnNumber: 39
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                        lineNumber: 380,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                lineNumber: 279,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputGroup,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputLabel,
                                                    children: [
                                                        "Loan Type",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                            value: loanType,
                                                            onChange: (e)=>setLoanType(e.target.value),
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].selectInput,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "mortgage",
                                                                    children: "Mortgage"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                    lineNumber: 393,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "auto",
                                                                    children: "Auto Loan"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                    lineNumber: 394,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "personal",
                                                                    children: "Personal Loan"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                    lineNumber: 395,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "credit-card",
                                                                    children: "Credit Card"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                    lineNumber: 396,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                            lineNumber: 388,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                    lineNumber: 386,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                lineNumber: 385,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputGroup,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputLabel,
                                                    children: [
                                                        "Credit Score Range",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].radioGroup,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].radioLabel,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "radio",
                                                                            name: "creditScore",
                                                                            value: "excellent",
                                                                            checked: creditScore === 'excellent',
                                                                            onChange: (e)=>setCreditScore(e.target.value),
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].radioInput
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                            lineNumber: 406,
                                                                            columnNumber: 23
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].radioText,
                                                                            children: "Excellent (740+)"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                            lineNumber: 414,
                                                                            columnNumber: 23
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                    lineNumber: 405,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].radioLabel,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "radio",
                                                                            name: "creditScore",
                                                                            value: "good",
                                                                            checked: creditScore === 'good',
                                                                            onChange: (e)=>setCreditScore(e.target.value),
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].radioInput
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                            lineNumber: 417,
                                                                            columnNumber: 23
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].radioText,
                                                                            children: "Good (670-739)"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                            lineNumber: 425,
                                                                            columnNumber: 23
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                    lineNumber: 416,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].radioLabel,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "radio",
                                                                            name: "creditScore",
                                                                            value: "fair",
                                                                            checked: creditScore === 'fair',
                                                                            onChange: (e)=>setCreditScore(e.target.value),
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].radioInput
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                            lineNumber: 428,
                                                                            columnNumber: 23
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].radioText,
                                                                            children: "Fair (580-669)"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                            lineNumber: 436,
                                                                            columnNumber: 23
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                    lineNumber: 427,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].radioLabel,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "radio",
                                                                            name: "creditScore",
                                                                            value: "poor",
                                                                            checked: creditScore === 'poor',
                                                                            onChange: (e)=>setCreditScore(e.target.value),
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].radioInput
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                            lineNumber: 439,
                                                                            columnNumber: 23
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].radioText,
                                                                            children: "Poor (300-579)"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                            lineNumber: 447,
                                                                            columnNumber: 23
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                    lineNumber: 438,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                            lineNumber: 404,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                    lineNumber: 402,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                lineNumber: 401,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                        lineNumber: 248,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultsCard,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].sectionTitle,
                                                children: "Financial Analysis"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                lineNumber: 456,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            results && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultsGrid,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultItem,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultLabel,
                                                                        children: "DTI Ratio"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                        lineNumber: 462,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultValue,
                                                                        style: {
                                                                            color: results.approvalColor
                                                                        },
                                                                        children: formatPercentage(results.dtiRatio)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                        lineNumber: 463,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultSubtext,
                                                                        children: [
                                                                            results.statusIcon,
                                                                            " ",
                                                                            results.approvalStatus
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                        lineNumber: 466,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                lineNumber: 461,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultItem,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultLabel,
                                                                        children: "Disposable Income"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                        lineNumber: 471,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultValue,
                                                                        children: formatCurrency(results.disposableIncome)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                        lineNumber: 472,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultSubtext,
                                                                        children: "Per Month"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                        lineNumber: 473,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                lineNumber: 470,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultItem,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultLabel,
                                                                        children: "Total Monthly Debt"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                        lineNumber: 476,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultValue,
                                                                        children: formatCurrency(results.totalMonthlyDebt)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                        lineNumber: 477,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultSubtext,
                                                                        children: "All Payments"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                        lineNumber: 478,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                lineNumber: 475,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultItem,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultLabel,
                                                                        children: "Max Allowed DTI"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                        lineNumber: 481,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultValue,
                                                                        children: formatPercentage(results.maxAllowedDTI)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                        lineNumber: 482,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultSubtext,
                                                                        children: "For Your Credit"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                        lineNumber: 483,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                lineNumber: 480,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                        lineNumber: 460,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartContainer,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartTitle,
                                                                children: "Lender Requirements Comparison"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                lineNumber: 489,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartBars,
                                                                children: chartData.comparison && chartData.comparison.map((data, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartBarGroup,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartBarLabel,
                                                                                children: data.label
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                lineNumber: 493,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartBarContainer,
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartBar,
                                                                                    style: {
                                                                                        width: `${Math.min(data.value * 2, 100)}%`,
                                                                                        backgroundColor: data.color
                                                                                    },
                                                                                    title: `${data.label}: ${formatPercentage(data.value)}`
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                    lineNumber: 495,
                                                                                    columnNumber: 29
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                lineNumber: 494,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartBarValue,
                                                                                children: formatPercentage(data.value)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                lineNumber: 504,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, index, true, {
                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                        lineNumber: 492,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                lineNumber: 490,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                        lineNumber: 488,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].debtBreakdown,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartTitle,
                                                                children: "Debt Composition"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                lineNumber: 512,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].debtPieChart,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].pieChartContainer,
                                                                        children: chartData.debtBreakdown && chartData.debtBreakdown.map((debt, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].pieSegment,
                                                                                style: {
                                                                                    backgroundColor: debt.color || `hsl(${index * 60}, 70%, 60%)`,
                                                                                    transform: `rotate(${debt.percentage * 3.6}deg)`
                                                                                },
                                                                                title: `${debt.name}: ${formatCurrency(debt.amount)} (${formatPercentage(debt.percentage)})`
                                                                            }, index, false, {
                                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                lineNumber: 516,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                        lineNumber: 514,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].debtLegend,
                                                                        children: chartData.debtBreakdown && chartData.debtBreakdown.map((debt, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].legendItem,
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].legendColor,
                                                                                        style: {
                                                                                            backgroundColor: debt.color || `hsl(${index * 60}, 70%, 60%)`
                                                                                        }
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                        lineNumber: 530,
                                                                                        columnNumber: 29
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].legendText,
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                                children: [
                                                                                                    debt.name,
                                                                                                    ":"
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                                lineNumber: 535,
                                                                                                columnNumber: 31
                                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                                            " ",
                                                                                            formatCurrency(debt.amount),
                                                                                            " (",
                                                                                            formatPercentage(debt.percentage),
                                                                                            ")"
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                        lineNumber: 534,
                                                                                        columnNumber: 29
                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                ]
                                                                            }, index, true, {
                                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                lineNumber: 529,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                        lineNumber: 527,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                lineNumber: 513,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                        lineNumber: 511,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].insightsCard,
                                                        style: {
                                                            borderLeftColor: results.approvalColor
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].insightsTitle,
                                                                children: "📋 Action Plan & Recommendations"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                lineNumber: 545,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].recommendationBox,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].recommendationText,
                                                                        children: results.recommendation
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                        lineNumber: 547,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].actionSteps,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].actionTitle,
                                                                                children: "Steps to Improve Your DTI:"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                lineNumber: 550,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].actionList,
                                                                                children: results.dtiRatio > results.maxAllowedDTI ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                            children: "Increase income through side gigs or career advancement"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                            lineNumber: 554,
                                                                                            columnNumber: 31
                                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                            children: "Pay down high-interest debt first (credit cards)"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                            lineNumber: 555,
                                                                                            columnNumber: 31
                                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                            children: "Consider debt consolidation to lower monthly payments"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                            lineNumber: 556,
                                                                                            columnNumber: 31
                                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                            children: "Refinance existing loans for better terms"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                            lineNumber: 557,
                                                                                            columnNumber: 31
                                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                            children: "Avoid taking on new debt until ratio improves"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                            lineNumber: 558,
                                                                                            columnNumber: 31
                                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                                    ]
                                                                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                            children: "Maintain current debt levels while building savings"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                            lineNumber: 562,
                                                                                            columnNumber: 31
                                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                            children: "Consider additional payments on highest-interest debt"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                            lineNumber: 563,
                                                                                            columnNumber: 31
                                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                            children: "Build emergency fund (3-6 months of expenses)"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                            lineNumber: 564,
                                                                                            columnNumber: 31
                                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                            children: "Monitor credit score regularly"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                            lineNumber: 565,
                                                                                            columnNumber: 31
                                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                            children: "Plan for major purchases strategically"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                            lineNumber: 566,
                                                                                            columnNumber: 31
                                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                                    ]
                                                                                }, void 0, true)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                lineNumber: 551,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                        lineNumber: 549,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                lineNumber: 546,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                        lineNumber: 544,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].incomeDebtSplit,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartTitle,
                                                                children: "Income Allocation"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                lineNumber: 576,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].splitVisualization,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].splitBar,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].debtPortion,
                                                                                style: {
                                                                                    width: `${results.debtToIncomePercentage}%`
                                                                                },
                                                                                title: `Debt Payments: ${formatPercentage(results.debtToIncomePercentage)}`,
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].splitLabel,
                                                                                        children: "Debt Payments"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                        lineNumber: 584,
                                                                                        columnNumber: 27
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].splitPercentage,
                                                                                        children: formatPercentage(results.debtToIncomePercentage)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                        lineNumber: 585,
                                                                                        columnNumber: 27
                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                lineNumber: 579,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].incomePortion,
                                                                                style: {
                                                                                    width: `${results.incomePercentage}%`
                                                                                },
                                                                                title: `Available Income: ${formatPercentage(results.incomePercentage)}`,
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].splitLabel,
                                                                                        children: "Available Income"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                        lineNumber: 592,
                                                                                        columnNumber: 27
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].splitPercentage,
                                                                                        children: formatPercentage(results.incomePercentage)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                        lineNumber: 593,
                                                                                        columnNumber: 27
                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                lineNumber: 587,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                        lineNumber: 578,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].splitLegend,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].legendItem,
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].legendColor} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].legendDebt}`
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                        lineNumber: 598,
                                                                                        columnNumber: 27
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        children: [
                                                                                            "Debt Payments: ",
                                                                                            formatCurrency(results.totalMonthlyDebt)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                        lineNumber: 599,
                                                                                        columnNumber: 27
                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                lineNumber: 597,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].legendItem,
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].legendColor} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].legendIncome}`
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                        lineNumber: 602,
                                                                                        columnNumber: 27
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        children: [
                                                                                            "Available Income: ",
                                                                                            formatCurrency(results.disposableIncome)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                        lineNumber: 603,
                                                                                        columnNumber: 27
                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                lineNumber: 601,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                        lineNumber: 596,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                lineNumber: 577,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                        lineNumber: 575,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                        lineNumber: 455,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                lineNumber: 246,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].educationalContent,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleCard,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleTitle,
                                                children: "Mastering Your Debt-to-Income Ratio: The Key to Financial Freedom"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                lineNumber: 616,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSection,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSubtitle,
                                                        children: "Understanding DTI: Your Financial Health Barometer"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                        lineNumber: 619,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: "The debt-to-income ratio (DTI) is a critical financial metric that lenders use to assess your ability to manage monthly payments and repay debts. It compares your total monthly debt payments to your gross monthly income, expressed as a percentage. This single number can determine your eligibility for loans, interest rates offered, and overall financial flexibility."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                        lineNumber: 620,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formulaCard,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                children: "Calculation Formula:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                lineNumber: 623,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formulaBox,
                                                                children: "DTI Ratio = (Total Monthly Debt Payments ÷ Gross Monthly Income) × 100"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                lineNumber: 624,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                children: "Example: $2,700 monthly debt ÷ $8,000 monthly income = 33.75% DTI ratio"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                lineNumber: 627,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                        lineNumber: 622,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                lineNumber: 618,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSection,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSubtitle,
                                                        children: "Lender Requirements by Loan Type"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                        lineNumber: 632,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].requirementsTable,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].table,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                                children: "Loan Type"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                lineNumber: 638,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                                children: "Excellent Credit"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                lineNumber: 639,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                                children: "Good Credit"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                lineNumber: 640,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                                children: "Fair Credit"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                lineNumber: 641,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                                children: "Poor Credit"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                lineNumber: 642,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                        lineNumber: 637,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                    lineNumber: 636,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "Conventional Mortgage"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                    lineNumber: 647,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "≤ 50%"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                    lineNumber: 648,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "≤ 43%"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                    lineNumber: 649,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "≤ 36%"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                    lineNumber: 650,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "≤ 29%"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                    lineNumber: 651,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                            lineNumber: 646,
                                                                            columnNumber: 23
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "FHA Mortgage"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                    lineNumber: 654,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "≤ 57%"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                    lineNumber: 655,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "≤ 50%"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                    lineNumber: 656,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "≤ 43%"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                    lineNumber: 657,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "≤ 36%"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                    lineNumber: 658,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                            lineNumber: 653,
                                                                            columnNumber: 23
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "Auto Loan"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                    lineNumber: 661,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "≤ 15%"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                    lineNumber: 662,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "≤ 12%"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                    lineNumber: 663,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "≤ 10%"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                    lineNumber: 664,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "≤ 8%"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                    lineNumber: 665,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                            lineNumber: 660,
                                                                            columnNumber: 23
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "Personal Loan"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                    lineNumber: 668,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "≤ 40%"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                    lineNumber: 669,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "≤ 35%"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                    lineNumber: 670,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "≤ 30%"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                    lineNumber: 671,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "≤ 25%"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                                    lineNumber: 672,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                            lineNumber: 667,
                                                                            columnNumber: 23
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                    lineNumber: 645,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                            lineNumber: 635,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                        lineNumber: 634,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                lineNumber: 631,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSection,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSubtitle,
                                                        children: "Strategies to Improve Your DTI Ratio"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                        lineNumber: 680,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].strategyGrid,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].strategyCard,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        children: "💰 Increase Income"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                        lineNumber: 684,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        children: "Ask for a raise, pursue promotions, start a side business, or take on freelance work. Even a 10-20% income increase can significantly improve your DTI ratio."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                        lineNumber: 685,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                lineNumber: 683,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].strategyCard,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        children: "📉 Reduce Debt"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                        lineNumber: 689,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        children: "Use the debt avalanche (high-interest first) or snowball (smallest balance first) method. Consider balance transfers or consolidation loans for better rates."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                        lineNumber: 690,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                lineNumber: 688,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].strategyCard,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        children: "🏠 Refinance"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                        lineNumber: 694,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        children: "Refinance high-interest loans when rates are favorable. Extending loan terms can lower monthly payments, though total interest may increase."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                        lineNumber: 695,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                lineNumber: 693,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].strategyCard,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        children: "💳 Smart Credit Use"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                        lineNumber: 699,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        children: "Pay more than minimums, avoid new debt, and use 0% APR offers strategically. Keep credit utilization below 30% on each card."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                        lineNumber: 700,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                lineNumber: 698,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                        lineNumber: 682,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                lineNumber: 679,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSection,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSubtitle,
                                                        children: "The 28/36 Rule: Golden Standard for Mortgages"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                        lineNumber: 706,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].goldenRuleCard,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ruleColumn,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        children: "🏠 Front-End Ratio: 28%"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                        lineNumber: 709,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        children: "Your housing expenses (mortgage, taxes, insurance, HOA) should not exceed 28% of your gross monthly income."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                        lineNumber: 710,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                lineNumber: 708,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ruleColumn,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        children: "📊 Back-End Ratio: 36%"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                        lineNumber: 713,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        children: "Your total monthly debt payments (including housing) should not exceed 36% of your gross monthly income."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                        lineNumber: 714,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                lineNumber: 712,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                        lineNumber: 707,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ruleNote,
                                                        children: "Note: Many lenders now accept higher ratios with strong compensating factors like excellent credit, large down payments, or significant savings."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                        lineNumber: 717,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                lineNumber: 705,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSection,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSubtitle,
                                                        children: "Expert Insights from Mortgage Lenders"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                        lineNumber: 721,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("blockquote", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].expertQuote,
                                                        children: [
                                                            '"DTI is just one piece of the puzzle, but it\'s often the first filter lenders use. A low DTI with excellent credit opens doors to the best rates and terms. Focus on both components simultaneously for optimal results."',
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].quoteFooter,
                                                                children: "— Senior Mortgage Underwriter, 15+ years experience"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                                lineNumber: 724,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                        lineNumber: 722,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                lineNumber: 720,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                        lineNumber: 615,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqCard,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqTitle,
                                                children: "Frequently Asked Questions"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                lineNumber: 731,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqItem,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqQuestion,
                                                        children: "What's the difference between front-end and back-end DTI?"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                        lineNumber: 734,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqAnswer,
                                                        children: "Front-end DTI includes only housing expenses (mortgage/rent, property taxes, insurance). Back-end DTI includes all debt payments (housing, auto loans, credit cards, student loans, etc.). Lenders typically focus on back-end DTI for qualification."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                        lineNumber: 735,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                lineNumber: 733,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqItem,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqQuestion,
                                                        children: "Are utility bills included in DTI calculation?"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                        lineNumber: 739,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqAnswer,
                                                        children: "No, utility bills, groceries, entertainment, and other living expenses are not included in DTI calculations. Only recurring debt payments with fixed terms (loans, credit cards, etc.) are considered."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                        lineNumber: 740,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                lineNumber: 738,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqItem,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqQuestion,
                                                        children: "How can I quickly improve my DTI before applying for a loan?"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                        lineNumber: 744,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqAnswer,
                                                        children: "1) Pay down credit card balances to lower minimum payments, 2) Avoid taking on new debt, 3) Pay off smaller loans completely, 4) Increase your income if possible, 5) Consider a co-signer if eligible."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                        lineNumber: 745,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                lineNumber: 743,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqItem,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqQuestion,
                                                        children: "Does DTI affect my credit score?"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                        lineNumber: 749,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqAnswer,
                                                        children: "DTI itself doesn't directly affect your credit score, but the components that make up DTI do. Credit utilization (30% of score) and payment history (35% of score) are closely related to DTI components."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                        lineNumber: 750,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                lineNumber: 748,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                        lineNumber: 730,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                lineNumber: 614,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].actionSection,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ctaCard,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ctaTitle,
                                            children: "Take Control of Your Financial Future"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                            lineNumber: 758,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ctaText,
                                            children: "Use our calculator to understand your current position and create a plan to improve your DTI ratio. Better ratios mean better loan terms and more financial opportunities."
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                            lineNumber: 759,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].scenarioButtons,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].scenarioButton,
                                                    onClick: ()=>{
                                                        setGrossMonthlyIncome(6000);
                                                        setMonthlyDebts({
                                                            mortgage: 1200,
                                                            autoLoan: 300,
                                                            creditCards: 200,
                                                            studentLoans: 150,
                                                            personalLoans: 100,
                                                            otherDebts: 50
                                                        });
                                                    },
                                                    children: "Conservative Budget"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                    lineNumber: 762,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].scenarioButton,
                                                    onClick: ()=>{
                                                        setGrossMonthlyIncome(12000);
                                                        setMonthlyDebts({
                                                            mortgage: 2500,
                                                            autoLoan: 600,
                                                            creditCards: 500,
                                                            studentLoans: 400,
                                                            personalLoans: 300,
                                                            otherDebts: 200
                                                        });
                                                    },
                                                    children: "High Income/Large Debt"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                    lineNumber: 778,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].scenarioButton,
                                                    onClick: ()=>{
                                                        setGrossMonthlyIncome(8000);
                                                        setMonthlyDebts({
                                                            mortgage: 1500,
                                                            autoLoan: 400,
                                                            creditCards: 300,
                                                            studentLoans: 250,
                                                            personalLoans: 150,
                                                            otherDebts: 100
                                                        });
                                                    },
                                                    children: "Reset to Default"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                    lineNumber: 794,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                            lineNumber: 761,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].disclaimer,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Disclaimer:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                                    lineNumber: 813,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " This calculator provides estimates for educational purposes. Actual lender requirements may vary based on specific circumstances, market conditions, and individual lender policies. DTI is one of many factors lenders consider. Always consult with qualified financial professionals before making borrowing decisions."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                            lineNumber: 812,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                    lineNumber: 757,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                lineNumber: 756,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                        lineNumber: 245,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].footer,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].footerContent,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].footerText,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: "Debt-to-Income Ratio Calculator"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                            lineNumber: 822,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        " | Part of the Financial Health Suite | Understanding your DTI is crucial for loan approval, better interest rates, and financial stability."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                    lineNumber: 821,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$debttoincomecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].footerNote,
                                    children: "Note: DTI requirements vary by lender, loan type, and market conditions. Regular monitoring of your financial ratios is recommended for optimal financial health."
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/debt-to-income-calculator.js",
                                    lineNumber: 825,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/debt-to-income-calculator.js",
                            lineNumber: 820,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/pages/debt-to-income-calculator.js",
                        lineNumber: 819,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/debt-to-income-calculator.js",
                lineNumber: 231,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true);
};
_s(DebtToIncomeCalculator, "iY5S1N+2EGFKrqnl74PlllovoRM=");
_c = DebtToIncomeCalculator;
var __N_SSG = true;
const __TURBOPACK__default__export__ = DebtToIncomeCalculator;
var _c;
__turbopack_context__.k.register(_c, "DebtToIncomeCalculator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/debt-to-income-calculator.js [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/debt-to-income-calculator";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/src/pages/debt-to-income-calculator.js [client] (ecmascript)");
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
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/src/pages/debt-to-income-calculator\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/debt-to-income-calculator.js [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__15f7441a._.js.map