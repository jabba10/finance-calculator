// components/BusinessCalculatorSuite.jsx
import React, { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './businesscalculatorsuite.module.css';

const BusinessCalculatorSuite = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // === Full List of 54 Calculators (copied exactly from BlogPost.jsx) ===
  const calculators = [
    { id: 1, title: 'Simple', icon: '🧮', path: '/simple-calculator', description: 'A basic arithmetic calculator for addition, subtraction, multiplication, and division.' },
    { id: 2, title: 'Tax', icon: '🧾', path: '/tax-calculator', description: 'Calculate income tax or sales tax based on your location, earnings, and filing status.' },
    { id: 3, title: 'Loan', icon: '🏦', path: '/loan-calculator', description: 'Determine monthly loan payments, total interest paid, and view a full amortization schedule.' },
    { id: 4, title: 'Break-even', icon: '⚖️', path: '/break-even-calculator', description: 'Find the exact sales volume needed to cover all fixed and variable costs.' },
    { id: 5, title: 'Cashflow', icon: '💸', path: '/cashflow-calculator', description: 'Track and project business or personal cash inflows and outflows.' },
    { id: 6, title: 'CAC', icon: '🎯', path: '/cac-calculator', description: 'Calculate Customer Acquisition Cost to measure how much you spend to gain a new customer.' },
    { id: 7, title: 'Markup', icon: '🏷️', path: '/markup-calculator', description: 'Set profitable product prices by applying a markup percentage to cost.' },
    { id: 8, title: 'Profit Margin', icon: '📉', path: '/profit-margin-calculator', description: 'Compute gross and net profit margins to understand profitability as a percentage of revenue.' },
    { id: 9, title: 'ROI', icon: '📈', path: '/roi-calculator', description: 'Measure Return on Investment for marketing campaigns, real estate, stocks, or any capital expenditure.' },
    { id: 10, title: 'NPV', icon: '📊', path: '/npv-calculator', description: 'Calculate Net Present Value of future cash flows to determine if an investment will yield positive returns.' },
    { id: 11, title: 'Payroll', icon: '📋', path: '/payroll-calculator', description: 'Estimate total payroll costs including wages, overtime, taxes, and deductions.' },
    { id: 12, title: 'Gross Profit', icon: '💰', path: '/gross-profit-calculator', description: 'Calculate gross profit by subtracting cost of goods sold from total revenue.' },
    { id: 13, title: 'EBITDA', icon: '💼', path: '/ebitda-calculator', description: 'Determine Earnings Before Interest, Taxes, Depreciation, and Amortization.' },
    { id: 14, title: 'Inventory', icon: '📦', path: '/inventory-turnover-calculator', description: 'Analyze inventory turnover ratio to measure how often stock is sold and replaced.' },
    { id: 15, title: 'Working Capital', icon: '💳', path: '/working-capital-calculator', description: 'Assess short-term financial health by calculating current assets minus liabilities.' },
    { id: 16, title: 'Debt/Equity', icon: '📉', path: '/debt-to-equity-calculator', description: 'Evaluate financial leverage by comparing total debt to shareholders equity.' },
    { id: 17, title: 'Current Ratio', icon: '🔍', path: '/current-ratio-calculator', description: 'Measure ability to pay short-term obligations using current assets.' },
    { id: 18, title: 'ROE', icon: '🏦', path: '/roe-calculator', description: 'Calculate Return on Equity to assess profit generation from shareholder investments.' },
    { id: 19, title: 'Valuation', icon: '🏢', path: '/business-valuation-calculator', description: 'Estimate the fair market value of your business using revenue and industry multiples.' },
    { id: 20, title: 'EVA', icon: '💡', path: '/eva-calculator', description: 'Compute Economic Value Added — the profit after covering cost of capital.' },
    { id: 21, title: 'WACC', icon: '📉', path: '/wacc-calculator', description: 'Find Weighted Average Cost of Capital used in valuation and finance decisions.' },
    { id: 22, title: '401K', icon: '🏦', path: '/retirement-calculator', description: 'Project retirement savings growth with employer match and compound interest.' },
    { id: 23, title: 'CD', icon: '🔒', path: '/cd-calculator', description: 'Calculate maturity amount and interest earned on a Certificate of Deposit.' },
    { id: 24, title: 'Bonds', icon: '📜', path: '/government-bonds-calculator', description: 'Estimate yield, return, and interest income from government bonds.' },
    { id: 25, title: 'Leverage', icon: '⚙️', path: '/operating-leverage-calculator', description: 'Analyze how fixed costs affect profitability when sales volume changes.' },
    { id: 26, title: 'Cash Flow', icon: '🔄', path: '/free-cash-flow-calculator', description: 'Calculate Free Cash Flow available for expansion, dividends, or debt reduction.' },
    { id: 27, title: 'Lease/Buy', icon: '🚗', path: '/lease-vs-buy-calculator', description: 'Compare leasing vs buying a vehicle or equipment to make smarter decisions.' },
    { id: 28, title: 'Pension', icon: '👵', path: '/pension-planning-calculator', description: 'Estimate monthly pension income in retirement based on service and salary history.' },
    { id: 29, title: 'Tax Bracket', icon: '🔖', path: '/tax-bracket-calculator', description: 'Determine your federal and state tax brackets and marginal tax rate.' },
    { id: 30, title: 'Education', icon: '🎓', path: '/education-cost-calculator', description: 'Plan for future education expenses including tuition and living costs.' },
    { id: 31, title: 'Crypto', icon: '₿', path: '/crypto-investment-calculator', description: 'Track crypto investment performance, calculate gains/losses, and estimate taxes.' },
    { id: 32, title: 'Debt', icon: '💳', path: '/credit-card-payoff-calculator', description: 'Create a payoff plan for credit card debt using snowball or avalanche methods.' },
    { id: 33, title: 'Purchasing Power', icon: '🌍', path: '/purchasing-power-parity-calculator', description: 'See how inflation or exchange rates affect the real value of money.' },
    { id: 34, title: 'Development', icon: '🏗️', path: '/development-feasibility-calculator', description: 'Analyze real estate development feasibility before breaking ground.' },
    { id: 35, title: 'Occupancy', icon: '🏢', path: '/occupancy-cost-calculator', description: 'Compare occupancy costs for office, retail, or industrial space.' },
    { id: 36, title: 'Litigation', icon: '⚖️', path: '/litigation-cost-calculator', description: 'Estimate legal fees, court costs, and settlement expenses.' },
    { id: 37, title: 'Monte Carlo', icon: '🎲', path: '/monte-carlo-simulation-calculator', description: 'Use probabilistic modeling to simulate financial outcomes and risk.' },
    { id: 38, title: 'Game Theory', icon: '♟️', path: '/game-theory-payoff-calculator', description: 'Model strategic interactions between competitors or players.' },
    { id: 39, title: 'Financial Literacy', icon: '📚', path: '/financial-literacy-score-calculator', description: 'Test your knowledge of personal finance and improve financial IQ.' },
    { id: 40, title: 'Staking', icon: '🔗', path: '/staking-rewards-calculator', description: 'Calculate potential rewards from staking cryptocurrencies over time.' },
    { id: 41, title: 'Time Value of Money', icon: '⏳', path: '/time-value-of-money-calculator', description: 'Understand how money grows or loses value over time due to interest.' },
    { id: 42, title: 'Discounted Cash Flow', icon: '📉', path: '/discounted-cash-flow-calculator', description: 'Value a business or investment by discounting future cash flows.' },
    { id: 43, title: 'Duration Convexity', icon: '📉', path: '/duration-convexity-calculator', description: 'Measure bond price sensitivity to interest rate changes.' },
    { id: 44, title: 'Option Pricing', icon: '💱', path: '/option-pricing-calculator', description: 'Price call and put options using models like Black-Scholes.' },
    { id: 45, title: 'HE-LOC', icon: '🏠', path: '/he-loc-calculator', description: 'Calculate payments and limits for a Home Equity Line of Credit.' },
    { id: 46, title: 'Accounts Receivable Turnover', icon: '📬', path: '/accounts-receivable-turnover-calculator', description: 'Measure how quickly a company collects payments from customers.' },
    { id: 47, title: 'Legal Retainer', icon: '⚖️', path: '/legal-retainer-calculator', description: 'Track remaining balance and usage of a legal retainer fee.' },
    { id: 48, title: 'Flipping Profit', icon: '🔄', path: '/flipping-profit-calculator', description: 'Estimate profit from flipping houses, cars, or collectibles.' },
    { id: 49, title: 'Mortgage Refinance', icon: '🏡', path: '/mortgage-refinance-break-even-calculator', description: 'Determine break-even point after refinancing a mortgage.' },
    { id: 50, title: 'Worker Classification', icon: '👷', path: '/worker-classification-calculator', description: 'Determine if a worker is an employee or independent contractor.' },
    { id: 51, title: 'Property Taxes', icon: '🏠', path: '/property-tax-calculator', description: 'Calculate annual or monthly property tax based on home value.' },
    { id: 52, title: 'Car Loan', icon: '🚗', path: '/car-loan-calculator', description: 'Estimate monthly payments and total cost of financing a car.' },
    { id: 53, title: 'Social Security', icon: '👵', path: '/social-security-calculator', description: 'Forecast Social Security retirement benefits based on earnings history.' },
    { id: 54, title: 'PPF', icon: '🇮🇳', path: '/ppf-calculator', description: 'Plan savings and project maturity in India Public Provident Fund.' },
    { id: 55, title: 'Mortgage Calculator', icon: '🏡', path: '/mortgage-calculator', description: 'Calculate monthly payments and total cost of financing a mortgage.' },
    { id: 56, title: 'Compound Interest Calculator', icon: '📉', path: '/compound-interest-calculator', description: 'Calculate compound interest over time based on principal, rate, and time.' },
  ];

  const filteredCalculators = calculators.filter(calc =>
    calc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    calc.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // SEO Metadata
  const siteUrl = 'https://www.financecalculatorfree.com';
  const pageTitle = '54 Free Business & Finance Calculators | ROI, Break-even, Loan, Tax Tools';
  const pageDescription = 'Access 54 free financial calculators with accurate formulas. No signup. 100% private.';
  const imagePreview = `${siteUrl}/images/business-calculators-preview.jpg`;

  return (
    <>
      <Head>
        {/* Basic Meta */}
        <html lang="en" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="business calculator, ROI, loan, tax, NPV, CAC, free tools" />
        <meta name="author" content="Calci" />
        <meta name="robots" content="index, follow" />

        {/* Canonical */}
        <link rel="canonical" href={`${siteUrl}/suite`} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/suite`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={imagePreview} />
        <meta property="og:image:alt" content="Collection of 54 business finance calculators" />
        <meta property="og:site_name" content="Calci" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@calci" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={imagePreview} />
        <meta name="twitter:image:alt" content="Free financial calculators for entrepreneurs and investors" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: pageTitle,
            description: pageDescription,
            url: `${siteUrl}/suite`,
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
                { '@type': 'ListItem', position: 2, name: 'Calculator Suite', item: `${siteUrl}/suite` }
              ]
            }
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Business & Finance Calculator Suite',
            description: 'A comprehensive suite of 54 financial calculators for business owners, finance professionals, and investors.',
            hasPart: calculators.slice(0, 10).map(calc => ({
              '@type': 'WebPage',
              name: calc.title + ' Calculator',
              url: `${siteUrl}${calc.path}`,
              description: calc.description
            }))
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Popular Business Calculators',
            description: 'List of top business finance calculators available on the suite page.',
            url: `${siteUrl}/suite`,
            numberOfItems: calculators.length,
            itemListOrder: 'http://schema.org/ItemListOrderUnordered',
            itemListElement: calculators.slice(0, 20).map((calc, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              item: {
                '@type': 'Tool',
                name: calc.title + ' Calculator',
                url: `${siteUrl}${calc.path}`,
                description: calc.description
              }
            }))
          })}
        </script>
      </Head>

      <div className={styles.page}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Business & Finance Toolkit</h1>
          <p className={styles.subtitle}>
            {calculators.length} essential calculators for entrepreneurs, finance teams, and investors.
          </p>

          {/* Search Input */}
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search calculators... (e.g., mortgage, ROI)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
              aria-label="Search calculators"
            />
            <p className={styles.hint}>Press <kbd>/</kbd> to focus search</p>
          </div>
        </section>

        {/* Calculator Grid */}
        <section className={styles.gridSection}>
          <div className={styles.container}>
            {searchTerm && filteredCalculators.length === 0 ? (
              <div className={styles.noResults}>
                <p>
                  ❌ No calculator found for <strong>"{searchTerm}"</strong>. Try another term.
                </p>
              </div>
            ) : (
              <div className={styles.cardsGrid}>
                {filteredCalculators.map((calc) => (
                  <Link href={calc.path} key={calc.id} className={styles.cardLink}>
                    <div className={styles.card}>
                      <div className={styles.icon}>{calc.icon}</div>
                      <div className={styles.content}>
                        <h3 className={styles.cardTitle}>{calc.title}</h3>
                        <p className={styles.cardDesc}>{calc.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default BusinessCalculatorSuite;