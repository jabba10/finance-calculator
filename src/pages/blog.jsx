// components/BlogPost.jsx
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import styles from './BlogPost.module.css';

const BlogPost = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const calculatorsContent = [
    { 
      id: 1, 
      title: 'Simple', 
      path: '/simple-calculator', 
      description: 'A basic arithmetic calculator for addition, subtraction, multiplication, and division. Perfect for quick everyday calculations without complexity or distractions.',
      formula: 'Result = a ± × ÷ b'
    },
    { 
      id: 2, 
      title: 'Tax', 
      path: '/tax-calculator', 
      description: 'Calculate income tax or sales tax based on your location, earnings, and filing status. Understand your take-home pay and tax obligations with ease.',
      formula: 'Tax = Income × Tax Rate'
    },
    { 
      id: 3, 
      title: 'Loan', 
      path: '/loan-calculator', 
      description: 'Determine monthly loan payments, total interest paid, and view a full amortization schedule. Ideal for personal loans, auto loans, or financing decisions.',
      formula: 'PMT = P × (r(1+r)^n) / ((1+r)^n - 1)'
    },
    { 
      id: 4, 
      title: 'Break-even', 
      path: '/break-even-calculator', 
      description: 'Find the exact sales volume needed to cover all fixed and variable costs. Essential for startups, small businesses, and financial planning.',
      formula: 'Break-even = Fixed Costs / (Price - Variable Cost)'
    },
    { 
      id: 5, 
      title: 'Cashflow', 
      path: '/cashflow-calculator', 
      description: 'Track and project business or personal cash inflows and outflows to ensure liquidity and avoid shortfalls in critical periods.',
      formula: 'Net Cash Flow = Cash In - Cash Out'
    },
    { 
      id: 6, 
      title: 'CAC', 
      path: '/cac-calculator', 
      description: 'Calculate Customer Acquisition Cost to measure how much you spend to gain a new customer. Helps evaluate marketing efficiency and ROI.',
      formula: 'CAC = Total Marketing Costs / New Customers Acquired'
    },
    { 
      id: 7, 
      title: 'Markup', 
      path: '/markup-calculator', 
      description: 'Set profitable product prices by applying a markup percentage to cost. Useful for retailers, wholesalers, and e-commerce businesses.',
      formula: 'Price = Cost × (1 + Markup %)'
    },
    { 
      id: 8, 
      title: 'Profit Margin', 
      path: '/profit-margin-calculator', 
      description: 'Compute gross and net profit margins to understand profitability as a percentage of revenue. Key metric for business health analysis.',
      formula: 'Profit Margin % = (Profit / Revenue) × 100'
    },
    { 
      id: 9, 
      title: 'ROI', 
      path: '/roi-calculator', 
      description: 'Measure Return on Investment for marketing campaigns, real estate, stocks, or any capital expenditure to assess performance and efficiency.',
      formula: 'ROI % = ((Gain - Cost) / Cost) × 100'
    },
    { 
      id: 10, 
      title: 'NPV', 
      path: '/npv-calculator', 
      description: 'Calculate Net Present Value of future cash flows to determine if an investment will yield positive returns after adjusting for time value of money.',
      formula: 'NPV = Σ [CFₜ / (1 + r)ᵗ] - Initial Investment'
    },
    { 
      id: 11, 
      title: 'Payroll', 
      path: '/payroll-calculator', 
      description: 'Estimate total payroll costs including wages, overtime, taxes, and deductions for employees or contractors.',
      formula: 'Total Payroll = Gross Pay + Employer Taxes + Benefits'
    },
    { 
      id: 12, 
      title: 'Gross Profit', 
      path: '/gross-profit-calculator', 
      description: 'Calculate gross profit by subtracting cost of goods sold from total revenue. A fundamental metric for pricing and production decisions.',
      formula: 'Gross Profit = Revenue - COGS'
    },
    { 
      id: 13, 
      title: 'EBITDA', 
      path: '/ebitda-calculator', 
      description: 'Determine Earnings Before Interest, Taxes, Depreciation, and Amortization — a key indicator of operational profitability and business value.',
      formula: 'EBITDA = Net Income + Interest + Taxes + D + A'
    },
    { 
      id: 14, 
      title: 'Inventory', 
      path: '/inventory-turnover-calculator', 
      description: 'Analyze inventory turnover ratio to measure how often stock is sold and replaced over a period. Helps optimize supply chain and reduce holding costs.',
      formula: 'Turnover = COGS / Average Inventory'
    },
    { 
      id: 15, 
      title: 'Working Capital', 
      path: '/working-capital-calculator', 
      description: 'Assess short-term financial health by calculating the difference between current assets and current liabilities.',
      formula: 'Working Capital = Current Assets - Current Liabilities'
    },
    { 
      id: 16, 
      title: 'Debt/Equity', 
      path: '/debt-to-equity-calculator', 
      description: 'Evaluate financial leverage by comparing total debt to shareholders equity. A critical ratio for investors and lenders.',
      formula: 'D/E = Total Debt / Shareholders’ Equity'
    },
    { 
      id: 17, 
      title: 'Current Ratio', 
      path: '/current-ratio-calculator', 
      description: 'Measure a companies ability to pay short-term obligations using current assets. A healthy current ratio indicates strong liquidity.',
      formula: 'Current Ratio = Current Assets / Current Liabilities'
    },
    { 
      id: 18, 
      title: 'ROE', 
      path: '/roe-calculator', 
      description: 'Calculate Return on Equity to assess how effectively a company generates profits from shareholders investments.',
      formula: 'ROE % = Net Income / Shareholders’ Equity × 100'
    },
    { 
      id: 19, 
      title: 'Valuation', 
      path: '/business-valuation-calculator', 
      description: 'Estimate the fair market value of your business using revenue, profit, and industry multiples for sale, investment, or partnership purposes.',
      formula: 'Valuation = EBITDA × Industry Multiple'
    },
    { 
      id: 20, 
      title: 'EVA', 
      path: '/eva-calculator', 
      description: 'Compute Economic Value Added — the profit a company generates after covering the cost of capital. Measures true economic profit.',
      formula: 'EVA = NOPAT - (WACC × Capital Invested)'
    },
    { 
      id: 21, 
      title: 'WACC', 
      path: '/wacc-calculator', 
      description: 'Find Weighted Average Cost of Capital used in valuation, investment analysis, and corporate finance decisions.',
      formula: 'WACC = (E/V × Re) + (D/V × Rd × (1 - Tc))'
    },
    { 
      id: 22, 
      title: '401K', 
      path: '/401k-calculator', 
      description: 'Project retirement savings growth with employer match, contributions, and compound interest over time.',
      formula: 'FV = PMT × [((1 + r)^n - 1) / r]'
    },
    { 
      id: 23, 
      title: 'CD', 
      path: '/cd-calculator', 
      description: 'Calculate maturity amount and interest earned on a Certificate of Deposit with fixed rate and term length.',
      formula: 'A = P(1 + r/n)^(nt)'
    },
    { 
      id: 24, 
      title: 'Bonds', 
      path: '/government-bonds-calculator', 
      description: 'Estimate yield, return, and interest income from government bonds like Treasury securities or municipal bonds.',
      formula: 'Yield = (Annual Interest / Bond Price) × 100'
    },
    { 
      id: 25, 
      title: 'Leverage', 
      path: '/operating-leverage-calculator', 
      description: 'Analyze how fixed costs affect profitability when sales volume changes. Useful for cost structure optimization.',
      formula: 'DOL = %Δ EBIT / %Δ Sales'
    },
    { 
      id: 26, 
      title: 'Cash Flow', 
      path: '/free-cash-flow-calculator', 
      description: 'Calculate Free Cash Flow — the cash a business generates after expenses, which can be used for expansion, dividends, or debt reduction.',
      formula: 'FCF = Operating Cash Flow - CapEx'
    },
    { 
      id: 27, 
      title: 'Lease/Buy', 
      path: '/lease-vs-buy-calculator', 
      description: 'Compare the total cost of leasing versus buying a vehicle or equipment to make smarter financing decisions.',
      formula: 'Total Cost = Σ Payments + Residual Value (if buying)'
    },
    { 
      id: 28, 
      title: 'Pension', 
      path: '/pension-planning-calculator', 
      description: 'Estimate monthly pension income in retirement based on years of service, salary history, and plan type.',
      formula: 'Pension = Avg Salary × Years × Multiplier'
    },
    { 
      id: 29, 
      title: 'Tax Bracket', 
      path: '/tax-bracket-calculator', 
      description: 'Determine your federal and state tax brackets and marginal tax rate based on income and filing status.',
      formula: 'Bracket = Income Range with Fixed Marginal Rate'
    },
    { 
      id: 30, 
      title: 'Education', 
      path: '/education-cost-calculator', 
      description: 'Plan for future education expenses including tuition, books, and living costs for college or training programs.',
      formula: 'Total Cost = Tuition + Fees + Living Expenses'
    },
    { 
      id: 31, 
      title: 'Crypto', 
      path: '/crypto-investment-calculator', 
      description: 'Track cryptocurrency investment performance, calculate gains/losses, and estimate tax liabilities.',
      formula: 'Profit = (Sell Price - Buy Price) × Quantity'
    },
    { 
      id: 32, 
      title: 'Debt', 
      path: '/credit-card-payoff-calculator', 
      description: 'Create a payoff plan for credit card debt using snowball or avalanche methods to become debt-free faster.',
      formula: 'Months = -log(1 - r×B/P) / log(1 + r)'
    },
    { 
      id: 33, 
      title: 'Purchasing Power', 
      path: '/purchasing-power-parity-calculator', 
      description: 'See how inflation or currency exchange rates affect the real value of money across time or countries.',
      formula: 'PPP = Price in Country A / Price in Country B'
    },
    { 
      id: 34, 
      title: 'Development', 
      path: '/development-feasibility-calculator', 
      description: 'Analyze real estate development feasibility by projecting costs, revenue, and profitability before breaking ground.',
      formula: 'Profit = Gross Revenue - Total Costs'
    },
    { 
      id: 35, 
      title: 'Occupancy', 
      path: '/occupancy-cost-calculator', 
      description: 'Compare occupancy costs for office, retail, or industrial space including rent, utilities, taxes, and maintenance.',
      formula: 'OCC % = Annual Occupancy Cost / Gross Revenue'
    },
    { 
      id: 36, 
      title: 'Litigation', 
      path: '/litigation-cost-calculator', 
      description: 'Estimate potential legal fees, court costs, and settlement expenses for civil disputes or lawsuits.',
      formula: 'Total Cost = Attorney Fees + Court Fees + Settlement'
    },
    { 
      id: 37, 
      title: 'Monte Carlo', 
      path: '/monte-carlo-simulation-calculator', 
      description: 'Use probabilistic modeling to simulate financial outcomes and assess risk in investments or business decisions.',
      formula: 'Outcome = f(Random Variables)'
    },
    { 
      id: 38, 
      title: 'Game Theory', 
      path: '/game-theory-payoff-calculator', 
      description: 'Model strategic interactions between competitors or players to predict optimal decisions and outcomes.',
      formula: 'Payoff = Utility(Player, Strategy Profile)'
    },
    { 
      id: 39, 
      title: 'Financial Literacy', 
      path: '/financial-literacy-score-calculator', 
      description: 'Test your knowledge of personal finance, investing, budgeting, and credit with a scoring tool to improve financial IQ.',
      formula: 'Score = (Correct Answers / Total) × 100'
    },
    { 
      id: 40, 
      title: 'Staking', 
      path: '/staking-rewards-calculator', 
      description: 'Calculate potential rewards from staking cryptocurrencies like Ethereum, Cardano, or Solana over time.',
      formula: 'Rewards = Principal × APR × Time'
    },
    { 
      id: 41, 
      title: 'Time Value of Money', 
      path: '/time-value-of-money-calculator', 
      description: 'Understand how money grows or loses value over time due to interest rates and inflation — essential for smart investing.',
      formula: 'FV = PV × (1 + r)^n'
    },
    { 
      id: 42, 
      title: 'Discounted Cash Flow', 
      path: '/discounted-cash-flow-calculator', 
      description: 'Value a business or investment by discounting projected future cash flows to their present value.',
      formula: 'DCF = Σ [CFₜ / (1 + r)ᵗ]'
    },
    { 
      id: 43, 
      title: 'Duration Convexity', 
      path: '/duration-convexity-calculator', 
      description: 'Measure bond price sensitivity to interest rate changes using duration and convexity metrics.',
      formula: 'ΔP/P ≈ -Duration × Δy + ½ × Convexity × (Δy)²'
    },
    { 
      id: 44, 
      title: 'Option Pricing', 
      path: '/option-pricing-calculator', 
      description: 'Price call and put options using models like Black-Scholes to evaluate derivatives and trading strategies.',
      formula: 'C = S₀N(d₁) - Xe^(-rT)N(d₂)'
    },
    { 
      id: 45, 
      title: 'HE-LOC', 
      path: '/he-loc-calculator', 
      description: 'Calculate payments, interest, and credit limits for a Home Equity Line of Credit (HELOC) based on home value and loan-to-value ratio.',
      formula: 'Credit Limit = Home Value × LTV - Mortgage Balance'
    },
    { 
      id: 46, 
      title: 'Accounts Receivable Turnover', 
      path: '/accounts-receivable-turnover-calculator', 
      description: 'Measure how quickly a company collects payments from customers, indicating efficiency in credit and collections.',
      formula: 'Turnover = Net Credit Sales / Avg Accounts Receivable'
    },
    { 
      id: 47, 
      title: 'Legal Retainer', 
      path: '/legal-retainer-calculator', 
      description: 'Track remaining balance and usage of a legal retainer fee over time as hours are billed.',
      formula: 'Remaining = Initial Retainer - (Rate × Hours Billed)'
    },
    { 
      id: 48, 
      title: 'Flipping Profit', 
      path: '/flipping-profit-calculator', 
      description: 'Estimate profit from flipping houses, cars, sneakers, or collectibles after accounting for purchase, repair, and selling costs.',
      formula: 'Profit = Sale Price - (Purchase + Repair + Fees)'
    },
    { 
      id: 49, 
      title: 'Mortgage Refinance', 
      path: '/mortgage-refinance-break-even-calculator', 
      description: 'Determine how long it takes to recover closing costs after refinancing a mortgage — the break-even point.',
      formula: 'Break-even Months = Closing Costs / Monthly Savings'
    },
    { 
      id: 50, 
      title: 'Worker Classification', 
      path: '/worker-classification-calculator', 
      description: 'Help determine whether a worker should be classified as an employee or independent contractor for tax and legal compliance.',
      formula: 'Classification = Behavioral + Financial + Relationship Control'
    },
    { 
      id: 51, 
      title: 'Property Taxes', 
      path: '/property-tax-calculator', 
      description: 'Calculate annual or monthly property tax based on assessed home value and local tax rates.',
      formula: 'Tax = Assessed Value × Tax Rate'
    },
    { 
      id: 52, 
      title: 'Car Loan', 
      path: '/car-loan-calculator', 
      description: 'Estimate monthly payments, total interest, and total cost of financing a new or used car.',
      formula: 'PMT = P × (r(1+r)^n) / ((1+r)^n - 1)'
    },
    { 
      id: 53, 
      title: 'Social Security', 
      path: '/social-security-calculator', 
      description: 'Forecast your Social Security retirement benefits based on earnings history and retirement age.',
      formula: 'Benefit = Average Indexed Earnings × PIA Formula'
    },
    { 
      id: 54, 
      title: 'PPF', 
      path: '/ppf-calculator', 
      description: 'Plan savings and project maturity amount in India Public Provident Fund (PPF), a tax-free long-term investment scheme.',
      formula: 'A = P × [(1 + r)^n - 1] / r'
    },
    { 
      id: 55, 
      title: 'Mortgage Calculator', 
      path: '/mortgage-calculator', 
      description: 'Calculate monthly payments, total interest, and total cost of financing a home loan.',
      formula: 'PMT = P × (r(1+r)^n) / ((1+r)^n - 1)'
    },
    { 
      id: 56, 
      title: 'Compound Interest Calculator', 
      path: '/compound-interest-calculator', 
      description: 'Calculate compound interest over time based on principal, interest rate, and time period.',
      formula: 'A = P(1 + r/n)^(nt)'
    },
    {
      id: 57,
      title: 'Debt Snowball Calculator',
      path: '/debt-snowball-calculator',
      description: 'Calculate how long it will take to pay off your debts using a snowball method.',
      formula: 'Months = Σ (Debtᵢ / Monthly Paymentᵢ)'
    }
  ];

  const filteredCalculators = useMemo(() => {
    return calculatorsContent.filter(calculator =>
      calculator.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      calculator.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // SEO Metadata
  const siteUrl = 'https://www.financecalculatorfree.com';
  const pageTitle = '54 Free Financial Calculators | ROI, Break-even, Loan, Tax, Mortgage Tools';
  const pageDescription =
    'Access 54 free financial calculators for ROI, break-even, loans, tax, mortgage, NPV, CAC, and more. No signup. Private. Accurate formulas.';
  const imagePreview = `${siteUrl}/images/financial-calculators-suite.jpg`;

  return (
    <div className={styles.pageWrapper}>
      {/* Structured Data (Schema.org) */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: pageTitle,
          description: pageDescription,
          url: `${siteUrl}/calculators`,
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: siteUrl,
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Financial Calculators',
                item: `${siteUrl}/calculators`,
              },
            ],
          },
        })}
      </script>

      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Financial Calculators Suite',
          description:
            'A complete collection of 54 financial calculators for personal finance, business, investing, and retirement planning.',
          url: `${siteUrl}/calculators`,
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: calculatorsContent.length,
            itemListElement: calculatorsContent.slice(0, 10).map((calc, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              item: {
                '@type': 'Tool',
                name: `${calc.title} Calculator`,
                url: `${siteUrl}${calc.path}`,
                description: calc.description,
              },
            })),
          },
        })}
      </script>

      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Top Financial Calculators',
          description: 'List of the most useful financial calculators for entrepreneurs, investors, and finance professionals.',
          url: `${siteUrl}/calculators`,
          numberOfItems: calculatorsContent.length,
          itemListOrder: 'http://schema.org/ItemListOrderUnordered',
          itemListElement: calculatorsContent.slice(0, 20).map((calc, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'Tool',
              name: calc.title + ' Calculator',
              url: `${siteUrl}${calc.path}`,
              description: calc.description,
            },
          })),
        })}
      </script>

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1>Financial Calculators Suite</h1>
          <p className={styles.subtitle}>
            Comprehensive collection of financial calculators for all your needs
          </p>
        </section>

        <section className={styles.gridSection}>
          <div className={styles.container}>
            <h2>All Calculators</h2>
            <p className={styles.sectionSubtitle}>
              {filteredCalculators.length} tools available — select any to get started
            </p>

            <input
              type="text"
              placeholder="Search calculators..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
              aria-label="Search calculators"
            />

            <div className={`${styles.cardsGrid} ${filteredCalculators.length === 1 ? styles.singleCard : ''}`}>
              {filteredCalculators.map((calc) => (
                <Link href={calc.path} key={calc.id} className={styles.cardLink}>
                  <div className={styles.card}>
                    <h3>{calc.title}</h3>
                    <p className={styles.description}>{calc.description}</p>
                    <p className={styles.formula}>{calc.formula}</p>
                    <span className={styles.linkText}>Use {calc.title} Calculator →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <h2>Need a Custom Calculator?</h2>
            <p>We can create specialized calculators tailored to your unique requirements.</p>
            <Link href="/contactus" className={styles.ctaButton}>
              <span className={styles.buttonText}>Request a Calculator</span>
              <span className={styles.arrow}>→</span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default BlogPost;