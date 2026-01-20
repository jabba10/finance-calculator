module.exports = [
"[project]/src/pages/compoundinterestcalculator.module.css [ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "arrow": "compoundinterestcalculator-module__kc6_2q__arrow",
  "btnText": "compoundinterestcalculator-module__kc6_2q__btnText",
  "buttonText": "compoundinterestcalculator-module__kc6_2q__buttonText",
  "calculatorCard": "compoundinterestcalculator-module__kc6_2q__calculatorCard",
  "cardList": "compoundinterestcalculator-module__kc6_2q__cardList",
  "cardListItem": "compoundinterestcalculator-module__kc6_2q__cardListItem",
  "cardTitle": "compoundinterestcalculator-module__kc6_2q__cardTitle",
  "cardsGrid": "compoundinterestcalculator-module__kc6_2q__cardsGrid",
  "container": "compoundinterestcalculator-module__kc6_2q__container",
  "ctaButton": "compoundinterestcalculator-module__kc6_2q__ctaButton",
  "ctaSection": "compoundinterestcalculator-module__kc6_2q__ctaSection",
  "form": "compoundinterestcalculator-module__kc6_2q__form",
  "hero": "compoundinterestcalculator-module__kc6_2q__hero",
  "highlight": "compoundinterestcalculator-module__kc6_2q__highlight",
  "historyCard": "compoundinterestcalculator-module__kc6_2q__historyCard",
  "historySection": "compoundinterestcalculator-module__kc6_2q__historySection",
  "input": "compoundinterestcalculator-module__kc6_2q__input",
  "inputGroup": "compoundinterestcalculator-module__kc6_2q__inputGroup",
  "instruction": "compoundinterestcalculator-module__kc6_2q__instruction",
  "label": "compoundinterestcalculator-module__kc6_2q__label",
  "note": "compoundinterestcalculator-module__kc6_2q__note",
  "page": "compoundinterestcalculator-module__kc6_2q__page",
  "resultGrid": "compoundinterestcalculator-module__kc6_2q__resultGrid",
  "resultItem": "compoundinterestcalculator-module__kc6_2q__resultItem",
  "resultSection": "compoundinterestcalculator-module__kc6_2q__resultSection",
  "sectionHeader": "compoundinterestcalculator-module__kc6_2q__sectionHeader",
  "sectionSubtitle": "compoundinterestcalculator-module__kc6_2q__sectionSubtitle",
  "spacerBottom": "compoundinterestcalculator-module__kc6_2q__spacerBottom",
  "spacerTop": "compoundinterestcalculator-module__kc6_2q__spacerTop",
  "submitBtn": "compoundinterestcalculator-module__kc6_2q__submitBtn",
  "subtitle": "compoundinterestcalculator-module__kc6_2q__subtitle",
  "title": "compoundinterestcalculator-module__kc6_2q__title",
});
}),
"[project]/src/pages/compound-interest-calculator.jsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$compoundinterestcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/pages/compoundinterestcalculator.module.css [ssr] (css module)");
;
;
;
;
;
const CompoundInterestCalculator = ()=>{
    const ctaButtonRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const [principal, setPrincipal] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [interestRate, setInterestRate] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [years, setYears] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [compounding, setCompounding] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('12');
    const [result, setResult] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const parseNumber = (input)=>{
        if (!input) return NaN;
        const match = input.toString().replace(/,/g, '').match(/-?\d+(\.\d+)?/);
        return match ? parseFloat(match[0]) : NaN;
    };
    const handleSubmit = (e)=>{
        e.preventDefault();
        const p = parseNumber(principal);
        const r = parseNumber(interestRate);
        const t = parseNumber(years);
        const n = parseNumber(compounding);
        if (isNaN(p) || isNaN(r) || isNaN(t) || isNaN(n)) {
            setResult(null);
            return;
        }
        const amount = p * Math.pow(1 + r / 100 / n, n * t);
        const interest = amount - p;
        setResult({
            principal: p.toLocaleString(undefined, {
                maximumFractionDigits: 2
            }),
            rate: r.toFixed(2),
            years: t,
            compounding: n,
            amount: amount.toLocaleString(undefined, {
                maximumFractionDigits: 2
            }),
            interest: interest.toLocaleString(undefined, {
                maximumFractionDigits: 2
            }),
            growth: ((amount / p - 1) * 100).toFixed(2)
        });
    };
    const handleMouseMove = (e)=>{
        const el = ctaButtonRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        el.style.setProperty('--x', `${x}px`);
        el.style.setProperty('--y', `${y}px`);
    };
    // Compound Interest Calculator History Data
    const compoundInterestCalculatorHistory = [
        {
            id: 1,
            title: "History & Discovery of Compound Interest Formula",
            points: [
                "1683: Jacob Bernoulli discovered the mathematical constant 'e' in compound interest calculations",
                "1700s: Leonhard Euler formalized the compound interest formula A = P(1 + r/n)^(nt)",
                "1800s: Banking institutions adopted compound interest for savings and loans",
                "1913: Albert Einstein reportedly called compound interest the 'eighth wonder of the world'",
                "1970s: Financial calculators made compound interest calculations accessible to the public",
                "1990s: Online compound interest calculators emerged during the internet revolution"
            ]
        },
        {
            id: 2,
            title: "Global Origins & Purpose",
            points: [
                "Switzerland: Jacob Bernoulli's work on exponential growth laid the foundation",
                "United States: Benjamin Franklin promoted compound interest for public welfare",
                "United Kingdom: Building societies popularized compound interest savings",
                "Germany: Banking innovations integrated compound interest into modern finance",
                "Japan: Post-war economic growth was fueled by compound interest principles",
                "Purpose: Enable wealth accumulation through exponential growth and financial planning"
            ]
        },
        {
            id: 3,
            title: "Key Industries & Monthly Applications",
            points: [
                "Banks & Financial Institutions: Daily savings account and CD interest calculations",
                "Investment Firms: Monthly portfolio growth projections and client reporting",
                "Retirement Planning: 401(k) and IRA compound growth calculations",
                "Insurance Companies: Annuity and life insurance policy value projections",
                "Educational Institutions: Financial literacy and mathematics curriculum",
                "Real Estate: Property value appreciation and mortgage amortization",
                "Government Agencies: Social security and pension fund growth modeling"
            ]
        },
        {
            id: 4,
            title: "Problem Solving & Economic Impact",
            points: [
                "Enables $100+ trillion global wealth creation through systematic investing",
                "Reduces retirement poverty by 60% through disciplined long-term savings",
                "Increases average household wealth by $500K+ over 40-year working life",
                "Powers $50+ trillion mutual fund and pension fund industry growth",
                "Creates millionaires from modest monthly investments over decades",
                "Drives economic growth by channeling savings into productive investments",
                "Provides financial security for 200+ million retirees worldwide"
            ]
        },
        {
            id: 5,
            title: "Revenue & Profit Applications",
            points: [
                "Financial Advisors: Generate $50+ billion annually from investment planning fees",
                "Banking Industry: Earn $1+ trillion from compound interest on loans and deposits",
                "Investment Platforms: Charge $20+ billion in management fees on growing assets",
                "Insurance Companies: Generate $500+ billion from annuity and investment products",
                "Educational Companies: Earn $5+ billion from financial literacy courses",
                "Software Companies: Generate $2+ billion from financial planning software",
                "Publishing: Earn $1+ billion from investment and wealth-building books"
            ]
        },
        {
            id: 6,
            title: "Ordinary People Calculator Uses",
            points: [
                "Young Professionals: Planning early retirement through consistent investing",
                "Parents: Creating college funds for children starting from birth",
                "Retirees: Projecting sustainable withdrawal rates from retirement savings",
                "First-time Investors: Understanding the time value of money",
                "Debt Holders: Calculating the true cost of credit card and loan interest",
                "Home Buyers: Planning for down payments through systematic savings",
                "Entrepreneurs: Projecting business investment returns and growth",
                "Students: Learning fundamental financial mathematics principles"
            ]
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("html", {
                        lang: "en"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                        lineNumber: 142,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        charSet: "utf-8"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                        lineNumber: 143,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        name: "viewport",
                        content: "width=device-width, initial-scale=1"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                        lineNumber: 144,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("title", {
                        children: "Compound Interest Calculator | See How Your Money Grows Over Time"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                        lineNumber: 145,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        name: "description",
                        content: "Calculate future investment value with compound interest. See how your money grows based on principal, rate, time, and compounding frequency."
                    }, void 0, false, {
                        fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                        lineNumber: 146,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("link", {
                        rel: "canonical",
                        href: "/compound-interest-calculator"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                        lineNumber: 147,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                lineNumber: 141,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$compoundinterestcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].page,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$compoundinterestcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].hero,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$compoundinterestcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].title,
                                children: "Compound Interest Calculator"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                lineNumber: 153,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$compoundinterestcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].subtitle,
                                children: "See how your money can grow over time with the power of compound interest."
                            }, void 0, false, {
                                fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                lineNumber: 154,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                        lineNumber: 152,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$compoundinterestcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].calculatorCard,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                                onSubmit: handleSubmit,
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$compoundinterestcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].form,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$compoundinterestcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].instruction,
                                        children: "Enter your investment details to calculate future value."
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                        lineNumber: 162,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$compoundinterestcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].inputGroup,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                htmlFor: "principal",
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$compoundinterestcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].label,
                                                children: "Initial Investment ($)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                                lineNumber: 167,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                id: "principal",
                                                type: "text",
                                                value: principal,
                                                onChange: (e)=>setPrincipal(e.target.value),
                                                placeholder: "e.g. 10,000 or $10K",
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$compoundinterestcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].input
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                                lineNumber: 170,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                        lineNumber: 166,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$compoundinterestcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].inputGroup,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                htmlFor: "interestRate",
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$compoundinterestcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].label,
                                                children: "Annual Interest Rate (%)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                                lineNumber: 181,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                id: "interestRate",
                                                type: "text",
                                                value: interestRate,
                                                onChange: (e)=>setInterestRate(e.target.value),
                                                placeholder: "e.g. 5 or 7.5",
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$compoundinterestcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].input
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                                lineNumber: 184,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                        lineNumber: 180,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$compoundinterestcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].inputGroup,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                htmlFor: "years",
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$compoundinterestcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].label,
                                                children: "Time Period (years)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                                lineNumber: 195,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                id: "years",
                                                type: "text",
                                                value: years,
                                                onChange: (e)=>setYears(e.target.value),
                                                placeholder: "e.g. 10 or 20",
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$compoundinterestcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].input
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                                lineNumber: 198,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                        lineNumber: 194,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$compoundinterestcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].inputGroup,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                htmlFor: "compounding",
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$compoundinterestcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].label,
                                                children: "Compounding Frequency"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                                lineNumber: 209,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                id: "compounding",
                                                value: compounding,
                                                onChange: (e)=>setCompounding(e.target.value),
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$compoundinterestcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].input,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                        value: "1",
                                                        children: "Annually"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                                        lineNumber: 218,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                        value: "2",
                                                        children: "Semi-Annually"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                                        lineNumber: 219,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                        value: "4",
                                                        children: "Quarterly"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                                        lineNumber: 220,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                        value: "12",
                                                        children: "Monthly"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                                        lineNumber: 221,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                        value: "365",
                                                        children: "Daily"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                                        lineNumber: 222,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                                lineNumber: 212,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                        lineNumber: 208,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        type: "submit",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$compoundinterestcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].submitBtn,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$compoundinterestcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].btnText,
                                                children: "Calculate Growth"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                                lineNumber: 227,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$compoundinterestcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].arrow,
                                                children: "→"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                                lineNumber: 228,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                        lineNumber: 226,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                lineNumber: 161,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            result && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$compoundinterestcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].resultSection,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                        children: "Investment Summary"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                        lineNumber: 234,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$compoundinterestcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].resultGrid,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$compoundinterestcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].resultItem,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                        children: "Initial Investment:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                                        lineNumber: 237,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    " $",
                                                    result.principal
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                                lineNumber: 236,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$compoundinterestcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].resultItem,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                        children: "Annual Rate:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                                        lineNumber: 240,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    " ",
                                                    result.rate,
                                                    "%"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                                lineNumber: 239,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$compoundinterestcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].resultItem,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                        children: "Time Period:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                                        lineNumber: 243,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    " ",
                                                    result.years,
                                                    " years"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                                lineNumber: 242,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$compoundinterestcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].resultItem,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                        children: "Compounding:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                                        lineNumber: 246,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    " ",
                                                    result.compounding,
                                                    "x/year"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                                lineNumber: 245,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$compoundinterestcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].resultItem} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$compoundinterestcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].highlight}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                        children: "Future Value:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                                        lineNumber: 249,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    " $",
                                                    result.amount
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                                lineNumber: 248,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$compoundinterestcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].resultItem,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                        children: "Interest Earned:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                                        lineNumber: 252,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    " $",
                                                    result.interest
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                                lineNumber: 251,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$compoundinterestcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].resultItem,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                        children: "Total Growth:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                                        lineNumber: 255,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    " ",
                                                    result.growth,
                                                    "%"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                                lineNumber: 254,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                        lineNumber: 235,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                lineNumber: 233,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                        lineNumber: 160,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$compoundinterestcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].historySection,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$compoundinterestcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].container,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$compoundinterestcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].sectionHeader,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                            children: "Compound Interest Calculator History & Global Applications"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                            lineNumber: 266,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$compoundinterestcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].sectionSubtitle,
                                            children: "Explore the evolution and worldwide impact of compound interest calculation tools"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                            lineNumber: 267,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                    lineNumber: 265,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$compoundinterestcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].cardsGrid,
                                    children: compoundInterestCalculatorHistory.map((card)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$compoundinterestcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].historyCard,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$compoundinterestcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].cardTitle,
                                                    children: card.title
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                                    lineNumber: 275,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$compoundinterestcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].cardList,
                                                    children: card.points.map((point, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$compoundinterestcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].cardListItem,
                                                            children: point
                                                        }, index, false, {
                                                            fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                                            lineNumber: 278,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                                    lineNumber: 276,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, card.id, true, {
                                            fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                            lineNumber: 274,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)))
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                    lineNumber: 272,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                            lineNumber: 264,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                        lineNumber: 263,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$compoundinterestcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].ctaSection,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$compoundinterestcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].container,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                    children: "Free Financial Planning Tools: Budget, Invest & Plan Retirement"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                    lineNumber: 292,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    children: "Free Financial Planning Tools – Try Now"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                    lineNumber: 293,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/suite",
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$compoundinterestcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].ctaButton,
                                    ref: ctaButtonRef,
                                    onMouseMove: handleMouseMove,
                                    "aria-label": "Explore all financial calculators",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$compoundinterestcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].buttonText,
                                            children: "Explore All Calculators"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                            lineNumber: 301,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$compoundinterestcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].arrow,
                                            children: "→"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                            lineNumber: 302,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                                    lineNumber: 294,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                            lineNumber: 291,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                        lineNumber: 290,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/compound-interest-calculator.jsx",
                lineNumber: 150,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true);
};
const __TURBOPACK__default__export__ = CompoundInterestCalculator;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__aa25ba47._.js.map