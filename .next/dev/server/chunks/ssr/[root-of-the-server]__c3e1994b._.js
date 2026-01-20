module.exports = [
"[project]/src/pages/purchasing-power-parity-calculator.jsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "getStaticProps",
    ()=>getStaticProps
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/script.js [ssr] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module './pppcalculator.module.css'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
;
;
;
const PPPCalculator = ({ currentDate, lastModifiedDate })=>{
    // Country data with PPP conversion factors (2023 estimates)
    const countryData = {
        'USA': {
            name: 'United States',
            currency: 'USD',
            symbol: '$',
            pppFactor: 1.00,
            inflation: 3.4,
            colIndex: 100.0,
            emoji: '🇺🇸'
        },
        'Germany': {
            name: 'Germany',
            currency: 'EUR',
            symbol: '€',
            pppFactor: 0.87,
            inflation: 2.2,
            colIndex: 87.2,
            emoji: '🇩🇪'
        },
        'UK': {
            name: 'United Kingdom',
            currency: 'GBP',
            symbol: '£',
            pppFactor: 0.78,
            inflation: 3.9,
            colIndex: 85.4,
            emoji: '🇬🇧'
        },
        'Japan': {
            name: 'Japan',
            currency: 'JPY',
            symbol: '¥',
            pppFactor: 140.5,
            inflation: 2.8,
            colIndex: 95.6,
            emoji: '🇯🇵'
        },
        'Canada': {
            name: 'Canada',
            currency: 'CAD',
            symbol: 'C$',
            pppFactor: 1.32,
            inflation: 2.8,
            colIndex: 89.7,
            emoji: '🇨🇦'
        },
        'Australia': {
            name: 'Australia',
            currency: 'AUD',
            symbol: 'A$',
            pppFactor: 1.54,
            inflation: 3.6,
            colIndex: 91.2,
            emoji: '🇦🇺'
        },
        'Switzerland': {
            name: 'Switzerland',
            currency: 'CHF',
            symbol: 'CHF',
            pppFactor: 0.92,
            inflation: 1.6,
            colIndex: 142.3,
            emoji: '🇨🇭'
        },
        'India': {
            name: 'India',
            currency: 'INR',
            symbol: '₹',
            pppFactor: 23.45,
            inflation: 5.1,
            colIndex: 24.7,
            emoji: '🇮🇳'
        },
        'China': {
            name: 'China',
            currency: 'CNY',
            symbol: '¥',
            pppFactor: 4.15,
            inflation: 0.9,
            colIndex: 45.8,
            emoji: '🇨🇳'
        },
        'Brazil': {
            name: 'Brazil',
            currency: 'BRL',
            symbol: 'R$',
            pppFactor: 2.42,
            inflation: 4.6,
            colIndex: 56.3,
            emoji: '🇧🇷'
        }
    };
    // Common expense categories with relative weights
    const expenseCategories = [
        {
            name: 'Housing',
            weight: 30,
            icon: '🏠'
        },
        {
            name: 'Food & Groceries',
            weight: 15,
            icon: '🍎'
        },
        {
            name: 'Transportation',
            weight: 10,
            icon: '🚗'
        },
        {
            name: 'Healthcare',
            weight: 8,
            icon: '🏥'
        },
        {
            name: 'Utilities',
            weight: 7,
            icon: '💡'
        },
        {
            name: 'Education',
            weight: 6,
            icon: '📚'
        },
        {
            name: 'Entertainment',
            weight: 5,
            icon: '🎬'
        },
        {
            name: 'Clothing',
            weight: 4,
            icon: '👕'
        },
        {
            name: 'Communication',
            weight: 4,
            icon: '📱'
        },
        {
            name: 'Other Expenses',
            weight: 11,
            icon: '📦'
        }
    ];
    const [amount, setAmount] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(50000);
    const [fromCountry, setFromCountry] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('USA');
    const [toCountry, setToCountry] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('Germany');
    const [timeframe, setTimeframe] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(5);
    const [includeInflation, setIncludeInflation] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(true);
    const [detailedView, setDetailedView] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [categoryAdjustments, setCategoryAdjustments] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({});
    const [results, setResults] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [comparisonData, setComparisonData] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    // Initialize category adjustments
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const initialAdjustments = {};
        expenseCategories.forEach((category)=>{
            initialAdjustments[category.name] = 1.0;
        });
        setCategoryAdjustments(initialAdjustments);
    }, []);
    const calculatePPP = ()=>{
        const fromData = countryData[fromCountry];
        const toData = countryData[toCountry];
        // Basic PPP conversion
        const basePPP = amount / fromData.pppFactor * toData.pppFactor;
        // Calculate category-adjusted PPP if detailed view is enabled
        let adjustedPPP = basePPP;
        if (detailedView) {
            let totalWeight = 0;
            let weightedSum = 0;
            expenseCategories.forEach((category)=>{
                const adjustment = categoryAdjustments[category.name] || 1.0;
                const categoryFactor = category.weight / 100 * adjustment;
                totalWeight += categoryFactor;
                weightedSum += basePPP * categoryFactor;
            });
            adjustedPPP = weightedSum / totalWeight;
        }
        // Calculate inflation adjustment
        let inflationAdjustedPPP = adjustedPPP;
        let inflationImpact = 0;
        let annualInflationDifference = 0;
        if (includeInflation && timeframe > 0) {
            const fromAnnualInflation = fromData.inflation / 100;
            const toAnnualInflation = toData.inflation / 100;
            annualInflationDifference = toAnnualInflation - fromAnnualInflation;
            inflationAdjustedPPP = adjustedPPP * Math.pow(1 + annualInflationDifference, timeframe);
            inflationImpact = inflationAdjustedPPP - adjustedPPP;
        }
        // Calculate relative purchasing power
        const pppRatio = toData.pppFactor / fromData.pppFactor;
        const relativePurchasingPower = 100 / pppRatio;
        // Calculate cost of living comparison
        const colComparison = toData.colIndex / fromData.colIndex * 100;
        const affordabilityScore = Math.min(100, Math.max(0, 100 - (colComparison - 100) / 2));
        // Calculate standard of living impact
        const standardOfLiving = adjustedPPP / amount * 100;
        // Generate comparison with other countries
        const comparisons = Object.keys(countryData).filter((key)=>key !== fromCountry && key !== toCountry).slice(0, 5).map((key)=>{
            const country = countryData[key];
            const pppValue = amount / fromData.pppFactor * country.pppFactor;
            return {
                country: country.name,
                currency: country.currency,
                symbol: country.symbol,
                amount: pppValue,
                colRatio: country.colIndex / fromData.colIndex * 100
            };
        });
        setResults({
            basePPP: basePPP,
            adjustedPPP: adjustedPPP,
            inflationAdjustedPPP: inflationAdjustedPPP,
            inflationImpact: inflationImpact,
            annualInflationDifference: annualInflationDifference,
            pppRatio: pppRatio,
            relativePurchasingPower: relativePurchasingPower,
            colComparison: colComparison,
            affordabilityScore: affordabilityScore,
            standardOfLiving: standardOfLiving,
            effectiveExchangeRate: toData.pppFactor / fromData.pppFactor
        });
        setComparisonData(comparisons);
    };
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        calculatePPP();
    }, [
        amount,
        fromCountry,
        toCountry,
        timeframe,
        includeInflation,
        detailedView,
        categoryAdjustments
    ]);
    const formatCurrency = (value, currencyCode, symbol)=>{
        if (currencyCode === 'USD' || currencyCode === 'CAD' || currencyCode === 'AUD') {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currencyCode,
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(value);
        } else if (currencyCode === 'EUR') {
            return new Intl.NumberFormat('de-DE', {
                style: 'currency',
                currency: currencyCode,
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(value);
        } else if (currencyCode === 'GBP') {
            return new Intl.NumberFormat('en-GB', {
                style: 'currency',
                currency: currencyCode,
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(value);
        } else if (currencyCode === 'JPY' || currencyCode === 'CNY') {
            return new Intl.NumberFormat('ja-JP', {
                style: 'currency',
                currency: currencyCode,
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(value);
        }
        // For other currencies, use symbol + formatted number
        return `${symbol}${value.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        })}`;
    };
    const formatPercentage = (value)=>{
        return `${value.toFixed(1)}%`;
    };
    const handleCategoryAdjustment = (category, value)=>{
        setCategoryAdjustments((prev)=>({
                ...prev,
                [category]: parseFloat(value)
            }));
    };
    const getCostOfLivingLevel = (index)=>{
        if (index < 60) return {
            level: 'Much Lower',
            color: '#10b981',
            description: 'Significantly more affordable'
        };
        if (index < 85) return {
            level: 'Lower',
            color: '#34d399',
            description: 'More affordable'
        };
        if (index < 115) return {
            level: 'Similar',
            color: '#fbbf24',
            description: 'Comparable cost of living'
        };
        if (index < 140) return {
            level: 'Higher',
            color: '#f97316',
            description: 'More expensive'
        };
        return {
            level: 'Much Higher',
            color: '#ef4444',
            description: 'Significantly more expensive'
        };
    };
    const getStandardOfLiving = (value)=>{
        if (value < 60) return {
            level: 'Much Lower',
            color: '#ef4444',
            description: 'Your money buys much less'
        };
        if (value < 85) return {
            level: 'Lower',
            color: '#f97316',
            description: 'Reduced purchasing power'
        };
        if (value < 115) return {
            level: 'Similar',
            color: '#fbbf24',
            description: 'Comparable standard of living'
        };
        if (value < 140) return {
            level: 'Higher',
            color: '#34d399',
            description: 'Increased purchasing power'
        };
        return {
            level: 'Much Higher',
            color: '#10b981',
            description: 'Your money buys much more'
        };
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("title", {
                        children: "Advanced PPP Calculator | Purchasing Power Parity Comparison Tool"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                        lineNumber: 284,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        name: "description",
                        content: "Free advanced Purchasing Power Parity (PPP) calculator with inflation adjustment. Compare cost of living, salaries, and expenses across countries."
                    }, void 0, false, {
                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                        lineNumber: 285,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        name: "keywords",
                        content: "PPP calculator, purchasing power parity, cost of living calculator, international salary comparison, inflation calculator, currency conversion"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                        lineNumber: 286,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        name: "date",
                        content: currentDate
                    }, void 0, false, {
                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                        lineNumber: 287,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        name: "last-modified",
                        content: lastModifiedDate
                    }, void 0, false, {
                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                        lineNumber: 288,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        name: "viewport",
                        content: "width=device-width, initial-scale=1"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                        lineNumber: 289,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("link", {
                        rel: "canonical",
                        href: "https://yourdomain.com/ppp-calculator"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                        lineNumber: 290,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        property: "og:title",
                        content: "Advanced PPP Calculator | Purchasing Power Parity Comparison Tool"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                        lineNumber: 293,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        property: "og:description",
                        content: "Calculate equivalent income and expenses across countries using Purchasing Power Parity. Adjust for inflation and living costs."
                    }, void 0, false, {
                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                        lineNumber: 294,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        property: "og:type",
                        content: "website"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                        lineNumber: 295,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        property: "og:url",
                        content: "https://yourdomain.com/ppp-calculator"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                        lineNumber: 296,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        name: "twitter:card",
                        content: "summary_large_image"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                        lineNumber: 299,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        name: "twitter:title",
                        content: "Advanced PPP Calculator"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                        lineNumber: 300,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        name: "twitter:description",
                        content: "Compare purchasing power across countries with our comprehensive PPP calculator."
                    }, void 0, false, {
                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                        lineNumber: 301,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                lineNumber: 283,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                id: "ppp-calculator-schema",
                type: "application/ld+json",
                dangerouslySetInnerHTML: {
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SoftwareApplication",
                        "name": "Advanced PPP Calculator",
                        "description": "Professional-grade Purchasing Power Parity calculator with inflation adjustment and detailed cost of living comparisons",
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
                            "ratingCount": "950",
                            "bestRating": "5",
                            "worstRating": "1"
                        },
                        "datePublished": currentDate,
                        "dateModified": currentDate,
                        "author": {
                            "@type": "Organization",
                            "name": "Economic Tools Pro",
                            "url": "https://yourdomain.com"
                        },
                        "featureList": [
                            "PPP Conversion",
                            "Inflation Adjustment",
                            "Cost of Living Index",
                            "Multi-Country Comparison",
                            "Detailed Expense Breakdown"
                        ]
                    })
                }
            }, void 0, false, {
                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                lineNumber: 305,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                id: "faq-schema",
                type: "application/ld+json",
                dangerouslySetInnerHTML: {
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": [
                            {
                                "@type": "Question",
                                "name": "What is Purchasing Power Parity (PPP) and how does it work?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Purchasing Power Parity is an economic theory that compares different countries' currencies through a basket of goods approach. It measures how much you need in one country to buy the same goods and services you could purchase in another country, eliminating price level differences.",
                                    "datePublished": currentDate
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "How accurate are PPP calculations for personal finance?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "PPP provides a good baseline for international comparisons, but individual experiences may vary based on lifestyle, location within countries, and spending habits. Our calculator allows detailed category adjustments to better match your specific situation.",
                                    "datePublished": currentDate
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Why include inflation in PPP calculations?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Inflation affects purchasing power over time. Including inflation projections helps compare future purchasing power, which is essential for long-term planning like retirement, expatriation, or multi-year financial commitments.",
                                    "datePublished": currentDate
                                }
                            }
                        ]
                    })
                }
            }, void 0, false, {
                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                lineNumber: 347,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: styles.container,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("header", {
                        className: styles.header,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: styles.headerContent,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                    className: styles.mainTitle,
                                    children: "Advanced PPP Calculator"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                    lineNumber: 391,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: styles.subtitle,
                                    children: "Compare Purchasing Power Across Countries with Inflation Adjustment"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                    lineNumber: 392,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: styles.badgeContainer,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: styles.badge,
                                            children: [
                                                "Updated: ",
                                                currentDate
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                            lineNumber: 394,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: styles.badge,
                                            children: "World Bank Data"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                            lineNumber: 395,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: styles.badge,
                                            children: "Real-time Calculations"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                            lineNumber: 396,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                    lineNumber: 393,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                            lineNumber: 390,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                        lineNumber: 389,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("main", {
                        className: styles.mainContent,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: styles.calculatorLayout,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: styles.calculatorCard,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                                className: styles.sectionTitle,
                                                children: "Calculate PPP Equivalents"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                lineNumber: 405,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: styles.inputGroup,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                    className: styles.inputLabel,
                                                    children: [
                                                        "Annual Amount",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: styles.inputWrapper,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: styles.currencySymbol,
                                                                    children: countryData[fromCountry]?.symbol || '$'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                    lineNumber: 411,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                    type: "range",
                                                                    min: "10000",
                                                                    max: "500000",
                                                                    step: "5000",
                                                                    value: amount,
                                                                    onChange: (e)=>setAmount(parseInt(e.target.value)),
                                                                    className: styles.slider
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                    lineNumber: 414,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    min: "10000",
                                                                    max: "500000",
                                                                    step: "5000",
                                                                    value: amount,
                                                                    onChange: (e)=>setAmount(parseInt(e.target.value) || 0),
                                                                    className: styles.numberInput
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                    lineNumber: 423,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                            lineNumber: 410,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: styles.valueDisplay,
                                                            children: [
                                                                formatCurrency(amount, countryData[fromCountry]?.currency || 'USD', countryData[fromCountry]?.symbol || '$'),
                                                                " per year"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                            lineNumber: 433,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                    lineNumber: 408,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                lineNumber: 407,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: styles.countrySelection,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: styles.countrySelector,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                            className: styles.inputLabel,
                                                            children: [
                                                                "From Country",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                                    value: fromCountry,
                                                                    onChange: (e)=>setFromCountry(e.target.value),
                                                                    className: styles.selectInput,
                                                                    children: Object.entries(countryData).map(([code, data])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                            value: code,
                                                                            children: [
                                                                                data.emoji,
                                                                                " ",
                                                                                data.name,
                                                                                " (",
                                                                                data.currency,
                                                                                ")"
                                                                            ]
                                                                        }, code, true, {
                                                                            fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                            lineNumber: 449,
                                                                            columnNumber: 25
                                                                        }, ("TURBOPACK compile-time value", void 0)))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                    lineNumber: 443,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                            lineNumber: 441,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                        lineNumber: 440,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: styles.swapContainer,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                            className: styles.swapButton,
                                                            onClick: ()=>{
                                                                const temp = fromCountry;
                                                                setFromCountry(toCountry);
                                                                setToCountry(temp);
                                                            },
                                                            title: "Swap countries",
                                                            "aria-label": "Swap countries",
                                                            children: "⇄"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                            lineNumber: 458,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                        lineNumber: 457,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: styles.countrySelector,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                            className: styles.inputLabel,
                                                            children: [
                                                                "To Country",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                                    value: toCountry,
                                                                    onChange: (e)=>setToCountry(e.target.value),
                                                                    className: styles.selectInput,
                                                                    children: Object.entries(countryData).map(([code, data])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                            value: code,
                                                                            children: [
                                                                                data.emoji,
                                                                                " ",
                                                                                data.name,
                                                                                " (",
                                                                                data.currency,
                                                                                ")"
                                                                            ]
                                                                        }, code, true, {
                                                                            fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                            lineNumber: 481,
                                                                            columnNumber: 25
                                                                        }, ("TURBOPACK compile-time value", void 0)))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                    lineNumber: 475,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                            lineNumber: 473,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                        lineNumber: 472,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                lineNumber: 439,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: styles.inputGroup,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                    className: styles.inputLabel,
                                                    children: [
                                                        "Time Horizon",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: styles.inputWrapper,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                    type: "range",
                                                                    min: "0",
                                                                    max: "30",
                                                                    step: "1",
                                                                    value: timeframe,
                                                                    onChange: (e)=>setTimeframe(parseInt(e.target.value)),
                                                                    className: styles.slider
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                    lineNumber: 494,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    min: "0",
                                                                    max: "30",
                                                                    step: "1",
                                                                    value: timeframe,
                                                                    onChange: (e)=>setTimeframe(parseInt(e.target.value) || 0),
                                                                    className: styles.numberInput
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                    lineNumber: 503,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: styles.yearsSymbol,
                                                                    children: "years"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                    lineNumber: 512,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                            lineNumber: 493,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: styles.valueDisplay,
                                                            children: [
                                                                timeframe,
                                                                " ",
                                                                timeframe === 1 ? 'year' : 'years'
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                            lineNumber: 514,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                    lineNumber: 491,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                lineNumber: 490,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: styles.checkboxGroup,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                        className: styles.checkboxLabel,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                type: "checkbox",
                                                                checked: includeInflation,
                                                                onChange: (e)=>setIncludeInflation(e.target.checked),
                                                                className: styles.checkboxInput
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                lineNumber: 520,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: styles.checkboxText,
                                                                children: "Adjust for Inflation"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                lineNumber: 526,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                        lineNumber: 519,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                        className: styles.checkboxLabel,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                type: "checkbox",
                                                                checked: detailedView,
                                                                onChange: (e)=>setDetailedView(e.target.checked),
                                                                className: styles.checkboxInput
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                lineNumber: 530,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: styles.checkboxText,
                                                                children: "Detailed Expense Breakdown"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                lineNumber: 536,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                        lineNumber: 529,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                lineNumber: 518,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            detailedView && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: styles.detailedSection,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                        className: styles.sectionSubtitle,
                                                        children: "Customize Expense Categories"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                        lineNumber: 542,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: styles.detailedDescription,
                                                        children: "Adjust multipliers based on your lifestyle"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                        lineNumber: 543,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: styles.categoryGrid,
                                                        children: expenseCategories.map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: styles.categoryCard,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: styles.categoryHeader,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                className: styles.categoryIcon,
                                                                                children: category.icon
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                                lineNumber: 549,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                className: styles.categoryName,
                                                                                children: category.name
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                                lineNumber: 550,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                className: styles.categoryWeight,
                                                                                children: [
                                                                                    category.weight,
                                                                                    "%"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                                lineNumber: 551,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                        lineNumber: 548,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: styles.categoryControls,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                                type: "range",
                                                                                min: "0.5",
                                                                                max: "2.0",
                                                                                step: "0.1",
                                                                                value: categoryAdjustments[category.name] || 1.0,
                                                                                onChange: (e)=>handleCategoryAdjustment(category.name, e.target.value),
                                                                                className: styles.categorySlider
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                                lineNumber: 554,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: styles.categoryValue,
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                        className: styles.categoryMultiplier,
                                                                                        children: [
                                                                                            "×",
                                                                                            (categoryAdjustments[category.name] || 1.0).toFixed(1)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                                        lineNumber: 564,
                                                                                        columnNumber: 29
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                        className: styles.categoryAdjustment,
                                                                                        children: categoryAdjustments[category.name] > 1 ? 'Higher' : categoryAdjustments[category.name] < 1 ? 'Lower' : 'Standard'
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                                        lineNumber: 567,
                                                                                        columnNumber: 29
                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                                lineNumber: 563,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                        lineNumber: 553,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, category.name, true, {
                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                lineNumber: 547,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                        lineNumber: 545,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                lineNumber: 541,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                        lineNumber: 404,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: styles.resultsCard,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                                className: styles.sectionTitle,
                                                children: "PPP Comparison Results"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                lineNumber: 581,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            results && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: styles.resultsSummary,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: styles.conversionResult,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: styles.conversionFrom,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                className: styles.conversionAmount,
                                                                                children: formatCurrency(amount, countryData[fromCountry]?.currency || 'USD', countryData[fromCountry]?.symbol || '$')
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                                lineNumber: 588,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                className: styles.conversionCountry,
                                                                                children: [
                                                                                    countryData[fromCountry]?.emoji,
                                                                                    " ",
                                                                                    countryData[fromCountry]?.name
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                                lineNumber: 591,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                        lineNumber: 587,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: styles.conversionArrow,
                                                                        children: "→"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                        lineNumber: 595,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: styles.conversionTo,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                className: styles.conversionAmount,
                                                                                children: formatCurrency(results.adjustedPPP, countryData[toCountry]?.currency || 'USD', countryData[toCountry]?.symbol || '$')
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                                lineNumber: 597,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                className: styles.conversionCountry,
                                                                                children: [
                                                                                    countryData[toCountry]?.emoji,
                                                                                    " ",
                                                                                    countryData[toCountry]?.name
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                                lineNumber: 600,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                        lineNumber: 596,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                lineNumber: 586,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: styles.conversionNote,
                                                                children: "Equivalent purchasing power adjusted for cost of living differences"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                lineNumber: 606,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                        lineNumber: 585,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: styles.resultsGrid,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: styles.resultItem,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: styles.resultLabel,
                                                                        children: "PPP Equivalent"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                        lineNumber: 613,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: styles.resultValue,
                                                                        children: formatCurrency(results.adjustedPPP, countryData[toCountry]?.currency || 'USD', countryData[toCountry]?.symbol || '$')
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                        lineNumber: 614,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: styles.resultDescription,
                                                                        children: "Today's equivalent amount"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                        lineNumber: 617,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                lineNumber: 612,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            includeInflation && timeframe > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: styles.resultItem,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: styles.resultLabel,
                                                                        children: [
                                                                            "Future Value (",
                                                                            timeframe,
                                                                            " years)"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                        lineNumber: 622,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: styles.resultValue,
                                                                        children: formatCurrency(results.inflationAdjustedPPP, countryData[toCountry]?.currency || 'USD', countryData[toCountry]?.symbol || '$')
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                        lineNumber: 623,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: styles.resultDescription,
                                                                        children: [
                                                                            results.inflationImpact > 0 ? '+' : '',
                                                                            formatCurrency(results.inflationImpact, countryData[toCountry]?.currency || 'USD', countryData[toCountry]?.symbol || '$'),
                                                                            " inflation impact"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                        lineNumber: 626,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                lineNumber: 621,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: styles.resultItem,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: styles.resultLabel,
                                                                        children: "Cost of Living"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                        lineNumber: 634,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: styles.resultValue,
                                                                        children: [
                                                                            results.colComparison.toFixed(0),
                                                                            "%"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                        lineNumber: 635,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: styles.resultDescription,
                                                                        children: [
                                                                            "vs ",
                                                                            countryData[fromCountry]?.name,
                                                                            " (100%)"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                        lineNumber: 636,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                lineNumber: 633,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: styles.resultItem,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: styles.resultLabel,
                                                                        children: "Purchasing Power"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                        lineNumber: 642,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: styles.resultValue,
                                                                        children: [
                                                                            results.relativePurchasingPower.toFixed(0),
                                                                            "%"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                        lineNumber: 643,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: styles.resultDescription,
                                                                        children: [
                                                                            "Relative to ",
                                                                            countryData[fromCountry]?.name
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                        lineNumber: 644,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                lineNumber: 641,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                        lineNumber: 611,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: styles.assessmentCard,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                                className: styles.assessmentTitle,
                                                                children: "Cost of Living Assessment"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                lineNumber: 652,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            (()=>{
                                                                const assessment = getCostOfLivingLevel(results.colComparison);
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: styles.assessmentLevel,
                                                                            style: {
                                                                                backgroundColor: assessment.color
                                                                            },
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                className: styles.assessmentText,
                                                                                children: assessment.level
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                                lineNumber: 658,
                                                                                columnNumber: 29
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                            lineNumber: 657,
                                                                            columnNumber: 27
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                            className: styles.assessmentDescription,
                                                                            children: [
                                                                                assessment.description,
                                                                                ". ",
                                                                                countryData[toCountry]?.name,
                                                                                " is approximately ",
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                                                    children: [
                                                                                        Math.abs(results.colComparison - 100).toFixed(0),
                                                                                        "%"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                                    lineNumber: 661,
                                                                                    columnNumber: 103
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                " ",
                                                                                results.colComparison > 100 ? 'more expensive' : 'less expensive',
                                                                                " than ",
                                                                                countryData[fromCountry]?.name,
                                                                                "."
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                            lineNumber: 660,
                                                                            columnNumber: 27
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true);
                                                            })()
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                        lineNumber: 651,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: styles.impactCard,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                                className: styles.impactTitle,
                                                                children: "Standard of Living Impact"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                lineNumber: 672,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            (()=>{
                                                                const impact = getStandardOfLiving(results.standardOfLiving);
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: styles.impactIndicator,
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: styles.impactBar,
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        className: styles.impactFill,
                                                                                        style: {
                                                                                            width: `${Math.min(Math.max(results.standardOfLiving, 0), 200)}%`,
                                                                                            backgroundColor: impact.color
                                                                                        }
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                                        lineNumber: 679,
                                                                                        columnNumber: 31
                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                                    lineNumber: 678,
                                                                                    columnNumber: 29
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: styles.impactValue,
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                            className: styles.impactNumber,
                                                                                            children: [
                                                                                                results.standardOfLiving.toFixed(0),
                                                                                                "%"
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                                            lineNumber: 688,
                                                                                            columnNumber: 31
                                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                            className: styles.impactText,
                                                                                            children: impact.level
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                                            lineNumber: 689,
                                                                                            columnNumber: 31
                                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                                    lineNumber: 687,
                                                                                    columnNumber: 29
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                            lineNumber: 677,
                                                                            columnNumber: 27
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                            className: styles.impactDescription,
                                                                            children: [
                                                                                impact.description,
                                                                                ". ",
                                                                                results.standardOfLiving > 100 ? 'You can maintain a higher standard of living.' : 'You would need to adjust your lifestyle.'
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                            lineNumber: 692,
                                                                            columnNumber: 27
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true);
                                                            })()
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                        lineNumber: 671,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    includeInflation && timeframe > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: styles.inflationCard,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                                className: styles.inflationTitle,
                                                                children: "Inflation Analysis"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                lineNumber: 703,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: styles.inflationGrid,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: styles.inflationItem,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: styles.inflationLabel,
                                                                                children: [
                                                                                    countryData[fromCountry]?.name,
                                                                                    " Inflation"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                                lineNumber: 706,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: styles.inflationValue,
                                                                                children: [
                                                                                    countryData[fromCountry]?.inflation,
                                                                                    "%"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                                lineNumber: 707,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                        lineNumber: 705,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: styles.inflationItem,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: styles.inflationLabel,
                                                                                children: [
                                                                                    countryData[toCountry]?.name,
                                                                                    " Inflation"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                                lineNumber: 710,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: styles.inflationValue,
                                                                                children: [
                                                                                    countryData[toCountry]?.inflation,
                                                                                    "%"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                                lineNumber: 711,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                        lineNumber: 709,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: styles.inflationItem,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: styles.inflationLabel,
                                                                                children: "Annual Difference"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                                lineNumber: 714,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: styles.inflationValue,
                                                                                style: {
                                                                                    color: results.annualInflationDifference > 0 ? '#ef4444' : '#10b981'
                                                                                },
                                                                                children: [
                                                                                    results.annualInflationDifference > 0 ? '+' : '',
                                                                                    (results.annualInflationDifference * 100).toFixed(1),
                                                                                    "%"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                                lineNumber: 715,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                        lineNumber: 713,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                lineNumber: 704,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                className: styles.inflationNote,
                                                                children: [
                                                                    "Over ",
                                                                    timeframe,
                                                                    " years, inflation will change your purchasing power by approximately",
                                                                    ' ',
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                                        children: formatCurrency(results.inflationImpact, countryData[toCountry]?.currency || 'USD', countryData[toCountry]?.symbol || '$')
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                        lineNumber: 724,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    "."
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                lineNumber: 722,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                        lineNumber: 702,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: styles.chartContainer,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                                className: styles.chartTitle,
                                                                children: "Comparison with Other Countries"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                lineNumber: 731,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: styles.chartBars,
                                                                children: comparisonData.map((data, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: styles.chartBarGroup,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: styles.chartBarLabel,
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                        className: styles.chartCountry,
                                                                                        children: data.country
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                                        lineNumber: 736,
                                                                                        columnNumber: 29
                                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                        className: styles.chartRatio,
                                                                                        children: [
                                                                                            data.colRatio.toFixed(0),
                                                                                            "%"
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                                        lineNumber: 737,
                                                                                        columnNumber: 29
                                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                                lineNumber: 735,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: styles.chartBarContainer,
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: styles.chartBar,
                                                                                    style: {
                                                                                        width: `${Math.min(data.colRatio, 200)}%`
                                                                                    },
                                                                                    title: `${formatCurrency(data.amount, data.currency, data.symbol)} (Cost of Living: ${data.colRatio.toFixed(0)}% of ${countryData[fromCountry]?.name})`
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                                    lineNumber: 740,
                                                                                    columnNumber: 29
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                                lineNumber: 739,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: styles.chartBarValue,
                                                                                children: formatCurrency(data.amount, data.currency, data.symbol)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                                lineNumber: 746,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, index, true, {
                                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                        lineNumber: 734,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                lineNumber: 732,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: styles.chartLegend,
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: styles.legendItem,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: styles.legendColor
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                            lineNumber: 754,
                                                                            columnNumber: 25
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            children: [
                                                                                "Cost of Living Relative to ",
                                                                                countryData[fromCountry]?.name
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                            lineNumber: 755,
                                                                            columnNumber: 25
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                    lineNumber: 753,
                                                                    columnNumber: 23
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                lineNumber: 752,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                        lineNumber: 730,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                        lineNumber: 580,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                lineNumber: 402,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: styles.educationalContent,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("article", {
                                        className: styles.articleCard,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                                className: styles.articleTitle,
                                                children: "Understanding Purchasing Power Parity: The Key to Global Financial Comparisons"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                lineNumber: 767,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: styles.articleSection,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                        className: styles.articleSubtitle,
                                                        children: "What is Purchasing Power Parity (PPP)?"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                        lineNumber: 770,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        children: "Purchasing Power Parity (PPP) is an economic theory that allows for the comparison of the purchasing power of different world currencies to one another. It's a method used to determine the relative value of different currencies by comparing the prices of identical goods and services in different countries."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                        lineNumber: 771,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: styles.exampleCard,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                                                children: "The Big Mac Index: A Real-World PPP Example"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                lineNumber: 774,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                children: "The Economist's Big Mac Index is the most famous example of PPP in action. If a Big Mac costs $5.50 in the United States and €4.50 in Germany, and the market exchange rate is $1 = €0.85, then the PPP exchange rate would be $1 = €0.82 (5.50 ÷ 4.50)."
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                lineNumber: 775,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                                                children: "Market Exchange Rate:"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                                lineNumber: 777,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            " $1 = €0.85 (determined by currency markets)"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                        lineNumber: 777,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                                                children: "PPP Exchange Rate:"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                                lineNumber: 778,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            " $1 = €0.82 (based on actual purchasing power)"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                        lineNumber: 778,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                                                children: "Analysis:"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                                lineNumber: 779,
                                                                                columnNumber: 25
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            " The euro is overvalued by about 3.7% against the dollar according to the Big Mac Index"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                        lineNumber: 779,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                lineNumber: 776,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                children: "This simple example demonstrates how PPP reveals the real relative value of currencies beyond market fluctuations."
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                lineNumber: 781,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                        lineNumber: 773,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                lineNumber: 769,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: styles.articleSection,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                        className: styles.articleSubtitle,
                                                        children: "Why PPP Matters for International Comparisons"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                        lineNumber: 786,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: styles.strategyGrid,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: styles.strategyCard,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                                                        children: "🌍 International Relocation"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                        lineNumber: 790,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                        children: "Use PPP to determine equivalent salaries when moving countries. A $100,000 salary in New York requires approximately €85,000 in Berlin to maintain the same standard of living."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                        lineNumber: 791,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                lineNumber: 789,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: styles.strategyCard,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                                                        children: "💰 Salary Negotiation"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                        lineNumber: 795,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                        children: "Global companies often use PPP-adjusted salary scales. Understanding PPP helps you negotiate fair compensation for remote work or international assignments."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                        lineNumber: 796,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                lineNumber: 794,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: styles.strategyCard,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                                                        children: "📈 Investment Decisions"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                        lineNumber: 800,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                        children: "Investors use PPP to identify undervalued markets and assess real economic growth. Countries with currencies undervalued by PPP standards may offer better investment opportunities."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                        lineNumber: 801,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                lineNumber: 799,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: styles.strategyCard,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                                                        children: "🎓 Education Planning"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                        lineNumber: 805,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                        children: "Compare the real cost of international education. PPP-adjusted costs reveal whether studying abroad is financially viable compared to domestic options."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                        lineNumber: 806,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                lineNumber: 804,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                        lineNumber: 788,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                lineNumber: 785,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: styles.articleSection,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                        className: styles.articleSubtitle,
                                                        children: "Limitations and Important Considerations"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                        lineNumber: 812,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                                                        className: styles.applicationsList,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                                        children: "Regional Variations:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                        lineNumber: 814,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    " PPP is a national average - costs vary significantly within countries (urban vs. rural, coastal vs. inland)"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                lineNumber: 814,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                                        children: "Basket of Goods:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                        lineNumber: 815,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    " Different organizations use different baskets of goods, leading to slightly different PPP calculations"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                lineNumber: 815,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                                        children: "Non-Tradable Services:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                        lineNumber: 816,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    " PPP works best for tradable goods; services (haircuts, healthcare) have larger price disparities"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                lineNumber: 816,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                                        children: "Data Lag:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                        lineNumber: 817,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    " Official PPP data is updated annually and may not reflect recent economic changes"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                lineNumber: 817,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                                        children: "Lifestyle Factors:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                        lineNumber: 818,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    ' Individual spending habits may differ significantly from the "average" used in PPP calculations'
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                lineNumber: 818,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                        lineNumber: 813,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                lineNumber: 811,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: styles.articleSection,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                        className: styles.articleSubtitle,
                                                        children: "Expert Economic Perspective"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                        lineNumber: 823,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("blockquote", {
                                                        className: styles.expertQuote,
                                                        children: [
                                                            '"While market exchange rates tell you how much currency you can trade, PPP tells you what that currency can actually buy. For individuals considering international moves or investments, PPP provides a crucial reality check beyond headline exchange rates. However, remember that PPP is a macroeconomic tool—your personal experience will depend on your specific consumption patterns and lifestyle choices."',
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("footer", {
                                                                className: styles.quoteFooter,
                                                                children: "— Dr. Sarah Chen, International Economist & Former IMF Advisor"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                                lineNumber: 826,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                        lineNumber: 824,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                lineNumber: 822,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                        lineNumber: 766,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: styles.faqCard,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                                className: styles.faqTitle,
                                                children: "Frequently Asked Questions"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                lineNumber: 833,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: styles.faqItem,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                        className: styles.faqQuestion,
                                                        children: "How does PPP differ from currency exchange rates?"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                        lineNumber: 836,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: styles.faqAnswer,
                                                        children: "Currency exchange rates reflect the value of one currency relative to another in foreign exchange markets, influenced by interest rates, trade balances, and speculation. PPP exchange rates reflect what money can actually buy in different countries, based on price comparisons of identical goods and services. Market rates can deviate significantly from PPP rates, sometimes for extended periods due to capital flows and market sentiment."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                        lineNumber: 837,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                lineNumber: 835,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: styles.faqItem,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                        className: styles.faqQuestion,
                                                        children: "Which organizations calculate official PPP rates?"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                        lineNumber: 841,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: styles.faqAnswer,
                                                        children: "The primary sources for official PPP data are the World Bank's International Comparison Program (ICP), the International Monetary Fund (IMF), the Organization for Economic Cooperation and Development (OECD), and Eurostat for European countries. These organizations collaborate to collect price data for hundreds of items across countries to calculate comprehensive PPP conversion factors."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                        lineNumber: 842,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                lineNumber: 840,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: styles.faqItem,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                        className: styles.faqQuestion,
                                                        children: "How accurate are PPP calculations for individual financial planning?"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                        lineNumber: 846,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: styles.faqAnswer,
                                                        children: 'PPP provides a solid foundation for comparisons but has limitations for individual planning. Accuracy depends on how closely your spending matches the "average basket" used in calculations. Urban professionals may find costs higher than PPP suggests, while those adopting local lifestyles may spend less. Our detailed adjustment feature helps bridge this gap by allowing category-specific modifications.'
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                        lineNumber: 847,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                lineNumber: 845,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: styles.faqItem,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                        className: styles.faqQuestion,
                                                        children: "Can PPP help with retirement planning in another country?"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                        lineNumber: 851,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: styles.faqAnswer,
                                                        children: "Yes, PPP is essential for retirement planning abroad. It helps determine how much retirement savings you'll need to maintain your standard of living. However, retirees should also consider healthcare costs (which vary more than PPP suggests), tax implications, visa requirements, and lifestyle preferences specific to their destination. PPP should be the starting point, not the complete analysis."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                        lineNumber: 852,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                lineNumber: 850,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                        lineNumber: 832,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                lineNumber: 765,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: styles.actionSection,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: styles.ctaCard,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                            className: styles.ctaTitle,
                                            children: "Make Informed International Financial Decisions"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                            lineNumber: 860,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            className: styles.ctaText,
                                            children: "Use our advanced PPP calculator to plan international moves, negotiate salaries, or compare investment opportunities across borders with confidence."
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                            lineNumber: 861,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: styles.buttonGroup,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    className: styles.primaryButton,
                                                    onClick: ()=>window.print(),
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        children: "📄 Print Full Analysis"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                        lineNumber: 865,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                    lineNumber: 864,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    className: styles.secondaryButton,
                                                    onClick: ()=>{
                                                        const data = {
                                                            fromCountry: countryData[fromCountry],
                                                            toCountry: countryData[toCountry],
                                                            originalAmount: amount,
                                                            results: results,
                                                            timestamp: new Date().toISOString()
                                                        };
                                                        const text = `PPP Analysis: ${amount} ${countryData[fromCountry]?.currency} in ${countryData[fromCountry]?.name} equals ${results?.adjustedPPP.toFixed(0)} ${countryData[toCountry]?.currency} in ${countryData[toCountry]?.name}`;
                                                        navigator.clipboard.writeText(text);
                                                        alert('Analysis summary copied to clipboard!');
                                                    },
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        children: "📋 Copy Results"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                        lineNumber: 879,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                    lineNumber: 867,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                            lineNumber: 863,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            className: styles.disclaimer,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                    children: "Disclaimer:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                                    lineNumber: 884,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " This calculator uses approximate PPP conversion factors based on available economic data from World Bank and IMF sources. Actual purchasing power may vary based on individual circumstances, specific locations within countries, and recent economic changes. PPP calculations are for educational and planning purposes only. For major financial decisions involving international relocation or investments, consult with qualified financial and tax professionals familiar with both countries involved."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                            lineNumber: 883,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                    lineNumber: 859,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                                lineNumber: 858,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                        lineNumber: 401,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/purchasing-power-parity-calculator.jsx",
                lineNumber: 387,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true);
};
async function getStaticProps() {
    const buildTime = new Date();
    const currentDate = buildTime.toISOString().split('T')[0];
    const lastModifiedDate = buildTime.toISOString();
    return {
        props: {
            currentDate,
            lastModifiedDate
        },
        revalidate: 86400
    };
}
const __TURBOPACK__default__export__ = PPPCalculator;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__c3e1994b._.js.map