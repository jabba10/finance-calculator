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
"[project]/src/pages/cac.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "actionList": "cac-module__d9rNVW__actionList",
  "actionSection": "cac-module__d9rNVW__actionSection",
  "actionSteps": "cac-module__d9rNVW__actionSteps",
  "actionTitle": "cac-module__d9rNVW__actionTitle",
  "articleCard": "cac-module__d9rNVW__articleCard",
  "articleSection": "cac-module__d9rNVW__articleSection",
  "articleSubtitle": "cac-module__d9rNVW__articleSubtitle",
  "articleTitle": "cac-module__d9rNVW__articleTitle",
  "badge": "cac-module__d9rNVW__badge",
  "badgeContainer": "cac-module__d9rNVW__badgeContainer",
  "benchmarksTable": "cac-module__d9rNVW__benchmarksTable",
  "cacLtvVisualization": "cac-module__d9rNVW__cacLtvVisualization",
  "cacPortion": "cac-module__d9rNVW__cacPortion",
  "calculatorCard": "cac-module__d9rNVW__calculatorCard",
  "calculatorLayout": "cac-module__d9rNVW__calculatorLayout",
  "chartBar": "cac-module__d9rNVW__chartBar",
  "chartBarContainer": "cac-module__d9rNVW__chartBarContainer",
  "chartBarGroup": "cac-module__d9rNVW__chartBarGroup",
  "chartBarLabel": "cac-module__d9rNVW__chartBarLabel",
  "chartBarValue": "cac-module__d9rNVW__chartBarValue",
  "chartBars": "cac-module__d9rNVW__chartBars",
  "chartContainer": "cac-module__d9rNVW__chartContainer",
  "chartTitle": "cac-module__d9rNVW__chartTitle",
  "container": "cac-module__d9rNVW__container",
  "ctaCard": "cac-module__d9rNVW__ctaCard",
  "ctaText": "cac-module__d9rNVW__ctaText",
  "ctaTitle": "cac-module__d9rNVW__ctaTitle",
  "currencySymbol": "cac-module__d9rNVW__currencySymbol",
  "disclaimer": "cac-module__d9rNVW__disclaimer",
  "educationalContent": "cac-module__d9rNVW__educationalContent",
  "expenseBreakdown": "cac-module__d9rNVW__expenseBreakdown",
  "expenseGrid": "cac-module__d9rNVW__expenseGrid",
  "expenseInput": "cac-module__d9rNVW__expenseInput",
  "expenseLabel": "cac-module__d9rNVW__expenseLabel",
  "expenseLegend": "cac-module__d9rNVW__expenseLegend",
  "expenseNumberInput": "cac-module__d9rNVW__expenseNumberInput",
  "expensePieChart": "cac-module__d9rNVW__expensePieChart",
  "expenseWrapper": "cac-module__d9rNVW__expenseWrapper",
  "expertQuote": "cac-module__d9rNVW__expertQuote",
  "faqAnswer": "cac-module__d9rNVW__faqAnswer",
  "faqCard": "cac-module__d9rNVW__faqCard",
  "faqItem": "cac-module__d9rNVW__faqItem",
  "faqQuestion": "cac-module__d9rNVW__faqQuestion",
  "faqTitle": "cac-module__d9rNVW__faqTitle",
  "footer": "cac-module__d9rNVW__footer",
  "footerContent": "cac-module__d9rNVW__footerContent",
  "footerNote": "cac-module__d9rNVW__footerNote",
  "footerText": "cac-module__d9rNVW__footerText",
  "formulaBox": "cac-module__d9rNVW__formulaBox",
  "formulaCard": "cac-module__d9rNVW__formulaCard",
  "goldenRuleCard": "cac-module__d9rNVW__goldenRuleCard",
  "header": "cac-module__d9rNVW__header",
  "headerContent": "cac-module__d9rNVW__headerContent",
  "indicatorDot": "cac-module__d9rNVW__indicatorDot",
  "indicatorGood": "cac-module__d9rNVW__indicatorGood",
  "indicatorPoor": "cac-module__d9rNVW__indicatorPoor",
  "indicatorText": "cac-module__d9rNVW__indicatorText",
  "inputGroup": "cac-module__d9rNVW__inputGroup",
  "inputLabel": "cac-module__d9rNVW__inputLabel",
  "inputSubtitle": "cac-module__d9rNVW__inputSubtitle",
  "inputWrapper": "cac-module__d9rNVW__inputWrapper",
  "insightsCard": "cac-module__d9rNVW__insightsCard",
  "insightsTitle": "cac-module__d9rNVW__insightsTitle",
  "legendColor": "cac-module__d9rNVW__legendColor",
  "legendItem": "cac-module__d9rNVW__legendItem",
  "legendText": "cac-module__d9rNVW__legendText",
  "ltvPortion": "cac-module__d9rNVW__ltvPortion",
  "mainContent": "cac-module__d9rNVW__mainContent",
  "mainTitle": "cac-module__d9rNVW__mainTitle",
  "numberInput": "cac-module__d9rNVW__numberInput",
  "pieChartContainer": "cac-module__d9rNVW__pieChartContainer",
  "pieSegment": "cac-module__d9rNVW__pieSegment",
  "quoteFooter": "cac-module__d9rNVW__quoteFooter",
  "radioGroup": "cac-module__d9rNVW__radioGroup",
  "radioInput": "cac-module__d9rNVW__radioInput",
  "radioLabel": "cac-module__d9rNVW__radioLabel",
  "radioText": "cac-module__d9rNVW__radioText",
  "ratioBar": "cac-module__d9rNVW__ratioBar",
  "ratioIndicator": "cac-module__d9rNVW__ratioIndicator",
  "ratioInfo": "cac-module__d9rNVW__ratioInfo",
  "ratioLabel": "cac-module__d9rNVW__ratioLabel",
  "ratioNote": "cac-module__d9rNVW__ratioNote",
  "ratioValue": "cac-module__d9rNVW__ratioValue",
  "ratioVisualization": "cac-module__d9rNVW__ratioVisualization",
  "recommendationBox": "cac-module__d9rNVW__recommendationBox",
  "recommendationText": "cac-module__d9rNVW__recommendationText",
  "resultItem": "cac-module__d9rNVW__resultItem",
  "resultLabel": "cac-module__d9rNVW__resultLabel",
  "resultSubtext": "cac-module__d9rNVW__resultSubtext",
  "resultValue": "cac-module__d9rNVW__resultValue",
  "resultsCard": "cac-module__d9rNVW__resultsCard",
  "resultsGrid": "cac-module__d9rNVW__resultsGrid",
  "ruleColumn": "cac-module__d9rNVW__ruleColumn",
  "scenarioButton": "cac-module__d9rNVW__scenarioButton",
  "scenarioButtons": "cac-module__d9rNVW__scenarioButtons",
  "sectionTitle": "cac-module__d9rNVW__sectionTitle",
  "selectInput": "cac-module__d9rNVW__selectInput",
  "slider": "cac-module__d9rNVW__slider",
  "strategyCard": "cac-module__d9rNVW__strategyCard",
  "strategyGrid": "cac-module__d9rNVW__strategyGrid",
  "subtitle": "cac-module__d9rNVW__subtitle",
  "table": "cac-module__d9rNVW__table",
  "totalExpenseDisplay": "cac-module__d9rNVW__totalExpenseDisplay",
  "unitSymbol": "cac-module__d9rNVW__unitSymbol",
  "valueDisplay": "cac-module__d9rNVW__valueDisplay",
  "warningList": "cac-module__d9rNVW__warningList",
});
}),
"[project]/src/pages/cac-calculator.jsx [client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/pages/cac.module.css [client] (css module)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
const CustomerAcquisitionCostCalculator = ({ currentDate, lastModifiedDate })=>{
    _s();
    const [marketingExpenses, setMarketingExpenses] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        advertising: 5000,
        salaries: 8000,
        software: 2000,
        content: 1500,
        events: 3000,
        other: 1000
    });
    const [newCustomers, setNewCustomers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(200);
    const [businessType, setBusinessType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('saas');
    const [timePeriod, setTimePeriod] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('monthly');
    const [results, setResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [chartData, setChartData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const industryBenchmarks = {
        'saas': {
            excellent: 100,
            good: 300,
            average: 500,
            poor: 1000
        },
        'ecommerce': {
            excellent: 10,
            good: 25,
            average: 50,
            poor: 100
        },
        'b2b': {
            excellent: 200,
            good: 500,
            average: 1000,
            poor: 2500
        },
        'subscription': {
            excellent: 50,
            good: 150,
            average: 300,
            poor: 600
        },
        'marketplace': {
            excellent: 75,
            good: 200,
            average: 400,
            poor: 800
        },
        'enterprise': {
            excellent: 1000,
            good: 3000,
            average: 7000,
            poor: 15000
        }
    };
    const timePeriodMultipliers = {
        'daily': 30,
        'weekly': 4.33,
        'monthly': 1,
        'quarterly': 1 / 3,
        'yearly': 1 / 12
    };
    const calculateCAC = ()=>{
        const totalExpenses = Object.values(marketingExpenses).reduce((sum, expense)=>sum + expense, 0);
        const cac = totalExpenses / newCustomers;
        const benchmark = industryBenchmarks[businessType];
        const multiplier = timePeriodMultipliers[timePeriod];
        const monthlyCAC = cac * multiplier;
        const annualizedCAC = monthlyCAC * 12;
        let performanceRating = 'Excellent';
        let ratingColor = '#4CAF50';
        let recommendation = '';
        let ratingIcon = '🚀';
        if (monthlyCAC <= benchmark.excellent) {
            performanceRating = 'Excellent';
            ratingColor = '#4CAF50';
            recommendation = 'Your CAC is highly competitive. Consider scaling successful channels.';
            ratingIcon = '🚀';
        } else if (monthlyCAC <= benchmark.good) {
            performanceRating = 'Good';
            ratingColor = '#8BC34A';
            recommendation = 'Your CAC is above average. Optimize underperforming channels.';
            ratingIcon = '✅';
        } else if (monthlyCAC <= benchmark.average) {
            performanceRating = 'Average';
            ratingColor = '#FFC107';
            recommendation = 'Your CAC needs improvement. Focus on high-ROI marketing channels.';
            ratingIcon = '⚠️';
        } else {
            performanceRating = 'Poor';
            ratingColor = '#F44336';
            recommendation = 'Your CAC is too high. Review marketing strategy and customer targeting.';
            ratingIcon = '❌';
        }
        const expenseBreakdown = Object.entries(marketingExpenses).filter(([_, amount])=>amount > 0).map(([type, amount])=>({
                name: type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1'),
                amount,
                percentage: amount / totalExpenses * 100,
                color: getExpenseColor(type)
            }));
        const comparisonData = [
            {
                label: 'Your CAC',
                value: monthlyCAC,
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
        const ltvCacRatio = benchmark.average > 0 ? benchmark.average * 36 / monthlyCAC : 0;
        const healthyLTVtoCAC = ltvCacRatio >= 3;
        setResults({
            cac: Math.round(cac * 100) / 100,
            monthlyCAC: Math.round(monthlyCAC * 100) / 100,
            annualizedCAC: Math.round(annualizedCAC * 100) / 100,
            totalExpenses,
            performanceRating,
            ratingColor,
            recommendation,
            ratingIcon,
            ltvCacRatio: Math.round(ltvCacRatio * 100) / 100,
            healthyLTVtoCAC,
            newCustomersPerDollar: Math.round(newCustomers / totalExpenses * 100) / 100,
            expensePerChannel: totalExpenses / expenseBreakdown.length,
            benchmarkAverage: benchmark.average
        });
        setChartData({
            expenseBreakdown,
            comparison: comparisonData
        });
    };
    const getExpenseColor = (type)=>{
        const colors = {
            'advertising': '#2196F3',
            'salaries': '#FF9800',
            'software': '#9C27B0',
            'content': '#4CAF50',
            'events': '#FF5722',
            'other': '#607D8B'
        };
        return colors[type] || '#795548';
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CustomerAcquisitionCostCalculator.useEffect": ()=>{
            calculateCAC();
        }
    }["CustomerAcquisitionCostCalculator.useEffect"], [
        marketingExpenses,
        newCustomers,
        businessType,
        timePeriod
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
    const updateExpense = (expenseType, value)=>{
        setMarketingExpenses((prev)=>({
                ...prev,
                [expenseType]: Math.max(0, parseInt(value) || 0)
            }));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                        children: "Advanced Customer Acquisition Cost Calculator | CAC Analysis Tool"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/cac-calculator.jsx",
                        lineNumber: 154,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "description",
                        content: "Professional CAC calculator with industry benchmarks. Calculate customer acquisition cost, analyze marketing efficiency, and optimize your growth strategy."
                    }, void 0, false, {
                        fileName: "[project]/src/pages/cac-calculator.jsx",
                        lineNumber: 155,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "keywords",
                        content: "customer acquisition cost calculator, CAC calculator, marketing ROI, SaaS metrics, growth marketing, customer lifetime value"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/cac-calculator.jsx",
                        lineNumber: 156,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "date",
                        content: currentDate
                    }, void 0, false, {
                        fileName: "[project]/src/pages/cac-calculator.jsx",
                        lineNumber: 157,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "last-modified",
                        content: lastModifiedDate
                    }, void 0, false, {
                        fileName: "[project]/src/pages/cac-calculator.jsx",
                        lineNumber: 158,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "viewport",
                        content: "width=device-width, initial-scale=1"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/cac-calculator.jsx",
                        lineNumber: 159,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                        rel: "canonical",
                        href: "https://www.financecalculatorfree.com/cac-calculator"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/cac-calculator.jsx",
                        lineNumber: 160,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:title",
                        content: "Advanced Customer Acquisition Cost Calculator | CAC Analysis Tool"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/cac-calculator.jsx",
                        lineNumber: 163,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:description",
                        content: "Calculate your CAC and compare against industry benchmarks. Optimize marketing spend and improve customer acquisition efficiency."
                    }, void 0, false, {
                        fileName: "[project]/src/pages/cac-calculator.jsx",
                        lineNumber: 164,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:type",
                        content: "website"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/cac-calculator.jsx",
                        lineNumber: 165,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:url",
                        content: "https://www.financecalculatorfree.com/cac-calculator"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/cac-calculator.jsx",
                        lineNumber: 166,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "twitter:card",
                        content: "summary_large_image"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/cac-calculator.jsx",
                        lineNumber: 169,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "twitter:title",
                        content: "Professional CAC Calculator"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/cac-calculator.jsx",
                        lineNumber: 170,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "twitter:description",
                        content: "Analyze your customer acquisition cost and compare against industry benchmarks."
                    }, void 0, false, {
                        fileName: "[project]/src/pages/cac-calculator.jsx",
                        lineNumber: 171,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/cac-calculator.jsx",
                lineNumber: 153,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                id: "cac-calculator-schema",
                type: "application/ld+json",
                dangerouslySetInnerHTML: {
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SoftwareApplication",
                        "name": "Advanced Customer Acquisition Cost Calculator",
                        "description": "Professional marketing analytics tool for calculating and optimizing customer acquisition costs",
                        "applicationCategory": "BusinessApplication",
                        "operatingSystem": "Web",
                        "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "USD"
                        },
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": "4.8",
                            "ratingCount": "950",
                            "bestRating": "5",
                            "worstRating": "1"
                        },
                        "datePublished": currentDate,
                        "dateModified": currentDate,
                        "author": {
                            "@type": "Organization",
                            "name": "Business Metrics Pro",
                            "url": "https://www.financecalculatorfree.com"
                        },
                        "featureList": [
                            "Industry Benchmark Comparisons",
                            "Expense Breakdown Analysis",
                            "LTV:CAC Ratio Calculation",
                            "Time Period Adjustments",
                            "Marketing Efficiency Optimization"
                        ]
                    })
                }
            }, void 0, false, {
                fileName: "[project]/src/pages/cac-calculator.jsx",
                lineNumber: 175,
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
                                "name": "What is a good Customer Acquisition Cost (CAC) for my business?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Good CAC varies by industry. For SaaS, $100-300 is excellent, $300-500 is good. For e-commerce, $10-25 is excellent. The key is LTV:CAC ratio - aim for at least 3:1.",
                                    "datePublished": currentDate
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "What costs should be included in CAC calculation?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Include all marketing and sales expenses: advertising spend, marketing team salaries, software tools, content creation, events, and agency fees over the same time period.",
                                    "datePublished": currentDate
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "How can I reduce my CAC effectively?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Focus on: 1) Improving conversion rates, 2) Increasing customer lifetime value, 3) Optimizing high-performing channels, 4) Implementing referral programs, 5) Enhancing targeting precision.",
                                    "datePublished": currentDate
                                }
                            }
                        ]
                    })
                }
            }, void 0, false, {
                fileName: "[project]/src/pages/cac-calculator.jsx",
                lineNumber: 217,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].container,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].header,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].headerContent,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].mainTitle,
                                    children: "Advanced Customer Acquisition Cost Calculator"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/cac-calculator.jsx",
                                    lineNumber: 261,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].subtitle,
                                    children: "Analyze Your Marketing Efficiency and Optimize Growth Spending"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/cac-calculator.jsx",
                                    lineNumber: 262,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].badgeContainer,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].badge,
                                            children: [
                                                "Updated: ",
                                                currentDate
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/cac-calculator.jsx",
                                            lineNumber: 264,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].badge,
                                            children: "Industry Benchmarks"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/cac-calculator.jsx",
                                            lineNumber: 265,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].badge,
                                            children: "LTV:CAC Analysis"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/cac-calculator.jsx",
                                            lineNumber: 266,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/cac-calculator.jsx",
                                    lineNumber: 263,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/cac-calculator.jsx",
                            lineNumber: 260,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/pages/cac-calculator.jsx",
                        lineNumber: 259,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].mainContent,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].calculatorLayout,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].calculatorCard,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].sectionTitle,
                                                children: "Calculate Your CAC"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                lineNumber: 275,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputGroup,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputLabel,
                                                    children: [
                                                        "New Customers Acquired",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputWrapper,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "range",
                                                                    min: "1",
                                                                    max: "10000",
                                                                    step: "1",
                                                                    value: newCustomers,
                                                                    onChange: (e)=>setNewCustomers(parseInt(e.target.value)),
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].slider
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                    lineNumber: 281,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    min: "1",
                                                                    max: "10000",
                                                                    step: "1",
                                                                    value: newCustomers,
                                                                    onChange: (e)=>setNewCustomers(parseInt(e.target.value) || 0),
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].numberInput
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                    lineNumber: 290,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].unitSymbol,
                                                                    children: "customers"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                    lineNumber: 299,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/cac-calculator.jsx",
                                                            lineNumber: 280,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].valueDisplay,
                                                            children: [
                                                                newCustomers.toLocaleString(),
                                                                " customers"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/cac-calculator.jsx",
                                                            lineNumber: 301,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/cac-calculator.jsx",
                                                    lineNumber: 278,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                lineNumber: 277,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputGroup,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputSubtitle,
                                                        children: "Marketing & Sales Expenses"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                        lineNumber: 306,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].expenseGrid,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].expenseInput,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].expenseLabel,
                                                                        children: "Advertising Spend"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                        lineNumber: 310,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].expenseWrapper,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].currencySymbol,
                                                                                children: "$"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                lineNumber: 312,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "number",
                                                                                min: "0",
                                                                                max: "1000000",
                                                                                step: "100",
                                                                                value: marketingExpenses.advertising,
                                                                                onChange: (e)=>updateExpense('advertising', e.target.value),
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].expenseNumberInput
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                lineNumber: 313,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                        lineNumber: 311,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                lineNumber: 309,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].expenseInput,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].expenseLabel,
                                                                        children: "Sales & Marketing Salaries"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                        lineNumber: 326,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].expenseWrapper,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].currencySymbol,
                                                                                children: "$"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                lineNumber: 328,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "number",
                                                                                min: "0",
                                                                                max: "1000000",
                                                                                step: "100",
                                                                                value: marketingExpenses.salaries,
                                                                                onChange: (e)=>updateExpense('salaries', e.target.value),
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].expenseNumberInput
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                lineNumber: 329,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                        lineNumber: 327,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                lineNumber: 325,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].expenseInput,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].expenseLabel,
                                                                        children: "Software & Tools"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                        lineNumber: 342,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].expenseWrapper,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].currencySymbol,
                                                                                children: "$"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                lineNumber: 344,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "number",
                                                                                min: "0",
                                                                                max: "1000000",
                                                                                step: "100",
                                                                                value: marketingExpenses.software,
                                                                                onChange: (e)=>updateExpense('software', e.target.value),
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].expenseNumberInput
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                lineNumber: 345,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                        lineNumber: 343,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                lineNumber: 341,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].expenseInput,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].expenseLabel,
                                                                        children: "Content Creation"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                        lineNumber: 358,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].expenseWrapper,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].currencySymbol,
                                                                                children: "$"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                lineNumber: 360,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "number",
                                                                                min: "0",
                                                                                max: "1000000",
                                                                                step: "100",
                                                                                value: marketingExpenses.content,
                                                                                onChange: (e)=>updateExpense('content', e.target.value),
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].expenseNumberInput
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                lineNumber: 361,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                        lineNumber: 359,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                lineNumber: 357,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].expenseInput,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].expenseLabel,
                                                                        children: "Events & Conferences"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                        lineNumber: 374,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].expenseWrapper,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].currencySymbol,
                                                                                children: "$"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                lineNumber: 376,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "number",
                                                                                min: "0",
                                                                                max: "1000000",
                                                                                step: "100",
                                                                                value: marketingExpenses.events,
                                                                                onChange: (e)=>updateExpense('events', e.target.value),
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].expenseNumberInput
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                lineNumber: 377,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                        lineNumber: 375,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                lineNumber: 373,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].expenseInput,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].expenseLabel,
                                                                        children: "Other Expenses"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                        lineNumber: 390,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].expenseWrapper,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].currencySymbol,
                                                                                children: "$"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                lineNumber: 392,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "number",
                                                                                min: "0",
                                                                                max: "1000000",
                                                                                step: "100",
                                                                                value: marketingExpenses.other,
                                                                                onChange: (e)=>updateExpense('other', e.target.value),
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].expenseNumberInput
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                lineNumber: 393,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                        lineNumber: 391,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                lineNumber: 389,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                        lineNumber: 308,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].totalExpenseDisplay,
                                                        children: [
                                                            "Total Expenses: ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                children: formatCurrency(Object.values(marketingExpenses).reduce((sum, expense)=>sum + expense, 0))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                lineNumber: 407,
                                                                columnNumber: 35
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                        lineNumber: 406,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                lineNumber: 305,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputGroup,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputLabel,
                                                    children: [
                                                        "Business Type",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                            value: businessType,
                                                            onChange: (e)=>setBusinessType(e.target.value),
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].selectInput,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "saas",
                                                                    children: "SaaS (Software as a Service)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                    lineNumber: 419,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "ecommerce",
                                                                    children: "E-commerce & Retail"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                    lineNumber: 420,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "b2b",
                                                                    children: "B2B Services"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                    lineNumber: 421,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "subscription",
                                                                    children: "Subscription Box"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                    lineNumber: 422,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "marketplace",
                                                                    children: "Marketplace Platform"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                    lineNumber: 423,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "enterprise",
                                                                    children: "Enterprise Software"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                    lineNumber: 424,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/cac-calculator.jsx",
                                                            lineNumber: 414,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/cac-calculator.jsx",
                                                    lineNumber: 412,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                lineNumber: 411,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputGroup,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputLabel,
                                                    children: [
                                                        "Time Period",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].radioGroup,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].radioLabel,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "radio",
                                                                            name: "timePeriod",
                                                                            value: "daily",
                                                                            checked: timePeriod === 'daily',
                                                                            onChange: (e)=>setTimePeriod(e.target.value),
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].radioInput
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                            lineNumber: 434,
                                                                            columnNumber: 23
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].radioText,
                                                                            children: "Daily"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                            lineNumber: 442,
                                                                            columnNumber: 23
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                    lineNumber: 433,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].radioLabel,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "radio",
                                                                            name: "timePeriod",
                                                                            value: "weekly",
                                                                            checked: timePeriod === 'weekly',
                                                                            onChange: (e)=>setTimePeriod(e.target.value),
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].radioInput
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                            lineNumber: 445,
                                                                            columnNumber: 23
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].radioText,
                                                                            children: "Weekly"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                            lineNumber: 453,
                                                                            columnNumber: 23
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                    lineNumber: 444,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].radioLabel,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "radio",
                                                                            name: "timePeriod",
                                                                            value: "monthly",
                                                                            checked: timePeriod === 'monthly',
                                                                            onChange: (e)=>setTimePeriod(e.target.value),
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].radioInput
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                            lineNumber: 456,
                                                                            columnNumber: 23
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].radioText,
                                                                            children: "Monthly"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                            lineNumber: 464,
                                                                            columnNumber: 23
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                    lineNumber: 455,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].radioLabel,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "radio",
                                                                            name: "timePeriod",
                                                                            value: "quarterly",
                                                                            checked: timePeriod === 'quarterly',
                                                                            onChange: (e)=>setTimePeriod(e.target.value),
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].radioInput
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                            lineNumber: 467,
                                                                            columnNumber: 23
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].radioText,
                                                                            children: "Quarterly"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                            lineNumber: 475,
                                                                            columnNumber: 23
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                    lineNumber: 466,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].radioLabel,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "radio",
                                                                            name: "timePeriod",
                                                                            value: "yearly",
                                                                            checked: timePeriod === 'yearly',
                                                                            onChange: (e)=>setTimePeriod(e.target.value),
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].radioInput
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                            lineNumber: 478,
                                                                            columnNumber: 23
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].radioText,
                                                                            children: "Yearly"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                            lineNumber: 486,
                                                                            columnNumber: 23
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                    lineNumber: 477,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/cac-calculator.jsx",
                                                            lineNumber: 432,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/cac-calculator.jsx",
                                                    lineNumber: 430,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                lineNumber: 429,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                        lineNumber: 274,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultsCard,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].sectionTitle,
                                                children: "Marketing Efficiency Analysis"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                lineNumber: 495,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            results && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultsGrid,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultItem,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultLabel,
                                                                        children: "Customer Acquisition Cost"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                        lineNumber: 501,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultValue,
                                                                        style: {
                                                                            color: results.ratingColor
                                                                        },
                                                                        children: formatCurrency(results.monthlyCAC)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                        lineNumber: 502,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultSubtext,
                                                                        children: [
                                                                            results.ratingIcon,
                                                                            " ",
                                                                            results.performanceRating
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                        lineNumber: 505,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                lineNumber: 500,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultItem,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultLabel,
                                                                        children: "New Customers per $"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                        lineNumber: 510,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultValue,
                                                                        children: results.newCustomersPerDollar.toFixed(2)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                        lineNumber: 511,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultSubtext,
                                                                        children: "Customers per dollar spent"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                        lineNumber: 512,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                lineNumber: 509,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultItem,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultLabel,
                                                                        children: "LTV:CAC Ratio"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                        lineNumber: 515,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultValue,
                                                                        style: {
                                                                            color: results.healthyLTVtoCAC ? '#4CAF50' : '#F44336'
                                                                        },
                                                                        children: [
                                                                            results.ltvCacRatio,
                                                                            ":1"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                        lineNumber: 516,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultSubtext,
                                                                        children: results.healthyLTVtoCAC ? '✅ Healthy' : '❌ Needs Improvement'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                        lineNumber: 519,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                lineNumber: 514,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultItem,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultLabel,
                                                                        children: "Total Marketing Spend"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                        lineNumber: 524,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultValue,
                                                                        children: formatCurrency(results.totalExpenses)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                        lineNumber: 525,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultSubtext,
                                                                        children: [
                                                                            "For ",
                                                                            newCustomers.toLocaleString(),
                                                                            " customers"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                        lineNumber: 526,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                lineNumber: 523,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                        lineNumber: 499,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartContainer,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartTitle,
                                                                children: "Industry Benchmark Comparison"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                lineNumber: 532,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartBars,
                                                                children: chartData.comparison && chartData.comparison.map((data, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartBarGroup,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartBarLabel,
                                                                                children: data.label
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                lineNumber: 536,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartBarContainer,
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartBar,
                                                                                    style: {
                                                                                        width: `${Math.min(data.value / results.benchmarkAverage * 100, 100)}%`,
                                                                                        backgroundColor: data.color
                                                                                    },
                                                                                    title: `${data.label}: ${formatCurrency(data.value)}`
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                    lineNumber: 538,
                                                                                    columnNumber: 29
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                lineNumber: 537,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartBarValue,
                                                                                children: formatCurrency(data.value)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                lineNumber: 547,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, index, true, {
                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                        lineNumber: 535,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                lineNumber: 533,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                        lineNumber: 531,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].expenseBreakdown,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartTitle,
                                                                children: "Marketing Expense Allocation"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                lineNumber: 555,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].expensePieChart,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].pieChartContainer,
                                                                        children: chartData.expenseBreakdown && chartData.expenseBreakdown.map((expense, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].pieSegment,
                                                                                style: {
                                                                                    backgroundColor: expense.color,
                                                                                    transform: `rotate(${expense.percentage * 3.6}deg)`
                                                                                },
                                                                                title: `${expense.name}: ${formatCurrency(expense.amount)} (${formatPercentage(expense.percentage)})`
                                                                            }, index, false, {
                                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                lineNumber: 559,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                        lineNumber: 557,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].expenseLegend,
                                                                        children: chartData.expenseBreakdown && chartData.expenseBreakdown.map((expense, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].legendItem,
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].legendColor,
                                                                                        style: {
                                                                                            backgroundColor: expense.color
                                                                                        }
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                        lineNumber: 573,
                                                                                        columnNumber: 29
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].legendText,
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                                children: [
                                                                                                    expense.name,
                                                                                                    ":"
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                                lineNumber: 578,
                                                                                                columnNumber: 31
                                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                                            " ",
                                                                                            formatCurrency(expense.amount),
                                                                                            " (",
                                                                                            formatPercentage(expense.percentage),
                                                                                            ")"
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                        lineNumber: 577,
                                                                                        columnNumber: 29
                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                ]
                                                                            }, index, true, {
                                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                lineNumber: 572,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                        lineNumber: 570,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                lineNumber: 556,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                        lineNumber: 554,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].insightsCard,
                                                        style: {
                                                            borderLeftColor: results.ratingColor
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].insightsTitle,
                                                                children: "📈 Growth Optimization Recommendations"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                lineNumber: 588,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].recommendationBox,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].recommendationText,
                                                                        children: results.recommendation
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                        lineNumber: 590,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].actionSteps,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].actionTitle,
                                                                                children: "Key Improvement Strategies:"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                lineNumber: 593,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].actionList,
                                                                                children: results.performanceRating === 'Poor' || results.performanceRating === 'Average' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                            children: "Audit and pause underperforming marketing channels"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                            lineNumber: 597,
                                                                                            columnNumber: 31
                                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                            children: "Double down on channels with lowest CAC"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                            lineNumber: 598,
                                                                                            columnNumber: 31
                                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                            children: "Improve website conversion rate by 25%"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                            lineNumber: 599,
                                                                                            columnNumber: 31
                                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                            children: "Implement referral program to reduce paid acquisition"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                            lineNumber: 600,
                                                                                            columnNumber: 31
                                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                            children: "Optimize ad targeting and messaging"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                            lineNumber: 601,
                                                                                            columnNumber: 31
                                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                                    ]
                                                                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                            children: "Scale successful acquisition channels with increased budget"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                            lineNumber: 605,
                                                                                            columnNumber: 31
                                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                            children: "Implement A/B testing for continuous optimization"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                            lineNumber: 606,
                                                                                            columnNumber: 31
                                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                            children: "Focus on customer retention to increase LTV"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                            lineNumber: 607,
                                                                                            columnNumber: 31
                                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                            children: "Explore new customer segments with similar characteristics"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                            lineNumber: 608,
                                                                                            columnNumber: 31
                                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                            children: "Consider expanding to new geographic markets"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                            lineNumber: 609,
                                                                                            columnNumber: 31
                                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                                    ]
                                                                                }, void 0, true)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                lineNumber: 594,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                        lineNumber: 592,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                lineNumber: 589,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                        lineNumber: 587,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cacLtvVisualization,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartTitle,
                                                                children: "LTV:CAC Health Check"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                lineNumber: 619,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ratioVisualization,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ratioBar,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cacPortion,
                                                                                style: {
                                                                                    width: '25%'
                                                                                },
                                                                                title: `CAC: ${formatCurrency(results.monthlyCAC)}`,
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ratioLabel,
                                                                                        children: "CAC"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                        lineNumber: 627,
                                                                                        columnNumber: 27
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ratioValue,
                                                                                        children: formatCurrency(results.monthlyCAC)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                        lineNumber: 628,
                                                                                        columnNumber: 27
                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                lineNumber: 622,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ltvPortion,
                                                                                style: {
                                                                                    width: `${Math.min(results.ltvCacRatio * 25, 75)}%`
                                                                                },
                                                                                title: `LTV: ${formatCurrency(results.monthlyCAC * results.ltvCacRatio)}`,
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ratioLabel,
                                                                                        children: "LTV"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                        lineNumber: 635,
                                                                                        columnNumber: 27
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ratioValue,
                                                                                        children: formatCurrency(results.monthlyCAC * results.ltvCacRatio)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                        lineNumber: 636,
                                                                                        columnNumber: 27
                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                lineNumber: 630,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                        lineNumber: 621,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ratioInfo,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ratioIndicator,
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].indicatorDot} ${results.healthyLTVtoCAC ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].indicatorGood : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].indicatorPoor}`
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                        lineNumber: 641,
                                                                                        columnNumber: 27
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].indicatorText,
                                                                                        children: [
                                                                                            "Target Ratio: ",
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                                children: "3:1"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                                lineNumber: 643,
                                                                                                columnNumber: 43
                                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                                            " | Your Ratio: ",
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                                children: [
                                                                                                    results.ltvCacRatio,
                                                                                                    ":1"
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                                lineNumber: 643,
                                                                                                columnNumber: 78
                                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                        lineNumber: 642,
                                                                                        columnNumber: 27
                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                lineNumber: 640,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ratioNote,
                                                                                children: results.healthyLTVtoCAC ? '✅ Healthy ratio indicates sustainable growth' : '⚠️ Ratio below 3:1 suggests potential scaling challenges'
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                lineNumber: 646,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                        lineNumber: 639,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                lineNumber: 620,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                        lineNumber: 618,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                        lineNumber: 494,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                lineNumber: 272,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].educationalContent,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleCard,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleTitle,
                                                children: "Mastering Customer Acquisition Cost: The Key to Sustainable Growth"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                lineNumber: 662,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSection,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSubtitle,
                                                        children: "Understanding CAC: Your Growth Efficiency Metric"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                        lineNumber: 665,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: 'Customer Acquisition Cost (CAC) measures how much your business spends to acquire a new customer. It\'s the single most important metric for evaluating marketing efficiency and determining whether your growth is sustainable. By calculating and optimizing CAC, you can scale profitably while avoiding the "growth at all costs" trap that sinks many startups.'
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                        lineNumber: 666,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formulaCard,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                children: "Calculation Formula:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                lineNumber: 669,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formulaBox,
                                                                children: "CAC = Total Marketing & Sales Expenses ÷ Number of New Customers Acquired"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                lineNumber: 670,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                children: "Example: $20,500 marketing spend ÷ 200 new customers = $102.50 CAC"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                lineNumber: 673,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                        lineNumber: 668,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                lineNumber: 664,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSection,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSubtitle,
                                                        children: "Industry Benchmarks: What's a Good CAC?"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                        lineNumber: 678,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].benchmarksTable,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].table,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                                children: "Industry"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                lineNumber: 684,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                                children: "Excellent CAC"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                lineNumber: 685,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                                children: "Good CAC"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                lineNumber: 686,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                                children: "Average CAC"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                lineNumber: 687,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                                children: "Poor CAC"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                lineNumber: 688,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                        lineNumber: 683,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                    lineNumber: 682,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "SaaS"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                    lineNumber: 693,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "< $100"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                    lineNumber: 694,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "$100-$300"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                    lineNumber: 695,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "$300-$500"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                    lineNumber: 696,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "> $500"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                    lineNumber: 697,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                            lineNumber: 692,
                                                                            columnNumber: 23
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "E-commerce"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                    lineNumber: 700,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "< $10"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                    lineNumber: 701,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "$10-$25"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                    lineNumber: 702,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "$25-$50"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                    lineNumber: 703,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "> $50"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                    lineNumber: 704,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                            lineNumber: 699,
                                                                            columnNumber: 23
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "B2B Services"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                    lineNumber: 707,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "< $200"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                    lineNumber: 708,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "$200-$500"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                    lineNumber: 709,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "$500-$1000"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                    lineNumber: 710,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "> $1000"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                    lineNumber: 711,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                            lineNumber: 706,
                                                                            columnNumber: 23
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "Marketplace"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                    lineNumber: 714,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "< $75"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                    lineNumber: 715,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "$75-$200"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                    lineNumber: 716,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "$200-$400"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                    lineNumber: 717,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                    children: "> $400"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                                    lineNumber: 718,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                            lineNumber: 713,
                                                                            columnNumber: 23
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                    lineNumber: 691,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/cac-calculator.jsx",
                                                            lineNumber: 681,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                        lineNumber: 680,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                lineNumber: 677,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSection,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSubtitle,
                                                        children: "The Golden Rule: LTV:CAC Ratio"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                        lineNumber: 726,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].goldenRuleCard,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ruleColumn,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        children: "💰 Minimum Ratio: 3:1"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                        lineNumber: 729,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        children: "For sustainable growth, Customer Lifetime Value (LTV) should be at least 3 times your CAC. This ensures profitability after accounting for other costs."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                        lineNumber: 730,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                lineNumber: 728,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ruleColumn,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        children: "🚀 Ideal Ratio: 5:1+"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                        lineNumber: 733,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        children: "High-growth companies often maintain LTV:CAC ratios of 5:1 or higher, allowing for aggressive reinvestment in customer acquisition."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                        lineNumber: 734,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                lineNumber: 732,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ruleColumn,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        children: "⚠️ Danger Zone: < 1:1"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                        lineNumber: 737,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        children: "Ratios below 1:1 mean you're losing money on every customer. This is unsustainable and requires immediate strategic changes."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                        lineNumber: 738,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                lineNumber: 736,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                        lineNumber: 727,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                lineNumber: 725,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSection,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSubtitle,
                                                        children: "Advanced CAC Optimization Strategies"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                        lineNumber: 744,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].strategyGrid,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].strategyCard,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        children: "🎯 Improve Targeting Precision"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                        lineNumber: 748,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        children: "Use data analytics to identify your highest-value customer segments. Create detailed buyer personas and tailor marketing messages specifically to their needs."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                        lineNumber: 749,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                lineNumber: 747,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].strategyCard,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        children: "📊 Optimize Conversion Funnels"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                        lineNumber: 753,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        children: "Analyze drop-off points in your customer journey. Small improvements in conversion rates at each stage can dramatically reduce CAC."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                        lineNumber: 754,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                lineNumber: 752,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].strategyCard,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        children: "🤝 Implement Referral Programs"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                        lineNumber: 758,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        children: "Turn satisfied customers into advocates. Well-designed referral programs can reduce CAC by 30-50% while increasing customer quality."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                        lineNumber: 759,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                lineNumber: 757,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].strategyCard,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        children: "🔄 Focus on Retention"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                        lineNumber: 763,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        children: "Increasing customer lifetime value is as important as reducing CAC. Improve retention by 5% and watch your LTV:CAC ratio soar."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                        lineNumber: 764,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                lineNumber: 762,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                        lineNumber: 746,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                lineNumber: 743,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSection,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSubtitle,
                                                        children: "Common CAC Calculation Mistakes to Avoid"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                        lineNumber: 770,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].warningList,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: "Incomplete Expense Tracking:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                        lineNumber: 772,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    " Forgetting to include salaries, software costs, or overhead expenses"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                lineNumber: 772,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: "Wrong Time Alignment:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                        lineNumber: 773,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    " Comparing expenses from one period with customers from another"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                lineNumber: 773,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: "Ignoring Attribution:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                        lineNumber: 774,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    " Not tracking which channels actually drive conversions"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                lineNumber: 774,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: "Overlooking Customer Quality:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                        lineNumber: 775,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    " Focusing only on quantity without considering customer value"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                lineNumber: 775,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: "Forgetting Payback Period:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                        lineNumber: 776,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    " Not calculating how long it takes to recover CAC"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                lineNumber: 776,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                        lineNumber: 771,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                lineNumber: 769,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSection,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSubtitle,
                                                        children: "Expert Insights from Growth Marketers"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                        lineNumber: 781,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("blockquote", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].expertQuote,
                                                        children: [
                                                            '"The best growth teams obsess over CAC, but they understand it\'s meaningless without LTV context. A $500 CAC might be disastrous for one business but fantastic for another with a $5,000 LTV. Always pair these metrics together for strategic decision-making."',
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].quoteFooter,
                                                                children: "— Director of Growth, Venture-Backed SaaS Company, 10+ years experience"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                                lineNumber: 784,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                        lineNumber: 782,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                lineNumber: 780,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                        lineNumber: 661,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqCard,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqTitle,
                                                children: "Frequently Asked Questions"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                lineNumber: 791,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqItem,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqQuestion,
                                                        children: "Should I include salaries in CAC calculation?"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                        lineNumber: 794,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqAnswer,
                                                        children: "Yes, include salaries for all marketing and sales personnel directly involved in customer acquisition. For executives or shared roles, allocate an appropriate percentage of their time and cost to acquisition activities."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                        lineNumber: 795,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                lineNumber: 793,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqItem,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqQuestion,
                                                        children: "How often should I calculate CAC?"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                        lineNumber: 799,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqAnswer,
                                                        children: "Calculate CAC monthly for regular monitoring, but also review quarterly and annually for trend analysis. Segment CAC by channel (paid search, social, referrals) for more actionable insights."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                        lineNumber: 800,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                lineNumber: 798,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqItem,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqQuestion,
                                                        children: "What's the difference between CAC and CPA?"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                        lineNumber: 804,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqAnswer,
                                                        children: 'CAC (Customer Acquisition Cost) measures cost to acquire a paying customer. CPA (Cost Per Acquisition) often refers to any conversion (lead, signup, download). Always clarify what "acquisition" means in your context.'
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                        lineNumber: 805,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                lineNumber: 803,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqItem,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqQuestion,
                                                        children: "How do I calculate payback period?"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                        lineNumber: 809,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqAnswer,
                                                        children: "Payback Period = CAC ÷ (Average Revenue Per User × Gross Margin). For SaaS, aim for <12 months. For e-commerce, aim for <3 months. Shorter payback periods reduce cash flow risk."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                                        lineNumber: 810,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                                lineNumber: 808,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/cac-calculator.jsx",
                                        lineNumber: 790,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                lineNumber: 660,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].actionSection,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ctaCard,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ctaTitle,
                                            children: "Optimize Your Growth Strategy"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/cac-calculator.jsx",
                                            lineNumber: 818,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ctaText,
                                            children: "Use our calculator to benchmark your CAC against industry standards and develop a data-driven growth plan. Test different scenarios to find your optimal marketing mix."
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/cac-calculator.jsx",
                                            lineNumber: 819,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$cac$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].disclaimer,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Disclaimer:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/cac-calculator.jsx",
                                                    lineNumber: 824,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " This calculator provides estimates for educational and planning purposes. Industry benchmarks are based on aggregated data and may not reflect specific market conditions or business models. Actual optimal CAC varies based on business stage, market position, funding, and strategic objectives. Consult with qualified business advisors before making significant marketing investment decisions."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/cac-calculator.jsx",
                                            lineNumber: 823,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/cac-calculator.jsx",
                                    lineNumber: 817,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/pages/cac-calculator.jsx",
                                lineNumber: 816,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/cac-calculator.jsx",
                        lineNumber: 271,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/cac-calculator.jsx",
                lineNumber: 257,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true);
};
_s(CustomerAcquisitionCostCalculator, "lZi7p7h6hdz54Fwqp+xhmOrjhrE=");
_c = CustomerAcquisitionCostCalculator;
var __N_SSG = true;
const __TURBOPACK__default__export__ = CustomerAcquisitionCostCalculator;
var _c;
__turbopack_context__.k.register(_c, "CustomerAcquisitionCostCalculator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/cac-calculator.jsx [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/cac-calculator";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/src/pages/cac-calculator.jsx [client] (ecmascript)");
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
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/src/pages/cac-calculator\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/cac-calculator.jsx [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__5e0f5c41._.js.map