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
"[project]/src/pages/timevalueofmoneycalculator.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "actionSection": "timevalueofmoneycalculator-module__Y_5grq__actionSection",
  "applicationsList": "timevalueofmoneycalculator-module__Y_5grq__applicationsList",
  "articleCard": "timevalueofmoneycalculator-module__Y_5grq__articleCard",
  "articleSection": "timevalueofmoneycalculator-module__Y_5grq__articleSection",
  "articleSubtitle": "timevalueofmoneycalculator-module__Y_5grq__articleSubtitle",
  "articleTitle": "timevalueofmoneycalculator-module__Y_5grq__articleTitle",
  "badge": "timevalueofmoneycalculator-module__Y_5grq__badge",
  "badgeContainer": "timevalueofmoneycalculator-module__Y_5grq__badgeContainer",
  "buttonGroup": "timevalueofmoneycalculator-module__Y_5grq__buttonGroup",
  "calculatorCard": "timevalueofmoneycalculator-module__Y_5grq__calculatorCard",
  "calculatorLayout": "timevalueofmoneycalculator-module__Y_5grq__calculatorLayout",
  "chartBarContainer": "timevalueofmoneycalculator-module__Y_5grq__chartBarContainer",
  "chartBarGroup": "timevalueofmoneycalculator-module__Y_5grq__chartBarGroup",
  "chartBarLabel": "timevalueofmoneycalculator-module__Y_5grq__chartBarLabel",
  "chartBarNominal": "timevalueofmoneycalculator-module__Y_5grq__chartBarNominal",
  "chartBarReal": "timevalueofmoneycalculator-module__Y_5grq__chartBarReal",
  "chartBarValue": "timevalueofmoneycalculator-module__Y_5grq__chartBarValue",
  "chartBars": "timevalueofmoneycalculator-module__Y_5grq__chartBars",
  "chartContainer": "timevalueofmoneycalculator-module__Y_5grq__chartContainer",
  "chartLegend": "timevalueofmoneycalculator-module__Y_5grq__chartLegend",
  "chartTitle": "timevalueofmoneycalculator-module__Y_5grq__chartTitle",
  "container": "timevalueofmoneycalculator-module__Y_5grq__container",
  "ctaCard": "timevalueofmoneycalculator-module__Y_5grq__ctaCard",
  "ctaText": "timevalueofmoneycalculator-module__Y_5grq__ctaText",
  "ctaTitle": "timevalueofmoneycalculator-module__Y_5grq__ctaTitle",
  "currencySymbol": "timevalueofmoneycalculator-module__Y_5grq__currencySymbol",
  "disclaimer": "timevalueofmoneycalculator-module__Y_5grq__disclaimer",
  "educationalContent": "timevalueofmoneycalculator-module__Y_5grq__educationalContent",
  "exampleCard": "timevalueofmoneycalculator-module__Y_5grq__exampleCard",
  "exampleNote": "timevalueofmoneycalculator-module__Y_5grq__exampleNote",
  "expertQuote": "timevalueofmoneycalculator-module__Y_5grq__expertQuote",
  "faqAnswer": "timevalueofmoneycalculator-module__Y_5grq__faqAnswer",
  "faqCard": "timevalueofmoneycalculator-module__Y_5grq__faqCard",
  "faqItem": "timevalueofmoneycalculator-module__Y_5grq__faqItem",
  "faqQuestion": "timevalueofmoneycalculator-module__Y_5grq__faqQuestion",
  "faqTitle": "timevalueofmoneycalculator-module__Y_5grq__faqTitle",
  "footer": "timevalueofmoneycalculator-module__Y_5grq__footer",
  "footerContent": "timevalueofmoneycalculator-module__Y_5grq__footerContent",
  "footerNote": "timevalueofmoneycalculator-module__Y_5grq__footerNote",
  "footerText": "timevalueofmoneycalculator-module__Y_5grq__footerText",
  "header": "timevalueofmoneycalculator-module__Y_5grq__header",
  "headerContent": "timevalueofmoneycalculator-module__Y_5grq__headerContent",
  "inputGroup": "timevalueofmoneycalculator-module__Y_5grq__inputGroup",
  "inputLabel": "timevalueofmoneycalculator-module__Y_5grq__inputLabel",
  "inputWrapper": "timevalueofmoneycalculator-module__Y_5grq__inputWrapper",
  "insightsCard": "timevalueofmoneycalculator-module__Y_5grq__insightsCard",
  "insightsList": "timevalueofmoneycalculator-module__Y_5grq__insightsList",
  "insightsTitle": "timevalueofmoneycalculator-module__Y_5grq__insightsTitle",
  "legendColor": "timevalueofmoneycalculator-module__Y_5grq__legendColor",
  "legendItem": "timevalueofmoneycalculator-module__Y_5grq__legendItem",
  "legendNominal": "timevalueofmoneycalculator-module__Y_5grq__legendNominal",
  "legendReal": "timevalueofmoneycalculator-module__Y_5grq__legendReal",
  "mainContent": "timevalueofmoneycalculator-module__Y_5grq__mainContent",
  "mainTitle": "timevalueofmoneycalculator-module__Y_5grq__mainTitle",
  "numberInput": "timevalueofmoneycalculator-module__Y_5grq__numberInput",
  "percentageSymbol": "timevalueofmoneycalculator-module__Y_5grq__percentageSymbol",
  "primaryButton": "timevalueofmoneycalculator-module__Y_5grq__primaryButton",
  "quoteFooter": "timevalueofmoneycalculator-module__Y_5grq__quoteFooter",
  "resultItem": "timevalueofmoneycalculator-module__Y_5grq__resultItem",
  "resultLabel": "timevalueofmoneycalculator-module__Y_5grq__resultLabel",
  "resultValue": "timevalueofmoneycalculator-module__Y_5grq__resultValue",
  "resultsCard": "timevalueofmoneycalculator-module__Y_5grq__resultsCard",
  "resultsGrid": "timevalueofmoneycalculator-module__Y_5grq__resultsGrid",
  "secondaryButton": "timevalueofmoneycalculator-module__Y_5grq__secondaryButton",
  "sectionTitle": "timevalueofmoneycalculator-module__Y_5grq__sectionTitle",
  "selectInput": "timevalueofmoneycalculator-module__Y_5grq__selectInput",
  "slider": "timevalueofmoneycalculator-module__Y_5grq__slider",
  "strategyCard": "timevalueofmoneycalculator-module__Y_5grq__strategyCard",
  "strategyGrid": "timevalueofmoneycalculator-module__Y_5grq__strategyGrid",
  "subtitle": "timevalueofmoneycalculator-module__Y_5grq__subtitle",
  "valueDisplay": "timevalueofmoneycalculator-module__Y_5grq__valueDisplay",
  "yearsSymbol": "timevalueofmoneycalculator-module__Y_5grq__yearsSymbol",
});
}),
"[project]/src/pages/time-value-of-money-calculator.jsx [client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/pages/timevalueofmoneycalculator.module.css [client] (css module)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
const TimeValueOfMoneyCalculator = ({ currentDate, lastModifiedDate })=>{
    _s();
    const [calculationType, setCalculationType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('futureValue');
    const [presentValue, setPresentValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(10000);
    const [futureValue, setFutureValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(20000);
    const [annualRate, setAnnualRate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(7);
    const [years, setYears] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(10);
    const [compoundingPeriods, setCompoundingPeriods] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(12);
    const [regularPayment, setRegularPayment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(100);
    const [paymentType, setPaymentType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('end');
    const [results, setResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [chartData, setChartData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [inflationRate, setInflationRate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(2.5);
    const calculateTimeValue = ()=>{
        const rate = annualRate / 100;
        const inflation = inflationRate / 100;
        const periods = years;
        const n = compoundingPeriods;
        const r = rate / n;
        const t = periods;
        const pmt = regularPayment;
        let pv = presentValue;
        let fv = futureValue;
        let calculatedResult = null;
        const dataPoints = [];
        switch(calculationType){
            case 'futureValue':
                // FV = PV * (1 + r)^n + PMT * [((1 + r)^n - 1) / r]
                const futureVal = pv * Math.pow(1 + rate, t) + pmt * ((Math.pow(1 + rate, t) - 1) / rate);
                const realFutureVal = futureVal / Math.pow(1 + inflation, t);
                calculatedResult = {
                    futureValue: Math.round(futureVal * 100) / 100,
                    presentValue: pv,
                    totalPayments: pmt * t,
                    totalInterest: Math.round((futureVal - pv - pmt * t) * 100) / 100,
                    realFutureValue: Math.round(realFutureVal * 100) / 100,
                    inflationAdjusted: Math.round((futureVal - realFutureVal) * 100) / 100
                };
                // Generate chart data
                for(let i = 0; i <= t; i++){
                    const yearValue = pv * Math.pow(1 + rate, i) + pmt * ((Math.pow(1 + rate, i) - 1) / rate);
                    dataPoints.push({
                        year: i,
                        nominalValue: Math.round(yearValue * 100) / 100,
                        realValue: Math.round(yearValue / Math.pow(1 + inflation, i) * 100) / 100
                    });
                }
                break;
            case 'presentValue':
                // PV = FV / (1 + r)^n
                const presentVal = fv / Math.pow(1 + rate, t);
                const realPresentVal = presentVal * Math.pow(1 + inflation, t);
                calculatedResult = {
                    presentValue: Math.round(presentVal * 100) / 100,
                    futureValue: fv,
                    discountFactor: Math.round(1 / Math.pow(1 + rate, t) * 10000) / 10000,
                    totalDiscount: Math.round((fv - presentVal) * 100) / 100,
                    realPresentValue: Math.round(realPresentVal * 100) / 100
                };
                break;
            case 'rateRequired':
                // Solve for r: FV = PV * (1 + r)^n
                const requiredRate = (Math.pow(fv / pv, 1 / t) - 1) * 100;
                calculatedResult = {
                    requiredRate: Math.round(requiredRate * 100) / 100,
                    presentValue: pv,
                    futureValue: fv,
                    years: t,
                    ruleOf72: Math.round(72 / requiredRate * 10) / 10
                };
                break;
            case 'timeRequired':
                // Solve for n: n = log(FV/PV) / log(1 + r)
                const timeRequired = Math.log(fv / pv) / Math.log(1 + rate);
                calculatedResult = {
                    yearsRequired: Math.round(timeRequired * 100) / 100,
                    presentValue: pv,
                    futureValue: fv,
                    rate: annualRate,
                    ruleOf72: Math.round(72 / annualRate * 10) / 10
                };
                break;
            case 'annuityPayment':
                // PMT = FV * r / ((1 + r)^n - 1)
                const annuityPayment = fv * rate / (Math.pow(1 + rate, t) - 1);
                calculatedResult = {
                    requiredPayment: Math.round(annuityPayment * 100) / 100,
                    futureValue: fv,
                    years: t,
                    rate: annualRate,
                    totalPayments: Math.round(annuityPayment * t * 100) / 100,
                    interestEarned: Math.round((fv - annuityPayment * t) * 100) / 100
                };
                break;
        }
        setResults(calculatedResult);
        if (dataPoints.length > 0) {
            setChartData(dataPoints);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TimeValueOfMoneyCalculator.useEffect": ()=>{
            calculateTimeValue();
        }
    }["TimeValueOfMoneyCalculator.useEffect"], [
        calculationType,
        presentValue,
        futureValue,
        annualRate,
        years,
        compoundingPeriods,
        regularPayment,
        paymentType,
        inflationRate
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
    const formatYears = (value)=>{
        return `${value.toFixed(1)} years`;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                        children: "Time Value of Money Calculator | Complete TVM Analysis Tool"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                        lineNumber: 146,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "description",
                        content: "Professional Time Value of Money calculator with inflation adjustment. Calculate future value, present value, required rate, time periods, and annuity payments."
                    }, void 0, false, {
                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                        lineNumber: 147,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "keywords",
                        content: "time value of money calculator, TVM calculator, present value, future value, discount rate, financial calculator, inflation calculator, annuity calculator"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                        lineNumber: 148,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "date",
                        content: currentDate
                    }, void 0, false, {
                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                        lineNumber: 149,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "last-modified",
                        content: lastModifiedDate
                    }, void 0, false, {
                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                        lineNumber: 150,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "viewport",
                        content: "width=device-width, initial-scale=1"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                        lineNumber: 151,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                        rel: "canonical",
                        href: "https://www.financecalculatorfree.com/time-value-of-money-calculator"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                        lineNumber: 152,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:title",
                        content: "Time Value of Money Calculator | Complete TVM Analysis Tool"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                        lineNumber: 155,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:description",
                        content: "Professional TVM calculator for financial analysis, investment planning, and inflation-adjusted calculations."
                    }, void 0, false, {
                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                        lineNumber: 156,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:type",
                        content: "website"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                        lineNumber: 157,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:url",
                        content: "https://www.financecalculatorfree.com/time-value-of-money-calculator"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                        lineNumber: 158,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "twitter:card",
                        content: "summary_large_image"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                        lineNumber: 161,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "twitter:title",
                        content: "Time Value of Money Calculator"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                        lineNumber: 162,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "twitter:description",
                        content: "Master financial calculations with our comprehensive TVM calculator."
                    }, void 0, false, {
                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                        lineNumber: 163,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                lineNumber: 145,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                id: "tvm-calculator-schema",
                type: "application/ld+json",
                dangerouslySetInnerHTML: {
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SoftwareApplication",
                        "name": "Time Value of Money Calculator",
                        "description": "Professional-grade TVM calculator with inflation adjustment and multiple calculation modes",
                        "applicationCategory": "FinanceApplication",
                        "operatingSystem": "Web",
                        "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "USD"
                        },
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": "4.9",
                            "ratingCount": "1850",
                            "bestRating": "5",
                            "worstRating": "1"
                        },
                        "datePublished": currentDate,
                        "dateModified": currentDate,
                        "author": {
                            "@type": "Organization",
                            "name": "Financial Analysis Tools",
                            "url": "https://www.financecalculatorfree.com"
                        },
                        "featureList": [
                            "Future Value Calculations",
                            "Present Value Analysis",
                            "Inflation Adjustment",
                            "Required Rate Solver",
                            "Time Period Calculator",
                            "Annuity Payment Analysis"
                        ]
                    })
                }
            }, void 0, false, {
                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                lineNumber: 167,
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
                                "name": "What is the Time Value of Money (TVM) concept?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "The Time Value of Money is a core financial principle stating that money available now is worth more than the same amount in the future due to its potential earning capacity. This is the foundation for concepts like interest rates, investment returns, and inflation.",
                                    "datePublished": currentDate
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Why is inflation adjustment important in TVM calculations?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Inflation reduces purchasing power over time. Without adjusting for inflation, future money amounts appear larger than their real value. Our calculator provides both nominal and inflation-adjusted values for accurate financial planning.",
                                    "datePublished": currentDate
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "When should I use present value vs future value calculations?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Use future value to calculate what an investment will be worth later. Use present value to determine what a future amount is worth today - essential for comparing investment opportunities or evaluating lump sum vs annuity options.",
                                    "datePublished": currentDate
                                }
                            }
                        ]
                    })
                }
            }, void 0, false, {
                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                lineNumber: 210,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].container,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].header,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].headerContent,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].mainTitle,
                                    children: "Time Value of Money Calculator"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                    lineNumber: 254,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].subtitle,
                                    children: "Master Financial Calculations with Complete TVM Analysis"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                    lineNumber: 255,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].badgeContainer,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].badge,
                                            children: [
                                                "Updated: ",
                                                currentDate
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                            lineNumber: 257,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].badge,
                                            children: "Professional Grade"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                            lineNumber: 258,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].badge,
                                            children: "Inflation Adjusted"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                            lineNumber: 259,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                    lineNumber: 256,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                            lineNumber: 253,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                        lineNumber: 252,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].mainContent,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].calculatorLayout,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].calculatorCard,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].sectionTitle,
                                                children: "TVM Calculations"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                lineNumber: 268,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputGroup,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputLabel,
                                                    children: [
                                                        "Calculation Type",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                            value: calculationType,
                                                            onChange: (e)=>setCalculationType(e.target.value),
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].selectInput,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "futureValue",
                                                                    children: "Future Value (FV)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                    lineNumber: 278,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "presentValue",
                                                                    children: "Present Value (PV)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                    lineNumber: 279,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "rateRequired",
                                                                    children: "Required Rate of Return"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                    lineNumber: 280,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "timeRequired",
                                                                    children: "Time Required"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                    lineNumber: 281,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "annuityPayment",
                                                                    children: "Required Payment"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                    lineNumber: 282,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                            lineNumber: 273,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                    lineNumber: 271,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                lineNumber: 270,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            (calculationType === 'futureValue' || calculationType === 'rateRequired' || calculationType === 'timeRequired' || calculationType === 'annuityPayment') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputGroup,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputLabel,
                                                    children: [
                                                        "Present Value (PV)",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputWrapper,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].currencySymbol,
                                                                    children: "$"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                    lineNumber: 292,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "range",
                                                                    min: "100",
                                                                    max: "1000000",
                                                                    step: "100",
                                                                    value: presentValue,
                                                                    onChange: (e)=>setPresentValue(parseInt(e.target.value)),
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].slider
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                    lineNumber: 293,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    min: "100",
                                                                    max: "1000000",
                                                                    step: "100",
                                                                    value: presentValue,
                                                                    onChange: (e)=>setPresentValue(parseInt(e.target.value) || 0),
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].numberInput
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                    lineNumber: 302,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                            lineNumber: 291,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].valueDisplay,
                                                            children: formatCurrency(presentValue)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                            lineNumber: 312,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                    lineNumber: 289,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                lineNumber: 288,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            (calculationType === 'presentValue' || calculationType === 'rateRequired' || calculationType === 'timeRequired' || calculationType === 'annuityPayment') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputGroup,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputLabel,
                                                    children: [
                                                        "Future Value (FV)",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputWrapper,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].currencySymbol,
                                                                    children: "$"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                    lineNumber: 322,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "range",
                                                                    min: "100",
                                                                    max: "5000000",
                                                                    step: "100",
                                                                    value: futureValue,
                                                                    onChange: (e)=>setFutureValue(parseInt(e.target.value)),
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].slider
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                    lineNumber: 323,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    min: "100",
                                                                    max: "5000000",
                                                                    step: "100",
                                                                    value: futureValue,
                                                                    onChange: (e)=>setFutureValue(parseInt(e.target.value) || 0),
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].numberInput
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                    lineNumber: 332,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                            lineNumber: 321,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].valueDisplay,
                                                            children: formatCurrency(futureValue)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                            lineNumber: 342,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                    lineNumber: 319,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                lineNumber: 318,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            (calculationType === 'futureValue' || calculationType === 'presentValue' || calculationType === 'annuityPayment') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputGroup,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputLabel,
                                                    children: [
                                                        "Annual Interest Rate",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputWrapper,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "range",
                                                                    min: "0.1",
                                                                    max: "30",
                                                                    step: "0.1",
                                                                    value: annualRate,
                                                                    onChange: (e)=>setAnnualRate(parseFloat(e.target.value)),
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].slider
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                    lineNumber: 352,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    min: "0.1",
                                                                    max: "30",
                                                                    step: "0.1",
                                                                    value: annualRate,
                                                                    onChange: (e)=>setAnnualRate(parseFloat(e.target.value) || 0),
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].numberInput
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                    lineNumber: 361,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].percentageSymbol,
                                                                    children: "%"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                    lineNumber: 370,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                            lineNumber: 351,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].valueDisplay,
                                                            children: formatPercentage(annualRate)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                            lineNumber: 372,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                    lineNumber: 349,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                lineNumber: 348,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            (calculationType === 'futureValue' || calculationType === 'presentValue' || calculationType === 'rateRequired' || calculationType === 'annuityPayment') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputGroup,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputLabel,
                                                    children: [
                                                        "Time Period",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputWrapper,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "range",
                                                                    min: "1",
                                                                    max: "50",
                                                                    step: "1",
                                                                    value: years,
                                                                    onChange: (e)=>setYears(parseInt(e.target.value)),
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].slider
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                    lineNumber: 382,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    min: "1",
                                                                    max: "50",
                                                                    step: "1",
                                                                    value: years,
                                                                    onChange: (e)=>setYears(parseInt(e.target.value) || 0),
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].numberInput
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                    lineNumber: 391,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].yearsSymbol,
                                                                    children: "years"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                    lineNumber: 400,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                            lineNumber: 381,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].valueDisplay,
                                                            children: [
                                                                years,
                                                                " years"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                            lineNumber: 402,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                    lineNumber: 379,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                lineNumber: 378,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            calculationType === 'futureValue' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputGroup,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputLabel,
                                                    children: [
                                                        "Regular Payment (PMT)",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputWrapper,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].currencySymbol,
                                                                    children: "$"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                    lineNumber: 412,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "range",
                                                                    min: "0",
                                                                    max: "5000",
                                                                    step: "10",
                                                                    value: regularPayment,
                                                                    onChange: (e)=>setRegularPayment(parseInt(e.target.value)),
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].slider
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                    lineNumber: 413,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    min: "0",
                                                                    max: "5000",
                                                                    step: "10",
                                                                    value: regularPayment,
                                                                    onChange: (e)=>setRegularPayment(parseInt(e.target.value) || 0),
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].numberInput
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                    lineNumber: 422,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                            lineNumber: 411,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].valueDisplay,
                                                            children: [
                                                                formatCurrency(regularPayment),
                                                                "/period"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                            lineNumber: 432,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                    lineNumber: 409,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                lineNumber: 408,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputGroup,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputLabel,
                                                    children: [
                                                        "Expected Inflation Rate",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputWrapper,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "range",
                                                                    min: "0",
                                                                    max: "10",
                                                                    step: "0.1",
                                                                    value: inflationRate,
                                                                    onChange: (e)=>setInflationRate(parseFloat(e.target.value)),
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].slider
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                    lineNumber: 441,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    min: "0",
                                                                    max: "10",
                                                                    step: "0.1",
                                                                    value: inflationRate,
                                                                    onChange: (e)=>setInflationRate(parseFloat(e.target.value) || 0),
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].numberInput
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                    lineNumber: 450,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].percentageSymbol,
                                                                    children: "%"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                    lineNumber: 459,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                            lineNumber: 440,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].valueDisplay,
                                                            children: formatPercentage(inflationRate)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                            lineNumber: 461,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                    lineNumber: 438,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                lineNumber: 437,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            calculationType === 'futureValue' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputGroup,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputLabel,
                                                    children: [
                                                        "Payment Timing",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                            value: paymentType,
                                                            onChange: (e)=>setPaymentType(e.target.value),
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].selectInput,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "end",
                                                                    children: "End of Period (Ordinary Annuity)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                    lineNumber: 474,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "beginning",
                                                                    children: "Beginning of Period (Annuity Due)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                    lineNumber: 475,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                            lineNumber: 469,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                    lineNumber: 467,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                lineNumber: 466,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                        lineNumber: 267,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultsCard,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].sectionTitle,
                                                children: "TVM Analysis Results"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                lineNumber: 484,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            results && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultsGrid,
                                                        children: [
                                                            calculationType === 'futureValue' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultItem,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultLabel,
                                                                                children: "Future Value (Nominal)"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 492,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultValue,
                                                                                children: formatCurrency(results.futureValue)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 493,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                        lineNumber: 491,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultItem,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultLabel,
                                                                                children: "Real Future Value"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 496,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultValue,
                                                                                children: formatCurrency(results.realFutureValue)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 497,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                        lineNumber: 495,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultItem,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultLabel,
                                                                                children: "Total Interest"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 500,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultValue,
                                                                                children: formatCurrency(results.totalInterest)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 501,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                        lineNumber: 499,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultItem,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultLabel,
                                                                                children: "Inflation Loss"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 504,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultValue,
                                                                                children: formatCurrency(results.inflationAdjusted)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 505,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                        lineNumber: 503,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true),
                                                            calculationType === 'presentValue' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultItem,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultLabel,
                                                                                children: "Present Value"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 513,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultValue,
                                                                                children: formatCurrency(results.presentValue)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 514,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                        lineNumber: 512,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultItem,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultLabel,
                                                                                children: "Discount Factor"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 517,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultValue,
                                                                                children: results.discountFactor
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 518,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                        lineNumber: 516,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultItem,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultLabel,
                                                                                children: "Total Discount"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 521,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultValue,
                                                                                children: formatCurrency(results.totalDiscount)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 522,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                        lineNumber: 520,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultItem,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultLabel,
                                                                                children: "Real Present Value"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 525,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultValue,
                                                                                children: formatCurrency(results.realPresentValue)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 526,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                        lineNumber: 524,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true),
                                                            calculationType === 'rateRequired' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultItem,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultLabel,
                                                                                children: "Required Annual Rate"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 534,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultValue,
                                                                                children: formatPercentage(results.requiredRate)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 535,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                        lineNumber: 533,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultItem,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultLabel,
                                                                                children: "Rule of 72 Estimate"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 538,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultValue,
                                                                                children: [
                                                                                    results.ruleOf72,
                                                                                    " years to double"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 539,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                        lineNumber: 537,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultItem,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultLabel,
                                                                                children: "Growth Multiple"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 542,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultValue,
                                                                                children: [
                                                                                    (results.futureValue / results.presentValue).toFixed(2),
                                                                                    "x"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 543,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                        lineNumber: 541,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultItem,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultLabel,
                                                                                children: "CAGR"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 546,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultValue,
                                                                                children: formatPercentage(results.requiredRate)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 547,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                        lineNumber: 545,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true),
                                                            calculationType === 'timeRequired' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultItem,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultLabel,
                                                                                children: "Years Required"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 555,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultValue,
                                                                                children: formatYears(results.yearsRequired)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 556,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                        lineNumber: 554,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultItem,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultLabel,
                                                                                children: "Rule of 72 Estimate"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 559,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultValue,
                                                                                children: [
                                                                                    results.ruleOf72,
                                                                                    " years to double"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 560,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                        lineNumber: 558,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultItem,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultLabel,
                                                                                children: "Growth Multiple"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 563,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultValue,
                                                                                children: [
                                                                                    (results.futureValue / results.presentValue).toFixed(2),
                                                                                    "x"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 564,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                        lineNumber: 562,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultItem,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultLabel,
                                                                                children: "Monthly Equivalent"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 567,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultValue,
                                                                                children: [
                                                                                    (results.yearsRequired * 12).toFixed(0),
                                                                                    " months"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 568,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                        lineNumber: 566,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true),
                                                            calculationType === 'annuityPayment' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultItem,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultLabel,
                                                                                children: "Required Payment"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 576,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultValue,
                                                                                children: [
                                                                                    formatCurrency(results.requiredPayment),
                                                                                    "/year"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 577,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                        lineNumber: 575,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultItem,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultLabel,
                                                                                children: "Total Payments"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 580,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultValue,
                                                                                children: formatCurrency(results.totalPayments)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 581,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                        lineNumber: 579,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultItem,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultLabel,
                                                                                children: "Interest Earned"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 584,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultValue,
                                                                                children: formatCurrency(results.interestEarned)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 585,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                        lineNumber: 583,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultItem,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultLabel,
                                                                                children: "Monthly Equivalent"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 588,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultValue,
                                                                                children: [
                                                                                    formatCurrency(results.requiredPayment / 12),
                                                                                    "/month"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 589,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                        lineNumber: 587,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                        lineNumber: 488,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    calculationType === 'futureValue' && chartData.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartContainer,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartTitle,
                                                                children: "Value Growth Over Time"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                lineNumber: 598,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartBars,
                                                                children: chartData.slice(0, 10).map((data, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartBarGroup,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartBarLabel,
                                                                                children: [
                                                                                    "Year ",
                                                                                    data.year
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 602,
                                                                                columnNumber: 29
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartBarContainer,
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartBarNominal,
                                                                                        style: {
                                                                                            width: `${data.nominalValue / chartData[chartData.length - 1].nominalValue * 100}%`
                                                                                        },
                                                                                        title: `Nominal: ${formatCurrency(data.nominalValue)}`
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                        lineNumber: 604,
                                                                                        columnNumber: 31
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartBarReal,
                                                                                        style: {
                                                                                            width: `${data.realValue / chartData[chartData.length - 1].realValue * 100}%`
                                                                                        },
                                                                                        title: `Real: ${formatCurrency(data.realValue)}`
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                        lineNumber: 609,
                                                                                        columnNumber: 31
                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 603,
                                                                                columnNumber: 29
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartBarValue,
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        children: [
                                                                                            "N: ",
                                                                                            formatCurrency(data.nominalValue)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                        lineNumber: 616,
                                                                                        columnNumber: 31
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        children: [
                                                                                            "R: ",
                                                                                            formatCurrency(data.realValue)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                        lineNumber: 617,
                                                                                        columnNumber: 31
                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 615,
                                                                                columnNumber: 29
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, index, true, {
                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                        lineNumber: 601,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0)))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                lineNumber: 599,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartLegend,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].legendItem,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].legendColor} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].legendNominal}`
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 624,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                children: "Nominal Value (No Inflation)"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 625,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                        lineNumber: 623,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].legendItem,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].legendColor} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].legendReal}`
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 628,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                children: "Real Value (Inflation Adjusted)"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 629,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                        lineNumber: 627,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                lineNumber: 622,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                        lineNumber: 597,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].insightsCard,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].insightsTitle,
                                                                children: "📊 Financial Insights"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                lineNumber: 636,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].insightsList,
                                                                children: [
                                                                    calculationType === 'futureValue' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                children: [
                                                                                    "Your money will grow to ",
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                        children: formatCurrency(results.futureValue)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                        lineNumber: 640,
                                                                                        columnNumber: 55
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    " in nominal terms"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 640,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                children: [
                                                                                    "After inflation adjustment, real purchasing power will be ",
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                        children: formatCurrency(results.realFutureValue)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                        lineNumber: 641,
                                                                                        columnNumber: 89
                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 641,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                children: [
                                                                                    "Inflation will reduce your purchasing power by ",
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                        children: formatCurrency(results.inflationAdjusted)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                        lineNumber: 642,
                                                                                        columnNumber: 78
                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 642,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true),
                                                                    calculationType === 'presentValue' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                        children: formatCurrency(results.futureValue)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                        lineNumber: 647,
                                                                                        columnNumber: 31
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    " in the future is worth ",
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                        children: formatCurrency(results.presentValue)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                        lineNumber: 647,
                                                                                        columnNumber: 109
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    " today"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 647,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                children: [
                                                                                    "This represents a discount of ",
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                        children: formatCurrency(results.totalDiscount)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                        lineNumber: 648,
                                                                                        columnNumber: 61
                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 648,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                children: [
                                                                                    "The discount factor of ",
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                        children: results.discountFactor
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                        lineNumber: 649,
                                                                                        columnNumber: 54
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    " shows time value impact"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 649,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true),
                                                                    calculationType === 'rateRequired' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                children: [
                                                                                    "You need ",
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                        children: formatPercentage(results.requiredRate)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                        lineNumber: 654,
                                                                                        columnNumber: 40
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    " annual return to reach your goal"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 654,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                children: [
                                                                                    "At this rate, your money doubles every ",
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                        children: results.ruleOf72
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                        lineNumber: 655,
                                                                                        columnNumber: 70
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    " years"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 655,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                children: [
                                                                                    "This represents a ",
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                        children: [
                                                                                            (results.futureValue / results.presentValue).toFixed(2),
                                                                                            "x"
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                        lineNumber: 656,
                                                                                        columnNumber: 49
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    " growth over ",
                                                                                    years,
                                                                                    " years"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 656,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true),
                                                                    calculationType === 'timeRequired' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                children: [
                                                                                    "You need ",
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                        children: formatYears(results.yearsRequired)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                        lineNumber: 661,
                                                                                        columnNumber: 40
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    " to reach your financial goal"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 661,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                children: [
                                                                                    "At ",
                                                                                    annualRate,
                                                                                    "% return, money doubles every ",
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                        children: results.ruleOf72
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                        lineNumber: 662,
                                                                                        columnNumber: 76
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    " years"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 662,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                children: [
                                                                                    "This represents ",
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                        children: (results.yearsRequired * 12).toFixed(0)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                        lineNumber: 663,
                                                                                        columnNumber: 47
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    " months of investing"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 663,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true),
                                                                    calculationType === 'annuityPayment' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                children: [
                                                                                    "You need to save ",
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                        children: formatCurrency(results.requiredPayment)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                        lineNumber: 668,
                                                                                        columnNumber: 48
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    " annually"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 668,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                children: [
                                                                                    "That's ",
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                        children: formatCurrency(results.requiredPayment / 12)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                        lineNumber: 669,
                                                                                        columnNumber: 38
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    " per month"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 669,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                children: [
                                                                                    "Total contributions: ",
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                        children: formatCurrency(results.totalPayments)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                        lineNumber: 670,
                                                                                        columnNumber: 52
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    ", Interest: ",
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                        children: formatCurrency(results.interestEarned)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                        lineNumber: 670,
                                                                                        columnNumber: 120
                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 670,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                lineNumber: 637,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                        lineNumber: 635,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                        lineNumber: 483,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                lineNumber: 265,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].educationalContent,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleCard,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleTitle,
                                                children: "Mastering the Time Value of Money: Your Financial Compass"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                lineNumber: 683,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSection,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSubtitle,
                                                        children: "The Core Principle of Finance"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                        lineNumber: 686,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: "The Time Value of Money (TVM) is the fundamental concept that money available today is worth more than the identical sum in the future due to its potential earning capacity. This core principle underpins all financial decision-making, from personal savings to corporate investments and government bonds."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                        lineNumber: 687,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].exampleCard,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                children: "TVM in Action: Investment Decision"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                lineNumber: 690,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: "Scenario:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                        lineNumber: 691,
                                                                        columnNumber: 22
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    " You have $10,000 to invest. Option A: Receive $15,000 in 5 years. Option B: Receive $18,000 in 8 years."
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                lineNumber: 691,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                children: "Option A PV:"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 693,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            " $15,000 discounted at 7% = $10,693"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                        lineNumber: 693,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                children: "Option B PV:"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 694,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            " $18,000 discounted at 7% = $10,485"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                        lineNumber: 694,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                children: "Decision:"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 695,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            " Option A has higher present value despite smaller future amount"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                        lineNumber: 695,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                lineNumber: 692,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                children: "This demonstrates why TVM analysis is crucial for comparing different financial opportunities."
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                lineNumber: 697,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                        lineNumber: 689,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                lineNumber: 685,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSection,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSubtitle,
                                                        children: "Five Essential TVM Calculations"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                        lineNumber: 702,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].strategyGrid,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].strategyCard,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        children: "⏰ Future Value (FV)"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                        lineNumber: 706,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        children: "Calculates what an investment made today will be worth in the future. Essential for retirement planning, education savings, and long-term goal setting."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                        lineNumber: 707,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].exampleNote,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                children: "Formula:"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 709,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            " FV = PV × (1 + r)^n"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                        lineNumber: 708,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                lineNumber: 705,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].strategyCard,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        children: "💰 Present Value (PV)"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                        lineNumber: 714,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        children: "Determines today's value of a future sum of money. Crucial for comparing investment opportunities, evaluating annuities, and making lump-sum decisions."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                        lineNumber: 715,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].exampleNote,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                children: "Formula:"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 717,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            " PV = FV ÷ (1 + r)^n"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                        lineNumber: 716,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                lineNumber: 713,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].strategyCard,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        children: "📈 Required Rate of Return"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                        lineNumber: 722,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        children: "Calculates the interest rate needed to reach a future financial goal from a present investment. Vital for investment selection and portfolio planning."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                        lineNumber: 723,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].exampleNote,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                children: "Use:"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 725,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            " Evaluating if investment returns match goals"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                        lineNumber: 724,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                lineNumber: 721,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].strategyCard,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        children: "⏳ Time Period Calculation"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                        lineNumber: 730,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        children: "Determines how long it will take for an investment to reach a target value at a given rate. Important for financial planning and goal setting."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                        lineNumber: 731,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].exampleNote,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                children: "Rule of 72:"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 733,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            " 72 ÷ interest rate = years to double"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                        lineNumber: 732,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                lineNumber: 729,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].strategyCard,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        children: "💵 Annuity Payments"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                        lineNumber: 738,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        children: "Calculates regular payments needed to accumulate a future sum. Essential for retirement planning, debt repayment, and savings goals."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                        lineNumber: 739,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].exampleNote,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                children: "Types:"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                                lineNumber: 741,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            " Ordinary annuity (end) vs Annuity due (beginning)"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                        lineNumber: 740,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                lineNumber: 737,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                        lineNumber: 704,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                lineNumber: 701,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSection,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSubtitle,
                                                        children: "Practical Applications of TVM"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                        lineNumber: 748,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].applicationsList,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: "Retirement Planning:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                        lineNumber: 750,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    " Calculate how much to save monthly for retirement goals"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                lineNumber: 750,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: "Investment Analysis:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                        lineNumber: 751,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    " Compare different investment opportunities using NPV"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                lineNumber: 751,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: "Loan Decisions:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                        lineNumber: 752,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    " Evaluate mortgage options, car loans, and credit terms"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                lineNumber: 752,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: "Business Valuation:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                        lineNumber: 753,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    " Discount future cash flows to determine company worth"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                lineNumber: 753,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: "Insurance Planning:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                        lineNumber: 754,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    " Compare lump-sum settlements vs structured payments"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                lineNumber: 754,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: "Education Funding:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                        lineNumber: 755,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    " Plan for future education costs with present savings"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                lineNumber: 755,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: "Real Estate:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                        lineNumber: 756,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    " Evaluate property investments based on future rental income"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                lineNumber: 756,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                        lineNumber: 749,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                lineNumber: 747,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSection,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSubtitle,
                                                        children: "The Critical Role of Inflation"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                        lineNumber: 761,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: "Inflation systematically erodes purchasing power over time. A dollar today buys more than a dollar tomorrow. Our calculator provides both nominal (unadjusted) and real (inflation-adjusted) values because:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                        lineNumber: 762,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].exampleCard,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                children: "Inflation Impact Example:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                lineNumber: 765,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: "Without Inflation Adjustment:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                        lineNumber: 766,
                                                                        columnNumber: 22
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    " $10,000 at 7% for 20 years = $38,697"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                lineNumber: 766,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: "With 3% Inflation:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                        lineNumber: 767,
                                                                        columnNumber: 22
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    " Real value = $38,697 ÷ (1.03^20) = $21,394"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                lineNumber: 767,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: "Insight:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                        lineNumber: 768,
                                                                        columnNumber: 22
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    " Your nominal wealth grows, but real purchasing power increases much slower."
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                lineNumber: 768,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                        lineNumber: 764,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                lineNumber: 760,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSection,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSubtitle,
                                                        children: "Expert Insights from Financial Analysts"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                        lineNumber: 773,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("blockquote", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].expertQuote,
                                                        children: [
                                                            '"The Time Value of Money is not just a mathematical concept—it\'s a philosophical framework for understanding financial decisions. Every choice involving time and money, from paying off student loans early to delaying Social Security benefits, fundamentally revolves around TVM calculations. Mastering these concepts transforms complex financial decisions into clear mathematical problems."',
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].quoteFooter,
                                                                children: "— CFA Charterholder, 20+ years in investment analysis"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                                lineNumber: 776,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                        lineNumber: 774,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                lineNumber: 772,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                        lineNumber: 682,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqCard,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqTitle,
                                                children: "Frequently Asked Questions"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                lineNumber: 783,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqItem,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqQuestion,
                                                        children: "What's the difference between nominal and real rates of return?"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                        lineNumber: 786,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqAnswer,
                                                        children: "The nominal rate is the stated rate of return without inflation adjustment. The real rate is the nominal rate minus inflation. For example, with a 7% nominal return and 3% inflation, your real return is approximately 4%. Real returns matter for purchasing power preservation."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                        lineNumber: 787,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                lineNumber: 785,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqItem,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqQuestion,
                                                        children: "How does compounding frequency affect TVM calculations?"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                        lineNumber: 791,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqAnswer,
                                                        children: "More frequent compounding (monthly vs annually) increases effective returns due to interest earning interest more often. The formula adjusts by dividing the annual rate by compounding periods and multiplying time periods accordingly. Our calculator can handle various compounding frequencies."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                        lineNumber: 792,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                lineNumber: 790,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqItem,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqQuestion,
                                                        children: "When should I use present value vs future value calculations?"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                        lineNumber: 796,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqAnswer,
                                                        children: "Use future value when planning for goals (How much will my savings be worth?). Use present value when evaluating opportunities (What is this future payment worth today?). Present value is essential for comparing investments with different time horizons."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                        lineNumber: 797,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                lineNumber: 795,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqItem,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqQuestion,
                                                        children: "What is discount rate and how do I choose it?"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                        lineNumber: 801,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqAnswer,
                                                        children: "The discount rate reflects your opportunity cost—what you could earn in alternative investments with similar risk. For personal decisions, use your expected investment return. For business decisions, use the company's cost of capital or required rate of return."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                        lineNumber: 802,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                lineNumber: 800,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqItem,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqQuestion,
                                                        children: "How does TVM apply to debt decisions?"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                        lineNumber: 806,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqAnswer,
                                                        children: "TVM helps evaluate whether to pay off debt early or invest. Compare the after-tax interest cost of debt to your expected investment returns. Generally, pay off high-interest debt first, but lower-interest debt might be better served by investing if returns exceed the interest rate."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                        lineNumber: 807,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                lineNumber: 805,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                        lineNumber: 782,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                lineNumber: 681,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].actionSection,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ctaCard,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ctaTitle,
                                            children: "Master Your Financial Future with TVM"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                            lineNumber: 815,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ctaText,
                                            children: "Use our comprehensive TVM calculator to analyze investments, plan for goals, and make informed financial decisions. Experiment with different scenarios to understand how time, rates, and inflation impact your wealth."
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                            lineNumber: 816,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].buttonGroup,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].primaryButton,
                                                    onClick: ()=>setCalculationType('futureValue'),
                                                    children: "Calculate Future Value"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                    lineNumber: 819,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].secondaryButton,
                                                    onClick: ()=>setCalculationType('presentValue'),
                                                    children: "Analyze Present Value"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                    lineNumber: 822,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                            lineNumber: 818,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$timevalueofmoneycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].disclaimer,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Disclaimer:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                                    lineNumber: 828,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " This calculator provides educational estimates for Time Value of Money concepts. Actual investment returns and inflation rates may vary significantly. Past performance does not guarantee future results. This tool does not constitute financial advice. Consult with qualified financial professionals for personalized guidance. Calculations assume constant rates and may not reflect market volatility or changing economic conditions."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                            lineNumber: 827,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                    lineNumber: 814,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                                lineNumber: 813,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                        lineNumber: 264,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/time-value-of-money-calculator.jsx",
                lineNumber: 250,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true);
};
_s(TimeValueOfMoneyCalculator, "FBg+cCAnpOtQqD/qOy+3hIlgi2I=");
_c = TimeValueOfMoneyCalculator;
var __N_SSG = true;
const __TURBOPACK__default__export__ = TimeValueOfMoneyCalculator;
var _c;
__turbopack_context__.k.register(_c, "TimeValueOfMoneyCalculator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/time-value-of-money-calculator.jsx [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/time-value-of-money-calculator";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/src/pages/time-value-of-money-calculator.jsx [client] (ecmascript)");
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
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/src/pages/time-value-of-money-calculator\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/time-value-of-money-calculator.jsx [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__4d7e70e0._.js.map