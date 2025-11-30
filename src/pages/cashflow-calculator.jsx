import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './cashflowcal.module.css';

const CashFlowCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [revenue, setRevenue] = useState('');
  const [cogs, setCogs] = useState('');
  const [operatingExpenses, setOperatingExpenses] = useState('');
  const [depreciation, setDepreciation] = useState('10000');
  const [interest, setInterest] = useState('5000');
  const [taxRate, setTaxRate] = useState('25');
  const [result, setResult] = useState(null);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert inputs to numbers and validate
    const rev = parseFloat(revenue);
    const c = parseFloat(cogs);
    const opex = parseFloat(operatingExpenses);
    const dep = parseFloat(depreciation) || 0;
    const int = parseFloat(interest) || 0;
    const tax = parseFloat(taxRate) / 100;

    // Validate inputs
    if (isNaN(rev) || isNaN(c) || isNaN(opex) || isNaN(tax)) {
      alert("Please enter valid numbers in all required fields");
      return;
    }

    if (rev < 0 || c < 0 || opex < 0 || dep < 0 || int < 0 || tax < 0) {
      alert("Values cannot be negative");
      return;
    }

    if (tax > 0.5) {
      alert("Tax rate cannot exceed 50%");
      return;
    }

    // Calculations
    const grossProfit = rev - c;
    const ebit = grossProfit - opex - dep;
    const ebt = ebit - int;
    const taxes = ebt * tax;
    const netIncome = ebt - taxes;
    const operatingCashFlow = netIncome + dep;

    setResult({
      revenue: rev.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      cogs: c.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      operatingExpenses: opex.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      depreciation: dep.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      grossProfit: grossProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      ebit: ebit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      netIncome: netIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      operatingCashFlow: operatingCashFlow.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      taxRate: (tax * 100).toFixed(2)
    });
  };

  // Magnetic effect on CTA button
  const handleMouseMove = (e) => {
    if (!ctaButtonRef.current) return;
    const el = ctaButtonRef.current;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--x', `${x}px`);
    el.style.setProperty('--y', `${y}px`);
  };

  // SEO Metadata - Enhanced with comprehensive cash flow keywords
  const siteUrl = 'https://www.financecalculatorfree.com';
  const pageTitle = 'Free Cash Flow Calculator 2024 | Operating Cash Flow Analysis Tool';
  const pageDescription = 'Calculate operating cash flow, free cash flow, and assess business liquidity with our free cash flow calculator. Perfect for financial analysis and business planning.';

  // Comprehensive SEO Keywords Collections for Cash Flow Calculator
  const singleKeywords = [
    'cash', 'flow', 'calculator', 'operating', 'free', 'business', 'finance', 
    'liquidity', 'revenue', 'expenses', 'income', 'profit', 'loss', 'margin', 
    'ebitda', 'ebit', 'cogs', 'depreciation', 'amortization', 'tax', 'interest', 
    'working', 'capital', 'investment', 'valuation', 'analysis', 'statement', 
    'forecast', 'budget', 'planning', 'management', 'health', 'performance', 
    'metrics', 'ratios', 'efficiency', 'sustainability', 'solvency', 'leverage',
    'burn', 'rate', 'runway', 'conversion', 'cycle', 'receivables', 'payables',
    'inventory', 'accrual', 'accounting', 'financial', 'modeling', 'projection',
    'scenario', 'sensitivity', 'break-even', 'profitability', 'viability'
  ];

  const twoWordKeywords = [
    'cash flow', 'cash flow calculator', 'operating cash flow', 'free cash flow', 
    'cash flow analysis', 'cash flow statement', 'cash flow forecast', 
    'cash flow management', 'cash flow projection', 'cash flow modeling', 
    'business cash flow', 'small business cash flow', 'startup cash flow', 
    'monthly cash flow', 'annual cash flow', 'cash flow margin', 
    'cash flow ratio', 'cash flow coverage', 'cash flow liquidity', 
    'cash flow health', 'cash flow performance', 'cash flow metrics', 
    'cash flow planning', 'cash flow budget', 'cash flow optimization', 
    'negative cash flow', 'positive cash flow', 'net cash flow', 
    'gross cash flow', 'discounted cash flow', 'DCF analysis', 
    'cash flow valuation', 'cash flow from operations', 'CFO calculator', 
    'cash flow to debt', 'cash flow per share', 'cash flow yield', 
    'operating margin', 'gross margin', 'net margin', 'profit margin', 
    'revenue growth', 'expense management', 'working capital', 
    'current ratio', 'quick ratio', 'debt service', 'coverage ratio',
    'burn rate', 'cash runway', 'cash conversion', 'days sales outstanding',
    'days payable outstanding', 'inventory turnover', 'financial health'
  ];

  const longTailKeywords = [
    'free online cash flow calculator for small business',
    'operating cash flow calculator with depreciation',
    'how to calculate cash flow from operations',
    'cash flow calculator for startup business plan',
    'free cash flow calculator for valuation',
    'monthly cash flow calculator for budgeting',
    'cash flow analysis calculator for investors',
    'small business cash flow forecasting tool',
    'cash flow calculator for seasonal businesses',
    'how to calculate free cash flow from financial statements',
    'cash flow calculator for ecommerce business',
    'restaurant cash flow calculator with inventory',
    'manufacturing cash flow calculator with cogs',
    'service business cash flow calculator',
    'freelance cash flow calculator for self-employed',
    'real estate cash flow calculator rental properties',
    'saas cash flow calculator for subscription business',
    'cash flow calculator for nonprofit organizations',
    'construction business cash flow calculator',
    'retail store cash flow calculator inventory management',
    'cash flow calculator for business loan application',
    'how to calculate cash flow for startup funding',
    'cash flow calculator with working capital changes',
    'discounted cash flow calculator for business valuation',
    'cash flow calculator for acquisition analysis',
    'cash flow calculator for financial modeling',
    'cash flow calculator for business plan financials',
    'cash flow calculator for investors due diligence',
    'cash flow calculator for company valuation',
    'cash flow calculator for merger and acquisition',
    'cash flow calculator for investment analysis',
    'cash flow calculator for capital budgeting',
    'cash flow calculator for project evaluation',
    'cash flow calculator for equipment purchase',
    'cash flow calculator for expansion planning',
    'cash flow calculator for new product launch',
    'cash flow calculator for market entry strategy',
    'cash flow calculator for international expansion',
    'cash flow calculator for franchise business',
    'cash flow calculator for online business',
    'cash flow calculator for dropshipping business',
    'cash flow calculator for amazon FBA sellers',
    'cash flow calculator for Shopify store owners',
    'cash flow calculator for digital marketing agency',
    'cash flow calculator for consulting business',
    'cash flow calculator for law firm',
    'cash flow calculator for medical practice',
    'cash flow calculator for dental office',
    'cash flow calculator for veterinary clinic',
    'cash flow calculator for accounting firm',
    'cash flow calculator for insurance agency',
    'cash flow calculator for financial advisor',
    'cash flow calculator for real estate agent',
    'cash flow calculator for construction company',
    'cash flow calculator for manufacturing plant',
    'cash flow calculator for wholesale distribution',
    'cash flow calculator for import export business',
    'cash flow calculator for transportation company',
    'cash flow calculator for trucking business',
    'cash flow calculator for logistics company',
    'cash flow calculator for tech startup',
    'cash flow calculator for mobile app development',
    'cash flow calculator for software company',
    'cash flow calculator for biotech startup',
    'cash flow calculator for renewable energy project'
  ];

  const allKeywords = [...singleKeywords, ...twoWordKeywords, ...longTailKeywords].join(', ');

  return (
    <>
      <Head>
        {/* Basic Meta */}
        <html lang="en" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={allKeywords} />
        <meta name="author" content="Calci Financial Tools" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        
        {/* Additional Meta Tags */}
        <meta name="subject" content="Cash Flow Calculator & Financial Analysis" />
        <meta name="classification" content="Finance, Business, Calculators, Cash Flow Analysis" />
        <meta name="topic" content="Cash Flow Calculation and Business Financial Health" />
        <meta name="summary" content="Free online cash flow calculator for business financial analysis" />
        <meta name="url" content={`${siteUrl}/cashflow-calculator`} />
        
        {/* Verification & Ownership */}
        <meta name="google-site-verification" content="your_verification_code" />
        <meta name="msvalidate.01" content="your_bing_verification" />
        
        {/* Location & Business */}
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="United States" />
        <meta name="geo.position" content="39.8283;-98.5795" />
        <meta name="ICBM" content="39.8283, -98.5795" />
        
        {/* Canonical */}
        <link rel="canonical" href={`${siteUrl}/cashflow-calculator`} />
        
        {/* Alternate Languages */}
        <link rel="alternate" href={`${siteUrl}/cashflow-calculator`} hrefLang="x-default" />
        <link rel="alternate" href={`${siteUrl}/cashflow-calculator`} hrefLang="en" />
        <link rel="alternate" href={`${siteUrl}/es/cashflow-calculator`} hrefLang="es" />
        
        {/* Preload & Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/cashflow-calculator`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={`${siteUrl}/images/cashflow-calculator-preview.jpg`} />
        <meta property="og:image:alt" content="Cash Flow Calculator Interface for Financial Analysis" />
        <meta property="og:site_name" content="Calci Financial Calculators" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:see_also" content={siteUrl} />
        
        {/* Facebook */}
        <meta property="fb:app_id" content="your_facebook_app_id" />
        <meta property="fb:pages" content="your_facebook_page_id" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@calcifinance" />
        <meta name="twitter:creator" content="@calcifinance" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={`${siteUrl}/images/cashflow-calculator-preview.jpg`} />
        <meta name="twitter:image:alt" content="Free Cash Flow Calculator for Business Analysis" />
        
        {/* Additional Social */}
        <meta name="pinterest" content="nopin" description="Free cash flow calculator for financial analysis" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: pageTitle,
            description: pageDescription,
            url: `${siteUrl}/cashflow-calculator`,
            mainEntity: {
              '@type': 'SoftwareApplication',
              name: 'Cash Flow Calculator',
              applicationCategory: 'FinanceApplication',
              operatingSystem: 'Any',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD'
              },
              description: 'Free online cash flow calculator for operating cash flow analysis, free cash flow calculation, and business financial health assessment.',
              featureList: [
                'Operating cash flow calculation',
                'Free cash flow estimation',
                'Financial ratio analysis',
                'Multiple business type support',
                'Privacy-focused local calculations'
              ],
              processorRequirements: 'Web browser',
              permission: 'No special permissions required'
            },
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
                { '@type': 'ListItem', position: 2, name: 'Cash Flow Calculator', item: `${siteUrl}/cashflow-calculator` }
              ]
            },
            publisher: {
              '@type': 'Organization',
              name: 'Calci Financial Tools',
              url: siteUrl,
              logo: `${siteUrl}/images/logo.png`,
              sameAs: [
                'https://twitter.com/calcifinance',
                'https://www.linkedin.com/company/calci-finance',
                'https://www.facebook.com/calcifinance'
              ]
            }
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowToTool',
            name: 'Cash Flow Calculator',
            description: 'A tool for calculating operating cash flow and analyzing business financial health',
            url: `${siteUrl}/cashflow-calculator`,
            step: [
              {
                '@type': 'HowToStep',
                name: 'Enter Revenue and COGS',
                text: 'Input your total revenue and cost of goods sold to calculate gross profit'
              },
              {
                '@type': 'HowToStep',
                name: 'Set Operating Expenses',
                text: 'Enter your operating expenses including salaries, rent, and marketing costs'
              },
              {
                '@type': 'HowToStep',
                name: 'Add Depreciation and Interest',
                text: 'Include non-cash expenses and interest costs for accurate cash flow calculation'
              },
              {
                '@type': 'HowToStep',
                name: 'Calculate Cash Flow',
                text: 'View your operating cash flow, net income, and key financial metrics'
              }
            ],
            tool: ['Revenue calculator', 'Expense tracker', 'Depreciation adder', 'Cash flow analyzer'],
            about: {
              '@type': 'Thing',
              name: 'Business Cash Flow Analysis'
            },
            audience: {
              '@type': 'Audience',
              audienceType: ['Small Business Owners', 'Startup Founders', 'Financial Analysts', 'Investors', 'Accountants']
            }
          })}
        </script>

        {/* Additional FAQ Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'Is this cash flow calculator completely free to use?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes, our cash flow calculator is 100% free with no hidden costs, registration requirements, or usage limits. You can analyze your business cash flow as many times as needed.'
                }
              },
              {
                '@type': 'Question',
                name: 'What is the difference between operating cash flow and free cash flow?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Operating cash flow measures cash generated from core business operations, while free cash flow is operating cash flow minus capital expenditures, representing cash available for expansion, dividends, or debt reduction.'
                }
              },
              {
                '@type': 'Question',
                name: 'Can I use this calculator for personal finance cash flow?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'While designed for business analysis, you can adapt it for personal finance by considering salary as revenue and living expenses as operating expenses for a high-level cash flow view.'
                }
              },
              {
                '@type': 'Question',
                name: 'How accurate are the cash flow calculations?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Our calculator uses standard accounting formulas and provides accurate estimates based on your inputs. Actual cash flow may vary based on timing differences, working capital changes, and other operational factors.'
                }
              },
              {
                '@type': 'Question',
                name: 'What is a good cash flow margin for my business?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'A healthy operating cash flow margin varies by industry but generally 10-20% is good, while above 20% is excellent. Compare with industry benchmarks for accurate assessment.'
                }
              },
              {
                '@type': 'Question',
                name: 'Do you store my business financial information?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'No, all calculations are performed locally in your browser. We do not store, transmit, or collect any of your business financial information.'
                }
              },
              {
                '@type': 'Question',
                name: 'Can this calculator help with business loan applications?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes, this calculator can help you prepare cash flow projections and understand your business financial health, which are crucial components of most business loan applications.'
                }
              }
            ]
          })}
        </script>
      </Head>

      {/* Spacing above content (gap from navbar) */}
      <div className={styles.spacerTop}></div>

      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Cash Flow Calculator</h1>
          <p className={styles.subtitle}>
            Estimate your business's operating cash flow to assess financial health and liquidity.
          </p>
        </section>

        {/* Calculator Section */}
        <section>
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter your income and expense details to calculate operating cash flow.
              </p>

              <div className={styles.inputGroup}>
                <label htmlFor="revenue" className={styles.label}>
                  Total Revenue ($)
                </label>
                <input
                  id="revenue"
                  type="number"
                  value={revenue}
                  onChange={(e) => setRevenue(e.target.value)}
                  placeholder="e.g. 500000"
                  className={styles.input}
                  min="0"
                  step="any"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="cogs" className={styles.label}>
                  Cost of Goods Sold (COGS) ($)
                </label>
                <input
                  id="cogs"
                  type="number"
                  value={cogs}
                  onChange={(e) => setCogs(e.target.value)}
                  placeholder="e.g. 200000"
                  className={styles.input}
                  min="0"
                  step="any"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="operatingExpenses" className={styles.label}>
                  Operating Expenses ($)
                </label>
                <input
                  id="operatingExpenses"
                  type="number"
                  value={operatingExpenses}
                  onChange={(e) => setOperatingExpenses(e.target.value)}
                  placeholder="e.g. 100000"
                  className={styles.input}
                  min="0"
                  step="any"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="depreciation" className={styles.label}>
                  Depreciation ($)
                </label>
                <input
                  id="depreciation"
                  type="number"
                  value={depreciation}
                  onChange={(e) => setDepreciation(e.target.value)}
                  className={styles.input}
                  min="0"
                  step="any"
                />
                <small className={styles.note}>Non-cash expense added back to cash flow</small>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="interest" className={styles.label}>
                  Interest Expense ($)
                </label>
                <input
                  id="interest"
                  type="number"
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  className={styles.input}
                  min="0"
                  step="any"
                />
                <small className={styles.note}>Pre-tax interest cost</small>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="taxRate" className={styles.label}>
                  Tax Rate (%)
                </label>
                <input
                  id="taxRate"
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  className={styles.input}
                  min="0"
                  max="50"
                  step="0.1"
                  required
                />
              </div>

              <button type="submit" className={styles.submitBtn}>
                <span className="taxpro-btn-label">Calculate Cash Flow</span>
                <span className="taxpro-btn-arrow">→</span>
              </button>
            </form>

            {result && (
              <div className={styles.resultSection}>
                <h3>Operating Cash Flow Results</h3>
                <div className={styles.resultGrid}>
                  <div className={styles.resultItem}>
                    <strong>Gross Profit:</strong> ${result.grossProfit}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>EBIT:</strong> ${result.ebit}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Net Income:</strong> ${result.netIncome}
                  </div>
                  <div className={`${styles.resultItem} ${styles.highlight}`}>
                    <strong>Operating Cash Flow:</strong> ${result.operatingCashFlow}
                  </div>
                </div>
                <div className={styles.note}>
                  Your operating cash flow is <strong>${result.operatingCashFlow}</strong>, which reflects the actual cash generated from core operations.
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h3>Why Cash Flow Matters</h3>
            <p>
              <strong>Operating Cash Flow (OCF)</strong> measures the actual cash a business generates from its core operations. Unlike net income, it accounts for non-cash expenses like depreciation and is a key indicator of <strong>liquidity, sustainability, and financial health</strong>.
            </p>

            <h4>How to Use This Calculator</h4>
            <ul className={styles.list}>
              <li><strong>Revenue:</strong> Total sales or income from operations</li>
              <li><strong>COGS:</strong> Direct costs of producing goods or services</li>
              <li><strong>Operating Expenses:</strong> Rent, salaries, marketing, etc.</li>
              <li><strong>Depreciation:</strong> Non-cash expense; added back to net income</li>
              <li><strong>Interest:</strong> Cost of debt financing (affects taxable income)</li>
              <li><strong>Tax Rate:</strong> Effective corporate tax rate</li>
              <li>Click "Calculate Cash Flow" to see your operating cash flow</li>
            </ul>

            <h4>Formula Used</h4>
            <div className={styles.formula}>
              <code>OCF = Net Income + Depreciation</code>
            </div>
            <p>
              Where:
              <ul className={styles.list}>
                <li><strong>Net Income</strong> = (Revenue - COGS - OpEx - Depreciation - Interest) × (1 - Tax Rate)</li>
                <li><strong>Depreciation</strong> is added back because it's a non-cash expense</li>
              </ul>
            </p>
            <p>
              <strong>Example:</strong> $500K revenue, $200K COGS, $100K OpEx, $10K depreciation, $5K interest, 25% tax
              <br />
              Net Income = ($185K EBT × 0.75) = $138,750 → OCF = $138,750 + $10,000 = <strong>$148,750</strong>
            </p>

            <h4>Interpreting Your Cash Flow</h4>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Cash Flow Level</th>
                  <th>Interpretation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Positive</td>
                  <td>Healthy: Business generates more cash than it spends</td>
                </tr>
                <tr>
                  <td>Zero</td>
                  <td>Break-even: Cash neutral, may need external funding</td>
                </tr>
                <tr>
                  <td>Negative</td>
                  <td>Warning sign: May face liquidity issues or over-leveraging</td>
                </tr>
              </tbody>
            </table>

            <h4>Industry Benchmarks</h4>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Industry</th>
                  <th>Typical OCF Margin</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Software (SaaS)</td>
                  <td>20-40%</td>
                </tr>
                <tr>
                  <td>Retail</td>
                  <td>5-10%</td>
                </tr>
                <tr>
                  <td>Manufacturing</td>
                  <td>10-15%</td>
                </tr>
                <tr>
                  <td>Restaurants</td>
                  <td>3-8%</td>
                </tr>
                <tr>
                  <td>Construction</td>
                  <td>5-12%</td>
                </tr>
              </tbody>
            </table>

            <h4>Tips to Improve Cash Flow</h4>
            <ul className={styles.list}>
              <li>✅ <strong>Speed up receivables</strong> — invoice promptly, offer early payment discounts</li>
              <li>✅ <strong>Delay payables</strong> — negotiate longer payment terms</li>
              <li>✅ <strong>Reduce inventory</strong> — optimize stock levels</li>
              <li>✅ <strong>Cut non-essential costs</strong> — review recurring expenses</li>
              <li>✅ <strong>Lease instead of buy</strong> — preserve capital</li>
            </ul>

            <h4>Advanced Cash Flow Concepts</h4>
            <ul className={styles.list}>
              <li><strong>Free Cash Flow (FCF):</strong> OCF - Capital Expenditures</li>
              <li><strong>Cash Flow Forecasting:</strong> Project future inflows/outflows</li>
              <li><strong>DCF Valuation:</strong> Use OCF to value a business</li>
              <li><strong>Cash Conversion Cycle:</strong> Measures efficiency of cash flow management</li>
            </ul>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <h2 className={styles.ctaSectionHeading}>Free Financial Planning Tools: Budget, Invest & Plan Retirement</h2>
          <p className={styles.ctaSectionSubtext}>Free Financial Planning Tools – Try Now</p>
          <Link href="/suite" passHref legacyBehavior>
            <a
              className={styles.ctaButton}
              ref={ctaButtonRef}
              onMouseMove={handleMouseMove}
            >
              <span className="btn-label">Explore All Calculators</span>
              <span className="btn-icon" aria-hidden="true">→</span>
            </a>
          </Link>
        </section>
      </div>

      {/* Spacing below content (gap before footer) */}
      <div className={styles.spacerBottom}></div>
    </>
  );
};

export default CashFlowCalculator;