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
"[project]/src/pages/404.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [client] (ecmascript)");
'use client';
;
;
;
;
const Custom404 = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                        className: "jsx-f26ab6fac92ec3f1",
                        children: "Page Not Found | FinanceCalculatorFree"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/404.js",
                        lineNumber: 9,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "description",
                        content: "The page you're looking for doesn't exist. Return to our homepage to access 50+ free financial calculators for mortgages, investments, debt, and retirement.",
                        className: "jsx-f26ab6fac92ec3f1"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/404.js",
                        lineNumber: 10,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "robots",
                        content: "noindex, follow",
                        className: "jsx-f26ab6fac92ec3f1"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/404.js",
                        lineNumber: 14,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "viewport",
                        content: "width=device-width, initial-scale=1, maximum-scale=5",
                        className: "jsx-f26ab6fac92ec3f1"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/404.js",
                        lineNumber: 15,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/404.js",
                lineNumber: 8,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-f26ab6fac92ec3f1" + " " + "notFoundPage",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                    className: "jsx-f26ab6fac92ec3f1" + " " + "notFoundMain",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-f26ab6fac92ec3f1" + " " + "notFoundContainer",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "jsx-f26ab6fac92ec3f1" + " " + "hero",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-f26ab6fac92ec3f1" + " " + "heroContent",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                            className: "jsx-f26ab6fac92ec3f1",
                                            children: "404 - Page Not Found"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/404.js",
                                            lineNumber: 25,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "jsx-f26ab6fac92ec3f1",
                                            children: "Oops! The page you're looking for seems to have gone missing. Don't worry, we'll help you get back to free financial calculations."
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/404.js",
                                            lineNumber: 26,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/404.js",
                                    lineNumber: 24,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/pages/404.js",
                                lineNumber: 23,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "jsx-f26ab6fac92ec3f1" + " " + "cardsSection",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-f26ab6fac92ec3f1" + " " + "card mission",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "jsx-f26ab6fac92ec3f1",
                                                children: "What Might Have Happened?"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/404.js",
                                                lineNumber: 33,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "jsx-f26ab6fac92ec3f1",
                                                children: "The page may have been moved, deleted, or there might be a typo in the URL. We're constantly improving our site, and sometimes pages get relocated during updates."
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/404.js",
                                                lineNumber: 34,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/404.js",
                                        lineNumber: 32,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-f26ab6fac92ec3f1" + " " + "card vision",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "jsx-f26ab6fac92ec3f1",
                                                children: "Get Back on Track"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/404.js",
                                                lineNumber: 40,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "jsx-f26ab6fac92ec3f1",
                                                children: "While we fix this, why not explore our free financial tools? All calculators are completely free — no sign-ups, no ads, just accurate results."
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/404.js",
                                                lineNumber: 41,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/404.js",
                                        lineNumber: 39,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/404.js",
                                lineNumber: 31,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "jsx-f26ab6fac92ec3f1" + " " + "valuesSection",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "jsx-f26ab6fac92ec3f1",
                                        children: "Why Choose FinanceCalculatorFree?"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/404.js",
                                        lineNumber: 50,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-f26ab6fac92ec3f1" + " " + "valuesGrid",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-f26ab6fac92ec3f1" + " " + "valueCard",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-f26ab6fac92ec3f1" + " " + "icon",
                                                        children: "🔐"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/404.js",
                                                        lineNumber: 53,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                        className: "jsx-f26ab6fac92ec3f1",
                                                        children: "Privacy First"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/404.js",
                                                        lineNumber: 54,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "jsx-f26ab6fac92ec3f1",
                                                        children: "No tracking, no cookies, no data collection. Your inputs stay on your device."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/404.js",
                                                        lineNumber: 55,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/404.js",
                                                lineNumber: 52,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-f26ab6fac92ec3f1" + " " + "valueCard",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-f26ab6fac92ec3f1" + " " + "icon",
                                                        children: "🧮"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/404.js",
                                                        lineNumber: 58,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                        className: "jsx-f26ab6fac92ec3f1",
                                                        children: "Transparency"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/404.js",
                                                        lineNumber: 59,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "jsx-f26ab6fac92ec3f1",
                                                        children: "We show the formulas behind every result — because knowledge is power."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/404.js",
                                                        lineNumber: 60,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/404.js",
                                                lineNumber: 57,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-f26ab6fac92ec3f1" + " " + "valueCard",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-f26ab6fac92ec3f1" + " " + "icon",
                                                        children: "🚀"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/404.js",
                                                        lineNumber: 63,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                        className: "jsx-f26ab6fac92ec3f1",
                                                        children: "Accessibility"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/404.js",
                                                        lineNumber: 64,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "jsx-f26ab6fac92ec3f1",
                                                        children: "Free for all. No paywalls. No sign-ups. Just tools that work."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/404.js",
                                                        lineNumber: 65,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/404.js",
                                                lineNumber: 62,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-f26ab6fac92ec3f1" + " " + "valueCard",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-f26ab6fac92ec3f1" + " " + "icon",
                                                        children: "📈"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/404.js",
                                                        lineNumber: 68,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                        className: "jsx-f26ab6fac92ec3f1",
                                                        children: "Accuracy"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/404.js",
                                                        lineNumber: 69,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "jsx-f26ab6fac92ec3f1",
                                                        children: "All tools use industry-standard financial math and are regularly audited."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/404.js",
                                                        lineNumber: 70,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/404.js",
                                                lineNumber: 67,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/404.js",
                                        lineNumber: 51,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/404.js",
                                lineNumber: 49,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "jsx-f26ab6fac92ec3f1" + " " + "ctaSection",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-f26ab6fac92ec3f1" + " " + "ctaContent",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "jsx-f26ab6fac92ec3f1",
                                            children: "Ready to Take Control of Your Finances?"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/404.js",
                                            lineNumber: 78,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "jsx-f26ab6fac92ec3f1",
                                            children: "Explore 50+ free calculators — no login, just results."
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/404.js",
                                            lineNumber: 79,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/suite",
                                            className: "ctaButton",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "jsx-f26ab6fac92ec3f1" + " " + "buttonText",
                                                    children: "Try All Calculators"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/404.js",
                                                    lineNumber: 81,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "jsx-f26ab6fac92ec3f1" + " " + "arrow",
                                                    children: "→"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/404.js",
                                                    lineNumber: 82,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/404.js",
                                            lineNumber: 80,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/404.js",
                                    lineNumber: 77,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/pages/404.js",
                                lineNumber: 76,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/404.js",
                        lineNumber: 20,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/pages/404.js",
                    lineNumber: 19,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/pages/404.js",
                lineNumber: 18,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                id: "f26ab6fac92ec3f1",
                children: ".jsx-f26ab6fac92ec3f1:root{--primary-bg:#fff;--text-primary:#0d1b2a;--text-secondary:#414a4c;--accent-color:#0d1b2a;--accent-hover:#1a2d3f;--border-color:#e9ecef;--card-shadow:0 4px 12px #0d1b2a14;--card-shadow-hover:0 6px 14px #0d1b2a1f;--light-bg:#f8f9fa}.notFoundPage.jsx-f26ab6fac92ec3f1{background-color:var(--primary-bg);color:var(--text-primary);flex-direction:column;min-height:100dvh;padding-top:5rem;padding-bottom:4rem;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;line-height:1.6;display:flex}.notFoundMain.jsx-f26ab6fac92ec3f1{flex:1;justify-content:center;align-items:flex-start;width:100%;display:flex}.notFoundContainer.jsx-f26ab6fac92ec3f1{width:100%;max-width:1200px;margin:0 auto}.hero.jsx-f26ab6fac92ec3f1{text-align:center;background-color:var(--light-bg);margin-top:0;padding:3rem 1.5rem 2rem}.heroContent.jsx-f26ab6fac92ec3f1 h1.jsx-f26ab6fac92ec3f1{color:var(--text-primary);margin-bottom:.75rem;font-size:1.75rem;font-weight:600;line-height:1.3}.heroContent.jsx-f26ab6fac92ec3f1 p.jsx-f26ab6fac92ec3f1{color:var(--text-secondary);max-width:600px;margin:0 auto;font-size:.95rem;line-height:1.5}.cardsSection.jsx-f26ab6fac92ec3f1{flex-wrap:wrap;justify-content:center;gap:1.2rem;padding:1.8rem 1.5rem;display:flex}.card.jsx-f26ab6fac92ec3f1{min-width:280px;max-width:400px;box-shadow:var(--card-shadow);border:1px solid var(--border-color);background-color:#fff;border-radius:10px;flex:1;padding:1.3rem;transition:all .3s}.card.jsx-f26ab6fac92ec3f1:hover{box-shadow:var(--card-shadow-hover);transform:translateY(-2px)}.card.jsx-f26ab6fac92ec3f1 h3.jsx-f26ab6fac92ec3f1{color:var(--text-primary);margin-bottom:.7rem;font-size:1.1rem;font-weight:600}.card.jsx-f26ab6fac92ec3f1 p.jsx-f26ab6fac92ec3f1{color:var(--text-secondary);margin:0;font-size:.88rem;line-height:1.55}.mission.jsx-f26ab6fac92ec3f1{background:linear-gradient(#eef5ff,#fff)}.vision.jsx-f26ab6fac92ec3f1{background:linear-gradient(#f0f8f0,#fff)}.valuesSection.jsx-f26ab6fac92ec3f1{text-align:center;padding:2rem 1.5rem}.valuesSection.jsx-f26ab6fac92ec3f1 h2.jsx-f26ab6fac92ec3f1{color:var(--text-primary);margin-bottom:1.4rem;font-size:1.3rem;font-weight:600}.valuesGrid.jsx-f26ab6fac92ec3f1{grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1.2rem;max-width:1000px;margin:0 auto;display:grid}.valueCard.jsx-f26ab6fac92ec3f1{border:1px solid var(--border-color);text-align:center;background-color:#fff;border-radius:8px;padding:1rem;transition:all .3s;box-shadow:0 3px 10px #0d1b2a0f}.valueCard.jsx-f26ab6fac92ec3f1:hover{box-shadow:var(--card-shadow-hover);transform:translateY(-2px)}.valueCard.jsx-f26ab6fac92ec3f1 .icon.jsx-f26ab6fac92ec3f1{margin-bottom:.6rem;font-size:1.6rem}.valueCard.jsx-f26ab6fac92ec3f1 h4.jsx-f26ab6fac92ec3f1{color:var(--text-primary);margin-bottom:.5rem;font-size:1rem;font-weight:500}.valueCard.jsx-f26ab6fac92ec3f1 p.jsx-f26ab6fac92ec3f1{color:var(--text-secondary);margin:0;font-size:.82rem;line-height:1.5}.ctaSection.jsx-f26ab6fac92ec3f1{background-color:var(--accent-color);color:#fff;text-align:center;padding:2.2rem 1.5rem}.ctaContent.jsx-f26ab6fac92ec3f1 h2.jsx-f26ab6fac92ec3f1{margin-bottom:.6rem;font-size:1.35rem;font-weight:600}.ctaContent.jsx-f26ab6fac92ec3f1 p.jsx-f26ab6fac92ec3f1{color:#ccc;margin-bottom:1.2rem;font-size:.9rem;line-height:1.5}.ctaButton.jsx-f26ab6fac92ec3f1{color:var(--accent-color);cursor:pointer;background:#fff;border:none;border-radius:6px;align-items:center;gap:.6rem;padding:.7rem 1.3rem;font-size:.95rem;font-weight:500;text-decoration:none;transition:all .3s;display:inline-flex}.ctaButton.jsx-f26ab6fac92ec3f1:hover{background:#f8f9fa;transform:translateY(-2px);box-shadow:0 6px 14px #0000001a}.ctaButton.jsx-f26ab6fac92ec3f1 .arrow.jsx-f26ab6fac92ec3f1{transition:transform .3s}.ctaButton.jsx-f26ab6fac92ec3f1:hover .arrow.jsx-f26ab6fac92ec3f1{transform:translate(4px)}@media (width<=374px){.notFoundPage.jsx-f26ab6fac92ec3f1{padding-top:3rem;padding-bottom:2.5rem}.hero.jsx-f26ab6fac92ec3f1{padding:2.2rem 1rem 1.5rem}.heroContent.jsx-f26ab6fac92ec3f1 h1.jsx-f26ab6fac92ec3f1{font-size:1.4rem}.heroContent.jsx-f26ab6fac92ec3f1 p.jsx-f26ab6fac92ec3f1{font-size:.82rem}.cardsSection.jsx-f26ab6fac92ec3f1{flex-direction:column;gap:1rem;padding:1.4rem 1rem}.card.jsx-f26ab6fac92ec3f1{min-width:auto;max-width:none;padding:1.1rem}.card.jsx-f26ab6fac92ec3f1 h3.jsx-f26ab6fac92ec3f1{font-size:1.05rem}.valuesSection.jsx-f26ab6fac92ec3f1{padding:1.6rem 1rem}.valuesGrid.jsx-f26ab6fac92ec3f1{grid-template-columns:1fr;gap:1rem}.ctaSection.jsx-f26ab6fac92ec3f1{padding:1.6rem 1rem}.ctaContent.jsx-f26ab6fac92ec3f1 h2.jsx-f26ab6fac92ec3f1{font-size:1.15rem}.ctaButton.jsx-f26ab6fac92ec3f1{padding:.6rem 1rem;font-size:.85rem}}@media (width>=375px) and (width<=424px){.notFoundPage.jsx-f26ab6fac92ec3f1{padding-top:3.5rem;padding-bottom:3rem}.heroContent.jsx-f26ab6fac92ec3f1 h1.jsx-f26ab6fac92ec3f1{font-size:1.5rem}.cardsSection.jsx-f26ab6fac92ec3f1{flex-direction:column;align-items:stretch;gap:1rem}.card.jsx-f26ab6fac92ec3f1{min-width:auto;max-width:none}}@media (width>=425px) and (width<=767px){.notFoundPage.jsx-f26ab6fac92ec3f1{padding-top:4rem;padding-bottom:3.5rem}.cardsSection.jsx-f26ab6fac92ec3f1{flex-direction:column;align-items:stretch;gap:1rem}.card.jsx-f26ab6fac92ec3f1{min-width:auto;max-width:none}.valuesGrid.jsx-f26ab6fac92ec3f1{grid-template-columns:1fr 1fr}}@media (width>=768px) and (width<=1023px){.notFoundPage.jsx-f26ab6fac92ec3f1{padding-top:4.5rem}.heroContent.jsx-f26ab6fac92ec3f1 h1.jsx-f26ab6fac92ec3f1{font-size:2rem}.heroContent.jsx-f26ab6fac92ec3f1 p.jsx-f26ab6fac92ec3f1{font-size:1.05rem}.cardsSection.jsx-f26ab6fac92ec3f1{gap:1.5rem}.valuesGrid.jsx-f26ab6fac92ec3f1{grid-template-columns:repeat(2,1fr)}.ctaButton.jsx-f26ab6fac92ec3f1{padding:.8rem 1.5rem;font-size:1rem}}@media (width>=1024px) and (width<=1439px){.notFoundPage.jsx-f26ab6fac92ec3f1{padding-top:5rem}.heroContent.jsx-f26ab6fac92ec3f1 h1.jsx-f26ab6fac92ec3f1{font-size:2.25rem}.heroContent.jsx-f26ab6fac92ec3f1 p.jsx-f26ab6fac92ec3f1{font-size:1.1rem}.valuesGrid.jsx-f26ab6fac92ec3f1{grid-template-columns:repeat(4,1fr)}}@media (width>=1440px){.notFoundPage.jsx-f26ab6fac92ec3f1{padding-top:5.5rem}.heroContent.jsx-f26ab6fac92ec3f1 h1.jsx-f26ab6fac92ec3f1{font-size:2.5rem}.heroContent.jsx-f26ab6fac92ec3f1 p.jsx-f26ab6fac92ec3f1{font-size:1.15rem}.valuesGrid.jsx-f26ab6fac92ec3f1{grid-template-columns:repeat(4,1fr);gap:2rem}.ctaButton.jsx-f26ab6fac92ec3f1{padding:.9rem 1.8rem;font-size:1.05rem}}@media (prefers-reduced-motion:reduce){.card.jsx-f26ab6fac92ec3f1,.valueCard.jsx-f26ab6fac92ec3f1,.ctaButton.jsx-f26ab6fac92ec3f1{transition:none}.card.jsx-f26ab6fac92ec3f1:hover,.valueCard.jsx-f26ab6fac92ec3f1:hover,.ctaButton.jsx-f26ab6fac92ec3f1:hover,.ctaButton.jsx-f26ab6fac92ec3f1:hover .arrow.jsx-f26ab6fac92ec3f1{transform:none}}@media (prefers-color-scheme:dark){.jsx-f26ab6fac92ec3f1:root{--primary-bg:#1a1a1a;--text-primary:#fff;--text-secondary:#ccc;--accent-color:#2d3748;--border-color:#374151;--card-shadow:0 4px 12px #0000004d;--card-shadow-hover:0 6px 14px #0006;--light-bg:#2d3748}.card.jsx-f26ab6fac92ec3f1,.valueCard.jsx-f26ab6fac92ec3f1{background-color:#2d3748;border-color:#4a5568}.mission.jsx-f26ab6fac92ec3f1{background:linear-gradient(#2b6cb0,#2d3748)}.vision.jsx-f26ab6fac92ec3f1{background:linear-gradient(to bottom: #22543d,#2d3748)}}@media (prefers-contrast:high){.ctaButton.jsx-f26ab6fac92ec3f1{border:2px solid}.card.jsx-f26ab6fac92ec3f1,.valueCard.jsx-f26ab6fac92ec3f1{border-width:2px}}.ctaButton.jsx-f26ab6fac92ec3f1:focus-visible{outline:2px solid var(--accent-color);outline-offset:2px}@media (hover:none) and (pointer:coarse){.card.jsx-f26ab6fac92ec3f1:hover,.valueCard.jsx-f26ab6fac92ec3f1:hover,.ctaButton.jsx-f26ab6fac92ec3f1:hover{transform:none}.ctaButton.jsx-f26ab6fac92ec3f1:active{transform:scale(.98)}}@media (height<=500px) and (orientation:landscape){.notFoundPage.jsx-f26ab6fac92ec3f1{padding-top:3rem;padding-bottom:2rem}.hero.jsx-f26ab6fac92ec3f1{padding:1.5rem 1rem 1rem}.cardsSection.jsx-f26ab6fac92ec3f1,.valuesSection.jsx-f26ab6fac92ec3f1{padding:1rem}.ctaSection.jsx-f26ab6fac92ec3f1{padding:1.5rem 1rem}}@supports (padding:max(0px)){.notFoundPage.jsx-f26ab6fac92ec3f1{padding-left:max(1rem,env(safe-area-inset-left));padding-right:max(1rem,env(safe-area-inset-right));padding-top:max(5rem,env(safe-area-inset-top))}}"
            }, void 0, false, void 0, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true);
};
_c = Custom404;
const __TURBOPACK__default__export__ = Custom404;
var _c;
__turbopack_context__.k.register(_c, "Custom404");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/404.js [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/404";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/src/pages/404.js [client] (ecmascript)");
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
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/src/pages/404\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/404.js [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__85ba9d59._.js.map