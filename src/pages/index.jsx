// app/page.js or components/Homepage.jsx
import React, { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './homepage.module.css';

const Homepage = () => {
  const [visibleCalculators, setVisibleCalculators] = useState(6);

  // === Full List of 54 Calculators (paths matched exactly from BlogPost.jsx) ===
  const calculators = [
    { id: 1, title: 'Simple', icon: '🧮', description: 'A basic arithmetic calculator for addition, subtraction, multiplication, and division.', path: '/simple-calculator' },
    { id: 2, title: 'Tax', icon: '🧾', description: 'Calculate income tax or sales tax based on your location, earnings, and filing status.', path: '/tax-calculator' },
    { id: 3, title: 'Loan', icon: '🏦', description: 'Determine monthly loan payments, total interest paid, and view a full amortization schedule.', path: '/loan-calculator' },
    { id: 4, title: 'Break-even', icon: '⚖️', description: 'Find the exact sales volume needed to cover all fixed and variable costs.', path: '/break-even-calculator' },
    { id: 5, title: 'Cashflow', icon: '💸', description: 'Track and project business or personal cash inflows and outflows.', path: '/cashflow-calculator' },
    { id: 6, title: 'CAC', icon: '🎯', description: 'Calculate Customer Acquisition Cost to measure how much you spend to gain a new customer.', path: '/cac-calculator' },
    { id: 7, title: 'Markup', icon: '🏷️', description: 'Set profitable product prices by applying a markup percentage to cost.', path: '/markup-calculator' },
    { id: 8, title: 'Profit Margin', icon: '📉', description: 'Compute gross and net profit margins to understand profitability.', path: '/profit-margin-calculator' },
    { id: 9, title: 'ROI', icon: '📈', description: 'Measure Return on Investment for marketing campaigns, real estate, stocks, or any capital expenditure.', path: '/roi-calculator' },
    { id: 10, title: 'NPV', icon: '📊', description: 'Calculate Net Present Value of future cash flows to determine investment returns.', path: '/npv-calculator' },
    { id: 11, title: 'Payroll', icon: '📋', description: 'Estimate total payroll costs including wages, overtime, taxes, and deductions.', path: '/payroll-calculator' },
    { id: 12, title: 'Gross Profit', icon: '💰', description: 'Calculate gross profit by subtracting cost of goods sold from total revenue.', path: '/gross-profit-calculator' },
    { id: 13, title: 'EBITDA', icon: '💼', description: 'Determine Earnings Before Interest, Taxes, Depreciation, and Amortization.', path: '/ebitda-calculator' },
    { id: 14, title: 'Inventory', icon: '📦', description: 'Analyze inventory turnover ratio to measure how often stock is sold and replaced.', path: '/inventory-turnover-calculator' },
    { id: 15, title: 'Working Capital', icon: '💳', description: 'Assess short-term financial health by calculating current assets minus liabilities.', path: '/working-capital-calculator' },
    { id: 16, title: 'Debt/Equity', icon: '📉', description: 'Evaluate financial leverage by comparing total debt to shareholders equity.', path: '/debt-to-equity-calculator' },
    { id: 17, title: 'Current Ratio', icon: '🔍', description: 'Measure ability to pay short-term obligations using current assets.', path: '/current-ratio-calculator' },
    { id: 18, title: 'ROE', icon: '🏦', description: 'Calculate Return on Equity to assess profit generation from shareholder investments.', path: '/roe-calculator' },
    { id: 19, title: 'Valuation', icon: '🏢', description: 'Estimate the fair market value of your business using revenue and multiples.', path: '/business-valuation-calculator' },
    { id: 20, title: 'EVA', icon: '💡', description: 'Compute Economic Value Added — the profit after covering cost of capital.', path: '/eva-calculator' },
    { id: 21, title: 'WACC', icon: '📉', description: 'Find Weighted Average Cost of Capital for valuation and finance decisions.', path: '/wacc-calculator' },
    { id: 22, title: '401K', icon: '🏦', description: 'Project retirement savings growth with employer match and compound interest.', path: '/retirement-calculator' },
    { id: 23, title: 'CD', icon: '🔒', description: 'Calculate maturity amount and interest earned on a Certificate of Deposit.', path: '/cd-calculator' },
    { id: 24, title: 'Bonds', icon: '📜', description: 'Estimate yield and return from government bonds like Treasury securities.', path: '/government-bonds-calculator' },
    { id: 25, title: 'Leverage', icon: '⚙️', description: 'Analyze how fixed costs affect profitability when sales volume changes.', path: '/operating-leverage-calculator' },
    { id: 26, title: 'Cash Flow', icon: '🔄', description: 'Calculate Free Cash Flow available for expansion, dividends, or debt reduction.', path: '/free-cash-flow-calculator' },
    { id: 27, title: 'Lease/Buy', icon: '🚗', description: 'Compare leasing vs buying a vehicle or equipment to make smarter decisions.', path: '/lease-vs-buy-calculator' },
    { id: 28, title: 'Pension', icon: '👵', description: 'Estimate monthly pension income in retirement based on service and salary.', path: '/pension-planning-calculator' },
    { id: 29, title: 'Tax Bracket', icon: '🔖', description: 'Determine your federal and state tax brackets and marginal tax rate.', path: '/tax-bracket-calculator' },
    { id: 30, title: 'Education', icon: '🎓', description: 'Plan for future education expenses including tuition and living costs.', path: '/education-cost-calculator' },
    { id: 31, title: 'Crypto', icon: '₿', description: 'Track crypto investment performance and estimate gains, losses, and taxes.', path: '/crypto-investment-calculator' },
    { id: 32, title: 'Debt', icon: '💳', description: 'Create a payoff plan for credit card debt using snowball or avalanche methods.', path: '/credit-card-payoff-calculator' },
    { id: 33, title: 'Purchasing Power', icon: '🌍', description: 'See how inflation or exchange rates affect the real value of money.', path: '/purchasing-power-parity-calculator' },
    { id: 34, title: 'Development', icon: '🏗️', description: 'Analyze real estate development feasibility before breaking ground.', path: '/development-feasibility-calculator' },
    { id: 35, title: 'Occupancy', icon: '🏢', description: 'Compare occupancy costs for office, retail, or industrial space.', path: '/occupancy-cost-calculator' },
    { id: 36, title: 'Litigation', icon: '⚖️', description: 'Estimate legal fees, court costs, and settlement expenses.', path: '/litigation-cost-calculator' },
    { id: 37, title: 'Monte Carlo', icon: '🎲', description: 'Use probabilistic modeling to simulate financial outcomes and risk.', path: '/monte-carlo-simulation-calculator' },
    { id: 38, title: 'Game Theory', icon: '♟️', description: 'Model strategic interactions between competitors or players.', path: '/game-theory-payoff-calculator' },
    { id: 39, title: 'Financial Literacy', icon: '📚', description: 'Test your knowledge of personal finance and improve financial IQ.', path: '/financial-literacy-score-calculator' },
    { id: 40, title: 'Staking', icon: '🔗', description: 'Calculate potential rewards from staking cryptocurrencies over time.', path: '/staking-rewards-calculator' },
    { id: 41, title: 'Time Value of Money', icon: '⏳', description: 'Understand how money grows or loses value over time due to interest.', path: '/time-value-of-money-calculator' },
    { id: 42, title: 'Discounted Cash Flow', icon: '📉', description: 'Value a business or investment by discounting future cash flows.', path: '/discounted-cash-flow-calculator' },
    { id: 43, title: 'Duration Convexity', icon: '📉', description: 'Measure bond price sensitivity to interest rate changes.', path: '/duration-convexity-calculator' },
    { id: 44, title: 'Option Pricing', icon: '💱', description: 'Price call and put options using models like Black-Scholes.', path: '/option-pricing-calculator' },
    { id: 45, title: 'HE-LOC', icon: '🏠', description: 'Calculate payments and limits for a Home Equity Line of Credit.', path: '/he-loc-calculator' },
    { id: 46, title: 'Accounts Receivable Turnover', icon: '📬', description: 'Measure how quickly a company collects payments from customers.', path: '/accounts-receivable-turnover-calculator' },
    { id: 47, title: 'Legal Retainer', icon: '⚖️', description: 'Track remaining balance and usage of a legal retainer fee.', path: '/legal-retainer-calculator' },
    { id: 48, title: 'Flipping Profit', icon: '🔄', description: 'Estimate profit from flipping houses, cars, or collectibles.', path: '/flipping-profit-calculator' },
    { id: 49, title: 'Mortgage Refinance', icon: '🏡', description: 'Determine break-even point after refinancing a mortgage.', path: '/mortgage-refinance-break-even-calculator' },
    { id: 50, title: 'Worker Classification', icon: '👷', description: 'Determine if a worker is an employee or independent contractor.', path: '/worker-classification-calculator' },
    { id: 51, title: 'Property Taxes', icon: '🏠', description: 'Calculate annual or monthly property tax based on home value.', path: '/property-tax-calculator' },
    { id: 52, title: 'Car Loan', icon: '🚗', description: 'Estimate monthly payments and total cost of financing a car.', path: '/car-loan-calculator' },
    { id: 53, title: 'Social Security', icon: '👵', description: 'Forecast Social Security retirement benefits based on earnings history.', path: '/social-security-calculator' },
    { id: 54, title: 'PPF', icon: '🇮🇳', description: 'Plan savings and project maturity in India Public Provident Fund.', path: '/ppf-calculator' }
  ];

  const loadMoreCalculators = () => {
    setVisibleCalculators(prev => Math.min(prev + 6, calculators.length));
  };

  // SEO Metadata
  const siteUrl = 'https://www.financecalculatorfree.com';
  const pageTitle = '57 Free Financial Calculators | ROI, Break-even, Loan, Tax Tools';
  const pageDescription = 'Access 57 free financial calculators with accurate formulas. No signup. 100% private.';
  const imagePreview = `${siteUrl}/images/financial-calculators-preview.jpg`;

  return (
    <>
      <Head>
        {/* Basic Meta */}
        <html lang="en" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="financial calculator, ROI, loan, tax, mortgage, NPV, free tools" />
        <meta name="author" content="Calci" />
        <meta name="robots" content="index, follow" />

        {/* Canonical */}
        <link rel="canonical" href={siteUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={imagePreview} />
        <meta property="og:image:alt" content="Collection of 54 financial calculators" />
        <meta property="og:site_name" content="Calci" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@calci" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={imagePreview} />
        <meta name="twitter:image:alt" content="Free financial calculators for personal and business use" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: pageTitle,
            description: pageDescription,
            url: siteUrl,
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl }
              ]
            }
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Free Financial Calculators',
            description: 'A comprehensive collection of 54 financial calculators with real formulas.',
            hasPart: calculators.slice(0, 10).map(calc => ({
              '@type': 'WebPage',
              name: calc.title + ' Calculator',
              url: `${siteUrl}${calc.path}`,
              description: calc.description
            }))
          })}
        </script>
      </Head>

      <div className={styles.homepage}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>
            Master Your Finances With <span className={styles.highlight}>Smart Calculators</span>
          </h1>
          <p className={styles.heroSubtitle}>
            57 precision tools powered by real financial formulas — no sign-up, just results.
          </p>
          <Link href="/suite" className={styles.simpleCta}>
            Explore All Calculators →
          </Link>
        </section>

        {/* Value Props */}
        <section className={styles.valueProps}>
          <div className={styles.container}>
            <div className={styles.valueProp}>
              <div className={styles.icon}>📊</div>
              <h3>Formula Accuracy</h3>
              <p>Industry-standard math — no guesswork.</p>
            </div>
            <div className={styles.valueProp}>
              <div className={styles.icon}>🔐</div>
              <h3>Private & Secure</h3>
              <p>Your inputs stay on your device.</p>
            </div>
            <div className={styles.valueProp}>
              <div className={styles.icon}>📘</div>
              <h3>Learn the Math</h3>
              <p>We show the logic behind every result.</p>
            </div>
          </div>
        </section>

        {/* Calculators Grid */}
        <section className={styles.calculatorsSection}>
          <div className={styles.container}>
            <h2>Financial Tools</h2>
            <p className={styles.sectionSubtitle}>Interactive calculators to help you make smarter decisions</p>

            <div className={styles.cardsGrid}>
              {calculators.slice(0, visibleCalculators).map((calc) => (
                <Link href={calc.path} key={calc.id} className={styles.cardLink}>
                  <div className={styles.card}>
                    <div className={styles.cardIcon}>{calc.icon}</div>
                    <h3 className={styles.cardTitle}>{calc.title}</h3>
                    <p className={styles.cardDesc}>{calc.description}</p>
                    <span className={styles.cardAction}>Use {calc.title} →</span>
                  </div>
                </Link>
              ))}
            </div>

            {visibleCalculators < calculators.length && (
              <button className={styles.loadMoreBtn} onClick={loadMoreCalculators}>
                Show More Calculators
              </button>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default Homepage;