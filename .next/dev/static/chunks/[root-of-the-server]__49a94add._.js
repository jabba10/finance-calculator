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
"[project]/src/pages/simplecalculator.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "actionSection": "simplecalculator-module__EenrHa__actionSection",
  "activeMode": "simplecalculator-module__EenrHa__activeMode",
  "applicationsList": "simplecalculator-module__EenrHa__applicationsList",
  "articleCard": "simplecalculator-module__EenrHa__articleCard",
  "articleSection": "simplecalculator-module__EenrHa__articleSection",
  "articleSubtitle": "simplecalculator-module__EenrHa__articleSubtitle",
  "articleTitle": "simplecalculator-module__EenrHa__articleTitle",
  "badge": "simplecalculator-module__EenrHa__badge",
  "badgeContainer": "simplecalculator-module__EenrHa__badgeContainer",
  "calcButton": "simplecalculator-module__EenrHa__calcButton",
  "calculationDetails": "simplecalculator-module__EenrHa__calculationDetails",
  "calculatorCard": "simplecalculator-module__EenrHa__calculatorCard",
  "calculatorDisplay": "simplecalculator-module__EenrHa__calculatorDisplay",
  "calculatorHeader": "simplecalculator-module__EenrHa__calculatorHeader",
  "calculatorKeypad": "simplecalculator-module__EenrHa__calculatorKeypad",
  "calculatorLayout": "simplecalculator-module__EenrHa__calculatorLayout",
  "clearButton": "simplecalculator-module__EenrHa__clearButton",
  "clearHistoryButton": "simplecalculator-module__EenrHa__clearHistoryButton",
  "container": "simplecalculator-module__EenrHa__container",
  "ctaCard": "simplecalculator-module__EenrHa__ctaCard",
  "ctaText": "simplecalculator-module__EenrHa__ctaText",
  "ctaTitle": "simplecalculator-module__EenrHa__ctaTitle",
  "currentCalculation": "simplecalculator-module__EenrHa__currentCalculation",
  "currentTitle": "simplecalculator-module__EenrHa__currentTitle",
  "detailLabel": "simplecalculator-module__EenrHa__detailLabel",
  "detailRow": "simplecalculator-module__EenrHa__detailRow",
  "detailValue": "simplecalculator-module__EenrHa__detailValue",
  "disclaimer": "simplecalculator-module__EenrHa__disclaimer",
  "displayContainer": "simplecalculator-module__EenrHa__displayContainer",
  "educationalContent": "simplecalculator-module__EenrHa__educationalContent",
  "emptyHistory": "simplecalculator-module__EenrHa__emptyHistory",
  "emptyIcon": "simplecalculator-module__EenrHa__emptyIcon",
  "emptyText": "simplecalculator-module__EenrHa__emptyText",
  "emptyTitle": "simplecalculator-module__EenrHa__emptyTitle",
  "equalsButton": "simplecalculator-module__EenrHa__equalsButton",
  "exampleCard": "simplecalculator-module__EenrHa__exampleCard",
  "expertQuote": "simplecalculator-module__EenrHa__expertQuote",
  "faqAnswer": "simplecalculator-module__EenrHa__faqAnswer",
  "faqCard": "simplecalculator-module__EenrHa__faqCard",
  "faqItem": "simplecalculator-module__EenrHa__faqItem",
  "faqQuestion": "simplecalculator-module__EenrHa__faqQuestion",
  "faqTitle": "simplecalculator-module__EenrHa__faqTitle",
  "featureGrid": "simplecalculator-module__EenrHa__featureGrid",
  "featureIcon": "simplecalculator-module__EenrHa__featureIcon",
  "featureItem": "simplecalculator-module__EenrHa__featureItem",
  "featureText": "simplecalculator-module__EenrHa__featureText",
  "featureTitle": "simplecalculator-module__EenrHa__featureTitle",
  "footer": "simplecalculator-module__EenrHa__footer",
  "footerContent": "simplecalculator-module__EenrHa__footerContent",
  "footerNote": "simplecalculator-module__EenrHa__footerNote",
  "footerText": "simplecalculator-module__EenrHa__footerText",
  "functionButton": "simplecalculator-module__EenrHa__functionButton",
  "header": "simplecalculator-module__EenrHa__header",
  "headerContent": "simplecalculator-module__EenrHa__headerContent",
  "historyCalculation": "simplecalculator-module__EenrHa__historyCalculation",
  "historyContainer": "simplecalculator-module__EenrHa__historyContainer",
  "historyItem": "simplecalculator-module__EenrHa__historyItem",
  "historyList": "simplecalculator-module__EenrHa__historyList",
  "historyResult": "simplecalculator-module__EenrHa__historyResult",
  "keypadRow": "simplecalculator-module__EenrHa__keypadRow",
  "mainContent": "simplecalculator-module__EenrHa__mainContent",
  "mainDisplay": "simplecalculator-module__EenrHa__mainDisplay",
  "mainTitle": "simplecalculator-module__EenrHa__mainTitle",
  "memoryButton": "simplecalculator-module__EenrHa__memoryButton",
  "memoryIndicator": "simplecalculator-module__EenrHa__memoryIndicator",
  "memoryRow": "simplecalculator-module__EenrHa__memoryRow",
  "modeButton": "simplecalculator-module__EenrHa__modeButton",
  "modeToggle": "simplecalculator-module__EenrHa__modeToggle",
  "operationDisplay": "simplecalculator-module__EenrHa__operationDisplay",
  "operationsTable": "simplecalculator-module__EenrHa__operationsTable",
  "operatorButton": "simplecalculator-module__EenrHa__operatorButton",
  "quoteFooter": "simplecalculator-module__EenrHa__quoteFooter",
  "resultsCard": "simplecalculator-module__EenrHa__resultsCard",
  "resultsHeader": "simplecalculator-module__EenrHa__resultsHeader",
  "scientificButton": "simplecalculator-module__EenrHa__scientificButton",
  "scientificRow": "simplecalculator-module__EenrHa__scientificRow",
  "sectionTitle": "simplecalculator-module__EenrHa__sectionTitle",
  "shortcutItem": "simplecalculator-module__EenrHa__shortcutItem",
  "shortcutKey": "simplecalculator-module__EenrHa__shortcutKey",
  "shortcutLabel": "simplecalculator-module__EenrHa__shortcutLabel",
  "shortcutsCard": "simplecalculator-module__EenrHa__shortcutsCard",
  "shortcutsGrid": "simplecalculator-module__EenrHa__shortcutsGrid",
  "shortcutsTitle": "simplecalculator-module__EenrHa__shortcutsTitle",
  "strategyCard": "simplecalculator-module__EenrHa__strategyCard",
  "strategyGrid": "simplecalculator-module__EenrHa__strategyGrid",
  "subtitle": "simplecalculator-module__EenrHa__subtitle",
  "tableCell": "simplecalculator-module__EenrHa__tableCell",
  "tableRow": "simplecalculator-module__EenrHa__tableRow",
  "tipsCard": "simplecalculator-module__EenrHa__tipsCard",
  "tipsList": "simplecalculator-module__EenrHa__tipsList",
  "tipsTitle": "simplecalculator-module__EenrHa__tipsTitle",
});
}),
"[project]/src/pages/simple-calculator.jsx [client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/pages/simplecalculator.module.css [client] (css module)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
const SimpleCalculator = ({ currentDate, lastModifiedDate })=>{
    _s();
    const [display, setDisplay] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('0');
    const [previousValue, setPreviousValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [operator, setOperator] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [waitingForNewValue, setWaitingForNewValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [memory, setMemory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [history, setHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isScientificMode, setIsScientificMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Handle number input
    const inputNumber = (num)=>{
        if (waitingForNewValue) {
            setDisplay(String(num));
            setWaitingForNewValue(false);
        } else {
            setDisplay(display === '0' ? String(num) : display + num);
        }
    };
    // Handle decimal point
    const inputDecimal = ()=>{
        if (waitingForNewValue) {
            setDisplay('0.');
            setWaitingForNewValue(false);
        } else if (display.indexOf('.') === -1) {
            setDisplay(display + '.');
        }
    };
    // Handle operators
    const performOperation = (nextOperator)=>{
        const inputValue = parseFloat(display);
        if (previousValue === null) {
            setPreviousValue(inputValue);
        } else if (operator) {
            const currentValue = previousValue || 0;
            const newValue = calculate(currentValue, inputValue, operator);
            setPreviousValue(newValue);
            setDisplay(String(newValue));
            addToHistory(`${currentValue} ${getOperatorSymbol(operator)} ${inputValue} = ${newValue}`);
        }
        setWaitingForNewValue(true);
        setOperator(nextOperator);
    };
    // Calculate result
    const calculate = (firstValue, secondValue, operation)=>{
        switch(operation){
            case '+':
                return firstValue + secondValue;
            case '-':
                return firstValue - secondValue;
            case '×':
                return firstValue * secondValue;
            case '÷':
                return firstValue / secondValue;
            case '%':
                return firstValue % secondValue;
            case '^':
                return Math.pow(firstValue, secondValue);
            default:
                return secondValue;
        }
    };
    // Get operator symbol for display
    const getOperatorSymbol = (op)=>{
        switch(op){
            case '+':
                return '+';
            case '-':
                return '-';
            case '×':
                return '×';
            case '÷':
                return '÷';
            case '%':
                return '%';
            case '^':
                return '^';
            default:
                return op;
        }
    };
    // Handle equals
    const handleEquals = ()=>{
        const inputValue = parseFloat(display);
        if (previousValue !== null && operator) {
            const result = calculate(previousValue, inputValue, operator);
            setDisplay(String(result));
            setPreviousValue(null);
            setOperator(null);
            setWaitingForNewValue(true);
            addToHistory(`${previousValue} ${getOperatorSymbol(operator)} ${inputValue} = ${result}`);
        }
    };
    // Clear display
    const clearDisplay = ()=>{
        setDisplay('0');
        setPreviousValue(null);
        setOperator(null);
        setWaitingForNewValue(false);
    };
    // Clear entry
    const clearEntry = ()=>{
        setDisplay('0');
    };
    // Delete last character
    const deleteLast = ()=>{
        if (display.length === 1) {
            setDisplay('0');
        } else {
            setDisplay(display.slice(0, -1));
        }
    };
    // Toggle sign
    const toggleSign = ()=>{
        const newValue = parseFloat(display) * -1;
        setDisplay(String(newValue));
    };
    // Percentage
    const percentage = ()=>{
        const newValue = parseFloat(display) / 100;
        setDisplay(String(newValue));
    };
    // Square root
    const squareRoot = ()=>{
        const newValue = Math.sqrt(parseFloat(display));
        setDisplay(String(newValue));
        addToHistory(`√${display} = ${newValue}`);
    };
    // Square
    const square = ()=>{
        const newValue = Math.pow(parseFloat(display), 2);
        setDisplay(String(newValue));
        addToHistory(`${display}² = ${newValue}`);
    };
    // Reciprocal
    const reciprocal = ()=>{
        const newValue = 1 / parseFloat(display);
        setDisplay(String(newValue));
        addToHistory(`1/${display} = ${newValue}`);
    };
    // Memory functions
    const memoryClear = ()=>{
        setMemory(0);
    };
    const memoryRecall = ()=>{
        setDisplay(String(memory));
    };
    const memoryAdd = ()=>{
        setMemory(memory + parseFloat(display));
    };
    const memorySubtract = ()=>{
        setMemory(memory - parseFloat(display));
    };
    // Add calculation to history
    const addToHistory = (calculation)=>{
        setHistory((prev)=>[
                calculation,
                ...prev.slice(0, 9)
            ]);
    };
    // Clear history
    const clearHistory = ()=>{
        setHistory([]);
    };
    // Handle keyboard input
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SimpleCalculator.useEffect": ()=>{
            const handleKeyDown = {
                "SimpleCalculator.useEffect.handleKeyDown": (e)=>{
                    if (e.key >= '0' && e.key <= '9') inputNumber(e.key);
                    else if (e.key === '.') inputDecimal();
                    else if (e.key === '+') performOperation('+');
                    else if (e.key === '-') performOperation('-');
                    else if (e.key === '*') performOperation('×');
                    else if (e.key === '/') {
                        e.preventDefault();
                        performOperation('÷');
                    } else if (e.key === 'Enter' || e.key === '=') handleEquals();
                    else if (e.key === 'Escape' || e.key === 'Delete') clearDisplay();
                    else if (e.key === 'Backspace') deleteLast();
                }
            }["SimpleCalculator.useEffect.handleKeyDown"];
            window.addEventListener('keydown', handleKeyDown);
            return ({
                "SimpleCalculator.useEffect": ()=>window.removeEventListener('keydown', handleKeyDown)
            })["SimpleCalculator.useEffect"];
        }
    }["SimpleCalculator.useEffect"], [
        display,
        previousValue,
        operator,
        waitingForNewValue
    ]);
    // Format display with commas
    const formatDisplay = (value)=>{
        const num = parseFloat(value);
        if (isNaN(num)) return '0';
        // Handle very large/small numbers
        if (Math.abs(num) > 999999999999 || Math.abs(num) < 0.000001 && num !== 0) {
            return num.toExponential(6);
        }
        const parts = value.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                        children: "Advanced Calculator | Free Online Scientific Calculator"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/simple-calculator.jsx",
                        lineNumber: 222,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "description",
                        content: "Free online calculator with scientific functions, memory, and calculation history. Perfect for students, professionals, and everyday calculations."
                    }, void 0, false, {
                        fileName: "[project]/src/pages/simple-calculator.jsx",
                        lineNumber: 223,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "keywords",
                        content: "calculator, scientific calculator, online calculator, math calculator, free calculator, basic calculator, calculation tool"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/simple-calculator.jsx",
                        lineNumber: 224,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "date",
                        content: currentDate
                    }, void 0, false, {
                        fileName: "[project]/src/pages/simple-calculator.jsx",
                        lineNumber: 225,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "last-modified",
                        content: lastModifiedDate
                    }, void 0, false, {
                        fileName: "[project]/src/pages/simple-calculator.jsx",
                        lineNumber: 226,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "viewport",
                        content: "width=device-width, initial-scale=1"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/simple-calculator.jsx",
                        lineNumber: 227,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                        rel: "canonical",
                        href: "https://www.financecalculatorfree.com/simple-calculator"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/simple-calculator.jsx",
                        lineNumber: 228,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:title",
                        content: "Advanced Calculator | Free Online Scientific Calculator"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/simple-calculator.jsx",
                        lineNumber: 231,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:description",
                        content: "Free online calculator with scientific functions, memory, and calculation history. Perfect for all your calculation needs."
                    }, void 0, false, {
                        fileName: "[project]/src/pages/simple-calculator.jsx",
                        lineNumber: 232,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:type",
                        content: "website"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/simple-calculator.jsx",
                        lineNumber: 233,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:url",
                        content: "https://www.financecalculatorfree.com/simple-calculator"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/simple-calculator.jsx",
                        lineNumber: 234,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "twitter:card",
                        content: "summary_large_image"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/simple-calculator.jsx",
                        lineNumber: 237,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "twitter:title",
                        content: "Advanced Calculator"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/simple-calculator.jsx",
                        lineNumber: 238,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "twitter:description",
                        content: "Free online calculator with scientific functions and calculation history."
                    }, void 0, false, {
                        fileName: "[project]/src/pages/simple-calculator.jsx",
                        lineNumber: 239,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/simple-calculator.jsx",
                lineNumber: 221,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                id: "calculator-schema",
                type: "application/ld+json",
                dangerouslySetInnerHTML: {
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SoftwareApplication",
                        "name": "Advanced Online Calculator",
                        "description": "Free online calculator with basic and scientific functions, memory features, and calculation history",
                        "applicationCategory": "MathApplication",
                        "operatingSystem": "Web",
                        "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "USD"
                        },
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": "4.9",
                            "ratingCount": "2150",
                            "bestRating": "5",
                            "worstRating": "1"
                        },
                        "datePublished": currentDate,
                        "dateModified": currentDate,
                        "author": {
                            "@type": "Organization",
                            "name": "Math Tools Pro",
                            "url": "https://www.financecalculatorfree.com"
                        },
                        "featureList": [
                            "Basic Arithmetic Operations",
                            "Scientific Functions",
                            "Memory Functions",
                            "Calculation History",
                            "Keyboard Support"
                        ]
                    })
                }
            }, void 0, false, {
                fileName: "[project]/src/pages/simple-calculator.jsx",
                lineNumber: 243,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                id: "calculator-faq-schema",
                type: "application/ld+json",
                dangerouslySetInnerHTML: {
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": [
                            {
                                "@type": "Question",
                                "name": "What operations does this calculator support?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "This calculator supports basic arithmetic (addition, subtraction, multiplication, division), percentages, square roots, squares, reciprocals, and exponentiation. It also includes memory functions (MC, MR, M+, M-) and maintains a calculation history.",
                                    "datePublished": currentDate
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Can I use keyboard shortcuts with this calculator?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Yes! You can use your keyboard: numbers (0-9), decimal point (.), operators (+, -, *, /), Enter/Equals (=), Escape/Clear (Esc/Del), and Backspace to delete last digit. This makes calculations faster and more convenient.",
                                    "datePublished": currentDate
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "How do the memory functions work?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Memory functions work like a standard calculator: MC clears memory, MR recalls memory value, M+ adds current display to memory, M- subtracts current display from memory. The memory persists until you clear it or refresh the page.",
                                    "datePublished": currentDate
                                }
                            }
                        ]
                    })
                }
            }, void 0, false, {
                fileName: "[project]/src/pages/simple-calculator.jsx",
                lineNumber: 285,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].container,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].header,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].headerContent,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].mainTitle,
                                    children: "Advanced Calculator"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/simple-calculator.jsx",
                                    lineNumber: 329,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].subtitle,
                                    children: "Free Online Calculator with Scientific Functions & Memory"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/simple-calculator.jsx",
                                    lineNumber: 330,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].badgeContainer,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].badge,
                                            children: [
                                                "Updated: ",
                                                currentDate
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/simple-calculator.jsx",
                                            lineNumber: 332,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].badge,
                                            children: "Keyboard Support"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/simple-calculator.jsx",
                                            lineNumber: 333,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].badge,
                                            children: "No Signup Required"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/simple-calculator.jsx",
                                            lineNumber: 334,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/simple-calculator.jsx",
                                    lineNumber: 331,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/simple-calculator.jsx",
                            lineNumber: 328,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/pages/simple-calculator.jsx",
                        lineNumber: 327,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].mainContent,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].calculatorLayout,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].calculatorCard,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].calculatorHeader,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].sectionTitle,
                                                        children: "Calculator"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                        lineNumber: 344,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].modeToggle,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].modeButton} ${!isScientificMode ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].activeMode : ''}`,
                                                                onClick: ()=>setIsScientificMode(false),
                                                                children: "Basic"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 346,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].modeButton} ${isScientificMode ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].activeMode : ''}`,
                                                                onClick: ()=>setIsScientificMode(true),
                                                                children: "Scientific"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 352,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                        lineNumber: 345,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                lineNumber: 343,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].calculatorDisplay,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].displayContainer,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].operationDisplay,
                                                            children: previousValue !== null && `${formatDisplay(String(previousValue))} ${operator || ''}`
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/simple-calculator.jsx",
                                                            lineNumber: 364,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].mainDisplay,
                                                            children: formatDisplay(display)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/simple-calculator.jsx",
                                                            lineNumber: 367,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].memoryIndicator,
                                                            children: memory !== 0 && 'M'
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/simple-calculator.jsx",
                                                            lineNumber: 370,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/simple-calculator.jsx",
                                                    lineNumber: 363,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                lineNumber: 362,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].memoryRow,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].memoryButton,
                                                        onClick: memoryClear,
                                                        children: "MC"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                        lineNumber: 378,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].memoryButton,
                                                        onClick: memoryRecall,
                                                        children: "MR"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                        lineNumber: 379,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].memoryButton,
                                                        onClick: memoryAdd,
                                                        children: "M+"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                        lineNumber: 380,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].memoryButton,
                                                        onClick: memorySubtract,
                                                        children: "M-"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                        lineNumber: 381,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                lineNumber: 377,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].calculatorKeypad,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].keypadRow,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].calcButton} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].functionButton}`,
                                                                onClick: ()=>squareRoot(),
                                                                children: "√x"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 387,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].calcButton} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].functionButton}`,
                                                                onClick: ()=>square(),
                                                                children: "x²"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 388,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].calcButton} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].functionButton}`,
                                                                onClick: ()=>reciprocal(),
                                                                children: "1/x"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 389,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].calcButton} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].operatorButton}`,
                                                                onClick: ()=>performOperation('÷'),
                                                                children: "÷"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 390,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                        lineNumber: 386,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].keypadRow,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].calcButton,
                                                                onClick: ()=>inputNumber(7),
                                                                children: "7"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 394,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].calcButton,
                                                                onClick: ()=>inputNumber(8),
                                                                children: "8"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 395,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].calcButton,
                                                                onClick: ()=>inputNumber(9),
                                                                children: "9"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 396,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].calcButton} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].operatorButton}`,
                                                                onClick: ()=>performOperation('×'),
                                                                children: "×"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 397,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                        lineNumber: 393,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].keypadRow,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].calcButton,
                                                                onClick: ()=>inputNumber(4),
                                                                children: "4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 401,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].calcButton,
                                                                onClick: ()=>inputNumber(5),
                                                                children: "5"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 402,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].calcButton,
                                                                onClick: ()=>inputNumber(6),
                                                                children: "6"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 403,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].calcButton} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].operatorButton}`,
                                                                onClick: ()=>performOperation('-'),
                                                                children: "-"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 404,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                        lineNumber: 400,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].keypadRow,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].calcButton,
                                                                onClick: ()=>inputNumber(1),
                                                                children: "1"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 408,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].calcButton,
                                                                onClick: ()=>inputNumber(2),
                                                                children: "2"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 409,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].calcButton,
                                                                onClick: ()=>inputNumber(3),
                                                                children: "3"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 410,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].calcButton} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].operatorButton}`,
                                                                onClick: ()=>performOperation('+'),
                                                                children: "+"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 411,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                        lineNumber: 407,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].keypadRow,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].calcButton} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].functionButton}`,
                                                                onClick: toggleSign,
                                                                children: "±"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 415,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].calcButton,
                                                                onClick: ()=>inputNumber(0),
                                                                children: "0"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 416,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].calcButton,
                                                                onClick: inputDecimal,
                                                                children: "."
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 417,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].calcButton} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].equalsButton}`,
                                                                onClick: handleEquals,
                                                                children: "="
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 418,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                        lineNumber: 414,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].keypadRow,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].calcButton} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].clearButton}`,
                                                                onClick: clearEntry,
                                                                children: "CE"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 422,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].calcButton} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].clearButton}`,
                                                                onClick: clearDisplay,
                                                                children: "C"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 423,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].calcButton} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].functionButton}`,
                                                                onClick: deleteLast,
                                                                children: "⌫"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 424,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].calcButton} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].functionButton}`,
                                                                onClick: percentage,
                                                                children: "%"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 425,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                        lineNumber: 421,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    isScientificMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].scientificRow,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].calcButton} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].scientificButton}`,
                                                                onClick: ()=>performOperation('^'),
                                                                children: "x^y"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 431,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].calcButton} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].scientificButton}`,
                                                                onClick: ()=>performOperation('%'),
                                                                children: "Mod"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 432,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].calcButton} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].scientificButton}`,
                                                                onClick: ()=>{
                                                                    const newValue = Math.sin(parseFloat(display) * Math.PI / 180);
                                                                    setDisplay(String(newValue));
                                                                    addToHistory(`sin(${display}°) = ${newValue}`);
                                                                },
                                                                children: "sin"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 433,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].calcButton} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].scientificButton}`,
                                                                onClick: ()=>{
                                                                    const newValue = Math.cos(parseFloat(display) * Math.PI / 180);
                                                                    setDisplay(String(newValue));
                                                                    addToHistory(`cos(${display}°) = ${newValue}`);
                                                                },
                                                                children: "cos"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 438,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].calcButton} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].scientificButton}`,
                                                                onClick: ()=>{
                                                                    const newValue = Math.tan(parseFloat(display) * Math.PI / 180);
                                                                    setDisplay(String(newValue));
                                                                    addToHistory(`tan(${display}°) = ${newValue}`);
                                                                },
                                                                children: "tan"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 443,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                        lineNumber: 430,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                lineNumber: 385,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].shortcutsCard,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].shortcutsTitle,
                                                        children: "⌨️ Keyboard Shortcuts"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                        lineNumber: 454,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].shortcutsGrid,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].shortcutItem,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].shortcutKey,
                                                                        children: "0-9"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 457,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].shortcutLabel,
                                                                        children: "Numbers"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 458,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 456,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].shortcutItem,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].shortcutKey,
                                                                        children: "+ - * /"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 461,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].shortcutLabel,
                                                                        children: "Operators"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 462,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 460,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].shortcutItem,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].shortcutKey,
                                                                        children: "Enter / ="
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 465,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].shortcutLabel,
                                                                        children: "Equals"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 466,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 464,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].shortcutItem,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].shortcutKey,
                                                                        children: "Esc / Del"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 469,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].shortcutLabel,
                                                                        children: "Clear All"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 470,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 468,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].shortcutItem,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].shortcutKey,
                                                                        children: "Backspace"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 473,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].shortcutLabel,
                                                                        children: "Delete Last"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 474,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 472,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].shortcutItem,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].shortcutKey,
                                                                        children: "."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 477,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].shortcutLabel,
                                                                        children: "Decimal"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 478,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 476,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                        lineNumber: 455,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                lineNumber: 453,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                        lineNumber: 342,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultsCard,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].resultsHeader,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].sectionTitle,
                                                        children: "Calculation History"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                        lineNumber: 487,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    history.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].clearHistoryButton,
                                                        onClick: clearHistory,
                                                        children: "Clear History"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                        lineNumber: 489,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                lineNumber: 486,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].historyContainer,
                                                children: history.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].emptyHistory,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].emptyIcon,
                                                            children: "📝"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/simple-calculator.jsx",
                                                            lineNumber: 498,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].emptyTitle,
                                                            children: "No Calculations Yet"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/simple-calculator.jsx",
                                                            lineNumber: 499,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].emptyText,
                                                            children: "Your calculation history will appear here. Perform calculations using the calculator buttons or your keyboard."
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/simple-calculator.jsx",
                                                            lineNumber: 500,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/simple-calculator.jsx",
                                                    lineNumber: 497,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].historyList,
                                                    children: history.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].historyItem,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].historyCalculation,
                                                                    children: item.split('=')[0]
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                    lineNumber: 508,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].historyResult,
                                                                    children: [
                                                                        "= ",
                                                                        item.split('=')[1]
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                    lineNumber: 509,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, index, true, {
                                                            fileName: "[project]/src/pages/simple-calculator.jsx",
                                                            lineNumber: 507,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/simple-calculator.jsx",
                                                    lineNumber: 505,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                lineNumber: 495,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].currentCalculation,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].currentTitle,
                                                        children: "Current Calculation"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                        lineNumber: 518,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].calculationDetails,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].detailRow,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].detailLabel,
                                                                        children: "Display Value:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 521,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].detailValue,
                                                                        children: formatDisplay(display)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 522,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 520,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].detailRow,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].detailLabel,
                                                                        children: "Memory Value:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 525,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].detailValue,
                                                                        children: memory
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 526,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 524,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            previousValue !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].detailRow,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].detailLabel,
                                                                        children: "Previous Value:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 530,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].detailValue,
                                                                        children: formatDisplay(String(previousValue))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 531,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 529,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            operator && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].detailRow,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].detailLabel,
                                                                        children: "Current Operator:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 536,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].detailValue,
                                                                        children: getOperatorSymbol(operator)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 537,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 535,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                        lineNumber: 519,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                lineNumber: 517,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tipsCard,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tipsTitle,
                                                        children: "💡 Calculator Tips"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                        lineNumber: 545,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tipsList,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                children: "Use keyboard shortcuts for faster calculations"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 547,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                children: "Memory functions (MC, MR, M+, M-) work like standard calculators"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 548,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                children: 'Click "Scientific" mode for advanced functions'
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 549,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                children: "History saves your last 10 calculations"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 550,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                children: "Use ⌫ to delete last digit, CE to clear entry, C to clear all"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 551,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                        lineNumber: 546,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                lineNumber: 544,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                        lineNumber: 485,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                lineNumber: 340,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].educationalContent,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleCard,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleTitle,
                                                children: "The History and Mathematics of Calculators"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                lineNumber: 560,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSection,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSubtitle,
                                                        children: "From Abacus to Digital Calculators"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                        lineNumber: 563,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: "Calculators have evolved dramatically over centuries. The abacus, invented around 2400 BC, was the first calculating tool. In the 17th century, Blaise Pascal created the Pascaline, the first mechanical calculator. Electronic calculators emerged in the 1960s, and today's digital calculators can perform complex scientific computations instantly."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                        lineNumber: 564,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].exampleCard,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                children: "Calculator Evolution Timeline:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 567,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                children: "2400 BC:"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                                lineNumber: 569,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            " Abacus invented in Mesopotamia"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 569,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                children: "1642:"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                                lineNumber: 570,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            " Pascal's mechanical calculator"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 570,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                children: "1820:"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                                lineNumber: 571,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            " Arithmometer (first commercial calculator)"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 571,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                children: "1961:"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                                lineNumber: 572,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            " ANITA (first electronic calculator)"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 572,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                children: "1970s:"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                                lineNumber: 573,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            " Pocket calculators become affordable"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 573,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                children: "Today:"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                                lineNumber: 574,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            " Digital calculators on every device"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 574,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 568,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                        lineNumber: 566,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                lineNumber: 562,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSection,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSubtitle,
                                                        children: "Essential Calculator Functions Explained"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                        lineNumber: 580,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].strategyGrid,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].strategyCard,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        children: "📊 Memory Functions"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 584,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        children: "MC (Memory Clear) resets memory to 0. MR (Memory Recall) displays the stored value. M+ adds current display to memory. M- subtracts current display from memory."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 585,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 583,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].strategyCard,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        children: "🔢 Scientific Functions"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 589,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        children: "√x calculates square root. x² squares the number. 1/x finds the reciprocal. sin/cos/tan calculate trigonometric functions (degrees). x^y raises x to power y."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 590,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 588,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].strategyCard,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        children: "⚡ Order of Operations"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 594,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        children: "Calculators follow PEMDAS: Parentheses, Exponents, Multiplication/Division (left to right), Addition/Subtraction (left to right). Our calculator processes operations as entered."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 595,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 593,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].strategyCard,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        children: "⌨️ Keyboard Efficiency"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 599,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        children: "Master keyboard shortcuts: Use number keys, operators (+, -, *, /), Enter for equals, Escape to clear, Backspace to delete. This speeds up calculations significantly."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 600,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 598,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                        lineNumber: 582,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                lineNumber: 579,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSection,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSubtitle,
                                                        children: "Common Calculator Operations & Formulas"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                        lineNumber: 606,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].operationsTable,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableRow,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableCell,
                                                                        children: "Operation"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 609,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableCell,
                                                                        children: "Formula"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 610,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableCell,
                                                                        children: "Example"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 611,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 608,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableRow,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableCell,
                                                                        children: "Percentage"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 614,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableCell,
                                                                        children: "Value × Percentage ÷ 100"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 615,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableCell,
                                                                        children: "50 × 20% = 10"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 616,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 613,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableRow,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableCell,
                                                                        children: "Square Root"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 619,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableCell,
                                                                        children: "√x"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 620,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableCell,
                                                                        children: "√25 = 5"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 621,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 618,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableRow,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableCell,
                                                                        children: "Exponentiation"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 624,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableCell,
                                                                        children: "x^y"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 625,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableCell,
                                                                        children: "2^3 = 8"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 626,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 623,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableRow,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableCell,
                                                                        children: "Reciprocal"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 629,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableCell,
                                                                        children: "1 ÷ x"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 630,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableCell,
                                                                        children: "1/4 = 0.25"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 631,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 628,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableRow,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableCell,
                                                                        children: "Modulo"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 634,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableCell,
                                                                        children: "Remainder of division"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 635,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tableCell,
                                                                        children: "10 % 3 = 1"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 636,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 633,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                        lineNumber: 607,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                lineNumber: 605,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSection,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSubtitle,
                                                        children: "Real-World Calculator Applications"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                        lineNumber: 642,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].applicationsList,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: "Financial Calculations:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 644,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    " Loan payments, interest rates, investment returns, and budget planning"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 644,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: "Academic Use:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 645,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    " Homework assistance, exam calculations, scientific research, and statistical analysis"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 645,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: "Business Applications:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 646,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    " Profit margins, sales tax, discounts, payroll, and inventory management"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 646,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: "Engineering & Science:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 647,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    " Unit conversions, formula calculations, data analysis, and experimental results"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 647,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: "Everyday Life:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                        lineNumber: 648,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    " Shopping totals, recipe adjustments, travel expenses, and home improvement projects"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 648,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                        lineNumber: 643,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                lineNumber: 641,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSection,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].articleSubtitle,
                                                        children: "Expert Advice from Mathematics Educators"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                        lineNumber: 653,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("blockquote", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].expertQuote,
                                                        children: [
                                                            '"A calculator is a tool that enhances mathematical understanding, not a replacement for it. Learn to estimate answers mentally first, then use the calculator to verify. Understanding which operations to perform and why is more important than simply getting the right answer. Practice mental math alongside calculator use for true mathematical proficiency."',
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].quoteFooter,
                                                                children: "— Mathematics Professor, 20+ years teaching experience"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                                lineNumber: 656,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                        lineNumber: 654,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                lineNumber: 652,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                        lineNumber: 559,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqCard,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqTitle,
                                                children: "Calculator FAQs"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                lineNumber: 663,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqItem,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqQuestion,
                                                        children: "How accurate is this calculator?"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                        lineNumber: 666,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqAnswer,
                                                        children: "This calculator uses JavaScript's double-precision floating-point arithmetic, which provides 15-17 significant digits of precision. For most everyday calculations, this is more than sufficient. For extremely precise scientific calculations, specialized software may be needed."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                        lineNumber: 667,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                lineNumber: 665,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqItem,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqQuestion,
                                                        children: "Does the calculator follow order of operations (PEMDAS)?"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                        lineNumber: 671,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqAnswer,
                                                        children: "This calculator processes operations sequentially as entered (like a basic handheld calculator), not using algebraic logic that follows PEMDAS. To follow order of operations, perform calculations in the correct sequence: parentheses/exponents first, then multiplication/division, then addition/subtraction."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                        lineNumber: 672,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                lineNumber: 670,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqItem,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqQuestion,
                                                        children: "Can I use this calculator on mobile devices?"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                        lineNumber: 676,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqAnswer,
                                                        children: "Yes! The calculator is fully responsive and works on smartphones, tablets, and desktops. The buttons are sized appropriately for touch screens, and all functions are accessible on mobile devices. You can also use your device's keyboard if connected."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                        lineNumber: 677,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                lineNumber: 675,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqItem,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqQuestion,
                                                        children: "Is there a limit to how large numbers can be?"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                        lineNumber: 681,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].faqAnswer,
                                                        children: "The calculator can handle numbers up to approximately 1.8 × 10³⁰⁸. For very large or small numbers, it switches to scientific notation automatically. Numbers with more than 15-17 significant digits may experience rounding errors due to floating-point precision limits."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                                        lineNumber: 682,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                                lineNumber: 680,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/simple-calculator.jsx",
                                        lineNumber: 662,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                lineNumber: 558,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].actionSection,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ctaCard,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ctaTitle,
                                            children: "Ready to Calculate?"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/simple-calculator.jsx",
                                            lineNumber: 690,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].ctaText,
                                            children: "Use this free online calculator for all your mathematical needs. No downloads, no signups, just instant calculations whenever you need them."
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/simple-calculator.jsx",
                                            lineNumber: 691,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].featureGrid,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].featureItem,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].featureIcon,
                                                            children: "🔢"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/simple-calculator.jsx",
                                                            lineNumber: 695,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].featureTitle,
                                                            children: "Basic Arithmetic"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/simple-calculator.jsx",
                                                            lineNumber: 696,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].featureText,
                                                            children: "Addition, subtraction, multiplication, division"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/simple-calculator.jsx",
                                                            lineNumber: 697,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/simple-calculator.jsx",
                                                    lineNumber: 694,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].featureItem,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].featureIcon,
                                                            children: "⚡"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/simple-calculator.jsx",
                                                            lineNumber: 701,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].featureTitle,
                                                            children: "Scientific Functions"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/simple-calculator.jsx",
                                                            lineNumber: 702,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].featureText,
                                                            children: "Square root, exponents, trigonometry"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/simple-calculator.jsx",
                                                            lineNumber: 703,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/simple-calculator.jsx",
                                                    lineNumber: 700,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].featureItem,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].featureIcon,
                                                            children: "💾"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/simple-calculator.jsx",
                                                            lineNumber: 707,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].featureTitle,
                                                            children: "Memory Features"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/simple-calculator.jsx",
                                                            lineNumber: 708,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].featureText,
                                                            children: "MC, MR, M+, M- for complex calculations"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/simple-calculator.jsx",
                                                            lineNumber: 709,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/simple-calculator.jsx",
                                                    lineNumber: 706,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].featureItem,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].featureIcon,
                                                            children: "⌨️"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/simple-calculator.jsx",
                                                            lineNumber: 713,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].featureTitle,
                                                            children: "Keyboard Support"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/simple-calculator.jsx",
                                                            lineNumber: 714,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].featureText,
                                                            children: "Full keyboard shortcuts for efficiency"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/simple-calculator.jsx",
                                                            lineNumber: 715,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/simple-calculator.jsx",
                                                    lineNumber: 712,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/simple-calculator.jsx",
                                            lineNumber: 693,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$simplecalculator$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].disclaimer,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Disclaimer:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/simple-calculator.jsx",
                                                    lineNumber: 720,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " This calculator provides results based on standard mathematical operations and JavaScript's floating-point arithmetic. Results are for educational and general purpose use. For critical calculations (financial, engineering, scientific), always verify results with appropriate tools and professional advice. This tool is not responsible for calculation errors in critical applications."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/simple-calculator.jsx",
                                            lineNumber: 719,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/simple-calculator.jsx",
                                    lineNumber: 689,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/pages/simple-calculator.jsx",
                                lineNumber: 688,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/simple-calculator.jsx",
                        lineNumber: 339,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/simple-calculator.jsx",
                lineNumber: 325,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true);
};
_s(SimpleCalculator, "JZllz+jP5057Q+MhwwQETXq4nf8=");
_c = SimpleCalculator;
var __N_SSG = true;
const __TURBOPACK__default__export__ = SimpleCalculator;
var _c;
__turbopack_context__.k.register(_c, "SimpleCalculator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/simple-calculator.jsx [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/simple-calculator";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/src/pages/simple-calculator.jsx [client] (ecmascript)");
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
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/src/pages/simple-calculator\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/simple-calculator.jsx [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__49a94add._.js.map