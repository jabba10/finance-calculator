module.exports = [
"[project]/src/pages/blog.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "getStaticProps",
    ()=>getStaticProps
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
// components/FormulaPage.jsx
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/script.js [ssr] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module './formulapage.module.css'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
;
;
;
;
const FormulaPage = ({ currentDate, lastModifiedDate })=>{
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [activeCategory, setActiveCategory] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('all');
    const formulaCategories = [
        {
            id: 'all',
            name: 'All Formulas',
            icon: '📚',
            count: 56
        },
        {
            id: 'business',
            name: 'Business',
            icon: '💼',
            count: 22
        },
        {
            id: 'personal',
            name: 'Personal Finance',
            icon: '👨‍👩‍👧‍👦',
            count: 15
        },
        {
            id: 'investment',
            name: 'Investment',
            icon: '📈',
            count: 12
        },
        {
            id: 'real-estate',
            name: 'Real Estate',
            icon: '🏠',
            count: 7
        }
    ];
    const allFormulas = [
        {
            id: 1,
            title: 'Compound Interest',
            category: 'personal',
            icon: '💰',
            path: '/compound-interest-calculator',
            description: 'Calculate how your money grows over time with compound interest.',
            formula: 'A = P(1 + r/n)^(nt)',
            variables: [
                {
                    symbol: 'A',
                    description: 'Future value of investment/loan'
                },
                {
                    symbol: 'P',
                    description: 'Principal investment amount'
                },
                {
                    symbol: 'r',
                    description: 'Annual interest rate (decimal)'
                },
                {
                    symbol: 'n',
                    description: 'Number of times interest compounds per year'
                },
                {
                    symbol: 't',
                    description: 'Time in years'
                }
            ]
        },
        {
            id: 2,
            title: 'Loan Payment (Amortization)',
            category: 'personal',
            icon: '🏦',
            path: '/loan-calculator',
            description: 'Calculate monthly loan payments for any type of loan.',
            formula: 'PMT = P × [r(1+r)^n] / [(1+r)^n - 1]',
            variables: [
                {
                    symbol: 'PMT',
                    description: 'Monthly payment'
                },
                {
                    symbol: 'P',
                    description: 'Principal loan amount'
                },
                {
                    symbol: 'r',
                    description: 'Monthly interest rate (annual rate ÷ 12)'
                },
                {
                    symbol: 'n',
                    description: 'Total number of payments'
                }
            ]
        },
        {
            id: 3,
            title: 'Return on Investment (ROI)',
            category: 'investment',
            icon: '📊',
            path: '/roi-calculator',
            description: 'Measure profitability of an investment relative to its cost.',
            formula: 'ROI = [(Gain - Cost) ÷ Cost] × 100%',
            variables: [
                {
                    symbol: 'ROI',
                    description: 'Return on Investment percentage'
                },
                {
                    symbol: 'Gain',
                    description: 'Return from investment'
                },
                {
                    symbol: 'Cost',
                    description: 'Cost of investment'
                }
            ]
        },
        {
            id: 4,
            title: 'Net Present Value (NPV)',
            category: 'investment',
            icon: '📈',
            path: '/npv-calculator',
            description: 'Determine present value of future cash flows.',
            formula: 'NPV = Σ [CFₜ ÷ (1 + r)^t] - Initial Investment',
            variables: [
                {
                    symbol: 'NPV',
                    description: 'Net Present Value'
                },
                {
                    symbol: 'CFₜ',
                    description: 'Cash flow at time t'
                },
                {
                    symbol: 'r',
                    description: 'Discount rate'
                },
                {
                    symbol: 't',
                    description: 'Time period'
                }
            ]
        },
        {
            id: 5,
            title: 'Break-even Point',
            category: 'business',
            icon: '⚖️',
            path: '/break-even-calculator',
            description: 'Find sales volume needed to cover all costs.',
            formula: 'Break-even Units = Fixed Costs ÷ (Price - Variable Cost)',
            variables: [
                {
                    symbol: 'Fixed Costs',
                    description: 'Costs that dont change with production'
                },
                {
                    symbol: 'Price',
                    description: 'Selling price per unit'
                },
                {
                    symbol: 'Variable Cost',
                    description: 'Cost per unit produced'
                }
            ]
        },
        {
            id: 6,
            title: 'Profit Margin',
            category: 'business',
            icon: '📉',
            path: '/profit-margin-calculator',
            description: 'Calculate profitability as percentage of revenue.',
            formula: 'Profit Margin = (Net Profit ÷ Revenue) × 100%',
            variables: [
                {
                    symbol: 'Net Profit',
                    description: 'Revenue minus all expenses'
                },
                {
                    symbol: 'Revenue',
                    description: 'Total sales income'
                }
            ]
        },
        {
            id: 7,
            title: 'Mortgage Payment',
            category: 'real-estate',
            icon: '🏡',
            path: '/mortgage-calculator',
            description: 'Calculate monthly mortgage payments.',
            formula: 'M = P × [r(1+r)^n] ÷ [(1+r)^n - 1]',
            variables: [
                {
                    symbol: 'M',
                    description: 'Monthly mortgage payment'
                },
                {
                    symbol: 'P',
                    description: 'Principal loan amount'
                },
                {
                    symbol: 'r',
                    description: 'Monthly interest rate'
                },
                {
                    symbol: 'n',
                    description: 'Total number of payments'
                }
            ]
        },
        {
            id: 8,
            title: 'Future Value of Annuity',
            category: 'personal',
            icon: '💰',
            path: '/annuity-calculator',
            description: 'Calculate future value of regular deposits.',
            formula: 'FVA = PMT × [(1 + r)^n - 1] ÷ r',
            variables: [
                {
                    symbol: 'FVA',
                    description: 'Future Value of Annuity'
                },
                {
                    symbol: 'PMT',
                    description: 'Periodic payment amount'
                },
                {
                    symbol: 'r',
                    description: 'Interest rate per period'
                },
                {
                    symbol: 'n',
                    description: 'Number of periods'
                }
            ]
        },
        {
            id: 9,
            title: 'Debt-to-Income Ratio',
            category: 'personal',
            icon: '💳',
            path: '/debt-to-income-calculator',
            description: 'Assess ability to manage monthly debt payments.',
            formula: 'DTI = (Total Monthly Debt ÷ Gross Monthly Income) × 100%',
            variables: [
                {
                    symbol: 'DTI',
                    description: 'Debt-to-Income Ratio'
                },
                {
                    symbol: 'Total Monthly Debt',
                    description: 'Sum of all monthly debt payments'
                },
                {
                    symbol: 'Gross Monthly Income',
                    description: 'Monthly income before taxes'
                }
            ]
        },
        {
            id: 10,
            title: 'Customer Acquisition Cost',
            category: 'business',
            icon: '🎯',
            path: '/cac-calculator',
            description: 'Calculate cost to acquire a new customer.',
            formula: 'CAC = Total Marketing Costs ÷ Number of New Customers',
            variables: [
                {
                    symbol: 'CAC',
                    description: 'Customer Acquisition Cost'
                },
                {
                    symbol: 'Total Marketing Costs',
                    description: 'All marketing and sales expenses'
                },
                {
                    symbol: 'New Customers',
                    description: 'Customers acquired in period'
                }
            ]
        },
        {
            id: 11,
            title: 'Gross Profit',
            category: 'business',
            icon: '💵',
            path: '/gross-profit-calculator',
            description: 'Calculate profit after cost of goods sold.',
            formula: 'Gross Profit = Revenue - Cost of Goods Sold',
            variables: [
                {
                    symbol: 'Revenue',
                    description: 'Total sales'
                },
                {
                    symbol: 'COGS',
                    description: 'Cost of Goods Sold'
                }
            ]
        },
        {
            id: 12,
            title: 'EBITDA',
            category: 'business',
            icon: '📊',
            path: '/ebitda-calculator',
            description: 'Earnings before interest, taxes, depreciation, amortization.',
            formula: 'EBITDA = Net Income + Interest + Taxes + Depreciation + Amortization',
            variables: [
                {
                    symbol: 'Net Income',
                    description: 'Profit after all expenses'
                },
                {
                    symbol: 'Interest',
                    description: 'Interest expenses'
                },
                {
                    symbol: 'Taxes',
                    description: 'Tax expenses'
                },
                {
                    symbol: 'Depreciation',
                    description: 'Depreciation expenses'
                },
                {
                    symbol: 'Amortization',
                    description: 'Amortization expenses'
                }
            ]
        },
        {
            id: 13,
            title: 'Working Capital',
            category: 'business',
            icon: '💼',
            path: '/working-capital-calculator',
            description: 'Measure short-term financial health.',
            formula: 'Working Capital = Current Assets - Current Liabilities',
            variables: [
                {
                    symbol: 'Current Assets',
                    description: 'Assets convertible to cash within year'
                },
                {
                    symbol: 'Current Liabilities',
                    description: 'Debts due within year'
                }
            ]
        },
        {
            id: 14,
            title: 'Current Ratio',
            category: 'business',
            icon: '📋',
            path: '/current-ratio-calculator',
            description: 'Measure ability to pay short-term obligations.',
            formula: 'Current Ratio = Current Assets ÷ Current Liabilities',
            variables: [
                {
                    symbol: 'Current Assets',
                    description: 'Assets convertible to cash within year'
                },
                {
                    symbol: 'Current Liabilities',
                    description: 'Debts due within year'
                }
            ]
        },
        {
            id: 15,
            title: 'Debt-to-Equity Ratio',
            category: 'business',
            icon: '⚖️',
            path: '/debt-to-equity-calculator',
            description: 'Measure financial leverage.',
            formula: 'D/E = Total Liabilities ÷ Shareholders Equity',
            variables: [
                {
                    symbol: 'Total Liabilities',
                    description: 'All debts and obligations'
                },
                {
                    symbol: 'Shareholders Equity',
                    description: 'Assets minus liabilities'
                }
            ]
        },
        {
            id: 16,
            title: 'Return on Equity',
            category: 'investment',
            icon: '🏦',
            path: '/roe-calculator',
            description: 'Measure profitability relative to equity.',
            formula: 'ROE = (Net Income ÷ Shareholders Equity) × 100%',
            variables: [
                {
                    symbol: 'Net Income',
                    description: 'Profit after all expenses'
                },
                {
                    symbol: 'Shareholders Equity',
                    description: 'Assets minus liabilities'
                }
            ]
        },
        {
            id: 17,
            title: 'Weighted Average Cost of Capital',
            category: 'investment',
            icon: '📉',
            path: '/wacc-calculator',
            description: 'Calculate average cost of capital.',
            formula: 'WACC = (E/V × Re) + (D/V × Rd × (1 - Tc))',
            variables: [
                {
                    symbol: 'E',
                    description: 'Market value of equity'
                },
                {
                    symbol: 'V',
                    description: 'Total market value'
                },
                {
                    symbol: 'Re',
                    description: 'Cost of equity'
                },
                {
                    symbol: 'D',
                    description: 'Market value of debt'
                },
                {
                    symbol: 'Rd',
                    description: 'Cost of debt'
                },
                {
                    symbol: 'Tc',
                    description: 'Corporate tax rate'
                }
            ]
        },
        {
            id: 18,
            title: 'Discounted Cash Flow',
            category: 'investment',
            icon: '💹',
            path: '/discounted-cash-flow-calculator',
            description: 'Value investment based on future cash flows.',
            formula: 'DCF = Σ [CFₜ ÷ (1 + r)^t]',
            variables: [
                {
                    symbol: 'CFₜ',
                    description: 'Cash flow at time t'
                },
                {
                    symbol: 'r',
                    description: 'Discount rate'
                },
                {
                    symbol: 't',
                    description: 'Time period'
                }
            ]
        },
        {
            id: 19,
            title: 'Inventory Turnover',
            category: 'business',
            icon: '📦',
            path: '/inventory-turnover-calculator',
            description: 'Measure how quickly inventory sells.',
            formula: 'Turnover = Cost of Goods Sold ÷ Average Inventory',
            variables: [
                {
                    symbol: 'COGS',
                    description: 'Cost of Goods Sold'
                },
                {
                    symbol: 'Average Inventory',
                    description: '(Beginning + Ending Inventory) ÷ 2'
                }
            ]
        },
        {
            id: 20,
            title: 'Accounts Receivable Turnover',
            category: 'business',
            icon: '📬',
            path: '/accounts-receivable-turnover-calculator',
            description: 'Measure collection efficiency.',
            formula: 'Turnover = Net Credit Sales ÷ Average Accounts Receivable',
            variables: [
                {
                    symbol: 'Net Credit Sales',
                    description: 'Sales on credit minus returns'
                },
                {
                    symbol: 'Average AR',
                    description: '(Beginning + Ending AR) ÷ 2'
                }
            ]
        },
        {
            id: 21,
            title: 'Markup Calculation',
            category: 'business',
            icon: '🏷️',
            path: '/markup-calculator',
            description: 'Calculate selling price based on cost and markup.',
            formula: 'Selling Price = Cost × (1 + Markup %)',
            variables: [
                {
                    symbol: 'Cost',
                    description: 'Cost of product'
                },
                {
                    symbol: 'Markup %',
                    description: 'Desired profit percentage'
                }
            ]
        },
        {
            id: 22,
            title: 'Tax Calculation',
            category: 'personal',
            icon: '🧾',
            path: '/tax-calculator',
            description: 'Calculate income tax based on brackets.',
            formula: 'Tax = (Income - Deductions) × Tax Rate',
            variables: [
                {
                    symbol: 'Income',
                    description: 'Gross income'
                },
                {
                    symbol: 'Deductions',
                    description: 'Allowable deductions'
                },
                {
                    symbol: 'Tax Rate',
                    description: 'Applicable tax bracket rate'
                }
            ]
        },
        {
            id: 23,
            title: 'Property Tax',
            category: 'real-estate',
            icon: '🏠',
            path: '/property-tax-calculator',
            description: 'Calculate annual property tax.',
            formula: 'Property Tax = Assessed Value × Tax Rate',
            variables: [
                {
                    symbol: 'Assessed Value',
                    description: 'Value determined by assessor'
                },
                {
                    symbol: 'Tax Rate',
                    description: 'Local property tax rate'
                }
            ]
        },
        {
            id: 24,
            title: 'Capital Gains Tax',
            category: 'investment',
            icon: '📈',
            path: '/capital-gains-calculator',
            description: 'Calculate tax on investment profits.',
            formula: 'Capital Gains = Sale Price - Purchase Price - Costs',
            variables: [
                {
                    symbol: 'Sale Price',
                    description: 'Price asset sold for'
                },
                {
                    symbol: 'Purchase Price',
                    description: 'Original purchase price'
                },
                {
                    symbol: 'Costs',
                    description: 'Associated costs and fees'
                }
            ]
        },
        {
            id: 25,
            title: 'Operating Leverage',
            category: 'business',
            icon: '⚙️',
            path: '/operating-leverage-calculator',
            description: 'Measure sensitivity of operating income to sales.',
            formula: 'DOL = %Δ EBIT ÷ %Δ Sales',
            variables: [
                {
                    symbol: 'DOL',
                    description: 'Degree of Operating Leverage'
                },
                {
                    symbol: 'EBIT',
                    description: 'Earnings Before Interest and Taxes'
                },
                {
                    symbol: 'Sales',
                    description: 'Revenue'
                }
            ]
        },
        {
            id: 26,
            title: 'Free Cash Flow',
            category: 'business',
            icon: '💸',
            path: '/free-cash-flow-calculator',
            description: 'Calculate cash available for expansion, dividends.',
            formula: 'FCF = Operating Cash Flow - Capital Expenditures',
            variables: [
                {
                    symbol: 'Operating Cash Flow',
                    description: 'Cash from operations'
                },
                {
                    symbol: 'Capital Expenditures',
                    description: 'Investments in fixed assets'
                }
            ]
        },
        {
            id: 27,
            title: 'Economic Value Added',
            category: 'business',
            icon: '💡',
            path: '/eva-calculator',
            description: 'Measure true economic profit.',
            formula: 'EVA = NOPAT - (WACC × Capital)',
            variables: [
                {
                    symbol: 'NOPAT',
                    description: 'Net Operating Profit After Tax'
                },
                {
                    symbol: 'WACC',
                    description: 'Weighted Average Cost of Capital'
                },
                {
                    symbol: 'Capital',
                    description: 'Total capital invested'
                }
            ]
        },
        {
            id: 28,
            title: 'Present Value',
            category: 'investment',
            icon: '⏳',
            path: '/present-value-calculator',
            description: 'Calculate present value of future sum.',
            formula: 'PV = FV ÷ (1 + r)^n',
            variables: [
                {
                    symbol: 'PV',
                    description: 'Present Value'
                },
                {
                    symbol: 'FV',
                    description: 'Future Value'
                },
                {
                    symbol: 'r',
                    description: 'Discount rate'
                },
                {
                    symbol: 'n',
                    description: 'Number of periods'
                }
            ]
        },
        {
            id: 29,
            title: 'Internal Rate of Return',
            category: 'investment',
            icon: '📊',
            path: '/irr-calculator',
            description: 'Calculate rate that makes NPV zero.',
            formula: '0 = Σ [CFₜ ÷ (1 + IRR)^t] - Initial Investment',
            variables: [
                {
                    symbol: 'CFₜ',
                    description: 'Cash flow at time t'
                },
                {
                    symbol: 'IRR',
                    description: 'Internal Rate of Return'
                },
                {
                    symbol: 't',
                    description: 'Time period'
                }
            ]
        },
        {
            id: 30,
            title: 'Payback Period',
            category: 'investment',
            icon: '⏱️',
            path: '/payback-period-calculator',
            description: 'Calculate time to recover investment.',
            formula: 'Payback Period = Initial Investment ÷ Annual Cash Flow',
            variables: [
                {
                    symbol: 'Initial Investment',
                    description: 'Total initial investment'
                },
                {
                    symbol: 'Annual Cash Flow',
                    description: 'Yearly cash inflow'
                }
            ]
        },
        {
            id: 31,
            title: 'Gross Rent Multiplier',
            category: 'real-estate',
            icon: '🏢',
            path: '/grm-calculator',
            description: 'Measure property value relative to rent.',
            formula: 'GRM = Property Price ÷ Gross Annual Rent',
            variables: [
                {
                    symbol: 'Property Price',
                    description: 'Purchase price'
                },
                {
                    symbol: 'Gross Annual Rent',
                    description: 'Yearly rental income'
                }
            ]
        },
        {
            id: 32,
            title: 'Cap Rate',
            category: 'real-estate',
            icon: '🏠',
            path: '/cap-rate-calculator',
            description: 'Calculate return on real estate investment.',
            formula: 'Cap Rate = NOI ÷ Property Value',
            variables: [
                {
                    symbol: 'NOI',
                    description: 'Net Operating Income'
                },
                {
                    symbol: 'Property Value',
                    description: 'Current market value'
                }
            ]
        },
        {
            id: 33,
            title: 'Cash-on-Cash Return',
            category: 'real-estate',
            icon: '💰',
            path: '/cash-on-cash-calculator',
            description: 'Measure return on cash invested.',
            formula: 'CoC = Annual Pre-tax Cash Flow ÷ Total Cash Invested',
            variables: [
                {
                    symbol: 'Annual Pre-tax Cash Flow',
                    description: 'Yearly cash flow before tax'
                },
                {
                    symbol: 'Total Cash Invested',
                    description: 'Initial cash investment'
                }
            ]
        },
        {
            id: 34,
            title: 'Loan-to-Value Ratio',
            category: 'real-estate',
            icon: '🏦',
            path: '/ltv-calculator',
            description: 'Measure loan amount relative to property value.',
            formula: 'LTV = Loan Amount ÷ Property Value',
            variables: [
                {
                    symbol: 'Loan Amount',
                    description: 'Mortgage amount'
                },
                {
                    symbol: 'Property Value',
                    description: 'Appraised property value'
                }
            ]
        },
        {
            id: 35,
            title: 'Debt Service Coverage Ratio',
            category: 'business',
            icon: '📋',
            path: '/dscr-calculator',
            description: 'Measure ability to service debt.',
            formula: 'DSCR = NOI ÷ Total Debt Service',
            variables: [
                {
                    symbol: 'NOI',
                    description: 'Net Operating Income'
                },
                {
                    symbol: 'Total Debt Service',
                    description: 'Total debt payments'
                }
            ]
        },
        {
            id: 36,
            title: 'Quick Ratio',
            category: 'business',
            icon: '⚡',
            path: '/quick-ratio-calculator',
            description: 'Measure immediate liquidity.',
            formula: 'Quick Ratio = (Current Assets - Inventory) ÷ Current Liabilities',
            variables: [
                {
                    symbol: 'Current Assets',
                    description: 'Assets convertible to cash within year'
                },
                {
                    symbol: 'Inventory',
                    description: 'Value of inventory'
                },
                {
                    symbol: 'Current Liabilities',
                    description: 'Debts due within year'
                }
            ]
        },
        {
            id: 37,
            title: 'Asset Turnover',
            category: 'business',
            icon: '🔄',
            path: '/asset-turnover-calculator',
            description: 'Measure efficiency in using assets.',
            formula: 'Asset Turnover = Revenue ÷ Total Assets',
            variables: [
                {
                    symbol: 'Revenue',
                    description: 'Total sales'
                },
                {
                    symbol: 'Total Assets',
                    description: 'Average total assets'
                }
            ]
        },
        {
            id: 38,
            title: 'Earnings Per Share',
            category: 'investment',
            icon: '📊',
            path: '/eps-calculator',
            description: 'Calculate profit per share.',
            formula: 'EPS = (Net Income - Preferred Dividends) ÷ Outstanding Shares',
            variables: [
                {
                    symbol: 'Net Income',
                    description: 'Total profit'
                },
                {
                    symbol: 'Preferred Dividends',
                    description: 'Dividends to preferred shareholders'
                },
                {
                    symbol: 'Outstanding Shares',
                    description: 'Number of common shares'
                }
            ]
        },
        {
            id: 39,
            title: 'Price-to-Earnings Ratio',
            category: 'investment',
            icon: '💹',
            path: '/pe-ratio-calculator',
            description: 'Measure stock valuation.',
            formula: 'P/E = Stock Price ÷ EPS',
            variables: [
                {
                    symbol: 'Stock Price',
                    description: 'Current market price per share'
                },
                {
                    symbol: 'EPS',
                    description: 'Earnings Per Share'
                }
            ]
        },
        {
            id: 40,
            title: 'Dividend Yield',
            category: 'investment',
            icon: '📈',
            path: '/dividend-yield-calculator',
            description: 'Calculate dividend return.',
            formula: 'Dividend Yield = Annual Dividend ÷ Stock Price',
            variables: [
                {
                    symbol: 'Annual Dividend',
                    description: 'Yearly dividend per share'
                },
                {
                    symbol: 'Stock Price',
                    description: 'Current market price'
                }
            ]
        }
    ];
    const filteredFormulas = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        let filtered = allFormulas;
        if (activeCategory !== 'all') {
            filtered = filtered.filter((formula)=>formula.category === activeCategory);
        }
        if (searchTerm) {
            filtered = filtered.filter((formula)=>formula.title.toLowerCase().includes(searchTerm.toLowerCase()) || formula.description.toLowerCase().includes(searchTerm.toLowerCase()) || formula.formula.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        return filtered;
    }, [
        searchTerm,
        activeCategory
    ]);
    // SEO Metadata
    const siteUrl = 'https://www.financecalculatorfree.com';
    const pageTitle = 'Essential Financial Formulas | Master Finance with 40+ Key Formulas';
    const pageDescription = 'Complete guide to 40+ essential financial formulas for business, investment, personal finance, and real estate. Free calculators with detailed explanations and examples.';
    const totalFormulas = allFormulas.length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("title", {
                        children: pageTitle
                    }, void 0, false, {
                        fileName: "[project]/src/pages/blog.js",
                        lineNumber: 602,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        name: "description",
                        content: pageDescription
                    }, void 0, false, {
                        fileName: "[project]/src/pages/blog.js",
                        lineNumber: 603,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        name: "keywords",
                        content: "financial formulas, business formulas, investment formulas, finance equations, ROI formula, NPV formula, compound interest formula, financial calculations"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/blog.js",
                        lineNumber: 604,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        name: "author",
                        content: "Calci Financial Experts"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/blog.js",
                        lineNumber: 605,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        name: "robots",
                        content: "index, follow"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/blog.js",
                        lineNumber: 606,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        name: "date",
                        content: currentDate
                    }, void 0, false, {
                        fileName: "[project]/src/pages/blog.js",
                        lineNumber: 607,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        name: "last-modified",
                        content: lastModifiedDate
                    }, void 0, false, {
                        fileName: "[project]/src/pages/blog.js",
                        lineNumber: 608,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        property: "og:title",
                        content: pageTitle
                    }, void 0, false, {
                        fileName: "[project]/src/pages/blog.js",
                        lineNumber: 611,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        property: "og:description",
                        content: pageDescription
                    }, void 0, false, {
                        fileName: "[project]/src/pages/blog.js",
                        lineNumber: 612,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        property: "og:type",
                        content: "website"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/blog.js",
                        lineNumber: 613,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        property: "og:url",
                        content: `${siteUrl}/formulas`
                    }, void 0, false, {
                        fileName: "[project]/src/pages/blog.js",
                        lineNumber: 614,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        property: "og:image",
                        content: `${siteUrl}/images/financial-formulas-og.jpg`
                    }, void 0, false, {
                        fileName: "[project]/src/pages/blog.js",
                        lineNumber: 615,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        property: "og:site_name",
                        content: "Calci Finance Tools"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/blog.js",
                        lineNumber: 616,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        name: "twitter:card",
                        content: "summary_large_image"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/blog.js",
                        lineNumber: 619,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        name: "twitter:title",
                        content: pageTitle
                    }, void 0, false, {
                        fileName: "[project]/src/pages/blog.js",
                        lineNumber: 620,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        name: "twitter:description",
                        content: pageDescription
                    }, void 0, false, {
                        fileName: "[project]/src/pages/blog.js",
                        lineNumber: 621,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        name: "twitter:image",
                        content: `${siteUrl}/images/financial-formulas-twitter.jpg`
                    }, void 0, false, {
                        fileName: "[project]/src/pages/blog.js",
                        lineNumber: 622,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("link", {
                        rel: "canonical",
                        href: `${siteUrl}/formulas`
                    }, void 0, false, {
                        fileName: "[project]/src/pages/blog.js",
                        lineNumber: 625,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/blog.js",
                lineNumber: 601,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                id: "main-schema",
                type: "application/ld+json",
                strategy: "afterInteractive",
                children: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'WebPage',
                    name: pageTitle,
                    description: pageDescription,
                    url: `${siteUrl}/formulas`,
                    datePublished: currentDate,
                    dateModified: lastModifiedDate,
                    author: {
                        '@type': 'Organization',
                        name: 'Calci Financial Experts',
                        url: siteUrl
                    },
                    mainEntity: {
                        '@type': 'ItemList',
                        name: 'Financial Formulas Collection',
                        description: 'Comprehensive collection of essential financial formulas',
                        numberOfItems: totalFormulas,
                        itemListElement: allFormulas.slice(0, 20).map((formula, index)=>({
                                '@type': 'ListItem',
                                position: index + 1,
                                item: {
                                    '@type': 'CreativeWork',
                                    name: `${formula.title} Formula`,
                                    description: formula.description,
                                    educationalLevel: 'Intermediate',
                                    learningResourceType: 'Formula'
                                }
                            }))
                    }
                })
            }, void 0, false, {
                fileName: "[project]/src/pages/blog.js",
                lineNumber: 629,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                id: "faq-schema",
                type: "application/ld+json",
                strategy: "afterInteractive",
                children: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'FAQPage',
                    mainEntity: [
                        {
                            '@type': 'Question',
                            name: 'Why are financial formulas important?',
                            acceptedAnswer: {
                                '@type': 'Answer',
                                text: 'Financial formulas provide the mathematical foundation for making informed business, investment, and personal finance decisions. They help quantify risk, project returns, and analyze financial performance objectively.',
                                datePublished: currentDate
                            }
                        },
                        {
                            '@type': 'Question',
                            name: 'How can I use these formulas?',
                            acceptedAnswer: {
                                '@type': 'Answer',
                                text: 'Each formula comes with a free calculator tool that does the math for you. Simply input your numbers to get instant results, or study the formula to understand the underlying principles.',
                                datePublished: currentDate
                            }
                        },
                        {
                            '@type': 'Question',
                            name: 'Are these formulas used by professionals?',
                            acceptedAnswer: {
                                '@type': 'Answer',
                                text: 'Yes, these are industry-standard formulas used by financial analysts, accountants, investors, and business professionals worldwide. They form the basis of modern financial analysis.',
                                datePublished: currentDate
                            }
                        }
                    ]
                })
            }, void 0, false, {
                fileName: "[project]/src/pages/blog.js",
                lineNumber: 667,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: styles.pageWrapper,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("header", {
                        className: styles.hero,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: styles.heroContent,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                    className: styles.title,
                                    children: "Master Financial Formulas: The Complete Guide"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/blog.js",
                                    lineNumber: 711,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: styles.subtitle,
                                    children: [
                                        "Access ",
                                        totalFormulas,
                                        " essential financial formulas with detailed explanations, free calculators, and real-world applications. Used by 10,000+ finance professionals."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/blog.js",
                                    lineNumber: 712,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: styles.searchContainer,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: styles.searchWrapper,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                placeholder: "Search formulas (e.g., 'ROI', 'NPV', 'compound interest')",
                                                value: searchTerm,
                                                onChange: (e)=>setSearchTerm(e.target.value),
                                                className: styles.searchInput,
                                                "aria-label": "Search financial formulas"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/blog.js",
                                                lineNumber: 720,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: styles.searchIcon,
                                                children: "🔍"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/blog.js",
                                                lineNumber: 728,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/blog.js",
                                        lineNumber: 719,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/blog.js",
                                    lineNumber: 718,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/blog.js",
                            lineNumber: 710,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/pages/blog.js",
                        lineNumber: 709,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("main", {
                        className: styles.main,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                                className: styles.categorySection,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: styles.categoryContainer,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                            className: styles.sectionTitle,
                                            children: "Formula Categories"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/blog.js",
                                            lineNumber: 738,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: styles.categoryGrid,
                                            children: formulaCategories.map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    className: `${styles.categoryButton} ${activeCategory === category.id ? styles.activeCategory : ''}`,
                                                    onClick: ()=>setActiveCategory(category.id),
                                                    "aria-label": `Filter formulas by ${category.name}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: styles.categoryIcon,
                                                            children: category.icon
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/blog.js",
                                                            lineNumber: 747,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: styles.categoryName,
                                                            children: category.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/blog.js",
                                                            lineNumber: 748,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: styles.categoryCount,
                                                            children: category.count
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/blog.js",
                                                            lineNumber: 749,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, category.id, true, {
                                                    fileName: "[project]/src/pages/blog.js",
                                                    lineNumber: 741,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)))
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/blog.js",
                                            lineNumber: 739,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/blog.js",
                                    lineNumber: 737,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/pages/blog.js",
                                lineNumber: 736,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: styles.resultsInfo,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                    className: styles.resultsTitle,
                                    children: [
                                        filteredFormulas.length,
                                        " ",
                                        filteredFormulas.length === 1 ? 'Formula' : 'Formulas',
                                        " Found",
                                        activeCategory !== 'all' && ` in ${formulaCategories.find((c)=>c.id === activeCategory)?.name}`,
                                        searchTerm && ` for "${searchTerm}"`
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/blog.js",
                                    lineNumber: 758,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/pages/blog.js",
                                lineNumber: 757,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                                className: styles.formulasGrid,
                                children: filteredFormulas.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: styles.noResults,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: styles.noResultsIcon,
                                            children: "🔍"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/blog.js",
                                            lineNumber: 769,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                            children: "No formulas found"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/blog.js",
                                            lineNumber: 770,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            children: "Try a different search term or select another category"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/blog.js",
                                            lineNumber: 771,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                setSearchTerm('');
                                                setActiveCategory('all');
                                            },
                                            className: styles.clearFilters,
                                            children: "Show All Formulas"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/blog.js",
                                            lineNumber: 772,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/blog.js",
                                    lineNumber: 768,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: styles.cardsContainer,
                                    children: filteredFormulas.map((formula)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("article", {
                                            className: styles.formulaCard,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: styles.cardHeader,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: styles.cardIcon,
                                                            children: formula.icon
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/blog.js",
                                                            lineNumber: 787,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: styles.cardTitleContainer,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                                    className: styles.cardTitle,
                                                                    children: formula.title
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/blog.js",
                                                                    lineNumber: 789,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: styles.cardCategory,
                                                                    children: [
                                                                        formulaCategories.find((c)=>c.id === formula.category)?.icon,
                                                                        formulaCategories.find((c)=>c.id === formula.category)?.name
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/blog.js",
                                                                    lineNumber: 790,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/blog.js",
                                                            lineNumber: 788,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/blog.js",
                                                    lineNumber: 786,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: styles.cardBody,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: styles.cardDescription,
                                                            children: formula.description
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/blog.js",
                                                            lineNumber: 798,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: styles.formulaContainer,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: styles.formulaLabel,
                                                                    children: "Formula:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/blog.js",
                                                                    lineNumber: 801,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: styles.formulaDisplay,
                                                                    children: formula.formula
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/blog.js",
                                                                    lineNumber: 802,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/blog.js",
                                                            lineNumber: 800,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        formula.variables && formula.variables.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: styles.variablesContainer,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: styles.variablesLabel,
                                                                    children: "Variables:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/blog.js",
                                                                    lineNumber: 807,
                                                                    columnNumber: 27
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                                                                    className: styles.variablesList,
                                                                    children: formula.variables.map((variable, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                                            className: styles.variableItem,
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: styles.variableSymbol,
                                                                                    children: variable.symbol
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/blog.js",
                                                                                    lineNumber: 811,
                                                                                    columnNumber: 33
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: styles.variableDescription,
                                                                                    children: variable.description
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/blog.js",
                                                                                    lineNumber: 812,
                                                                                    columnNumber: 33
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            ]
                                                                        }, index, true, {
                                                                            fileName: "[project]/src/pages/blog.js",
                                                                            lineNumber: 810,
                                                                            columnNumber: 31
                                                                        }, ("TURBOPACK compile-time value", void 0)))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/blog.js",
                                                                    lineNumber: 808,
                                                                    columnNumber: 27
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/blog.js",
                                                            lineNumber: 806,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/blog.js",
                                                    lineNumber: 797,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: styles.cardFooter,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                        href: formula.path,
                                                        className: styles.calculatorLink,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: styles.linkText,
                                                                children: "Use Calculator"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/blog.js",
                                                                lineNumber: 822,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: styles.linkArrow,
                                                                children: "→"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/blog.js",
                                                                lineNumber: 823,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/blog.js",
                                                        lineNumber: 821,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/blog.js",
                                                    lineNumber: 820,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, formula.id, true, {
                                            fileName: "[project]/src/pages/blog.js",
                                            lineNumber: 785,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)))
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/blog.js",
                                    lineNumber: 783,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/pages/blog.js",
                                lineNumber: 766,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                                className: styles.ctaSection,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: styles.ctaContainer,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: styles.ctaIcon,
                                            children: "📚"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/blog.js",
                                            lineNumber: 835,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                            className: styles.ctaTitle,
                                            children: "Need Help Applying These Formulas?"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/blog.js",
                                            lineNumber: 836,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            className: styles.ctaText,
                                            children: "Each formula comes with a free calculator tool that does the math for you. No manual calculations needed - just input your numbers and get instant results."
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/blog.js",
                                            lineNumber: 837,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: styles.ctaButtons,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/suite",
                                                    className: styles.primaryButton,
                                                    children: "Explore All Calculators"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/blog.js",
                                                    lineNumber: 842,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/learn",
                                                    className: styles.secondaryButton,
                                                    children: "Learn Finance Basics"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/blog.js",
                                                    lineNumber: 845,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/blog.js",
                                            lineNumber: 841,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/blog.js",
                                    lineNumber: 834,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/pages/blog.js",
                                lineNumber: 833,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                                className: styles.educationSection,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: styles.educationContainer,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                            className: styles.educationTitle,
                                            children: "Why Master Financial Formulas?"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/blog.js",
                                            lineNumber: 855,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: styles.educationGrid,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: styles.educationCard,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: styles.eduIcon,
                                                            children: "🎯"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/blog.js",
                                                            lineNumber: 858,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                            children: "Make Better Decisions"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/blog.js",
                                                            lineNumber: 859,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            children: "Quantify risks and returns to make informed financial choices with confidence."
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/blog.js",
                                                            lineNumber: 860,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/blog.js",
                                                    lineNumber: 857,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: styles.educationCard,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: styles.eduIcon,
                                                            children: "📈"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/blog.js",
                                                            lineNumber: 863,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                            children: "Improve Analysis"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/blog.js",
                                                            lineNumber: 864,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            children: "Understand the numbers behind business performance and investment opportunities."
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/blog.js",
                                                            lineNumber: 865,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/blog.js",
                                                    lineNumber: 862,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: styles.educationCard,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: styles.eduIcon,
                                                            children: "💼"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/blog.js",
                                                            lineNumber: 868,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                            children: "Advance Your Career"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/blog.js",
                                                            lineNumber: 869,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            children: "Master financial analysis skills valued by employers across all industries."
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/blog.js",
                                                            lineNumber: 870,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/blog.js",
                                                    lineNumber: 867,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: styles.educationCard,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: styles.eduIcon,
                                                            children: "💰"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/blog.js",
                                                            lineNumber: 873,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                            children: "Increase Wealth"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/blog.js",
                                                            lineNumber: 874,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            children: "Apply formulas to optimize investments, reduce debt, and grow your net worth."
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/blog.js",
                                                            lineNumber: 875,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/blog.js",
                                                    lineNumber: 872,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/blog.js",
                                            lineNumber: 856,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/blog.js",
                                    lineNumber: 854,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/pages/blog.js",
                                lineNumber: 853,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/blog.js",
                        lineNumber: 734,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("footer", {
                        className: styles.footer,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: styles.footerContent,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: styles.footerText,
                                    children: [
                                        "© ",
                                        new Date().getFullYear(),
                                        " Calci Financial Formulas. All formulas are industry-standard and regularly verified by financial professionals."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/blog.js",
                                    lineNumber: 885,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: styles.footerNote,
                                    children: [
                                        "Page last updated: ",
                                        currentDate,
                                        ". Formulas are for educational purposes. Consult with a financial advisor for personalized advice."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/blog.js",
                                    lineNumber: 889,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/blog.js",
                            lineNumber: 884,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/pages/blog.js",
                        lineNumber: 883,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/blog.js",
                lineNumber: 707,
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
        revalidate: 21600
    };
}
const __TURBOPACK__default__export__ = FormulaPage;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__d91d2613._.js.map