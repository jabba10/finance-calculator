module.exports = [
"[project]/src/pages/valuationcalculator.module.css [ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "arrow": "valuationcalculator-module__3wS3gq__arrow",
  "btnText": "valuationcalculator-module__3wS3gq__btnText",
  "buttonText": "valuationcalculator-module__3wS3gq__buttonText",
  "calculatorCard": "valuationcalculator-module__3wS3gq__calculatorCard",
  "cardList": "valuationcalculator-module__3wS3gq__cardList",
  "cardListItem": "valuationcalculator-module__3wS3gq__cardListItem",
  "cardTitle": "valuationcalculator-module__3wS3gq__cardTitle",
  "cardsGrid": "valuationcalculator-module__3wS3gq__cardsGrid",
  "container": "valuationcalculator-module__3wS3gq__container",
  "ctaButton": "valuationcalculator-module__3wS3gq__ctaButton",
  "ctaSection": "valuationcalculator-module__3wS3gq__ctaSection",
  "form": "valuationcalculator-module__3wS3gq__form",
  "hero": "valuationcalculator-module__3wS3gq__hero",
  "highlight": "valuationcalculator-module__3wS3gq__highlight",
  "historyCard": "valuationcalculator-module__3wS3gq__historyCard",
  "historySection": "valuationcalculator-module__3wS3gq__historySection",
  "input": "valuationcalculator-module__3wS3gq__input",
  "inputGroup": "valuationcalculator-module__3wS3gq__inputGroup",
  "instruction": "valuationcalculator-module__3wS3gq__instruction",
  "label": "valuationcalculator-module__3wS3gq__label",
  "note": "valuationcalculator-module__3wS3gq__note",
  "page": "valuationcalculator-module__3wS3gq__page",
  "radioGroup": "valuationcalculator-module__3wS3gq__radioGroup",
  "radioLabel": "valuationcalculator-module__3wS3gq__radioLabel",
  "resultGrid": "valuationcalculator-module__3wS3gq__resultGrid",
  "resultItem": "valuationcalculator-module__3wS3gq__resultItem",
  "resultSection": "valuationcalculator-module__3wS3gq__resultSection",
  "sectionHeader": "valuationcalculator-module__3wS3gq__sectionHeader",
  "sectionSubtitle": "valuationcalculator-module__3wS3gq__sectionSubtitle",
  "spacerBottom": "valuationcalculator-module__3wS3gq__spacerBottom",
  "spacerTop": "valuationcalculator-module__3wS3gq__spacerTop",
  "submitBtn": "valuationcalculator-module__3wS3gq__submitBtn",
  "subtitle": "valuationcalculator-module__3wS3gq__subtitle",
  "title": "valuationcalculator-module__3wS3gq__title",
});
}),
"[project]/src/pages/business-valuation-calculator.jsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$valuationcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/pages/valuationcalculator.module.css [ssr] (css module)");
;
;
;
;
;
const ValuationCalculator = ()=>{
    const ctaButtonRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    // Form state
    const [revenue, setRevenue] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [profit, setProfit] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [industryMultiplier, setIndustryMultiplier] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('2.5');
    const [valuationMethod, setValuationMethod] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('revenue');
    const [result, setResult] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    // Helper: Extract first number from any string
    const parseNumber = (input)=>{
        if (!input) return NaN;
        // Remove commas and match the first number (including decimals)
        const match = input.toString().replace(/,/g, '').match(/\d+(\.\d+)?/);
        return match ? parseFloat(match[0]) : NaN;
    };
    // Handle form submission
    const handleSubmit = (e)=>{
        e.preventDefault();
        setResult(null);
        // Default values
        let revenueValue = 0;
        let profitValue = 0;
        let multiplier = 2.5; // default multiplier
        // Parse revenue if method is revenue
        if (valuationMethod === 'revenue') {
            const parsed = parseNumber(revenue);
            revenueValue = !isNaN(parsed) ? parsed : 0;
        }
        // Parse profit if method is profit
        if (valuationMethod === 'profit') {
            const parsed = parseNumber(profit);
            profitValue = !isNaN(parsed) ? parsed : 0;
        }
        // Always parse multiplier (never fail)
        const parsedMultiplier = parseNumber(industryMultiplier);
        if (!isNaN(parsedMultiplier) && parsedMultiplier > 0) {
            multiplier = parsedMultiplier;
        }
        // Calculate valuation
        const valuation = valuationMethod === 'revenue' ? revenueValue * multiplier : profitValue * multiplier;
        const methodUsed = valuationMethod === 'revenue' ? `Revenue Multiple (${multiplier.toFixed(1)}x)` : `Profit Multiple (${multiplier.toFixed(1)}x)`;
        // Format for display
        setResult({
            revenue: revenueValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }),
            profit: profitValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }),
            multiplier: multiplier.toFixed(1),
            valuation: valuation.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }),
            methodUsed,
            valuationMethod
        });
    };
    // Magnetic effect on CTA button
    const handleMouseMove = (e)=>{
        const el = ctaButtonRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        el.style.setProperty('--x', `${x}px`);
        el.style.setProperty('--y', `${y}px`);
    };
    // SEO Metadata
    const siteUrl = 'https://www.financecalculatorfree.com';
    const pageTitle = 'Business Valuation Calculator | Free Tool to Estimate Company Worth';
    const pageDescription = 'Estimate your company\'s value using industry-standard multiples. Perfect for startups, investors, and business owners planning exits or funding.';
    // Business Valuation History Data
    const businessValuationHistory = [
        {
            id: 1,
            title: "History & Discovery of Business Valuation",
            points: [
                "1910s Wall Street: Investment bankers created valuation multiples for railroad company mergers",
                "1930s Great Depression: SEC mandated standardized business valuation for public company reporting",
                "1950s Corporate America: Fortune 500 companies developed internal valuation models for acquisitions",
                "1970s Leveraged Buyouts: Private equity firms pioneered EBITDA-based valuation methods",
                "1990s Dot-com Bubble: Technology startups introduced revenue-based valuation disregarding profits",
                "2000s Global Finance: International accounting standards unified valuation methodologies worldwide"
            ]
        },
        {
            id: 2,
            title: "Global Origins & Business Purpose",
            points: [
                "United States: Wall Street investment banks created valuation for IPO pricing and M&A deals",
                "United Kingdom: London financial district established valuation for cross-border acquisitions",
                "Germany: Manufacturing conglomerates developed asset-based valuation for engineering companies",
                "Japan: Keiretsu business groups used valuation for inter-company shareholding decisions",
                "Switzerland: Private banking institutions perfected valuation for family office investments",
                "Purpose: Determine fair market value, facilitate transactions, and optimize capital allocation"
            ]
        },
        {
            id: 3,
            title: "Key Industries & Monthly Applications",
            points: [
                "Investment Banking: Weekly valuation updates for active M&A deal negotiations",
                "Private Equity: Quarterly portfolio company valuations for investor reporting",
                "Venture Capital: Continuous startup valuation for funding round pricing",
                "Corporate Development: Monthly valuation analysis for strategic acquisition targeting",
                "Commercial Banking: Credit risk valuation for business loan collateral assessment",
                "Accounting Firms: Annual business valuation for financial statement compliance",
                "Legal Practices: Valuation for divorce settlements, estate planning, and litigation"
            ]
        },
        {
            id: 4,
            title: "Problem Solving & Financial Impact",
            points: [
                "Prevents 20-40% valuation errors in mergers and acquisitions through accurate pricing",
                "Increases transaction success rates by 30-50% through realistic buyer-seller alignment",
                "Reduces legal disputes by 60-80% through defensible valuation methodologies",
                "Improves capital raising efficiency by 25-40% through optimal pricing strategies",
                "Enables 15-25% higher sale prices through proper value communication and negotiation",
                "Reduces tax liabilities by 10-30% through strategic valuation planning",
                "Prevents 50-70% of failed acquisitions through thorough due diligence valuation"
            ]
        },
        {
            id: 5,
            title: "Revenue Generation Applications",
            points: [
                "Investment Banking: Earn 1-5% transaction fees on valuation-driven M&A deals",
                "Valuation Firms: Charge $10,000-$100,000 for comprehensive business appraisals",
                "Private Equity: Generate 20-30% IRR through accurate valuation of turnaround targets",
                "Consulting Services: Bill $25,000-$250,000 for valuation improvement strategy projects",
                "Financial Software: Sell $5,000-$50,000 valuation modeling and analysis platforms",
                "Educational Programs: Generate $1,000-$10,000 per student for valuation certification courses",
                "Expert Witness: Earn $300-$800 per hour for litigation support valuation testimony"
            ]
        },
        {
            id: 6,
            title: "Ordinary People Business Valuation Calculator Uses",
            points: [
                "Small Business Owners: Estimating sale price for retirement or succession planning",
                "Startup Founders: Determining pre-money valuation for investor pitch negotiations",
                "Franchise Buyers: Comparing different franchise opportunity values",
                "Online Business Sellers: Pricing e-commerce stores for Flippa or Empire Flippers",
                "Real Estate Investors: Valuing property management companies for acquisition",
                "Service Business Owners: Assessing consulting or agency practice worth",
                "Restaurant Owners: Calculating sale value for family-owned establishments",
                "Retail Store Owners: Estimating worth for expansion or exit planning"
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
                        fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                        lineNumber: 172,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        charSet: "utf-8"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                        lineNumber: 173,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        name: "viewport",
                        content: "width=device-width, initial-scale=1"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                        lineNumber: 174,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("title", {
                        children: pageTitle
                    }, void 0, false, {
                        fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                        lineNumber: 175,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        name: "description",
                        content: pageDescription
                    }, void 0, false, {
                        fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                        lineNumber: 176,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("link", {
                        rel: "canonical",
                        href: `${siteUrl}/business-valuation-calculator`
                    }, void 0, false, {
                        fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                        lineNumber: 177,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                lineNumber: 171,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$valuationcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].page,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$valuationcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].hero,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$valuationcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].title,
                                children: "Business Valuation Calculator"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                lineNumber: 183,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$valuationcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].subtitle,
                                children: "Estimate your company's worth using industry-standard valuation methods."
                            }, void 0, false, {
                                fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                lineNumber: 184,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                        lineNumber: 182,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$valuationcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].calculatorCard,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                                onSubmit: handleSubmit,
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$valuationcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].form,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$valuationcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].instruction,
                                        children: "Select method and enter financial data — we extract numbers from any format (e.g., $500K, 1.2M, 3x)."
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                        lineNumber: 192,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$valuationcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].inputGroup,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$valuationcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].label,
                                                children: "Valuation Method"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                                lineNumber: 197,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$valuationcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].radioGroup,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$valuationcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].radioLabel,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                type: "radio",
                                                                name: "valuationMethod",
                                                                value: "revenue",
                                                                checked: valuationMethod === 'revenue',
                                                                onChange: ()=>setValuationMethod('revenue')
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                                                lineNumber: 200,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                children: "Revenue Multiple"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                                                lineNumber: 207,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                                        lineNumber: 199,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$valuationcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].radioLabel,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                type: "radio",
                                                                name: "valuationMethod",
                                                                value: "profit",
                                                                checked: valuationMethod === 'profit',
                                                                onChange: ()=>setValuationMethod('profit')
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                                                lineNumber: 210,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                children: "Profit Multiple"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                                                lineNumber: 217,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                                        lineNumber: 209,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                                lineNumber: 198,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                        lineNumber: 196,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    valuationMethod === 'revenue' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$valuationcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].inputGroup,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                htmlFor: "revenue",
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$valuationcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].label,
                                                children: "Annual Revenue ($)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                                lineNumber: 224,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                id: "revenue",
                                                type: "text",
                                                value: revenue,
                                                onChange: (e)=>setRevenue(e.target.value),
                                                placeholder: "e.g. $500,000 or 500K",
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$valuationcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].input
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                                lineNumber: 227,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                        lineNumber: 223,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    valuationMethod === 'profit' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$valuationcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].inputGroup,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                htmlFor: "profit",
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$valuationcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].label,
                                                children: "Annual Profit ($)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                                lineNumber: 240,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                id: "profit",
                                                type: "text",
                                                value: profit,
                                                onChange: (e)=>setProfit(e.target.value),
                                                placeholder: "e.g. $150,000 or 150K",
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$valuationcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].input
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                                lineNumber: 243,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                        lineNumber: 239,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$valuationcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].inputGroup,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                htmlFor: "industryMultiplier",
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$valuationcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].label,
                                                children: "Industry Multiplier"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                                lineNumber: 255,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                id: "industryMultiplier",
                                                type: "text",
                                                value: industryMultiplier,
                                                onChange: (e)=>setIndustryMultiplier(e.target.value),
                                                placeholder: "e.g. 2.5 or 5x",
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$valuationcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].input
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                                lineNumber: 258,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("small", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$valuationcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].note,
                                                children: valuationMethod === 'revenue' ? 'Typical range: 0.5x to 5x revenue' : 'Typical range: 2x to 10x profit'
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                                lineNumber: 266,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                        lineNumber: 254,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        type: "submit",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$valuationcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].submitBtn,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$valuationcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].btnText,
                                                children: "Calculate Valuation"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                                lineNumber: 274,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$valuationcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].arrow,
                                                children: "→"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                                lineNumber: 275,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                        lineNumber: 273,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                lineNumber: 191,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            result && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$valuationcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].resultSection,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                        children: "Valuation Estimate"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                        lineNumber: 281,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$valuationcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].resultGrid,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$valuationcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].resultItem,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                        children: "Method Used:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                                        lineNumber: 284,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    " ",
                                                    result.methodUsed
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                                lineNumber: 283,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            result.valuationMethod === 'revenue' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$valuationcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].resultItem,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                        children: "Annual Revenue:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                                        lineNumber: 288,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    " $",
                                                    result.revenue
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                                lineNumber: 287,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            result.valuationMethod === 'profit' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$valuationcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].resultItem,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                        children: "Annual Profit:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                                        lineNumber: 293,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    " $",
                                                    result.profit
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                                lineNumber: 292,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$valuationcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].resultItem,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                        children: "Industry Multiplier:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                                        lineNumber: 297,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    " ",
                                                    result.multiplier,
                                                    "x"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                                lineNumber: 296,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$valuationcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].resultItem} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$valuationcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].highlight}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                        children: "Estimated Valuation:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                                        lineNumber: 300,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    " $",
                                                    result.valuation
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                                lineNumber: 299,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                        lineNumber: 282,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$valuationcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].note,
                                        children: [
                                            "Based on ",
                                            result.methodUsed.toLowerCase(),
                                            ", your business is valued at approximately",
                                            ' ',
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                children: [
                                                    "$",
                                                    result.valuation
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                                lineNumber: 305,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            "."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                        lineNumber: 303,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                lineNumber: 280,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                        lineNumber: 190,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$valuationcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].historySection,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$valuationcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].container,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$valuationcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].sectionHeader,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                            children: "Business Valuation Calculator History & Global Applications"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                            lineNumber: 315,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$valuationcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].sectionSubtitle,
                                            children: "Explore the evolution and worldwide impact of business valuation calculation tools"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                            lineNumber: 316,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                    lineNumber: 314,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$valuationcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].cardsGrid,
                                    children: businessValuationHistory.map((card)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$valuationcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].historyCard,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$valuationcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].cardTitle,
                                                    children: card.title
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                                    lineNumber: 324,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$valuationcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].cardList,
                                                    children: card.points.map((point, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$valuationcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].cardListItem,
                                                            children: point
                                                        }, index, false, {
                                                            fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                                            lineNumber: 327,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                                    lineNumber: 325,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, card.id, true, {
                                            fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                            lineNumber: 323,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)))
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                    lineNumber: 321,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                            lineNumber: 313,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                        lineNumber: 312,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$valuationcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].ctaSection,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$valuationcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].container,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                    children: "Free Financial Planning Tools: Budget, Invest & Plan Retirement"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                    lineNumber: 341,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    children: "Free Financial Planning Tools – Try Now"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                    lineNumber: 342,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/suite",
                                    legacyBehavior: true,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$valuationcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].ctaButton,
                                        ref: ctaButtonRef,
                                        onMouseMove: handleMouseMove,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$valuationcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].buttonText,
                                                children: "Explore All Calculators"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                                lineNumber: 349,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$valuationcalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].arrow,
                                                children: "→"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                                lineNumber: 350,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                        lineNumber: 344,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                                    lineNumber: 343,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                            lineNumber: 340,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                        lineNumber: 339,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/business-valuation-calculator.jsx",
                lineNumber: 180,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true);
};
const __TURBOPACK__default__export__ = ValuationCalculator;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__d46f816d._.js.map