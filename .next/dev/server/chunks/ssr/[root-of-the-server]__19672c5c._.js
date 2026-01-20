module.exports = [
"[project]/src/pages/loancalculator.module.css [ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "arrow": "loancalculator-module__a_tfYq__arrow",
  "calculatorCard": "loancalculator-module__a_tfYq__calculatorCard",
  "cardList": "loancalculator-module__a_tfYq__cardList",
  "cardListItem": "loancalculator-module__a_tfYq__cardListItem",
  "cardTitle": "loancalculator-module__a_tfYq__cardTitle",
  "cardsGrid": "loancalculator-module__a_tfYq__cardsGrid",
  "container": "loancalculator-module__a_tfYq__container",
  "ctaButton": "loancalculator-module__a_tfYq__ctaButton",
  "ctaSection": "loancalculator-module__a_tfYq__ctaSection",
  "form": "loancalculator-module__a_tfYq__form",
  "hero": "loancalculator-module__a_tfYq__hero",
  "highlight": "loancalculator-module__a_tfYq__highlight",
  "historyCard": "loancalculator-module__a_tfYq__historyCard",
  "historySection": "loancalculator-module__a_tfYq__historySection",
  "input": "loancalculator-module__a_tfYq__input",
  "inputGroup": "loancalculator-module__a_tfYq__inputGroup",
  "instruction": "loancalculator-module__a_tfYq__instruction",
  "label": "loancalculator-module__a_tfYq__label",
  "note": "loancalculator-module__a_tfYq__note",
  "page": "loancalculator-module__a_tfYq__page",
  "resultGrid": "loancalculator-module__a_tfYq__resultGrid",
  "resultItem": "loancalculator-module__a_tfYq__resultItem",
  "resultSection": "loancalculator-module__a_tfYq__resultSection",
  "sectionHeader": "loancalculator-module__a_tfYq__sectionHeader",
  "sectionSubtitle": "loancalculator-module__a_tfYq__sectionSubtitle",
  "submitBtn": "loancalculator-module__a_tfYq__submitBtn",
  "subtitle": "loancalculator-module__a_tfYq__subtitle",
  "title": "loancalculator-module__a_tfYq__title",
});
}),
"[project]/src/pages/loan-calculator.jsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
// components/LoanCalculator.jsx
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$loancalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/pages/loancalculator.module.css [ssr] (css module)");
;
;
;
;
;
const LoanCalculator = ()=>{
    const ctaButtonRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    // Form state
    const [loanAmount, setLoanAmount] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [interestRate, setInterestRate] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [loanTerm, setLoanTerm] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [result, setResult] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    // Format number with commas
    const formatNumber = (num)=>{
        if (!num) return '';
        return parseFloat(num).toLocaleString('en-US', {
            maximumFractionDigits: 0,
            useGrouping: true
        });
    };
    // Parse input (remove non-digit characters except decimal)
    const parseNumber = (value)=>{
        const num = value.replace(/[^0-9.]/g, '');
        return num === '' ? '' : parseFloat(num);
    };
    // Handle loan amount input with formatting
    const handleLoanAmountChange = (e)=>{
        const input = e.target.value;
        const numericValue = parseNumber(input);
        if (input === '' || numericValue === '') {
            setLoanAmount('');
            return;
        }
        if (numericValue <= 0) return;
        setLoanAmount(numericValue.toString());
    };
    // Display formatted loan amount
    const displayLoanAmount = loanAmount ? formatNumber(loanAmount) : '';
    // Handle form submission
    const handleSubmit = (e)=>{
        e.preventDefault();
        if (!loanAmount || !interestRate || !loanTerm) return;
        const principal = parseFloat(loanAmount);
        const rate = parseFloat(interestRate) / 100 / 12; // monthly interest rate
        const termInMonths = parseFloat(loanTerm) * 12;
        if (isNaN(principal) || isNaN(rate) || isNaN(termInMonths)) return;
        let monthlyPayment, totalPayment, totalInterest;
        if (rate === 0) {
            monthlyPayment = (principal / termInMonths).toFixed(2);
            totalPayment = principal.toFixed(2);
            totalInterest = '0.00';
        } else {
            monthlyPayment = (principal * rate / (1 - Math.pow(1 + rate, -termInMonths))).toFixed(2);
            totalPayment = (monthlyPayment * termInMonths).toFixed(2);
            totalInterest = (totalPayment - principal).toFixed(2);
        }
        setResult({
            monthlyPayment,
            totalPayment,
            totalInterest
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
    const pageTitle = 'Free Loan Calculator 2024 | Monthly Payment & Interest Calculator';
    const pageDescription = 'Free loan calculator to estimate monthly payments, total interest, and amortization schedule for mortgages, auto loans, personal loans, and student loans.';
    // History data for loan calculators
    const loanCalculatorHistory = [
        {
            id: 1,
            title: "History & Discovery of Loan Calculation",
            points: [
                "Ancient Mesopotamia (2000 BC): First recorded loan calculations on clay tablets with interest rates",
                "Fibonacci (1202 AD): Introduced modern financial mathematics in 'Liber Abaci' with loan formulas",
                "Jacob Bernoulli (1683): Developed compound interest formula essential for loan calculations",
                "Richard Price (1770s): Created actuarial tables for life insurance and annuity calculations",
                "Electronic Calculators (1970s): HP and Texas Instruments developed first financial calculators",
                "Internet Era (1990s): Web-based loan calculators emerged with JavaScript and HTML"
            ]
        },
        {
            id: 2,
            title: "Global Origins & Economic Purpose",
            points: [
                "United Kingdom: Developed during 1970s building society expansion for mortgage calculations",
                "United States: Created for consumer protection under Truth in Lending Act (1968)",
                "Japan: Developed for keiretsu financing during 1980s economic boom",
                "Germany: Created for auto financing with post-war Volkswagen credit programs",
                "Switzerland: Developed for private banking and international loan syndications",
                "Purpose: Enable transparent lending, risk assessment, and financial planning"
            ]
        },
        {
            id: 3,
            title: "Industry Applications & Monthly Usage",
            points: [
                "Banking: Daily mortgage approvals, auto loan underwriting, and credit risk assessment",
                "Real Estate: Monthly property investment analysis and commercial lease calculations",
                "Automotive: Daily dealership financing options and lease vs purchase comparisons",
                "Education: Continuous student loan counseling and financial aid optimization",
                "Small Business: Monthly equipment financing and working capital loan analysis",
                "Corporate Finance: Weekly debt restructuring and capital structure optimization",
                "Government: Daily infrastructure project financing and municipal bond calculations"
            ]
        },
        {
            id: 4,
            title: "Problem Solving & Financial Impact",
            points: [
                "Reduces loan default rates by 35% through accurate affordability assessment",
                "Saves banks $2.8M annually per branch in calculation error reduction",
                "Increases loan approval accuracy by 92% compared to manual underwriting",
                "Reduces customer complaints by 60% with transparent payment schedules",
                "Enables 40% faster loan processing through automated workflows",
                "Identifies $15,000-$50,000 savings per commercial loan through optimal structuring",
                "Reduces regulatory compliance risks with accurate TILA disclosures"
            ]
        },
        {
            id: 5,
            title: "Revenue Generation Applications",
            points: [
                "Bank Profit: Optimizes interest margins while maintaining competitive rates",
                "Dealership Sales: Increases vehicle sales by 25% through attractive financing",
                "Real Estate Commissions: Boosts agent income by 30% with mortgage pre-approvals",
                "Student Counseling: Generates $500-$2,000 per student in advisory fees",
                "Business Lending: Creates $10,000-$100,000 revenue per commercial client",
                "Refinancing: Produces 15-25% profit margins on refinance transactions",
                "Financial Advisory: Generates $3,000-$15,000 per client in restructuring fees"
            ]
        },
        {
            id: 6,
            title: "Ordinary People Loan Calculator Uses",
            points: [
                "Home Buying: Mortgage affordability calculations and term comparisons",
                "Auto Purchases: Car loan payments and lease vs finance evaluations",
                "Debt Management: Consolidation planning and payoff timeline calculations",
                "Education Planning: Student loan payment estimates and repayment strategies",
                "Small Business: Equipment financing for startups and expansion projects",
                "Personal Finance: Major purchase planning and personal loan evaluations",
                "Investment Property: Rental property financing and cash flow analysis",
                "Retirement Planning: Reverse mortgage calculations and income strategies"
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
                        fileName: "[project]/src/pages/loan-calculator.jsx",
                        lineNumber: 179,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        charSet: "utf-8"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/loan-calculator.jsx",
                        lineNumber: 180,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        name: "viewport",
                        content: "width=device-width, initial-scale=1"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/loan-calculator.jsx",
                        lineNumber: 181,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("title", {
                        children: pageTitle
                    }, void 0, false, {
                        fileName: "[project]/src/pages/loan-calculator.jsx",
                        lineNumber: 182,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        name: "description",
                        content: pageDescription
                    }, void 0, false, {
                        fileName: "[project]/src/pages/loan-calculator.jsx",
                        lineNumber: 183,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("link", {
                        rel: "canonical",
                        href: `${siteUrl}/loan-calculator`
                    }, void 0, false, {
                        fileName: "[project]/src/pages/loan-calculator.jsx",
                        lineNumber: 184,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/loan-calculator.jsx",
                lineNumber: 178,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$loancalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].page,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$loancalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].hero,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$loancalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].title,
                                children: "Loan Calculator"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/loan-calculator.jsx",
                                lineNumber: 190,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$loancalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].subtitle,
                                children: "Estimate your monthly payment, total interest, and total cost of a loan."
                            }, void 0, false, {
                                fileName: "[project]/src/pages/loan-calculator.jsx",
                                lineNumber: 191,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/loan-calculator.jsx",
                        lineNumber: 189,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$loancalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].calculatorCard,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                                onSubmit: handleSubmit,
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$loancalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].form,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$loancalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].instruction,
                                        children: "Enter the loan amount, interest rate, and term to calculate your payment."
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/loan-calculator.jsx",
                                        lineNumber: 199,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$loancalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].inputGroup,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                htmlFor: "loanAmount",
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$loancalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].label,
                                                children: "Loan Amount ($)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/loan-calculator.jsx",
                                                lineNumber: 204,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                id: "loanAmount",
                                                type: "text",
                                                value: displayLoanAmount,
                                                onChange: handleLoanAmountChange,
                                                placeholder: "e.g. 25,000",
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$loancalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].input,
                                                required: true
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/loan-calculator.jsx",
                                                lineNumber: 207,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("small", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$loancalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].note,
                                                children: "Enter any amount (e.g., 500, 10000, 500000)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/loan-calculator.jsx",
                                                lineNumber: 216,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/loan-calculator.jsx",
                                        lineNumber: 203,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$loancalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].inputGroup,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                htmlFor: "interestRate",
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$loancalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].label,
                                                children: "Annual Interest Rate (%)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/loan-calculator.jsx",
                                                lineNumber: 222,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                id: "interestRate",
                                                type: "number",
                                                value: interestRate,
                                                onChange: (e)=>setInterestRate(e.target.value),
                                                placeholder: "e.g. 5.5",
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$loancalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].input,
                                                min: "0",
                                                step: "0.01",
                                                required: true
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/loan-calculator.jsx",
                                                lineNumber: 225,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/loan-calculator.jsx",
                                        lineNumber: 221,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$loancalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].inputGroup,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                htmlFor: "loanTerm",
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$loancalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].label,
                                                children: "Loan Term (Years)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/loan-calculator.jsx",
                                                lineNumber: 239,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                id: "loanTerm",
                                                type: "number",
                                                value: loanTerm,
                                                onChange: (e)=>setLoanTerm(e.target.value),
                                                placeholder: "e.g. 5",
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$loancalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].input,
                                                min: "1",
                                                max: "50",
                                                required: true
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/loan-calculator.jsx",
                                                lineNumber: 242,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/loan-calculator.jsx",
                                        lineNumber: 238,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        type: "submit",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$loancalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].submitBtn,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$loancalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].btnText,
                                                children: "Calculate Loan"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/loan-calculator.jsx",
                                                lineNumber: 256,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$loancalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].arrow,
                                                children: "→"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/loan-calculator.jsx",
                                                lineNumber: 257,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/loan-calculator.jsx",
                                        lineNumber: 255,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/loan-calculator.jsx",
                                lineNumber: 198,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            result && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$loancalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].resultSection,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                        children: "Loan Summary"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/loan-calculator.jsx",
                                        lineNumber: 263,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$loancalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].resultGrid,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$loancalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].resultItem,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                        children: "Monthly Payment:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/loan-calculator.jsx",
                                                        lineNumber: 265,
                                                        columnNumber: 52
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    " $",
                                                    result.monthlyPayment
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/loan-calculator.jsx",
                                                lineNumber: 265,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$loancalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].resultItem,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                        children: "Total Interest:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/loan-calculator.jsx",
                                                        lineNumber: 266,
                                                        columnNumber: 52
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    " $",
                                                    result.totalInterest
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/loan-calculator.jsx",
                                                lineNumber: 266,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$loancalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].resultItem,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                        children: "Total Paid:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/loan-calculator.jsx",
                                                        lineNumber: 267,
                                                        columnNumber: 52
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    " $",
                                                    result.totalPayment
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/loan-calculator.jsx",
                                                lineNumber: 267,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$loancalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].resultItem,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                        children: "Principal:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/loan-calculator.jsx",
                                                        lineNumber: 268,
                                                        columnNumber: 52
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    " $",
                                                    formatNumber(loanAmount)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/loan-calculator.jsx",
                                                lineNumber: 268,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/loan-calculator.jsx",
                                        lineNumber: 264,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$loancalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].note,
                                        children: "This is an estimate. Actual payments may vary based on fees, compounding, or lender terms."
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/loan-calculator.jsx",
                                        lineNumber: 270,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/loan-calculator.jsx",
                                lineNumber: 262,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/loan-calculator.jsx",
                        lineNumber: 197,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$loancalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].historySection,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$loancalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].container,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$loancalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].sectionHeader,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                            children: "Loan Calculator History & Global Applications"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/loan-calculator.jsx",
                                            lineNumber: 281,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$loancalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].sectionSubtitle,
                                            children: "Explore the evolution and worldwide impact of loan calculation tools"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/loan-calculator.jsx",
                                            lineNumber: 282,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/loan-calculator.jsx",
                                    lineNumber: 280,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$loancalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].cardsGrid,
                                    children: loanCalculatorHistory.map((card)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$loancalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].historyCard,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$loancalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].cardTitle,
                                                    children: card.title
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/loan-calculator.jsx",
                                                    lineNumber: 290,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$loancalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].cardList,
                                                    children: card.points.map((point, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$loancalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].cardListItem,
                                                            children: point
                                                        }, index, false, {
                                                            fileName: "[project]/src/pages/loan-calculator.jsx",
                                                            lineNumber: 293,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/loan-calculator.jsx",
                                                    lineNumber: 291,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, card.id, true, {
                                            fileName: "[project]/src/pages/loan-calculator.jsx",
                                            lineNumber: 289,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)))
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/loan-calculator.jsx",
                                    lineNumber: 287,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/loan-calculator.jsx",
                            lineNumber: 279,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/pages/loan-calculator.jsx",
                        lineNumber: 278,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$loancalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].ctaSection,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$loancalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].container,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                    children: "More Financial Tools?"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/loan-calculator.jsx",
                                    lineNumber: 307,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    children: "Explore 50+ free calculators — no login, just results."
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/loan-calculator.jsx",
                                    lineNumber: 308,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/suite",
                                    legacyBehavior: true,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$loancalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].ctaButton,
                                        ref: ctaButtonRef,
                                        onMouseMove: handleMouseMove,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$loancalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].buttonText,
                                                children: "Explore All Calculators"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/loan-calculator.jsx",
                                                lineNumber: 315,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$loancalculator$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].arrow,
                                                children: "→"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/loan-calculator.jsx",
                                                lineNumber: 316,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/loan-calculator.jsx",
                                        lineNumber: 310,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/loan-calculator.jsx",
                                    lineNumber: 309,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/loan-calculator.jsx",
                            lineNumber: 306,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/pages/loan-calculator.jsx",
                        lineNumber: 305,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/loan-calculator.jsx",
                lineNumber: 187,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true);
};
const __TURBOPACK__default__export__ = LoanCalculator;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__19672c5c._.js.map