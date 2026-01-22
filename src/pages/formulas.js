// components/FormulaPage.jsx
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Script from 'next/script';
import styles from './blogpost.module.css';

const FormulaPage = ({ currentDate, lastModifiedDate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const formulaCategories = [
    { id: 'all', name: 'All Formulas', icon: '📚', count: 61 },
    { id: 'business', name: 'Business', icon: '💼', count: 22 },
    { id: 'personal', name: 'Personal Finance', icon: '👨‍👩‍👧‍👦', count: 20 },
    { id: 'investment', name: 'Investment', icon: '📈', count: 12 },
    { id: 'real-estate', name: 'Real Estate', icon: '🏠', count: 7 },
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
        { symbol: 'A', description: 'Future value of investment/loan' },
        { symbol: 'P', description: 'Principal investment amount' },
        { symbol: 'r', description: 'Annual interest rate (decimal)' },
        { symbol: 'n', description: 'Number of times interest compounds per year' },
        { symbol: 't', description: 'Time in years' }
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
        { symbol: 'PMT', description: 'Monthly payment' },
        { symbol: 'P', description: 'Principal loan amount' },
        { symbol: 'r', description: 'Monthly interest rate (annual rate ÷ 12)' },
        { symbol: 'n', description: 'Total number of payments' }
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
        { symbol: 'ROI', description: 'Return on Investment percentage' },
        { symbol: 'Gain', description: 'Return from investment' },
        { symbol: 'Cost', description: 'Cost of investment' }
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
        { symbol: 'NPV', description: 'Net Present Value' },
        { symbol: 'CFₜ', description: 'Cash flow at time t' },
        { symbol: 'r', description: 'Discount rate' },
        { symbol: 't', description: 'Time period' }
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
        { symbol: 'Fixed Costs', description: 'Costs that dont change with production' },
        { symbol: 'Price', description: 'Selling price per unit' },
        { symbol: 'Variable Cost', description: 'Cost per unit produced' }
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
        { symbol: 'Net Profit', description: 'Revenue minus all expenses' },
        { symbol: 'Revenue', description: 'Total sales income' }
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
        { symbol: 'M', description: 'Monthly mortgage payment' },
        { symbol: 'P', description: 'Principal loan amount' },
        { symbol: 'r', description: 'Monthly interest rate' },
        { symbol: 'n', description: 'Total number of payments' }
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
        { symbol: 'FVA', description: 'Future Value of Annuity' },
        { symbol: 'PMT', description: 'Periodic payment amount' },
        { symbol: 'r', description: 'Interest rate per period' },
        { symbol: 'n', description: 'Number of periods' }
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
        { symbol: 'DTI', description: 'Debt-to-Income Ratio' },
        { symbol: 'Total Monthly Debt', description: 'Sum of all monthly debt payments' },
        { symbol: 'Gross Monthly Income', description: 'Monthly income before taxes' }
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
        { symbol: 'CAC', description: 'Customer Acquisition Cost' },
        { symbol: 'Total Marketing Costs', description: 'All marketing and sales expenses' },
        { symbol: 'New Customers', description: 'Customers acquired in period' }
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
        { symbol: 'Revenue', description: 'Total sales' },
        { symbol: 'COGS', description: 'Cost of Goods Sold' }
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
        { symbol: 'Net Income', description: 'Profit after all expenses' },
        { symbol: 'Interest', description: 'Interest expenses' },
        { symbol: 'Taxes', description: 'Tax expenses' },
        { symbol: 'Depreciation', description: 'Depreciation expenses' },
        { symbol: 'Amortization', description: 'Amortization expenses' }
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
        { symbol: 'Current Assets', description: 'Assets convertible to cash within year' },
        { symbol: 'Current Liabilities', description: 'Debts due within year' }
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
        { symbol: 'Current Assets', description: 'Assets convertible to cash within year' },
        { symbol: 'Current Liabilities', description: 'Debts due within year' }
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
        { symbol: 'Total Liabilities', description: 'All debts and obligations' },
        { symbol: 'Shareholders Equity', description: 'Assets minus liabilities' }
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
        { symbol: 'Net Income', description: 'Profit after all expenses' },
        { symbol: 'Shareholders Equity', description: 'Assets minus liabilities' }
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
        { symbol: 'E', description: 'Market value of equity' },
        { symbol: 'V', description: 'Total market value' },
        { symbol: 'Re', description: 'Cost of equity' },
        { symbol: 'D', description: 'Market value of debt' },
        { symbol: 'Rd', description: 'Cost of debt' },
        { symbol: 'Tc', description: 'Corporate tax rate' }
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
        { symbol: 'CFₜ', description: 'Cash flow at time t' },
        { symbol: 'r', description: 'Discount rate' },
        { symbol: 't', description: 'Time period' }
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
        { symbol: 'COGS', description: 'Cost of Goods Sold' },
        { symbol: 'Average Inventory', description: '(Beginning + Ending Inventory) ÷ 2' }
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
        { symbol: 'Net Credit Sales', description: 'Sales on credit minus returns' },
        { symbol: 'Average AR', description: '(Beginning + Ending AR) ÷ 2' }
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
        { symbol: 'Cost', description: 'Cost of product' },
        { symbol: 'Markup %', description: 'Desired profit percentage' }
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
        { symbol: 'Income', description: 'Gross income' },
        { symbol: 'Deductions', description: 'Allowable deductions' },
        { symbol: 'Tax Rate', description: 'Applicable tax bracket rate' }
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
        { symbol: 'Assessed Value', description: 'Value determined by assessor' },
        { symbol: 'Tax Rate', description: 'Local property tax rate' }
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
        { symbol: 'Sale Price', description: 'Price asset sold for' },
        { symbol: 'Purchase Price', description: 'Original purchase price' },
        { symbol: 'Costs', description: 'Associated costs and fees' }
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
        { symbol: 'DOL', description: 'Degree of Operating Leverage' },
        { symbol: 'EBIT', description: 'Earnings Before Interest and Taxes' },
        { symbol: 'Sales', description: 'Revenue' }
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
        { symbol: 'Operating Cash Flow', description: 'Cash from operations' },
        { symbol: 'Capital Expenditures', description: 'Investments in fixed assets' }
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
        { symbol: 'NOPAT', description: 'Net Operating Profit After Tax' },
        { symbol: 'WACC', description: 'Weighted Average Cost of Capital' },
        { symbol: 'Capital', description: 'Total capital invested' }
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
        { symbol: 'PV', description: 'Present Value' },
        { symbol: 'FV', description: 'Future Value' },
        { symbol: 'r', description: 'Discount rate' },
        { symbol: 'n', description: 'Number of periods' }
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
        { symbol: 'CFₜ', description: 'Cash flow at time t' },
        { symbol: 'IRR', description: 'Internal Rate of Return' },
        { symbol: 't', description: 'Time period' }
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
        { symbol: 'Initial Investment', description: 'Total initial investment' },
        { symbol: 'Annual Cash Flow', description: 'Yearly cash inflow' }
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
        { symbol: 'Property Price', description: 'Purchase price' },
        { symbol: 'Gross Annual Rent', description: 'Yearly rental income' }
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
        { symbol: 'NOI', description: 'Net Operating Income' },
        { symbol: 'Property Value', description: 'Current market value' }
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
        { symbol: 'Annual Pre-tax Cash Flow', description: 'Yearly cash flow before tax' },
        { symbol: 'Total Cash Invested', description: 'Initial cash investment' }
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
        { symbol: 'Loan Amount', description: 'Mortgage amount' },
        { symbol: 'Property Value', description: 'Appraised property value' }
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
        { symbol: 'NOI', description: 'Net Operating Income' },
        { symbol: 'Total Debt Service', description: 'Total debt payments' }
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
        { symbol: 'Current Assets', description: 'Assets convertible to cash within year' },
        { symbol: 'Inventory', description: 'Value of inventory' },
        { symbol: 'Current Liabilities', description: 'Debts due within year' }
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
        { symbol: 'Revenue', description: 'Total sales' },
        { symbol: 'Total Assets', description: 'Average total assets' }
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
        { symbol: 'Net Income', description: 'Total profit' },
        { symbol: 'Preferred Dividends', description: 'Dividends to preferred shareholders' },
        { symbol: 'Outstanding Shares', description: 'Number of common shares' }
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
        { symbol: 'Stock Price', description: 'Current market price per share' },
        { symbol: 'EPS', description: 'Earnings Per Share' }
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
        { symbol: 'Annual Dividend', description: 'Yearly dividend per share' },
        { symbol: 'Stock Price', description: 'Current market price' }
      ]
    },
    // ADDED: Millionaire Calculator
    {
      id: 41,
      title: 'Millionaire Calculator',
      category: 'personal',
      icon: '💎',
      path: '/millionaire-calculator',
      description: 'Calculate how long it takes to become a millionaire with your current savings and investments.',
      formula: 'Years = [ln(Million) - ln(Principal)] ÷ [ln(1 + Annual Return)]',
      variables: [
        { symbol: 'Years', description: 'Time needed to reach $1 million' },
        { symbol: 'Principal', description: 'Initial investment amount' },
        { symbol: 'Annual Return', description: 'Expected annual return rate' },
        { symbol: 'Monthly Contributions', description: 'Regular monthly investments' }
      ]
    },
    // ADDED: Early Retirement Calculator
    {
      id: 42,
      title: 'Early Retirement Calculator',
      category: 'personal',
      icon: '🏖️',
      path: '/early-retirement-calculator',
      description: 'Calculate how much you need to save to retire early based on your desired lifestyle.',
      formula: 'Retirement Savings = Annual Expenses × 25 (4% Rule)',
      variables: [
        { symbol: 'Retirement Savings', description: 'Total needed for retirement' },
        { symbol: 'Annual Expenses', description: 'Yearly living expenses in retirement' },
        { symbol: 'Safe Withdrawal Rate', description: 'Percentage you can withdraw annually (typically 4%)' },
        { symbol: 'Years to Retirement', description: 'Time until planned retirement' }
      ]
    },
    // ADDED: Inflation-Adjusted Calculator
    {
      id: 43,
      title: 'Inflation-Adjusted Calculator',
      category: 'personal',
      icon: '📉',
      path: '/inflation-adjusted-calculator',
      description: 'Calculate the real value of money over time accounting for inflation.',
      formula: 'Future Value = Present Value × (1 + Inflation Rate)^Years',
      variables: [
        { symbol: 'Future Value', description: 'Amount needed in future to equal todays value' },
        { symbol: 'Present Value', description: 'Current amount of money' },
        { symbol: 'Inflation Rate', description: 'Annual inflation rate' },
        { symbol: 'Years', description: 'Number of years into the future' }
      ]
    },
    // ADDED: Rent Increase Calculator
    {
      id: 44,
      title: 'Rent Increase Calculator',
      category: 'real-estate',
      icon: '🏢',
      path: '/rent-increase-calculator',
      description: 'Calculate future rent costs and total payments with annual increases.',
      formula: 'Future Rent = Current Rent × (1 + Annual Increase)^Years',
      variables: [
        { symbol: 'Future Rent', description: 'Monthly rent after specified years' },
        { symbol: 'Current Rent', description: 'Current monthly rent' },
        { symbol: 'Annual Increase', description: 'Yearly rent increase percentage' },
        { symbol: 'Years', description: 'Number of years' }
      ]
    },
    // ADDED: Subscription Cost Calculator
    {
      id: 45,
      title: 'Subscription Cost Calculator',
      category: 'personal',
      icon: '📱',
      path: '/subscription-cost-calculator',
      description: 'Calculate total annual and lifetime costs of your subscriptions.',
      formula: 'Annual Cost = Σ(Monthly Subscription × 12)',
      variables: [
        { symbol: 'Annual Cost', description: 'Total yearly subscription expenses' },
        { symbol: 'Monthly Subscription', description: 'Cost of each monthly service' },
        { symbol: 'Number of Services', description: 'Total subscription services' },
        { symbol: 'Years', description: 'Duration of subscriptions' }
      ]
    }
  ];

  const filteredFormulas = useMemo(() => {
    let filtered = allFormulas;
    
    if (activeCategory !== 'all') {
      filtered = filtered.filter(formula => formula.category === activeCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(formula =>
        formula.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formula.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formula.formula.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [searchTerm, activeCategory]);

  // SEO Metadata
  const siteUrl = 'https://www.financecalculatorfree.com';
  const pageTitle = 'Essential Financial Formulas | Master Finance with 45+ Key Formulas';
  const pageDescription = 'Complete guide to 45+ essential financial formulas for business, investment, personal finance, and real estate. Free calculators with detailed explanations and examples.';
  const totalFormulas = allFormulas.length;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="financial formulas, business formulas, investment formulas, finance equations, ROI formula, NPV formula, compound interest formula, financial calculations" />
        <meta name="author" content="Calci Financial Experts" />
        <meta name="robots" content="index, follow" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />

        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/formulas`} />
        <meta property="og:image" content={`${siteUrl}/images/financial-formulas-og.jpg`} />
        <meta property="og:site_name" content="Calci Finance Tools" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={`${siteUrl}/images/financial-formulas-twitter.jpg`} />

        {/* Canonical */}
        <link rel="canonical" href={`${siteUrl}/formulas`} />
      </Head>

      {/* Structured Data */}
      <Script
        id="main-schema"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify({
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
            itemListElement: allFormulas.slice(0, 20).map((formula, index) => ({
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
        })}
      </Script>

      <Script
        id="faq-schema"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify({
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
        })}
      </Script>

      <div className={styles.pageWrapper}>
        {/* Hero Section */}
        <header className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>Master Financial Formulas: The Complete Guide</h1>
            <p className={styles.subtitle}>
              Access {totalFormulas} essential financial formulas with detailed explanations, 
              free calculators, and real-world applications. Used by 10,000+ finance professionals.
            </p>
            
            {/* Search Bar */}
            <div className={styles.searchContainer}>
              <div className={styles.searchWrapper}>
                <input
                  type="text"
                  placeholder="Search formulas (e.g., 'ROI', 'NPV', 'compound interest')"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                  aria-label="Search financial formulas"
                />
                <div className={styles.searchIcon}>🔍</div>
              </div>
            </div>
          </div>
        </header>

        <main className={styles.main}>
          {/* Category Filter */}
          <section className={styles.categorySection}>
            <div className={styles.categoryContainer}>
              <h2 className={styles.sectionTitle}>Formula Categories</h2>
              <div className={styles.categoryGrid}>
                {formulaCategories.map((category) => (
                  <button
                    key={category.id}
                    className={`${styles.categoryButton} ${activeCategory === category.id ? styles.activeCategory : ''}`}
                    onClick={() => setActiveCategory(category.id)}
                    aria-label={`Filter formulas by ${category.name}`}
                  >
                    <span className={styles.categoryIcon}>{category.icon}</span>
                    <span className={styles.categoryName}>{category.name}</span>
                    <span className={styles.categoryCount}>{category.count}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Results Count */}
          <div className={styles.resultsInfo}>
            <h2 className={styles.resultsTitle}>
              {filteredFormulas.length} {filteredFormulas.length === 1 ? 'Formula' : 'Formulas'} Found
              {activeCategory !== 'all' && ` in ${formulaCategories.find(c => c.id === activeCategory)?.name}`}
              {searchTerm && ` for "${searchTerm}"`}
            </h2>
          </div>

          {/* Formulas Grid */}
          <section className={styles.formulasGrid}>
            {filteredFormulas.length === 0 ? (
              <div className={styles.noResults}>
                <div className={styles.noResultsIcon}>🔍</div>
                <h3>No formulas found</h3>
                <p>Try a different search term or select another category</p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setActiveCategory('all');
                  }}
                  className={styles.clearFilters}
                >
                  Show All Formulas
                </button>
              </div>
            ) : (
              <div className={styles.cardsContainer}>
                {filteredFormulas.map((formula) => (
                  <article key={formula.id} className={styles.formulaCard}>
                    <div className={styles.cardHeader}>
                      <div className={styles.cardIcon}>{formula.icon}</div>
                      <div className={styles.cardTitleContainer}>
                        <h3 className={styles.cardTitle}>{formula.title}</h3>
                        <span className={styles.cardCategory}>
                          {formulaCategories.find(c => c.id === formula.category)?.icon}
                          {formulaCategories.find(c => c.id === formula.category)?.name}
                        </span>
                      </div>
                    </div>
                    
                    <div className={styles.cardBody}>
                      <p className={styles.cardDescription}>{formula.description}</p>
                      
                      <div className={styles.formulaContainer}>
                        <div className={styles.formulaLabel}>Formula:</div>
                        <div className={styles.formulaDisplay}>{formula.formula}</div>
                      </div>
                      
                      {formula.variables && formula.variables.length > 0 && (
                        <div className={styles.variablesContainer}>
                          <div className={styles.variablesLabel}>Variables:</div>
                          <ul className={styles.variablesList}>
                            {formula.variables.map((variable, index) => (
                              <li key={index} className={styles.variableItem}>
                                <span className={styles.variableSymbol}>{variable.symbol}</span>
                                <span className={styles.variableDescription}>{variable.description}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    <div className={styles.cardFooter}>
                      <Link href={formula.path} className={styles.calculatorLink}>
                        <span className={styles.linkText}>Use Calculator</span>
                        <span className={styles.linkArrow}>→</span>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* CTA Section */}
          <section className={styles.ctaSection}>
            <div className={styles.ctaContainer}>
              <div className={styles.ctaIcon}>📚</div>
              <h2 className={styles.ctaTitle}>Need Help Applying These Formulas?</h2>
              <p className={styles.ctaText}>
                Each formula comes with a free calculator tool that does the math for you. 
                No manual calculations needed - just input your numbers and get instant results.
              </p>
              <div className={styles.ctaButtons}>
                <Link href="/suite" className={styles.primaryButton}>
                  Explore All Calculators
                </Link>
                <Link href="/learn" className={styles.secondaryButton}>
                  Learn Finance Basics
                </Link>
              </div>
            </div>
          </section>

          {/* Educational Section */}
          <section className={styles.educationSection}>
            <div className={styles.educationContainer}>
              <h2 className={styles.educationTitle}>Why Master Financial Formulas?</h2>
              <div className={styles.educationGrid}>
                <div className={styles.educationCard}>
                  <div className={styles.eduIcon}>🎯</div>
                  <h3>Make Better Decisions</h3>
                  <p>Quantify risks and returns to make informed financial choices with confidence.</p>
                </div>
                <div className={styles.educationCard}>
                  <div className={styles.eduIcon}>📈</div>
                  <h3>Improve Analysis</h3>
                  <p>Understand the numbers behind business performance and investment opportunities.</p>
                </div>
                <div className={styles.educationCard}>
                  <div className={styles.eduIcon}>💼</div>
                  <h3>Advance Your Career</h3>
                  <p>Master financial analysis skills valued by employers across all industries.</p>
                </div>
                <div className={styles.educationCard}>
                  <div className={styles.eduIcon}>💰</div>
                  <h3>Increase Wealth</h3>
                  <p>Apply formulas to optimize investments, reduce debt, and grow your net worth.</p>
                </div>
              </div>
            </div>
          </section>
        </main>

        
      </div>
    </>
  );
};

export async function getStaticProps() {
  const buildTime = new Date();
  const currentDate = buildTime.toISOString().split('T')[0];
  const lastModifiedDate = buildTime.toISOString();
  
  return {
    props: {
      currentDate,
      lastModifiedDate,
    },
    revalidate: 21600, // 24 hours
  };
}

export default FormulaPage;