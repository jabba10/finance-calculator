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
"[project]/src/pages/leasevsbuycalculator.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "actionSection": "leasevsbuycalculator-module__RN2ScG__actionSection",
  "applicationsList": "leasevsbuycalculator-module__RN2ScG__applicationsList",
  "articleCard": "leasevsbuycalculator-module__RN2ScG__articleCard",
  "articleSection": "leasevsbuycalculator-module__RN2ScG__articleSection",
  "articleSubtitle": "leasevsbuycalculator-module__RN2ScG__articleSubtitle",
  "articleTitle": "leasevsbuycalculator-module__RN2ScG__articleTitle",
  "badge": "leasevsbuycalculator-module__RN2ScG__badge",
  "badgeContainer": "leasevsbuycalculator-module__RN2ScG__badgeContainer",
  "buttonGroup": "leasevsbuycalculator-module__RN2ScG__buttonGroup",
  "buyRecommendation": "leasevsbuycalculator-module__RN2ScG__buyRecommendation",
  "buyResult": "leasevsbuycalculator-module__RN2ScG__buyResult",
  "calculatorCard": "leasevsbuycalculator-module__RN2ScG__calculatorCard",
  "calculatorLayout": "leasevsbuycalculator-module__RN2ScG__calculatorLayout",
  "chartBarBuy": "leasevsbuycalculator-module__RN2ScG__chartBarBuy",
  "chartBarContainer": "leasevsbuycalculator-module__RN2ScG__chartBarContainer",
  "chartBarGroup": "leasevsbuycalculator-module__RN2ScG__chartBarGroup",
  "chartBarLabel": "leasevsbuycalculator-module__RN2ScG__chartBarLabel",
  "chartBarLease": "leasevsbuycalculator-module__RN2ScG__chartBarLease",
  "chartBarValue": "leasevsbuycalculator-module__RN2ScG__chartBarValue",
  "chartBars": "leasevsbuycalculator-module__RN2ScG__chartBars",
  "chartContainer": "leasevsbuycalculator-module__RN2ScG__chartContainer",
  "chartLegend": "leasevsbuycalculator-module__RN2ScG__chartLegend",
  "chartTitle": "leasevsbuycalculator-module__RN2ScG__chartTitle",
  "comparisonTabs": "leasevsbuycalculator-module__RN2ScG__comparisonTabs",
  "container": "leasevsbuycalculator-module__RN2ScG__container",
  "ctaCard": "leasevsbuycalculator-module__RN2ScG__ctaCard",
  "ctaText": "leasevsbuycalculator-module__RN2ScG__ctaText",
  "ctaTitle": "leasevsbuycalculator-module__RN2ScG__ctaTitle",
  "currencySymbol": "leasevsbuycalculator-module__RN2ScG__currencySymbol",
  "disclaimer": "leasevsbuycalculator-module__RN2ScG__disclaimer",
  "educationalContent": "leasevsbuycalculator-module__RN2ScG__educationalContent",
  "exampleCard": "leasevsbuycalculator-module__RN2ScG__exampleCard",
  "expertQuote": "leasevsbuycalculator-module__RN2ScG__expertQuote",
  "faqAnswer": "leasevsbuycalculator-module__RN2ScG__faqAnswer",
  "faqCard": "leasevsbuycalculator-module__RN2ScG__faqCard",
  "faqItem": "leasevsbuycalculator-module__RN2ScG__faqItem",
  "faqQuestion": "leasevsbuycalculator-module__RN2ScG__faqQuestion",
  "faqTitle": "leasevsbuycalculator-module__RN2ScG__faqTitle",
  "footer": "leasevsbuycalculator-module__RN2ScG__footer",
  "footerContent": "leasevsbuycalculator-module__RN2ScG__footerContent",
  "footerNote": "leasevsbuycalculator-module__RN2ScG__footerNote",
  "footerText": "leasevsbuycalculator-module__RN2ScG__footerText",
  "header": "leasevsbuycalculator-module__RN2ScG__header",
  "headerContent": "leasevsbuycalculator-module__RN2ScG__headerContent",
  "inputGroup": "leasevsbuycalculator-module__RN2ScG__inputGroup",
  "inputLabel": "leasevsbuycalculator-module__RN2ScG__inputLabel",
  "inputWrapper": "leasevsbuycalculator-module__RN2ScG__inputWrapper",
  "insightsCard": "leasevsbuycalculator-module__RN2ScG__insightsCard",
  "insightsList": "leasevsbuycalculator-module__RN2ScG__insightsList",
  "insightsTitle": "leasevsbuycalculator-module__RN2ScG__insightsTitle",
  "leaseRecommendation": "leasevsbuycalculator-module__RN2ScG__leaseRecommendation",
  "leaseResult": "leasevsbuycalculator-module__RN2ScG__leaseResult",
  "legendBuy": "leasevsbuycalculator-module__RN2ScG__legendBuy",
  "legendColor": "leasevsbuycalculator-module__RN2ScG__legendColor",
  "legendItem": "leasevsbuycalculator-module__RN2ScG__legendItem",
  "legendLease": "leasevsbuycalculator-module__RN2ScG__legendLease",
  "mainContent": "leasevsbuycalculator-module__RN2ScG__mainContent",
  "mainTitle": "leasevsbuycalculator-module__RN2ScG__mainTitle",
  "numberInput": "leasevsbuycalculator-module__RN2ScG__numberInput",
  "percentageSymbol": "leasevsbuycalculator-module__RN2ScG__percentageSymbol",
  "primaryButton": "leasevsbuycalculator-module__RN2ScG__primaryButton",
  "quoteFooter": "leasevsbuycalculator-module__RN2ScG__quoteFooter",
  "recommendationBanner": "leasevsbuycalculator-module__RN2ScG__recommendationBanner",
  "recommendationText": "leasevsbuycalculator-module__RN2ScG__recommendationText",
  "recommendationTitle": "leasevsbuycalculator-module__RN2ScG__recommendationTitle",
  "resultItem": "leasevsbuycalculator-module__RN2ScG__resultItem",
  "resultLabel": "leasevsbuycalculator-module__RN2ScG__resultLabel",
  "resultSubtext": "leasevsbuycalculator-module__RN2ScG__resultSubtext",
  "resultValue": "leasevsbuycalculator-module__RN2ScG__resultValue",
  "resultsCard": "leasevsbuycalculator-module__RN2ScG__resultsCard",
  "resultsGrid": "leasevsbuycalculator-module__RN2ScG__resultsGrid",
  "secondaryButton": "leasevsbuycalculator-module__RN2ScG__secondaryButton",
  "sectionTitle": "leasevsbuycalculator-module__RN2ScG__sectionTitle",
  "selectInput": "leasevsbuycalculator-module__RN2ScG__selectInput",
  "slider": "leasevsbuycalculator-module__RN2ScG__slider",
  "strategyCard": "leasevsbuycalculator-module__RN2ScG__strategyCard",
  "strategyGrid": "leasevsbuycalculator-module__RN2ScG__strategyGrid",
  "subtitle": "leasevsbuycalculator-module__RN2ScG__subtitle",
  "tabSection": "leasevsbuycalculator-module__RN2ScG__tabSection",
  "tabTitle": "leasevsbuycalculator-module__RN2ScG__tabTitle",
  "valueDisplay": "leasevsbuycalculator-module__RN2ScG__valueDisplay",
  "yearsSymbol": "leasevsbuycalculator-module__RN2ScG__yearsSymbol",
});
}),
"[project]/src/pages/lease-vs-buy-calculator.jsx [client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/pages/leasevsbuycalculator.module.css [client] (css module)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
const LeaseVsBuyCalculator = ({ currentDate, lastModifiedDate })=>{
    _s();
    // Lease State
    const [leaseTerm, setLeaseTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(36);
    const [leaseDownPayment, setLeaseDownPayment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(3000);
    const [monthlyLeasePayment, setMonthlyLeasePayment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(450);
    const [leaseMileageLimit, setLeaseMileageLimit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(12000);
    const [dispositionFee, setDispositionFee] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(350);
    const [leaseAcquisitionFee, setLeaseAcquisitionFee] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(650);
    const [leaseInterestRate, setLeaseInterestRate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(4.5);
    // Buy State
    const [vehiclePrice, setVehiclePrice] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(35000);
    const [loanTerm, setLoanTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(60);
    const [downPayment, setDownPayment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(5000);
    const [loanInterestRate, setLoanInterestRate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(5.5);
    const [salesTaxRate, setSalesTaxRate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(7.5);
    const [expectedMileage, setExpectedMileage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(15000);
    // Results
    const [results, setResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [chartData, setChartData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [recommendation, setRecommendation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const calculateLeaseVsBuy = ()=>{
        // Calculate Lease Costs
        const leaseMonthlyWithTax = monthlyLeasePayment * (1 + salesTaxRate / 100);
        const totalLeasePayments = leaseMonthlyWithTax * leaseTerm;
        const totalLeaseCost = totalLeasePayments + leaseDownPayment + dispositionFee + leaseAcquisitionFee;
        // Calculate Buy Costs
        const loanAmount = vehiclePrice - downPayment;
        const monthlyLoanRate = loanInterestRate / 100 / 12;
        const loanPayment = loanAmount * monthlyLoanRate * Math.pow(1 + monthlyLoanRate, loanTerm) / (Math.pow(1 + monthlyLoanRate, loanTerm) - 1);
        const monthlyLoanWithTax = loanPayment * (1 + salesTaxRate / 100);
        const totalLoanPayments = monthlyLoanWithTax * loanTerm;
        const totalBuyCost = totalLoanPayments + downPayment + vehiclePrice * salesTaxRate / 100;
        // Calculate vehicle value after loan term (depreciation)
        const annualDepreciation = 15; // 15% per year
        const yearsOfLoan = loanTerm / 12;
        const vehicleValueAfterLoan = vehiclePrice * Math.pow(1 - annualDepreciation / 100, yearsOfLoan);
        // Calculate net buy cost (total cost - vehicle value)
        const netBuyCost = totalBuyCost - vehicleValueAfterLoan;
        // Calculate 3-year comparison (common lease term)
        const threeYearBuyPayments = monthlyLoanWithTax * 36;
        const threeYearBuyEquity = vehiclePrice * (1 - Math.pow(1 - annualDepreciation / 100, 3)) - threeYearBuyPayments;
        const threeYearLeaseCost = totalLeaseCost;
        // Calculate mileage impact
        const excessMilesPerYear = Math.max(0, expectedMileage - leaseMileageLimit);
        const excessMileCost = excessMilesPerYear * 0.25 * (leaseTerm / 12); // $0.25 per mile
        const adjustedLeaseCost = totalLeaseCost + excessMileCost;
        // Generate yearly data for chart
        const dataPoints = [];
        for(let year = 1; year <= 6; year++){
            const leaseCumulative = year <= leaseTerm / 12 ? leaseMonthlyWithTax * year * 12 + leaseDownPayment + (year === 3 ? dispositionFee + leaseAcquisitionFee : 0) + excessMileCost * (year / 3) : leaseMonthlyWithTax * leaseTerm + leaseDownPayment + dispositionFee + leaseAcquisitionFee + excessMileCost;
            const buyCumulative = Math.min(year * 12, loanTerm) * monthlyLoanWithTax + downPayment + vehiclePrice * salesTaxRate / 100;
            const buyVehicleValue = vehiclePrice * Math.pow(1 - annualDepreciation / 100, year);
            const buyNetCost = buyCumulative - buyVehicleValue;
            dataPoints.push({
                year,
                leaseCost: Math.round(leaseCumulative),
                buyCost: Math.round(buyCumulative),
                buyNetCost: Math.round(buyNetCost),
                buyVehicleValue: Math.round(buyVehicleValue)
            });
        }
        // Determine recommendation
        let rec = '';
        if (netBuyCost < totalLeaseCost && excessMileCost === 0) {
            rec = 'BUY - Lower long-term cost';
        } else if (excessMileCost > 2000) {
            rec = 'BUY - High mileage makes leasing expensive';
        } else if (leaseTerm <= 36 && monthlyLeasePayment * 12 < vehiclePrice * 0.15) {
            rec = 'LEASE - Good deal for short-term use';
        } else {
            rec = 'BUY - Better long-term investment';
        }
        setResults({
            totalLeaseCost: Math.round(totalLeaseCost),
            adjustedLeaseCost: Math.round(adjustedLeaseCost),
            totalBuyCost: Math.round(totalBuyCost),
            netBuyCost: Math.round(netBuyCost),
            monthlyLeasePayment: Math.round(leaseMonthlyWithTax),
            monthlyBuyPayment: Math.round(monthlyLoanWithTax),
            threeYearLeaseCost: Math.round(threeYearLeaseCost),
            threeYearBuyCost: Math.round(threeYearBuyPayments),
            threeYearBuyEquity: Math.round(threeYearBuyEquity),
            excessMileCost: Math.round(excessMileCost),
            vehicleValueAfterLoan: Math.round(vehicleValueAfterLoan)
        });
        setChartData(dataPoints);
        setRecommendation(rec);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LeaseVsBuyCalculator.useEffect": ()=>{
            calculateLeaseVsBuy();
        }
    }["LeaseVsBuyCalculator.useEffect"], [
        leaseTerm,
        leaseDownPayment,
        monthlyLeasePayment,
        leaseMileageLimit,
        dispositionFee,
        leaseAcquisitionFee,
        leaseInterestRate,
        vehiclePrice,
        loanTerm,
        downPayment,
        loanInterestRate,
        salesTaxRate,
        expectedMileage
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                        children: "Lease vs Buy Calculator | Make the Right Car Decision"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                        lineNumber: 137,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "description",
                        content: "Free comprehensive lease vs buy calculator. Compare total costs, monthly payments, and long-term value to make the best financial decision for your next vehicle."
                    }, void 0, false, {
                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                        lineNumber: 138,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "keywords",
                        content: "lease vs buy calculator, car lease calculator, auto loan calculator, vehicle financing, car buying decision, lease calculator"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                        lineNumber: 139,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "date",
                        content: currentDate
                    }, void 0, false, {
                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                        lineNumber: 140,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "last-modified",
                        content: lastModifiedDate
                    }, void 0, false, {
                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                        lineNumber: 141,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "viewport",
                        content: "width=device-width, initial-scale=1"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                        lineNumber: 142,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                        rel: "canonical",
                        href: "https://www.financecalculatorfree.com/lease-vs-buy-calculator"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                        lineNumber: 143,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:title",
                        content: "Lease vs Buy Calculator | Make the Right Car Decision"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                        lineNumber: 146,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:description",
                        content: "Should you lease or buy your next vehicle? Our calculator compares total costs and helps you make the best financial decision."
                    }, void 0, false, {
                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                        lineNumber: 147,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:type",
                        content: "website"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                        lineNumber: 148,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:url",
                        content: "https://www.financecalculatorfree.com/lease-vs-buy-calculator"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                        lineNumber: 149,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "twitter:card",
                        content: "summary_large_image"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                        lineNumber: 152,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "twitter:title",
                        content: "Lease vs Buy Calculator"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                        lineNumber: 153,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "twitter:description",
                        content: "Compare total vehicle ownership costs: leasing vs buying. Make informed financial decisions."
                    }, void 0, false, {
                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                        lineNumber: 154,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                lineNumber: 136,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                id: "lease-vs-buy-calculator-schema",
                type: "application/ld+json",
                dangerouslySetInnerHTML: {
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SoftwareApplication",
                        "name": "Lease vs Buy Calculator",
                        "description": "Professional vehicle lease vs purchase comparison calculator with detailed cost analysis and financial planning",
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
                            "ratingCount": "980",
                            "bestRating": "5",
                            "worstRating": "1"
                        },
                        "datePublished": currentDate,
                        "dateModified": currentDate,
                        "author": {
                            "@type": "Organization",
                            "name": "Auto Financial Tools",
                            "url": "https://www.financecalculatorfree.com"
                        },
                        "featureList": [
                            "Total Cost Comparison",
                            "Monthly Payment Analysis",
                            "Depreciation Calculator",
                            "Mileage Impact Analysis",
                            "Long-term Value Projection"
                        ]
                    })
                }
            }, void 0, false, {
                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                lineNumber: 158,
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
                                "name": "Is it better to lease or buy a car?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "The answer depends on your driving habits, financial situation, and personal preferences. Leasing typically offers lower monthly payments but no equity. Buying costs more monthly but you own the asset. Use our calculator to compare your specific scenario.",
                                    "datePublished": currentDate
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "What are the hidden costs of leasing?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Hidden lease costs include excess mileage fees ($0.15-$0.30 per mile over limit), disposition fees ($300-$500), excessive wear and tear charges, and early termination penalties. Our calculator helps account for these costs.",
                                    "datePublished": currentDate
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "How does depreciation affect the buy vs lease decision?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Depreciation is the biggest cost of vehicle ownership. When you lease, you only pay for the depreciation during the lease term. When you buy, you bear the full depreciation risk but also benefit from any residual value.",
                                    "datePublished": currentDate
                                }
                            }
                        ]
                    })
                }
            }, void 0, false, {
                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                lineNumber: 200,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].container,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].header,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].headerContent,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].mainTitle,
                                    children: "Lease vs Buy Calculator"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                    lineNumber: 244,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].subtitle,
                                    children: "Compare Total Costs and Make the Right Vehicle Decision"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                    lineNumber: 245,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].badgeContainer,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].badge,
                                            children: [
                                                "Updated: ",
                                                currentDate
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                            lineNumber: 247,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].badge,
                                            children: "Comprehensive Analysis"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                            lineNumber: 248,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].badge,
                                            children: "No Signup Required"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                            lineNumber: 249,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                    lineNumber: 246,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                            lineNumber: 243,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                        lineNumber: 242,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].mainContent,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].calculatorLayout,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].calculatorCard,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].sectionTitle,
                                                children: "Vehicle & Financial Details"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                lineNumber: 258,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputGroup,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputLabel,
                                                    children: [
                                                        "Vehicle Price",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputWrapper,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].currencySymbol,
                                                                    children: "$"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                    lineNumber: 265,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "range",
                                                                    min: "15000",
                                                                    max: "100000",
                                                                    step: "1000",
                                                                    value: vehiclePrice,
                                                                    onChange: (e)=>setVehiclePrice(parseInt(e.target.value)),
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].slider
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                    lineNumber: 266,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    min: "15000",
                                                                    max: "100000",
                                                                    step: "1000",
                                                                    value: vehiclePrice,
                                                                    onChange: (e)=>setVehiclePrice(parseInt(e.target.value) || 0),
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].numberInput
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                    lineNumber: 275,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                            lineNumber: 264,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].valueDisplay,
                                                            children: formatCurrency(vehiclePrice)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                            lineNumber: 285,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                    lineNumber: 262,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                lineNumber: 261,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputGroup,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputLabel,
                                                    children: [
                                                        "Sales Tax Rate",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputWrapper,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "range",
                                                                    min: "0",
                                                                    max: "10",
                                                                    step: "0.1",
                                                                    value: salesTaxRate,
                                                                    onChange: (e)=>setSalesTaxRate(parseFloat(e.target.value)),
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].slider
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                    lineNumber: 294,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    min: "0",
                                                                    max: "10",
                                                                    step: "0.1",
                                                                    value: salesTaxRate,
                                                                    onChange: (e)=>setSalesTaxRate(parseFloat(e.target.value) || 0),
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].numberInput
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                    lineNumber: 303,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].percentageSymbol,
                                                                    children: "%"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                    lineNumber: 312,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                            lineNumber: 293,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].valueDisplay,
                                                            children: formatPercentage(salesTaxRate)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                            lineNumber: 314,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                    lineNumber: 291,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                lineNumber: 290,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputGroup,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputLabel,
                                                    children: [
                                                        "Expected Annual Mileage",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputWrapper,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "range",
                                                                    min: "5000",
                                                                    max: "25000",
                                                                    step: "1000",
                                                                    value: expectedMileage,
                                                                    onChange: (e)=>setExpectedMileage(parseInt(e.target.value)),
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].slider
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                    lineNumber: 323,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    min: "5000",
                                                                    max: "25000",
                                                                    step: "1000",
                                                                    value: expectedMileage,
                                                                    onChange: (e)=>setExpectedMileage(parseInt(e.target.value) || 0),
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].numberInput
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                    lineNumber: 332,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].yearsSymbol,
                                                                    children: "miles"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                    lineNumber: 341,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                            lineNumber: 322,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].valueDisplay,
                                                            children: [
                                                                expectedMileage.toLocaleString(),
                                                                " miles/year"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                            lineNumber: 343,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                    lineNumber: 320,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                lineNumber: 319,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].comparisonTabs,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tabSection,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tabTitle,
                                                                children: "Lease Options"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                lineNumber: 349,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputGroup,
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputLabel,
                                                                    children: [
                                                                        "Lease Term",
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                            value: leaseTerm,
                                                                            onChange: (e)=>setLeaseTerm(parseInt(e.target.value)),
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].selectInput,
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                    value: "24",
                                                                                    children: "24 months"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                                    lineNumber: 359,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                    value: "36",
                                                                                    children: "36 months"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                                    lineNumber: 360,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                    value: "48",
                                                                                    children: "48 months"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                                    lineNumber: 361,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                    value: "60",
                                                                                    children: "60 months"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                                    lineNumber: 362,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                            lineNumber: 354,
                                                                            columnNumber: 23
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                    lineNumber: 352,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                lineNumber: 351,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputGroup,
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputLabel,
                                                                    children: [
                                                                        "Monthly Lease Payment",
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputWrapper,
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].currencySymbol,
                                                                                    children: "$"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                                    lineNumber: 371,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                    type: "range",
                                                                                    min: "200",
                                                                                    max: "1500",
                                                                                    step: "10",
                                                                                    value: monthlyLeasePayment,
                                                                                    onChange: (e)=>setMonthlyLeasePayment(parseInt(e.target.value)),
                                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].slider
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                                    lineNumber: 372,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                    type: "number",
                                                                                    min: "200",
                                                                                    max: "1500",
                                                                                    step: "10",
                                                                                    value: monthlyLeasePayment,
                                                                                    onChange: (e)=>setMonthlyLeasePayment(parseInt(e.target.value) || 0),
                                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].numberInput
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                                    lineNumber: 381,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                            lineNumber: 370,
                                                                            columnNumber: 23
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].valueDisplay,
                                                                            children: [
                                                                                formatCurrency(monthlyLeasePayment),
                                                                                "/month"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                            lineNumber: 391,
                                                                            columnNumber: 23
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                    lineNumber: 368,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                lineNumber: 367,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputGroup,
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputLabel,
                                                                    children: [
                                                                        "Lease Mileage Limit",
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                            value: leaseMileageLimit,
                                                                            onChange: (e)=>setLeaseMileageLimit(parseInt(e.target.value)),
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].selectInput,
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                    value: "10000",
                                                                                    children: "10,000 miles/year"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                                    lineNumber: 403,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                    value: "12000",
                                                                                    children: "12,000 miles/year"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                                    lineNumber: 404,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                    value: "15000",
                                                                                    children: "15,000 miles/year"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                                    lineNumber: 405,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                    value: "18000",
                                                                                    children: "18,000 miles/year"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                                    lineNumber: 406,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                            lineNumber: 398,
                                                                            columnNumber: 23
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                    lineNumber: 396,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                lineNumber: 395,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                        lineNumber: 348,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tabSection,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tabTitle,
                                                                children: "Purchase Options"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                lineNumber: 413,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputGroup,
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputLabel,
                                                                    children: [
                                                                        "Loan Term",
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                            value: loanTerm,
                                                                            onChange: (e)=>setLoanTerm(parseInt(e.target.value)),
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].selectInput,
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                    value: "36",
                                                                                    children: "3 years (36 months)"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                                    lineNumber: 423,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                    value: "48",
                                                                                    children: "4 years (48 months)"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                                    lineNumber: 424,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                    value: "60",
                                                                                    children: "5 years (60 months)"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                                    lineNumber: 425,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                    value: "72",
                                                                                    children: "6 years (72 months)"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                                    lineNumber: 426,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                    value: "84",
                                                                                    children: "7 years (72 months)"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                                    lineNumber: 427,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                            lineNumber: 418,
                                                                            columnNumber: 23
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                    lineNumber: 416,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                lineNumber: 415,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputGroup,
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputLabel,
                                                                    children: [
                                                                        "Down Payment",
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputWrapper,
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].currencySymbol,
                                                                                    children: "$"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                                    lineNumber: 436,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                    type: "range",
                                                                                    min: "0",
                                                                                    max: "20000",
                                                                                    step: "500",
                                                                                    value: downPayment,
                                                                                    onChange: (e)=>setDownPayment(parseInt(e.target.value)),
                                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].slider
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                                    lineNumber: 437,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                    type: "number",
                                                                                    min: "0",
                                                                                    max: "20000",
                                                                                    step: "500",
                                                                                    value: downPayment,
                                                                                    onChange: (e)=>setDownPayment(parseInt(e.target.value) || 0),
                                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].numberInput
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                                    lineNumber: 446,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                            lineNumber: 435,
                                                                            columnNumber: 23
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].valueDisplay,
                                                                            children: formatCurrency(downPayment)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                            lineNumber: 456,
                                                                            columnNumber: 23
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                    lineNumber: 433,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                lineNumber: 432,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputGroup,
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputLabel,
                                                                    children: [
                                                                        "Loan Interest Rate",
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputWrapper,
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                    type: "range",
                                                                                    min: "2",
                                                                                    max: "15",
                                                                                    step: "0.1",
                                                                                    value: loanInterestRate,
                                                                                    onChange: (e)=>setLoanInterestRate(parseFloat(e.target.value)),
                                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].slider
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                                    lineNumber: 464,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                    type: "number",
                                                                                    min: "2",
                                                                                    max: "15",
                                                                                    step: "0.1",
                                                                                    value: loanInterestRate,
                                                                                    onChange: (e)=>setLoanInterestRate(parseFloat(e.target.value) || 0),
                                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].numberInput
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                                    lineNumber: 473,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].percentageSymbol,
                                                                                    children: "%"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                                    lineNumber: 482,
                                                                                    columnNumber: 25
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                            lineNumber: 463,
                                                                            columnNumber: 23
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].valueDisplay,
                                                                            children: formatPercentage(loanInterestRate)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                            lineNumber: 484,
                                                                            columnNumber: 23
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                    lineNumber: 461,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                lineNumber: 460,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                        lineNumber: 412,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                lineNumber: 347,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                        lineNumber: 257,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultsCard,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].sectionTitle,
                                                children: "Cost Comparison Results"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                lineNumber: 493,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            results && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].recommendationBanner} ${recommendation.includes('LEASE') ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].leaseRecommendation : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].buyRecommendation}`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].recommendationTitle,
                                                                children: recommendation.includes('LEASE') ? '🚗 RECOMMENDATION: LEASE' : '💰 RECOMMENDATION: BUY'
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                lineNumber: 499,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].recommendationText,
                                                                children: recommendation
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                lineNumber: 502,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                        lineNumber: 498,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultsGrid,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultItem} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].leaseResult}`,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultLabel,
                                                                        children: [
                                                                            "Total Lease Cost (",
                                                                            leaseTerm,
                                                                            " months)"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                        lineNumber: 507,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultValue,
                                                                        children: formatCurrency(results.totalLeaseCost)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                        lineNumber: 508,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    results.excessMileCost > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultSubtext,
                                                                        children: [
                                                                            "+",
                                                                            formatCurrency(results.excessMileCost),
                                                                            " potential mileage fees"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                        lineNumber: 510,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                lineNumber: 506,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultItem} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].buyResult}`,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultLabel,
                                                                        children: "Total Purchase Cost"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                        lineNumber: 517,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultValue,
                                                                        children: formatCurrency(results.totalBuyCost)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                        lineNumber: 518,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultSubtext,
                                                                        children: [
                                                                            "Vehicle value after loan: ",
                                                                            formatCurrency(results.vehicleValueAfterLoan)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                        lineNumber: 519,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                lineNumber: 516,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultItem,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultLabel,
                                                                        children: "Monthly Payment (Lease)"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                        lineNumber: 525,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultValue,
                                                                        children: formatCurrency(results.monthlyLeasePayment)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                        lineNumber: 526,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                lineNumber: 524,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultItem,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultLabel,
                                                                        children: "Monthly Payment (Buy)"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                        lineNumber: 530,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultValue,
                                                                        children: formatCurrency(results.monthlyBuyPayment)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                        lineNumber: 531,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultSubtext,
                                                                        children: [
                                                                            loanTerm,
                                                                            " months"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                        lineNumber: 532,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                lineNumber: 529,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultItem,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultLabel,
                                                                        children: "3-Year Lease Cost"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                        lineNumber: 538,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultValue,
                                                                        children: formatCurrency(results.threeYearLeaseCost)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                        lineNumber: 539,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                lineNumber: 537,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultItem,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultLabel,
                                                                        children: "3-Year Buy Cost"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                        lineNumber: 543,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultValue,
                                                                        children: formatCurrency(results.threeYearBuyCost)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                        lineNumber: 544,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultSubtext,
                                                                        children: [
                                                                            "Estimated equity: ",
                                                                            formatCurrency(results.threeYearBuyEquity)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                        lineNumber: 545,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                lineNumber: 542,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                        lineNumber: 505,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartContainer,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartTitle,
                                                                children: "Cost Comparison Over Time"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                lineNumber: 553,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartBars,
                                                                children: chartData.map((data, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartBarGroup,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartBarLabel,
                                                                                children: [
                                                                                    "Year ",
                                                                                    data.year
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                                lineNumber: 557,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartBarContainer,
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartBarLease,
                                                                                        style: {
                                                                                            width: `${data.leaseCost / Math.max(data.buyCost, data.leaseCost) * 100}%`
                                                                                        },
                                                                                        title: `Lease: ${formatCurrency(data.leaseCost)}`
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                                        lineNumber: 559,
                                                                                        columnNumber: 29
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartBarBuy,
                                                                                        style: {
                                                                                            width: `${data.buyCost / Math.max(data.buyCost, data.leaseCost) * 100}%`
                                                                                        },
                                                                                        title: `Buy: ${formatCurrency(data.buyCost)}`
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                                        lineNumber: 564,
                                                                                        columnNumber: 29
                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                                lineNumber: 558,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartBarValue,
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        children: [
                                                                                            "Lease: ",
                                                                                            formatCurrency(data.leaseCost)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                                        lineNumber: 571,
                                                                                        columnNumber: 29
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        children: [
                                                                                            "Buy: ",
                                                                                            formatCurrency(data.buyCost)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                                        lineNumber: 572,
                                                                                        columnNumber: 29
                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                                lineNumber: 570,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, index, true, {
                                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                        lineNumber: 556,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                lineNumber: 554,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartLegend,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].legendItem,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].legendColor} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].legendLease}`
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                                lineNumber: 579,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                children: "Lease Cost"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                                lineNumber: 580,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                        lineNumber: 578,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].legendItem,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].legendColor} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].legendBuy}`
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                                lineNumber: 583,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                children: "Purchase Cost"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                                lineNumber: 584,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                        lineNumber: 582,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                lineNumber: 577,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                        lineNumber: 552,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].insightsCard,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].insightsTitle,
                                                                children: "💡 Key Insights"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                lineNumber: 590,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].insightsList,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                        children: [
                                                                            "Monthly payment difference: ",
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                children: formatCurrency(Math.abs(results.monthlyLeasePayment - results.monthlyBuyPayment))
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                                lineNumber: 592,
                                                                                columnNumber: 55
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            " ",
                                                                            results.monthlyLeasePayment < results.monthlyBuyPayment ? 'less for lease' : 'less for purchase'
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                        lineNumber: 592,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                        children: [
                                                                            "After ",
                                                                            loanTerm / 12,
                                                                            " years, you'll own a vehicle worth approximately ",
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                children: formatCurrency(results.vehicleValueAfterLoan)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                                lineNumber: 593,
                                                                                columnNumber: 95
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                        lineNumber: 593,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                        children: [
                                                                            "Leasing costs ",
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                children: formatCurrency(results.totalLeaseCost)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                                lineNumber: 594,
                                                                                columnNumber: 41
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            " with nothing to show at the end"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                        lineNumber: 594,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    results.excessMileCost > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                        children: [
                                                                            "Your driving habits could add ",
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                children: formatCurrency(results.excessMileCost)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                                lineNumber: 596,
                                                                                columnNumber: 59
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            " in excess mileage fees if you lease"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                        lineNumber: 596,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                lineNumber: 591,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                        lineNumber: 589,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                        lineNumber: 492,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                lineNumber: 255,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].educationalContent,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleCard,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleTitle,
                                                children: "Lease vs Buy: Making the Smart Financial Decision"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                lineNumber: 608,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSection,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSubtitle,
                                                        children: "When Leasing Makes Sense"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                        lineNumber: 611,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: "Leasing can be a smart choice for specific situations. Consider leasing if:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                        lineNumber: 612,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].strategyGrid,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].strategyCard,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        children: "🚗 Low Monthly Payments"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                        lineNumber: 616,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        children: "Lease payments are typically 30-60% lower than loan payments for the same vehicle, freeing up cash flow for other investments."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                        lineNumber: 617,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                lineNumber: 615,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].strategyCard,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        children: "🔄 Frequent Upgrades"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                        lineNumber: 621,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        children: "If you like driving new cars every 2-3 years with the latest technology and safety features, leasing eliminates trade-in hassles."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                        lineNumber: 622,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                lineNumber: 620,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].strategyCard,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        children: "🏢 Business Use"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                        lineNumber: 626,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        children: "Businesses can often deduct lease payments as operating expenses, and maintenance is typically covered under warranty."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                        lineNumber: 627,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                lineNumber: 625,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].strategyCard,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        children: "📊 Predictable Costs"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                        lineNumber: 631,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        children: "Most leases include warranty coverage for the entire term, making repair costs predictable and usually covered."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                        lineNumber: 632,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                lineNumber: 630,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                        lineNumber: 614,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                lineNumber: 610,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSection,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSubtitle,
                                                        children: "When Buying is Better"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                        lineNumber: 638,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: "Purchasing a vehicle often provides better long-term value. Buy if:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                        lineNumber: 639,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].exampleCard,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                children: "Long-Term Ownership:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                lineNumber: 642,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                children: "Years 1-3:"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                                lineNumber: 644,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            " Buying costs more monthly but builds equity"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                        lineNumber: 644,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                children: "Years 4-6:"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                                lineNumber: 645,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            " You own the vehicle outright after loan payoff"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                        lineNumber: 645,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                children: "Years 7+:"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                                lineNumber: 646,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            " No payments, just maintenance costs"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                        lineNumber: 646,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                lineNumber: 643,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                children: "The breakeven point is typically 4-5 years, after which buying becomes significantly cheaper."
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                lineNumber: 648,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                        lineNumber: 641,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                lineNumber: 637,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSection,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSubtitle,
                                                        children: "Hidden Costs to Consider"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                        lineNumber: 653,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].applicationsList,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: "Lease Excess Fees:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                        lineNumber: 655,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    " Mileage overage ($0.15-$0.30/mile), wear and tear charges, disposition fees ($300-$500)"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                lineNumber: 655,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: "Purchase Long-term Costs:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                        lineNumber: 656,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    " Repairs after warranty, depreciation (biggest cost), insurance may be higher"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                lineNumber: 656,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: "Both:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                        lineNumber: 657,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    " Sales tax (calculated differently), insurance, registration, maintenance"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                lineNumber: 657,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: "Opportunity Cost:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                        lineNumber: 658,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    " Money saved on lower lease payments could be invested elsewhere"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                lineNumber: 658,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: "Flexibility:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                        lineNumber: 659,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    " Early lease termination fees vs. selling a purchased vehicle"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                lineNumber: 659,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                        lineNumber: 654,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                lineNumber: 652,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSection,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSubtitle,
                                                        children: "Expert Advice from Auto Financial Planners"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                        lineNumber: 664,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("blockquote", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].expertQuote,
                                                        children: [
                                                            '"The biggest mistake people make is focusing only on monthly payments. Look at total cost of ownership over your intended ownership period. For most people who keep cars 5+ years, buying is financially superior. But for business users or those who want new cars frequently, leasing can make sense."',
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].quoteFooter,
                                                                children: "— Certified Automotive Financial Advisor, 20+ years experience"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                                lineNumber: 667,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                        lineNumber: 665,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                lineNumber: 663,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                        lineNumber: 607,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqCard,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqTitle,
                                                children: "Frequently Asked Questions"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                lineNumber: 674,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqItem,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqQuestion,
                                                        children: "What happens at the end of a lease?"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                        lineNumber: 677,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqAnswer,
                                                        children: "You typically have three options: 1) Return the vehicle (pay any excess mileage or damage fees), 2) Purchase the vehicle at the predetermined residual value, or 3) Lease a new vehicle from the same dealership. Most people choose option 1 or 3."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                        lineNumber: 678,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                lineNumber: 676,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqItem,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqQuestion,
                                                        children: "How is the lease payment calculated?"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                        lineNumber: 682,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqAnswer,
                                                        children: "Lease payments cover: 1) Depreciation (vehicle price minus residual value), 2) Rent charge (interest on the leased amount), 3) Taxes and fees. The formula is: (Capitalized Cost - Residual Value) ÷ Lease Term + (Capitalized Cost + Residual Value) × Money Factor."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                        lineNumber: 683,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                lineNumber: 681,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqItem,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqQuestion,
                                                        children: "Can I negotiate a lease like a purchase?"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                        lineNumber: 687,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqAnswer,
                                                        children: "Yes! You can negotiate the vehicle price (capitalized cost), mileage allowance, money factor (interest rate), and fees. The biggest opportunities are in negotiating the vehicle price and the residual value percentage."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                        lineNumber: 688,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                lineNumber: 686,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqItem,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqQuestion,
                                                        children: "What's the impact of mileage on my decision?"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                        lineNumber: 692,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqAnswer,
                                                        children: "High mileage drivers (15,000+ miles/year) should generally buy. Excess mileage fees add up quickly: 5,000 excess miles at $0.25/mile = $1,250 per year. Low-mileage drivers (<10,000 miles/year) can benefit from lower lease rates."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                        lineNumber: 693,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                lineNumber: 691,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                        lineNumber: 673,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                lineNumber: 606,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].actionSection,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ctaCard,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ctaTitle,
                                            children: "Ready to Make Your Decision?"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                            lineNumber: 701,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ctaText,
                                            children: "Use our calculator to model your specific situation. Adjust the inputs based on your driving habits, financial situation, and vehicle preferences."
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                            lineNumber: 702,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].buttonGroup,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].primaryButton,
                                                    onClick: ()=>window.print(),
                                                    children: "📄 Print This Analysis"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                    lineNumber: 705,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].secondaryButton,
                                                    onClick: ()=>{
                                                        // Reset to default values
                                                        setVehiclePrice(35000);
                                                        setLeaseTerm(36);
                                                        setMonthlyLeasePayment(450);
                                                        setLoanTerm(60);
                                                        setDownPayment(5000);
                                                        setExpectedMileage(15000);
                                                    },
                                                    children: "🔄 Reset Calculator"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                    lineNumber: 708,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                            lineNumber: 704,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$leasevsbuycalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].disclaimer,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Disclaimer:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                                    lineNumber: 722,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " This calculator provides estimates for educational purposes. Actual lease terms, interest rates, and vehicle values may vary. Consult with financial and automotive professionals before making major vehicle decisions. Vehicle depreciation rates are estimates based on industry averages."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                            lineNumber: 721,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                    lineNumber: 700,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                                lineNumber: 699,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                        lineNumber: 254,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/lease-vs-buy-calculator.jsx",
                lineNumber: 240,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true);
};
_s(LeaseVsBuyCalculator, "pEcfXtpt+ajloDaEEGMJuCx6yJk=");
_c = LeaseVsBuyCalculator;
var __N_SSG = true;
const __TURBOPACK__default__export__ = LeaseVsBuyCalculator;
var _c;
__turbopack_context__.k.register(_c, "LeaseVsBuyCalculator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/lease-vs-buy-calculator.jsx [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/lease-vs-buy-calculator";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/src/pages/lease-vs-buy-calculator.jsx [client] (ecmascript)");
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
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/src/pages/lease-vs-buy-calculator\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/lease-vs-buy-calculator.jsx [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__51c57686._.js.map