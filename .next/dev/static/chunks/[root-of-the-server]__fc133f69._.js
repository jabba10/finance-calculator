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
"[project]/src/pages/taxbracketcalculator.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "actionSection": "taxbracketcalculator-module__vMNEEG__actionSection",
  "applicationsList": "taxbracketcalculator-module__vMNEEG__applicationsList",
  "articleCard": "taxbracketcalculator-module__vMNEEG__articleCard",
  "articleSection": "taxbracketcalculator-module__vMNEEG__articleSection",
  "articleSubtitle": "taxbracketcalculator-module__vMNEEG__articleSubtitle",
  "articleTitle": "taxbracketcalculator-module__vMNEEG__articleTitle",
  "badge": "taxbracketcalculator-module__vMNEEG__badge",
  "badgeContainer": "taxbracketcalculator-module__vMNEEG__badgeContainer",
  "bracketCard": "taxbracketcalculator-module__vMNEEG__bracketCard",
  "bracketRate": "taxbracketcalculator-module__vMNEEG__bracketRate",
  "bracketTable": "taxbracketcalculator-module__vMNEEG__bracketTable",
  "bracketTitle": "taxbracketcalculator-module__vMNEEG__bracketTitle",
  "buttonGroup": "taxbracketcalculator-module__vMNEEG__buttonGroup",
  "calculatorCard": "taxbracketcalculator-module__vMNEEG__calculatorCard",
  "calculatorLayout": "taxbracketcalculator-module__vMNEEG__calculatorLayout",
  "chartBar": "taxbracketcalculator-module__vMNEEG__chartBar",
  "chartBarContainer": "taxbracketcalculator-module__vMNEEG__chartBarContainer",
  "chartBarGroup": "taxbracketcalculator-module__vMNEEG__chartBarGroup",
  "chartBarLabel": "taxbracketcalculator-module__vMNEEG__chartBarLabel",
  "chartBarValue": "taxbracketcalculator-module__vMNEEG__chartBarValue",
  "chartBars": "taxbracketcalculator-module__vMNEEG__chartBars",
  "chartContainer": "taxbracketcalculator-module__vMNEEG__chartContainer",
  "chartLegend": "taxbracketcalculator-module__vMNEEG__chartLegend",
  "chartTitle": "taxbracketcalculator-module__vMNEEG__chartTitle",
  "checkboxGroup": "taxbracketcalculator-module__vMNEEG__checkboxGroup",
  "checkboxInput": "taxbracketcalculator-module__vMNEEG__checkboxInput",
  "checkboxLabel": "taxbracketcalculator-module__vMNEEG__checkboxLabel",
  "checkboxText": "taxbracketcalculator-module__vMNEEG__checkboxText",
  "container": "taxbracketcalculator-module__vMNEEG__container",
  "contributionInput": "taxbracketcalculator-module__vMNEEG__contributionInput",
  "ctaCard": "taxbracketcalculator-module__vMNEEG__ctaCard",
  "ctaText": "taxbracketcalculator-module__vMNEEG__ctaText",
  "ctaTitle": "taxbracketcalculator-module__vMNEEG__ctaTitle",
  "currencySymbol": "taxbracketcalculator-module__vMNEEG__currencySymbol",
  "deductionNote": "taxbracketcalculator-module__vMNEEG__deductionNote",
  "dependentInput": "taxbracketcalculator-module__vMNEEG__dependentInput",
  "dependentSection": "taxbracketcalculator-module__vMNEEG__dependentSection",
  "disclaimer": "taxbracketcalculator-module__vMNEEG__disclaimer",
  "educationalContent": "taxbracketcalculator-module__vMNEEG__educationalContent",
  "efficiencyCard": "taxbracketcalculator-module__vMNEEG__efficiencyCard",
  "efficiencyDescription": "taxbracketcalculator-module__vMNEEG__efficiencyDescription",
  "efficiencyIcon": "taxbracketcalculator-module__vMNEEG__efficiencyIcon",
  "efficiencyLevel": "taxbracketcalculator-module__vMNEEG__efficiencyLevel",
  "efficiencyText": "taxbracketcalculator-module__vMNEEG__efficiencyText",
  "efficiencyTitle": "taxbracketcalculator-module__vMNEEG__efficiencyTitle",
  "exampleCard": "taxbracketcalculator-module__vMNEEG__exampleCard",
  "expertQuote": "taxbracketcalculator-module__vMNEEG__expertQuote",
  "faqAnswer": "taxbracketcalculator-module__vMNEEG__faqAnswer",
  "faqCard": "taxbracketcalculator-module__vMNEEG__faqCard",
  "faqItem": "taxbracketcalculator-module__vMNEEG__faqItem",
  "faqQuestion": "taxbracketcalculator-module__vMNEEG__faqQuestion",
  "faqTitle": "taxbracketcalculator-module__vMNEEG__faqTitle",
  "filingButton": "taxbracketcalculator-module__vMNEEG__filingButton",
  "filingButtonActive": "taxbracketcalculator-module__vMNEEG__filingButtonActive",
  "filingOptions": "taxbracketcalculator-module__vMNEEG__filingOptions",
  "footer": "taxbracketcalculator-module__vMNEEG__footer",
  "footerContent": "taxbracketcalculator-module__vMNEEG__footerContent",
  "footerNote": "taxbracketcalculator-module__vMNEEG__footerNote",
  "footerText": "taxbracketcalculator-module__vMNEEG__footerText",
  "header": "taxbracketcalculator-module__vMNEEG__header",
  "headerContent": "taxbracketcalculator-module__vMNEEG__headerContent",
  "inputGroup": "taxbracketcalculator-module__vMNEEG__inputGroup",
  "inputLabel": "taxbracketcalculator-module__vMNEEG__inputLabel",
  "inputWrapper": "taxbracketcalculator-module__vMNEEG__inputWrapper",
  "insightsCard": "taxbracketcalculator-module__vMNEEG__insightsCard",
  "insightsList": "taxbracketcalculator-module__vMNEEG__insightsList",
  "insightsTitle": "taxbracketcalculator-module__vMNEEG__insightsTitle",
  "legendColor": "taxbracketcalculator-module__vMNEEG__legendColor",
  "legendItem": "taxbracketcalculator-module__vMNEEG__legendItem",
  "mainContent": "taxbracketcalculator-module__vMNEEG__mainContent",
  "mainTitle": "taxbracketcalculator-module__vMNEEG__mainTitle",
  "numberInput": "taxbracketcalculator-module__vMNEEG__numberInput",
  "percentageSymbol": "taxbracketcalculator-module__vMNEEG__percentageSymbol",
  "primaryButton": "taxbracketcalculator-module__vMNEEG__primaryButton",
  "quoteFooter": "taxbracketcalculator-module__vMNEEG__quoteFooter",
  "resultDescription": "taxbracketcalculator-module__vMNEEG__resultDescription",
  "resultItem": "taxbracketcalculator-module__vMNEEG__resultItem",
  "resultLabel": "taxbracketcalculator-module__vMNEEG__resultLabel",
  "resultValue": "taxbracketcalculator-module__vMNEEG__resultValue",
  "resultsCard": "taxbracketcalculator-module__vMNEEG__resultsCard",
  "resultsGrid": "taxbracketcalculator-module__vMNEEG__resultsGrid",
  "retirementSection": "taxbracketcalculator-module__vMNEEG__retirementSection",
  "secondaryButton": "taxbracketcalculator-module__vMNEEG__secondaryButton",
  "sectionSubtitle": "taxbracketcalculator-module__vMNEEG__sectionSubtitle",
  "sectionTitle": "taxbracketcalculator-module__vMNEEG__sectionTitle",
  "selectInput": "taxbracketcalculator-module__vMNEEG__selectInput",
  "slider": "taxbracketcalculator-module__vMNEEG__slider",
  "strategyCard": "taxbracketcalculator-module__vMNEEG__strategyCard",
  "strategyGrid": "taxbracketcalculator-module__vMNEEG__strategyGrid",
  "subtitle": "taxbracketcalculator-module__vMNEEG__subtitle",
  "summaryArrow": "taxbracketcalculator-module__vMNEEG__summaryArrow",
  "summaryCard": "taxbracketcalculator-module__vMNEEG__summaryCard",
  "summaryItem": "taxbracketcalculator-module__vMNEEG__summaryItem",
  "summaryLabel": "taxbracketcalculator-module__vMNEEG__summaryLabel",
  "summaryNote": "taxbracketcalculator-module__vMNEEG__summaryNote",
  "summaryRow": "taxbracketcalculator-module__vMNEEG__summaryRow",
  "summaryValue": "taxbracketcalculator-module__vMNEEG__summaryValue",
  "tableCell": "taxbracketcalculator-module__vMNEEG__tableCell",
  "tableHeader": "taxbracketcalculator-module__vMNEEG__tableHeader",
  "tableRow": "taxbracketcalculator-module__vMNEEG__tableRow",
  "valueDisplay": "taxbracketcalculator-module__vMNEEG__valueDisplay",
  "yearsSymbol": "taxbracketcalculator-module__vMNEEG__yearsSymbol",
});
}),
"[project]/src/pages/tax-bracket-calculator.jsx [client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/pages/taxbracketcalculator.module.css [client] (css module)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
const TaxBracketCalculator = ({ currentDate, lastModifiedDate })=>{
    _s();
    // 2024 US Federal Tax Brackets (Single, Married Filing Jointly, Head of Household)
    const taxBrackets = {
        'single': [
            {
                min: 0,
                max: 11600,
                rate: 0.10,
                tax: 0
            },
            {
                min: 11601,
                max: 47150,
                rate: 0.12,
                tax: 1160
            },
            {
                min: 47151,
                max: 100525,
                rate: 0.22,
                tax: 5426
            },
            {
                min: 100526,
                max: 191950,
                rate: 0.24,
                tax: 17169
            },
            {
                min: 191951,
                max: 243725,
                rate: 0.32,
                tax: 39101
            },
            {
                min: 243726,
                max: 609350,
                rate: 0.35,
                tax: 55645
            },
            {
                min: 609351,
                max: Infinity,
                rate: 0.37,
                tax: 183647
            }
        ],
        'married': [
            {
                min: 0,
                max: 23200,
                rate: 0.10,
                tax: 0
            },
            {
                min: 23201,
                max: 94300,
                rate: 0.12,
                tax: 2320
            },
            {
                min: 94301,
                max: 201050,
                rate: 0.22,
                tax: 10852
            },
            {
                min: 201051,
                max: 383900,
                rate: 0.24,
                tax: 34338
            },
            {
                min: 383901,
                max: 487450,
                rate: 0.32,
                tax: 78202
            },
            {
                min: 487451,
                max: 731200,
                rate: 0.35,
                tax: 111294
            },
            {
                min: 731201,
                max: Infinity,
                rate: 0.37,
                tax: 196670
            }
        ],
        'headOfHousehold': [
            {
                min: 0,
                max: 16550,
                rate: 0.10,
                tax: 0
            },
            {
                min: 16551,
                max: 63100,
                rate: 0.12,
                tax: 1655
            },
            {
                min: 63101,
                max: 100500,
                rate: 0.22,
                tax: 7247
            },
            {
                min: 100501,
                max: 191950,
                rate: 0.24,
                tax: 15447
            },
            {
                min: 191951,
                max: 243700,
                rate: 0.32,
                tax: 37295
            },
            {
                min: 243701,
                max: 609350,
                rate: 0.35,
                tax: 53739
            },
            {
                min: 609351,
                max: Infinity,
                rate: 0.37,
                tax: 181955
            }
        ]
    };
    const [income, setIncome] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(75000);
    const [filingStatus, setFilingStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('single');
    const [stateTax, setStateTax] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(5.0);
    const [deductions, setDeductions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(13850);
    const [has401k, setHas401k] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [contribution401k, setContribution401k] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(10);
    const [hasHSA, setHasHSA] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [contributionHSA, setContributionHSA] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [hasDependents, setHasDependents] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [numDependents, setNumDependents] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [results, setResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [bracketBreakdown, setBracketBreakdown] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const calculateTaxes = ()=>{
        const brackets = taxBrackets[filingStatus];
        // Calculate pre-tax adjustments
        const preTax401k = has401k ? income * (contribution401k / 100) : 0;
        const preTaxHSA = hasHSA ? contributionHSA : 0;
        const adjustedGrossIncome = income - preTax401k - preTaxHSA;
        const taxableIncome = Math.max(0, adjustedGrossIncome - deductions);
        // Calculate federal tax
        let federalTax = 0;
        let remainingIncome = taxableIncome;
        const breakdown = [];
        for(let i = 0; i < brackets.length && remainingIncome > 0; i++){
            const bracket = brackets[i];
            const bracketRange = bracket.max === Infinity ? remainingIncome : Math.min(remainingIncome, bracket.max - bracket.min);
            const taxableInBracket = Math.max(0, Math.min(bracketRange, remainingIncome));
            if (taxableInBracket > 0) {
                const taxInBracket = taxableInBracket * bracket.rate;
                federalTax += taxInBracket;
                breakdown.push({
                    bracket: i + 1,
                    range: `$${bracket.min.toLocaleString()} - $${bracket.max === Infinity ? '∞' : bracket.max.toLocaleString()}`,
                    rate: bracket.rate * 100,
                    amount: taxableInBracket,
                    tax: taxInBracket,
                    cumulativeTax: federalTax
                });
                remainingIncome -= taxableInBracket;
            }
        }
        // Add previous brackets' taxes
        const lastBracket = brackets.find((b)=>taxableIncome >= b.min && taxableIncome <= b.max);
        if (lastBracket) {
            federalTax += lastBracket.tax;
        }
        // Calculate state tax
        const stateTaxAmount = adjustedGrossIncome * (stateTax / 100);
        // Calculate FICA taxes
        const socialSecurityTax = Math.min(income, 168600) * 0.062;
        const medicareTax = income * 0.0145;
        const ficaTax = socialSecurityTax + medicareTax;
        // Calculate total tax
        const totalTax = federalTax + stateTaxAmount + ficaTax;
        // Calculate effective tax rates
        const federalEffectiveRate = federalTax / income * 100;
        const totalEffectiveRate = totalTax / income * 100;
        const marginalRate = brackets.find((b)=>taxableIncome >= b.min && taxableIncome <= b.max)?.rate * 100 || 0;
        // Calculate take-home pay
        const takeHomePay = income - totalTax - preTax401k - preTaxHSA;
        const monthlyTakeHome = takeHomePay / 12;
        // Calculate tax savings from deductions
        const taxSavingsFrom401k = preTax401k * marginalRate / 100;
        const taxSavingsFromDeductions = deductions * marginalRate / 100;
        setResults({
            taxableIncome: taxableIncome,
            federalTax: federalTax,
            stateTax: stateTaxAmount,
            ficaTax: ficaTax,
            totalTax: totalTax,
            federalEffectiveRate: federalEffectiveRate,
            totalEffectiveRate: totalEffectiveRate,
            marginalRate: marginalRate,
            takeHomePay: takeHomePay,
            monthlyTakeHome: monthlyTakeHome,
            adjustedGrossIncome: adjustedGrossIncome,
            taxSavingsFrom401k: taxSavingsFrom401k,
            taxSavingsFromDeductions: taxSavingsFromDeductions,
            socialSecurityTax: socialSecurityTax,
            medicareTax: medicareTax
        });
        setBracketBreakdown(breakdown);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TaxBracketCalculator.useEffect": ()=>{
            calculateTaxes();
        }
    }["TaxBracketCalculator.useEffect"], [
        income,
        filingStatus,
        stateTax,
        deductions,
        has401k,
        contribution401k,
        hasHSA,
        contributionHSA,
        hasDependents,
        numDependents
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
        return `${value.toFixed(1)}%`;
    };
    const getBracketColor = (rate)=>{
        const colors = [
            '#10b981',
            '#34d399',
            '#fbbf24',
            '#f97316',
            '#ef4444',
            '#dc2626',
            '#991b1b'
        ];
        const index = Math.min(Math.floor(rate / 5), colors.length - 1);
        return colors[index];
    };
    const getTaxEfficiency = (effectiveRate)=>{
        if (effectiveRate < 10) return {
            level: 'Very Efficient',
            color: '#10b981',
            icon: '🏆'
        };
        if (effectiveRate < 15) return {
            level: 'Efficient',
            color: '#34d399',
            icon: '✅'
        };
        if (effectiveRate < 20) return {
            level: 'Average',
            color: '#fbbf24',
            icon: '📊'
        };
        if (effectiveRate < 25) return {
            level: 'High',
            color: '#f97316',
            icon: '⚠️'
        };
        return {
            level: 'Very High',
            color: '#ef4444',
            icon: '🔥'
        };
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                        children: "Advanced Tax Bracket Calculator | 2026 Federal & State Tax Estimation"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                        lineNumber: 173,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "description",
                        content: "Free advanced tax bracket calculator with 401(k), HSA, and deduction optimization. Calculate your marginal tax rate, effective tax rate, and take-home pay."
                    }, void 0, false, {
                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                        lineNumber: 174,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "keywords",
                        content: "tax bracket calculator, tax calculator, income tax calculator, federal tax calculator, marginal tax rate, effective tax rate, take home pay calculator"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                        lineNumber: 175,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "date",
                        content: currentDate
                    }, void 0, false, {
                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                        lineNumber: 176,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "last-modified",
                        content: lastModifiedDate
                    }, void 0, false, {
                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                        lineNumber: 177,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "viewport",
                        content: "width=device-width, initial-scale=1"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                        lineNumber: 178,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                        rel: "canonical",
                        href: "https://www.financecalculatorfree.com/tax-bracket-calculator"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                        lineNumber: 179,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:title",
                        content: "Advanced Tax Bracket Calculator | 2024 Federal & State Tax Estimation"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                        lineNumber: 182,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:description",
                        content: "Calculate your tax bracket, optimize deductions, and maximize take-home pay with our comprehensive tax calculator."
                    }, void 0, false, {
                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                        lineNumber: 183,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:type",
                        content: "website"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                        lineNumber: 184,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:url",
                        content: "https://www.financecalculatorfree.com/tax-bracket-calculator"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                        lineNumber: 185,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "twitter:card",
                        content: "summary_large_image"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                        lineNumber: 188,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "twitter:title",
                        content: "Advanced Tax Bracket Calculator"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                        lineNumber: 189,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "twitter:description",
                        content: "Calculate and optimize your taxes with our comprehensive tax bracket calculator."
                    }, void 0, false, {
                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                        lineNumber: 190,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                lineNumber: 172,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                id: "tax-bracket-calculator-schema",
                type: "application/ld+json",
                dangerouslySetInnerHTML: {
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SoftwareApplication",
                        "name": "Advanced Tax Bracket Calculator",
                        "description": "Professional-grade tax calculator with bracket analysis, deduction optimization, and take-home pay estimation",
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
                            "name": "Financial Tools Pro",
                            "url": "https://www.financecalculatorfree.com"
                        },
                        "featureList": [
                            "2024 Tax Bracket Analysis",
                            "State Tax Calculation",
                            "401(k) & HSA Optimization",
                            "Deduction Analysis",
                            "Take-Home Pay Estimation"
                        ]
                    })
                }
            }, void 0, false, {
                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                lineNumber: 194,
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
                                "name": "What's the difference between marginal and effective tax rates?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Your marginal tax rate is the rate at which your last dollar of income is taxed, determined by your highest tax bracket. Your effective tax rate is the average rate you pay on all your taxable income (total tax ÷ total income). Marginal rate affects additional income decisions, while effective rate shows your overall tax burden.",
                                    "datePublished": currentDate
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "How do pre-tax deductions like 401(k) reduce my taxes?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Pre-tax deductions reduce your taxable income dollar-for-dollar. If you contribute $1,000 to a 401(k) and your marginal tax rate is 24%, you save $240 in federal taxes. This means your $1,000 contribution only 'costs' you $760 in take-home pay.",
                                    "datePublished": currentDate
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "What's the standard deduction for 2024?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "For 2024, the standard deduction is $14,600 for single filers and $29,200 for married couples filing jointly. The standard deduction reduces your taxable income without needing to itemize expenses.",
                                    "datePublished": currentDate
                                }
                            }
                        ]
                    })
                }
            }, void 0, false, {
                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                lineNumber: 236,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].container,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].header,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].headerContent,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].mainTitle,
                                    children: "Advanced Tax Bracket Calculator"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                    lineNumber: 280,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].subtitle,
                                    children: "Calculate Your 2026 Tax Burden & Maximize Take-Home Pay"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                    lineNumber: 281,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].badgeContainer,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].badge,
                                            children: [
                                                "Updated: ",
                                                currentDate
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                            lineNumber: 283,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].badge,
                                            children: " Tax Brackets"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                            lineNumber: 284,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].badge,
                                            children: "IRS-Compliant"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                            lineNumber: 285,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                    lineNumber: 282,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                            lineNumber: 279,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                        lineNumber: 278,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].mainContent,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].calculatorLayout,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].calculatorCard,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].sectionTitle,
                                                children: "Enter Your Tax Information"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                lineNumber: 294,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputGroup,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputLabel,
                                                    children: [
                                                        "Annual Income",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputWrapper,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].currencySymbol,
                                                                    children: "$"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                    lineNumber: 300,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "range",
                                                                    min: "10000",
                                                                    max: "1000000",
                                                                    step: "1000",
                                                                    value: income,
                                                                    onChange: (e)=>setIncome(parseInt(e.target.value)),
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].slider
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                    lineNumber: 301,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    min: "10000",
                                                                    max: "1000000",
                                                                    step: "1000",
                                                                    value: income,
                                                                    onChange: (e)=>setIncome(parseInt(e.target.value) || 0),
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].numberInput
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                    lineNumber: 310,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                            lineNumber: 299,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].valueDisplay,
                                                            children: [
                                                                formatCurrency(income),
                                                                "/year"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                            lineNumber: 320,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                    lineNumber: 297,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                lineNumber: 296,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputGroup,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputLabel,
                                                    children: [
                                                        "Filing Status",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].filingOptions,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].filingButton} ${filingStatus === 'single' ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].filingButtonActive : ''}`,
                                                                    onClick: ()=>setFilingStatus('single'),
                                                                    children: "Single"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                    lineNumber: 328,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].filingButton} ${filingStatus === 'married' ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].filingButtonActive : ''}`,
                                                                    onClick: ()=>setFilingStatus('married'),
                                                                    children: "Married"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                    lineNumber: 334,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].filingButton} ${filingStatus === 'headOfHousehold' ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].filingButtonActive : ''}`,
                                                                    onClick: ()=>setFilingStatus('headOfHousehold'),
                                                                    children: "Head of Household"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                    lineNumber: 340,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                            lineNumber: 327,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                    lineNumber: 325,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                lineNumber: 324,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputGroup,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputLabel,
                                                    children: [
                                                        "State Tax Rate",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputWrapper,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "range",
                                                                    min: "0",
                                                                    max: "13",
                                                                    step: "0.1",
                                                                    value: stateTax,
                                                                    onChange: (e)=>setStateTax(parseFloat(e.target.value)),
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].slider
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                    lineNumber: 354,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    min: "0",
                                                                    max: "13",
                                                                    step: "0.1",
                                                                    value: stateTax,
                                                                    onChange: (e)=>setStateTax(parseFloat(e.target.value) || 0),
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].numberInput
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                    lineNumber: 363,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].percentageSymbol,
                                                                    children: "%"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                    lineNumber: 372,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                            lineNumber: 353,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].valueDisplay,
                                                            children: formatPercentage(stateTax)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                            lineNumber: 374,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                    lineNumber: 351,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                lineNumber: 350,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputGroup,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputLabel,
                                                        children: [
                                                            "Deductions",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputWrapper,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].currencySymbol,
                                                                        children: "$"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                        lineNumber: 382,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "range",
                                                                        min: "0",
                                                                        max: "50000",
                                                                        step: "100",
                                                                        value: deductions,
                                                                        onChange: (e)=>setDeductions(parseInt(e.target.value)),
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].slider
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                        lineNumber: 383,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        min: "0",
                                                                        max: "50000",
                                                                        step: "100",
                                                                        value: deductions,
                                                                        onChange: (e)=>setDeductions(parseInt(e.target.value) || 0),
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].numberInput
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                        lineNumber: 392,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                lineNumber: 381,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].valueDisplay,
                                                                children: formatCurrency(deductions)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                lineNumber: 402,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                        lineNumber: 379,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].deductionNote,
                                                        children: [
                                                            "Standard deduction: ",
                                                            filingStatus === 'single' ? '$14,600' : filingStatus === 'married' ? '$29,200' : '$21,900'
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                        lineNumber: 404,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                lineNumber: 378,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].retirementSection,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].sectionSubtitle,
                                                        children: "Retirement & Health Savings"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                        lineNumber: 410,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].checkboxGroup,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].checkboxLabel,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "checkbox",
                                                                        checked: has401k,
                                                                        onChange: (e)=>setHas401k(e.target.checked),
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].checkboxInput
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                        lineNumber: 414,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].checkboxText,
                                                                        children: "401(k) Contribution"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                        lineNumber: 420,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                lineNumber: 413,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            has401k && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].contributionInput,
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputLabel,
                                                                    children: [
                                                                        "Contribution Rate",
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputWrapper,
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                    type: "range",
                                                                                    min: "1",
                                                                                    max: "50",
                                                                                    step: "1",
                                                                                    value: contribution401k,
                                                                                    onChange: (e)=>setContribution401k(parseInt(e.target.value)),
                                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].slider
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                    lineNumber: 428,
                                                                                    columnNumber: 27
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                    type: "number",
                                                                                    min: "1",
                                                                                    max: "50",
                                                                                    step: "1",
                                                                                    value: contribution401k,
                                                                                    onChange: (e)=>setContribution401k(parseInt(e.target.value) || 0),
                                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].numberInput
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                    lineNumber: 437,
                                                                                    columnNumber: 27
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].percentageSymbol,
                                                                                    children: "%"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                    lineNumber: 446,
                                                                                    columnNumber: 27
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                            lineNumber: 427,
                                                                            columnNumber: 25
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].valueDisplay,
                                                                            children: formatPercentage(contribution401k)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                            lineNumber: 448,
                                                                            columnNumber: 25
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                    lineNumber: 425,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                lineNumber: 424,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                        lineNumber: 412,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].checkboxGroup,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].checkboxLabel,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "checkbox",
                                                                        checked: hasHSA,
                                                                        onChange: (e)=>setHasHSA(e.target.checked),
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].checkboxInput
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                        lineNumber: 456,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].checkboxText,
                                                                        children: "HSA Contribution"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                        lineNumber: 462,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                lineNumber: 455,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            hasHSA && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].contributionInput,
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputLabel,
                                                                    children: [
                                                                        "Annual Contribution",
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputWrapper,
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].currencySymbol,
                                                                                    children: "$"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                    lineNumber: 470,
                                                                                    columnNumber: 27
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                    type: "range",
                                                                                    min: "100",
                                                                                    max: "8300",
                                                                                    step: "100",
                                                                                    value: contributionHSA,
                                                                                    onChange: (e)=>setContributionHSA(parseInt(e.target.value)),
                                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].slider
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                    lineNumber: 471,
                                                                                    columnNumber: 27
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                    type: "number",
                                                                                    min: "100",
                                                                                    max: "8300",
                                                                                    step: "100",
                                                                                    value: contributionHSA,
                                                                                    onChange: (e)=>setContributionHSA(parseInt(e.target.value) || 0),
                                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].numberInput
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                    lineNumber: 480,
                                                                                    columnNumber: 27
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                            lineNumber: 469,
                                                                            columnNumber: 25
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].valueDisplay,
                                                                            children: [
                                                                                formatCurrency(contributionHSA),
                                                                                "/year"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                            lineNumber: 490,
                                                                            columnNumber: 25
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                    lineNumber: 467,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                lineNumber: 466,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                        lineNumber: 454,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                lineNumber: 409,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].dependentSection,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].sectionSubtitle,
                                                        children: "Dependents"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                        lineNumber: 498,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].checkboxGroup,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].checkboxLabel,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "checkbox",
                                                                        checked: hasDependents,
                                                                        onChange: (e)=>setHasDependents(e.target.checked),
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].checkboxInput
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                        lineNumber: 501,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].checkboxText,
                                                                        children: "I have dependents"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                        lineNumber: 507,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                lineNumber: 500,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            hasDependents && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].dependentInput,
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputLabel,
                                                                    children: [
                                                                        "Number of Dependents",
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputWrapper,
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                    type: "range",
                                                                                    min: "1",
                                                                                    max: "10",
                                                                                    step: "1",
                                                                                    value: numDependents,
                                                                                    onChange: (e)=>setNumDependents(parseInt(e.target.value)),
                                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].slider
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                    lineNumber: 515,
                                                                                    columnNumber: 27
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                    type: "number",
                                                                                    min: "1",
                                                                                    max: "10",
                                                                                    step: "1",
                                                                                    value: numDependents,
                                                                                    onChange: (e)=>setNumDependents(parseInt(e.target.value) || 0),
                                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].numberInput
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                    lineNumber: 524,
                                                                                    columnNumber: 27
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                            lineNumber: 514,
                                                                            columnNumber: 25
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].valueDisplay,
                                                                            children: [
                                                                                numDependents,
                                                                                " dependent",
                                                                                numDependents !== 1 ? 's' : ''
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                            lineNumber: 534,
                                                                            columnNumber: 25
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                    lineNumber: 512,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                lineNumber: 511,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                        lineNumber: 499,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                lineNumber: 497,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                        lineNumber: 293,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultsCard,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].sectionTitle,
                                                children: "Tax Analysis Results"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                lineNumber: 544,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            results && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].summaryCard,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].summaryRow,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].summaryItem,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].summaryLabel,
                                                                                children: "Gross Income"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                lineNumber: 551,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].summaryValue,
                                                                                children: formatCurrency(income)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                lineNumber: 552,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                        lineNumber: 550,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].summaryArrow,
                                                                        children: "→"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                        lineNumber: 554,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].summaryItem,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].summaryLabel,
                                                                                children: "Take-Home Pay"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                lineNumber: 556,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].summaryValue,
                                                                                children: formatCurrency(results.takeHomePay)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                lineNumber: 557,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                        lineNumber: 555,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                lineNumber: 549,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].summaryNote,
                                                                children: [
                                                                    "Monthly take-home: ",
                                                                    formatCurrency(results.monthlyTakeHome)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                lineNumber: 560,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                        lineNumber: 548,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultsGrid,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultItem,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultLabel,
                                                                        children: "Total Taxes"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                        lineNumber: 567,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultValue,
                                                                        children: formatCurrency(results.totalTax)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                        lineNumber: 568,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultDescription,
                                                                        children: [
                                                                            formatPercentage(results.totalEffectiveRate),
                                                                            " effective rate"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                        lineNumber: 569,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                lineNumber: 566,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultItem,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultLabel,
                                                                        children: "Marginal Tax Rate"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                        lineNumber: 575,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultValue,
                                                                        children: formatPercentage(results.marginalRate)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                        lineNumber: 576,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultDescription,
                                                                        children: "Rate on next dollar earned"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                        lineNumber: 577,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                lineNumber: 574,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultItem,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultLabel,
                                                                        children: "Federal Tax"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                        lineNumber: 583,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultValue,
                                                                        children: formatCurrency(results.federalTax)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                        lineNumber: 584,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultDescription,
                                                                        children: [
                                                                            formatPercentage(results.federalEffectiveRate),
                                                                            " effective rate"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                        lineNumber: 585,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                lineNumber: 582,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultItem,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultLabel,
                                                                        children: "Taxable Income"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                        lineNumber: 591,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultValue,
                                                                        children: formatCurrency(results.taxableIncome)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                        lineNumber: 592,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultDescription,
                                                                        children: "After deductions & pre-tax contributions"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                        lineNumber: 593,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                lineNumber: 590,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                        lineNumber: 565,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].efficiencyCard,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].efficiencyTitle,
                                                                children: "Tax Efficiency Assessment"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                lineNumber: 601,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            (()=>{
                                                                const efficiency = getTaxEfficiency(results.totalEffectiveRate);
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].efficiencyLevel,
                                                                            style: {
                                                                                backgroundColor: efficiency.color
                                                                            },
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].efficiencyIcon,
                                                                                    children: efficiency.icon
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                    lineNumber: 607,
                                                                                    columnNumber: 29
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].efficiencyText,
                                                                                    children: efficiency.level
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                    lineNumber: 608,
                                                                                    columnNumber: 29
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                            lineNumber: 606,
                                                                            columnNumber: 27
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].efficiencyDescription,
                                                                            children: [
                                                                                "Your total effective tax rate of ",
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                    children: formatPercentage(results.totalEffectiveRate)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                    lineNumber: 611,
                                                                                    columnNumber: 62
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                " is ",
                                                                                efficiency.level === 'Very Efficient' ? 'excellent' : efficiency.level === 'Efficient' ? 'good' : efficiency.level === 'Average' ? 'average' : efficiency.level === 'High' ? 'above average' : 'high',
                                                                                " for your income level and filing status."
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                            lineNumber: 610,
                                                                            columnNumber: 27
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true);
                                                            })()
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                        lineNumber: 600,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartContainer,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartTitle,
                                                                children: "Tax Distribution"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                lineNumber: 625,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartBars,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartBarGroup,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartBarLabel,
                                                                                children: "Federal Tax"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                lineNumber: 628,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartBarContainer,
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartBar,
                                                                                    style: {
                                                                                        width: `${results.federalTax / results.totalTax * 100}%`,
                                                                                        backgroundColor: '#ef4444'
                                                                                    },
                                                                                    title: `Federal Tax: ${formatCurrency(results.federalTax)} (${(results.federalTax / results.totalTax * 100).toFixed(1)}%)`
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                    lineNumber: 630,
                                                                                    columnNumber: 27
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                lineNumber: 629,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartBarValue,
                                                                                children: formatCurrency(results.federalTax)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                lineNumber: 639,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                        lineNumber: 627,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartBarGroup,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartBarLabel,
                                                                                children: "State Tax"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                lineNumber: 643,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartBarContainer,
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartBar,
                                                                                    style: {
                                                                                        width: `${results.stateTax / results.totalTax * 100}%`,
                                                                                        backgroundColor: '#f97316'
                                                                                    },
                                                                                    title: `State Tax: ${formatCurrency(results.stateTax)} (${(results.stateTax / results.totalTax * 100).toFixed(1)}%)`
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                    lineNumber: 645,
                                                                                    columnNumber: 27
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                lineNumber: 644,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartBarValue,
                                                                                children: formatCurrency(results.stateTax)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                lineNumber: 654,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                        lineNumber: 642,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartBarGroup,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartBarLabel,
                                                                                children: "FICA (Social Security & Medicare)"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                lineNumber: 658,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartBarContainer,
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartBar,
                                                                                    style: {
                                                                                        width: `${results.ficaTax / results.totalTax * 100}%`,
                                                                                        backgroundColor: '#fbbf24'
                                                                                    },
                                                                                    title: `FICA Tax: ${formatCurrency(results.ficaTax)} (${(results.ficaTax / results.totalTax * 100).toFixed(1)}%)`
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                    lineNumber: 660,
                                                                                    columnNumber: 27
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                lineNumber: 659,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartBarValue,
                                                                                children: formatCurrency(results.ficaTax)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                lineNumber: 669,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                        lineNumber: 657,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                lineNumber: 626,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].chartLegend,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].legendItem,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].legendColor,
                                                                                style: {
                                                                                    backgroundColor: '#ef4444'
                                                                                }
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                lineNumber: 674,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                children: [
                                                                                    "Federal Tax (",
                                                                                    (results.federalTax / results.totalTax * 100).toFixed(1),
                                                                                    "%)"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                lineNumber: 675,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                        lineNumber: 673,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].legendItem,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].legendColor,
                                                                                style: {
                                                                                    backgroundColor: '#f97316'
                                                                                }
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                lineNumber: 678,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                children: [
                                                                                    "State Tax (",
                                                                                    (results.stateTax / results.totalTax * 100).toFixed(1),
                                                                                    "%)"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                lineNumber: 679,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                        lineNumber: 677,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].legendItem,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].legendColor,
                                                                                style: {
                                                                                    backgroundColor: '#fbbf24'
                                                                                }
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                lineNumber: 682,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                children: [
                                                                                    "FICA (",
                                                                                    (results.ficaTax / results.totalTax * 100).toFixed(1),
                                                                                    "%)"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                lineNumber: 683,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                        lineNumber: 681,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                lineNumber: 672,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                        lineNumber: 624,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bracketCard,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bracketTitle,
                                                                children: "Federal Tax Bracket Breakdown"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                lineNumber: 690,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bracketTable,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableHeader,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableCell,
                                                                                children: "Bracket"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                lineNumber: 693,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableCell,
                                                                                children: "Income Range"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                lineNumber: 694,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableCell,
                                                                                children: "Tax Rate"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                lineNumber: 695,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableCell,
                                                                                children: "Tax Amount"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                lineNumber: 696,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableCell,
                                                                                children: "Cumulative Tax"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                lineNumber: 697,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                        lineNumber: 692,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    bracketBreakdown.map((bracket, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableRow,
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableCell,
                                                                                    children: bracket.bracket
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                    lineNumber: 701,
                                                                                    columnNumber: 27
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableCell,
                                                                                    children: bracket.range
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                    lineNumber: 702,
                                                                                    columnNumber: 27
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableCell,
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].bracketRate,
                                                                                        style: {
                                                                                            backgroundColor: getBracketColor(bracket.rate)
                                                                                        },
                                                                                        children: [
                                                                                            bracket.rate,
                                                                                            "%"
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                        lineNumber: 704,
                                                                                        columnNumber: 29
                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                    lineNumber: 703,
                                                                                    columnNumber: 27
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableCell,
                                                                                    children: formatCurrency(bracket.tax)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                    lineNumber: 708,
                                                                                    columnNumber: 27
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableCell,
                                                                                    children: formatCurrency(bracket.cumulativeTax)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                    lineNumber: 709,
                                                                                    columnNumber: 27
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            ]
                                                                        }, index, true, {
                                                                            fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                            lineNumber: 700,
                                                                            columnNumber: 25
                                                                        }, ("TURBOPACK compile-time value", void 0)))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                lineNumber: 691,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                        lineNumber: 689,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].insightsCard,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].insightsTitle,
                                                                children: "💡 Tax Optimization Insights"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                lineNumber: 717,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].insightsList,
                                                                children: [
                                                                    has401k && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                        children: [
                                                                            "Your 401(k) contribution saves you ",
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                children: formatCurrency(results.taxSavingsFrom401k)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                lineNumber: 720,
                                                                                columnNumber: 64
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            " in taxes this year"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                        lineNumber: 720,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                        children: [
                                                                            "The standard deduction reduces your taxable income by ",
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                children: formatCurrency(deductions)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                lineNumber: 722,
                                                                                columnNumber: 81
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            ", saving you approximately ",
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                children: formatCurrency(results.taxSavingsFromDeductions)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                lineNumber: 722,
                                                                                columnNumber: 153
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            " in taxes"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                        lineNumber: 722,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                        children: [
                                                                            "Your marginal tax rate of ",
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                children: formatPercentage(results.marginalRate)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                lineNumber: 723,
                                                                                columnNumber: 53
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            " means every additional $1,000 earned will be taxed at this rate"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                        lineNumber: 723,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    hasDependents && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                        children: [
                                                                            "Each dependent could qualify for a ",
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                children: "$2,000"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                lineNumber: 725,
                                                                                columnNumber: 64
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            " Child Tax Credit, potentially reducing your tax bill by ",
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                children: formatCurrency(numDependents * 2000)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                lineNumber: 725,
                                                                                columnNumber: 144
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                        lineNumber: 725,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                lineNumber: 718,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                        lineNumber: 716,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                        lineNumber: 543,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                lineNumber: 291,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].educationalContent,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleCard,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleTitle,
                                                children: "Understanding Tax Brackets: How Progressive Taxation Works"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                lineNumber: 737,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSection,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSubtitle,
                                                        children: 'The Myth of "Moving Into a Higher Tax Bracket"'
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                        lineNumber: 740,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: "One of the most common misconceptions about progressive taxation is that earning more money can push you into a higher tax bracket where ALL your income is taxed at the higher rate. This is completely false. In reality, only the income within each bracket is taxed at that bracket's rate."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                        lineNumber: 741,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].exampleCard,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                children: "Real-World Example: How Tax Brackets Actually Work"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                lineNumber: 744,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                children: "For a single filer in 2024:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                lineNumber: 745,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                children: "First $11,600:"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                lineNumber: 747,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            " Taxed at 10% = $1,160"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                        lineNumber: 747,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                children: "Next $35,550 ($11,601-$47,150):"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                lineNumber: 748,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            " Taxed at 12% = $4,266"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                        lineNumber: 748,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                children: "Next $53,375 ($47,151-$100,525):"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                lineNumber: 749,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            " Taxed at 22% = $11,743"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                        lineNumber: 749,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                children: "Total tax on $100,525:"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                                lineNumber: 750,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            " $17,169 (17.1% effective rate)"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                        lineNumber: 750,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                lineNumber: 746,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                children: "Notice: Earning $100,525 doesn't mean paying 22% on all income—only the amount above $47,150 is taxed at 22%."
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                lineNumber: 752,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                        lineNumber: 743,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                lineNumber: 739,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSection,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSubtitle,
                                                        children: "Strategies to Reduce Your Tax Burden"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                        lineNumber: 757,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].strategyGrid,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].strategyCard,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        children: "💰 Maximize Pre-Tax Contributions"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                        lineNumber: 761,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        children: "401(k), Traditional IRA, and HSA contributions reduce your taxable income dollar-for-dollar. A $1,000 contribution at a 24% marginal rate saves you $240 in taxes immediately."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                        lineNumber: 762,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                lineNumber: 760,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].strategyCard,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        children: "📊 Optimize Deductions"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                        lineNumber: 766,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        children: "Compare itemized deductions (mortgage interest, charitable contributions) with the standard deduction. Bundle charitable contributions in high-income years for maximum benefit."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                        lineNumber: 767,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                lineNumber: 765,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].strategyCard,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        children: "📈 Tax-Loss Harvesting"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                        lineNumber: 771,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        children: "Sell investments at a loss to offset capital gains. You can deduct up to $3,000 in net capital losses against ordinary income each year."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                        lineNumber: 772,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                lineNumber: 770,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].strategyCard,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        children: "🎓 Education Credits"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                        lineNumber: 776,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        children: "American Opportunity Tax Credit (AOTC) offers up to $2,500 per student for the first four years of college. Lifetime Learning Credit provides up to $2,000 per tax return."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                        lineNumber: 777,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                lineNumber: 775,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                        lineNumber: 759,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                lineNumber: 756,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSection,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSubtitle,
                                                        children: "Common Tax Planning Mistakes to Avoid"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                        lineNumber: 783,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].applicationsList,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: "Leaving 401(k) Match on the Table:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                        lineNumber: 785,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    " Not contributing enough to get your full employer match is like turning down free money"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                lineNumber: 785,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: "Ignarding Tax-Advantaged Accounts:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                        lineNumber: 786,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    " Failing to utilize HSAs, 529 plans, or IRAs can cost thousands in unnecessary taxes"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                lineNumber: 786,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: "Poor Timing of Income:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                        lineNumber: 787,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    " Bunching income into a single year can push you into higher tax brackets unnecessarily"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                lineNumber: 787,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: "Missing Deductions:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                        lineNumber: 788,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    " Home office expenses, student loan interest, and medical expenses are commonly overlooked"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                lineNumber: 788,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: "Not Planning for Estimated Taxes:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                        lineNumber: 789,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    " Self-employed individuals must make quarterly estimated tax payments to avoid penalties"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                lineNumber: 789,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                        lineNumber: 784,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                lineNumber: 782,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSection,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSubtitle,
                                                        children: "Expert Tips from Tax Professionals"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                        lineNumber: 794,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("blockquote", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].expertQuote,
                                                        children: [
                                                            '"The most important concept in tax planning is understanding your marginal tax rate. This determines the tax impact of every financial decision you make—from retirement contributions to investment choices to business deductions. Work backward from April 15th: plan your tax strategy at the beginning of the year, not at the end when it\'s too late to make meaningful changes."',
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].quoteFooter,
                                                                children: "— CPA & Tax Strategist, 20+ years experience"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                                lineNumber: 797,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                        lineNumber: 795,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                lineNumber: 793,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                        lineNumber: 736,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqCard,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqTitle,
                                                children: "Frequently Asked Questions"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                lineNumber: 804,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqItem,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqQuestion,
                                                        children: "Will a raise push me into a higher tax bracket and reduce my take-home pay?"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                        lineNumber: 807,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqAnswer,
                                                        children: "No, this is a common myth. Only the additional income above the bracket threshold is taxed at the higher rate. Your take-home pay will always increase with a raise, though the increase may be slightly less than expected due to the higher marginal rate on the additional income."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                        lineNumber: 808,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                lineNumber: 806,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqItem,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqQuestion,
                                                        children: "What's the difference between tax credits and tax deductions?"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                        lineNumber: 812,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqAnswer,
                                                        children: "Tax deductions reduce your taxable income, while tax credits directly reduce your tax bill dollar-for-dollar. A $1,000 deduction saves you $1,000 × (your marginal tax rate). A $1,000 credit saves you exactly $1,000 in taxes, regardless of your tax bracket."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                        lineNumber: 813,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                lineNumber: 811,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqItem,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqQuestion,
                                                        children: "How do I know if I should itemize or take the standard deduction?"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                        lineNumber: 817,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqAnswer,
                                                        children: "Compare your potential itemized deductions (mortgage interest, state/local taxes up to $10,000, charitable contributions, medical expenses over 7.5% of AGI) with the standard deduction. For 2024, the standard deduction is $14,600 for single filers and $29,200 for married couples. Most taxpayers take the standard deduction."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                        lineNumber: 818,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                lineNumber: 816,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqItem,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqQuestion,
                                                        children: "What happens if I contribute too much to my 401(k) or IRA?"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                        lineNumber: 822,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqAnswer,
                                                        children: "Excess contributions to retirement accounts are subject to a 6% excise tax each year until corrected. For 2024, the 401(k) contribution limit is $23,000 ($30,500 if 50 or older). IRA limits are $7,000 ($8,000 if 50 or older). Always monitor your contributions to avoid penalties."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                        lineNumber: 823,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                lineNumber: 821,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                        lineNumber: 803,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                lineNumber: 735,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].actionSection,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ctaCard,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ctaTitle,
                                            children: "Take Control of Your Tax Strategy"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                            lineNumber: 831,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ctaText,
                                            children: "Use our advanced tax calculator to optimize your finances, maximize deductions, and plan for a more tax-efficient future."
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                            lineNumber: 832,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].buttonGroup,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].primaryButton,
                                                    onClick: ()=>window.print(),
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "📄 Print Tax Analysis"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                        lineNumber: 836,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                    lineNumber: 835,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].secondaryButton,
                                                    onClick: ()=>{
                                                        const data = {
                                                            income: income,
                                                            filingStatus: filingStatus,
                                                            results: results,
                                                            timestamp: new Date().toISOString()
                                                        };
                                                        const text = `Tax Analysis: ${formatCurrency(income)} income → ${formatCurrency(results.takeHomePay)} take-home (${formatPercentage(results.totalEffectiveRate)} effective tax rate)`;
                                                        navigator.clipboard.writeText(text);
                                                        alert('Tax analysis copied to clipboard!');
                                                    },
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "📋 Copy Results"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                        lineNumber: 849,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                    lineNumber: 838,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                            lineNumber: 834,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$taxbracketcalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].disclaimer,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Disclaimer:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                                    lineNumber: 854,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " This calculator provides estimates for educational purposes based on 2024 IRS tax brackets and standard deductions. Actual tax liability may vary based on specific circumstances, additional credits, alternative minimum tax, and other factors not included in this calculation. This is not tax advice. Consult with a qualified tax professional for personalized tax planning and preparation."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                            lineNumber: 853,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                    lineNumber: 830,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                                lineNumber: 829,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                        lineNumber: 290,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/tax-bracket-calculator.jsx",
                lineNumber: 276,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true);
};
_s(TaxBracketCalculator, "KBSQSj9MCWYCPaGjcyy3FDxk0Fc=");
_c = TaxBracketCalculator;
var __N_SSG = true;
const __TURBOPACK__default__export__ = TaxBracketCalculator;
var _c;
__turbopack_context__.k.register(_c, "TaxBracketCalculator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/tax-bracket-calculator.jsx [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/tax-bracket-calculator";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/src/pages/tax-bracket-calculator.jsx [client] (ecmascript)");
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
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/src/pages/tax-bracket-calculator\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/tax-bracket-calculator.jsx [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__fc133f69._.js.map