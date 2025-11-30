import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './workingcapitalcalculator.module.css';

const WorkingCapitalCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [currentAssets, setCurrentAssets] = useState('');
  const [currentLiabilities, setCurrentLiabilities] = useState('');
  const [result, setResult] = useState(null);

  // Robust number extraction
  const parseNumber = (input) => {
    if (!input) return NaN;
    const match = input.toString().replace(/,/g, '').match(/-?\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : NaN;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const assets = parseNumber(currentAssets);
    const liabilities = parseNumber(currentLiabilities);

    if (isNaN(assets) || isNaN(liabilities)) {
      alert("Please enter valid numbers");
      return;
    }

    if (liabilities < 0 || assets < 0) {
      alert("Values cannot be negative");
      return;
    }

    const workingCapital = assets - liabilities;
    const ratio = liabilities !== 0 ? (assets / liabilities).toFixed(2) : 'Infinity';
    const isHealthyRatio = ratio !== 'Infinity' && parseFloat(ratio) >= 1.2 && parseFloat(ratio) <= 2.0;

    setResult({
      assets: assets.toLocaleString(undefined, { maximumFractionDigits: 2 }),
      liabilities: liabilities.toLocaleString(undefined, { maximumFractionDigits: 2 }),
      capital: workingCapital.toLocaleString(undefined, { maximumFractionDigits: 2 }),
      ratio,
      healthy: isHealthyRatio,
    });
  };

  // Magnetic effect on CTA button
  const handleMouseMove = (e) => {
    const el = ctaButtonRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--x', `${x}px`);
    el.style.setProperty('--y', `${y}px`);
  };

  // SEO Metadata - Enhanced with comprehensive working capital keywords
  const siteUrl = 'https://www.financecalculatorfree.com';
  const pageTitle = 'Free Working Capital Calculator 2024 | Current Ratio & Liquidity Analysis';
  const pageDescription = 'Calculate working capital, current ratio, and assess business liquidity. Free working capital calculator for financial health analysis and cash flow management.';

  // Comprehensive SEO Keywords Collections for Working Capital Calculator
  const singleKeywords = [
    'working', 'capital', 'calculator', 'current', 'ratio', 'liquidity', 'assets', 
    'liabilities', 'cash', 'flow', 'management', 'financial', 'health', 'business', 
    'short', 'term', 'obligations', 'debts', 'payables', 'receivables', 'inventory', 
    'convertible', 'operational', 'efficiency', 'solvency', 'stability', 'risk', 
    'assessment', 'analysis', 'metric', 'measurement', 'indicator', 'benchmark', 
    'standard', 'target', 'goal', 'optimal', 'ideal', 'minimum', 'maximum', 
    'adequate', 'sufficient', 'insufficient', 'deficient', 'negative', 'positive', 
    'neutral', 'balance', 'sheet', 'statement', 'position', 'condition', 'status', 
    'performance', 'evaluation', 'review', 'monitoring', 'tracking', 'reporting', 
    'planning', 'forecasting', 'budgeting', 'projection', 'estimation', 'calculation',
    'computation', 'formula', 'equation', 'methodology', 'approach', 'technique'
  ];

  const twoWordKeywords = [
    'working capital', 'working capital calculator', 'current ratio', 'liquidity ratio', 
    'current assets', 'current liabilities', 'cash flow', 'financial health', 
    'business liquidity', 'short term', 'financial stability', 'operational efficiency', 
    'cash management', 'working capital management', 'liquidity management', 
    'cash conversion', 'operating cycle', 'cash cycle', 'working capital cycle', 
    'net working', 'gross working', 'permanent working', 'temporary working', 
    'seasonal working', 'negative working', 'positive working', 'adequate working', 
    'insufficient working', 'excess working', 'optimal working', 'ideal working', 
    'working capital needs', 'working capital requirements', 'working capital financing', 
    'working capital loan', 'working capital line', 'working capital credit', 
    'working capital facility', 'working capital funding', 'working capital investment', 
    'working capital optimization', 'working capital improvement', 'working capital strategy', 
    'working capital policy', 'working capital planning', 'working capital forecast', 
    'working capital budget', 'working capital projection', 'working capital analysis', 
    'working capital assessment', 'working capital evaluation', 'working capital review', 
    'working capital monitoring', 'working capital tracking', 'working capital reporting', 
    'working capital metrics', 'working capital kpis', 'working capital benchmarks', 
    'working capital standards', 'working capital targets', 'working capital goals', 
    'accounts receivable', 'accounts payable', 'inventory management', 'cash balance', 
    'marketable securities', 'short term investments', 'accrued expenses', 
    'short term debt', 'current portion', 'long term debt', 'trade credit', 
    'supplier credit', 'customer credit', 'credit terms', 'payment terms', 
    'collection period', 'payment period', 'inventory period', 'cash period', 
    'operating cycle', 'cash cycle', 'conversion cycle', 'working capital turnover', 
    'current asset turnover', 'current liability turnover', 'quick ratio', 
    'acid test', 'cash ratio', 'defensive interval', 'liquidity coverage', 
    'financial ratio', 'balance sheet', 'income statement', 'cash flow statement', 
    'financial statements', 'financial analysis', 'ratio analysis', 'trend analysis', 
    'comparative analysis', 'industry analysis', 'peer analysis', 'competitor analysis'
  ];

  const longTailKeywords = [
    'free online working capital calculator for small business',
    'current ratio calculator for liquidity analysis',
    'working capital calculator for financial health assessment',
    'how to calculate working capital from balance sheet',
    'working capital calculator for startup companies',
    'current assets and current liabilities calculator',
    'liquidity ratio calculator for business loans',
    'working capital calculator for manufacturing companies',
    'retail business working capital calculator with inventory',
    'seasonal business working capital calculator for cash flow',
    'working capital calculator for service based businesses',
    'construction company working capital calculator for projects',
    'restaurant working capital calculator for food inventory',
    'healthcare working capital calculator for medical practices',
    'technology company working capital calculator for saas',
    'ecommerce working capital calculator for online stores',
    'nonprofit working capital calculator for charitable organizations',
    'franchise working capital calculator for multiple locations',
    'family business working capital calculator for succession planning',
    'startup working capital calculator for investor presentations',
    'small business working capital calculator for bank financing',
    'corporate working capital calculator for financial reporting',
    'public company working capital calculator for sec filings',
    'private company working capital calculator for business valuation',
    'merger acquisition working capital calculator for m&a deals',
    'due diligence working capital calculator for investment analysis',
    'turnaround working capital calculator for distressed companies',
    'restructuring working capital calculator for financial recovery',
    'bankruptcy working capital calculator for chapter 11',
    'liquidation working capital calculator for asset sales',
    'growth capital working capital calculator for expansion',
    'venture capital working capital calculator for portfolio companies',
    'private equity working capital calculator for leveraged buyouts',
    'angel investor working capital calculator for early stage',
    'commercial lender working capital calculator for credit decisions',
    'business appraiser working capital calculator for valuation',
    'financial advisor working capital calculator for client consulting',
    'cpa working capital calculator for accounting services',
    'cfa working capital calculator for financial analysis',
    'mba working capital calculator for business students',
    'entrepreneur working capital calculator for business planning',
    'ceo working capital calculator for executive management',
    'cfo working capital calculator for financial leadership',
    'controller working capital calculator for accounting management',
    'treasurer working capital calculator for cash management',
    'credit manager working capital calculator for risk assessment',
    'supply chain working capital calculator for inventory optimization',
    'procurement working capital calculator for vendor management',
    'sales working capital calculator for customer credit',
    'marketing working capital calculator for campaign budgeting',
    'operations working capital calculator for efficiency improvement',
    'hr working capital calculator for payroll management',
    'it working capital calculator for technology investments',
    'legal working capital calculator for compliance costs',
    'tax working capital calculator for planning strategies',
    'audit working capital calculator for internal controls',
    'compliance working capital calculator for regulatory requirements',
    'risk management working capital calculator for mitigation',
    'strategic planning working capital calculator for long term',
    'tactical planning working capital calculator for short term',
    'operational planning working capital calculator for daily',
    'budget planning working capital calculator for annual',
    'forecast planning working capital calculator for quarterly',
    'scenario analysis working capital calculator for what if',
    'sensitivity analysis working capital calculator for risk',
    'stress testing working capital calculator for worst case',
    'benchmarking working capital calculator for industry comparison',
    'trend analysis working capital calculator for historical',
    'ratio analysis working capital calculator for financial',
    'peer analysis working capital calculator for competitors',
    'industry analysis working capital calculator for sectors',
    'sector analysis working capital calculator for specific',
    'market analysis working capital calculator for conditions',
    'economic analysis working capital calculator for cycles',
    'seasonal analysis working capital calculator for patterns',
    'cyclical analysis working capital calculator for trends',
    'working capital calculator with accounts receivable aging',
    'working capital calculator with inventory turnover',
    'working capital calculator with accounts payable terms',
    'working capital calculator with cash conversion cycle',
    'working capital calculator with operating cycle analysis',
    'working capital calculator with liquidity coverage ratio',
    'working capital calculator with quick ratio calculation',
    'working capital calculator with acid test ratio',
    'working capital calculator with cash ratio analysis',
    'working capital calculator with defensive interval',
    'working capital calculator with working capital turnover',
    'working capital calculator with current asset turnover',
    'working capital calculator with current liability turnover',
    'working capital calculator with net working capital',
    'working capital calculator with gross working capital',
    'working capital calculator with permanent working capital',
    'working capital calculator with temporary working capital',
    'working capital calculator with seasonal working capital',
    'working capital calculator with negative working capital',
    'working capital calculator with positive working capital',
    'working capital calculator with adequate working capital',
    'working capital calculator with insufficient working capital',
    'working capital calculator with excess working capital',
    'working capital calculator with optimal working capital',
    'working capital calculator with ideal working capital',
    'working capital calculator with minimum working capital',
    'working capital calculator with maximum working capital',
    'working capital calculator for cash flow forecasting',
    'working capital calculator for budget preparation',
    'working capital calculator for financial planning',
    'working capital calculator for strategic planning',
    'working capital calculator for operational planning',
    'working capital calculator for tactical planning',
    'working capital calculator for risk assessment',
    'working capital calculator for opportunity analysis',
    'working capital calculator for decision making',
    'working capital calculator for performance measurement',
    'working capital calculator for kpi tracking',
    'working capital calculator for metric monitoring',
    'working capital calculator for dashboard reporting',
    'working capital calculator for executive reporting',
    'working capital calculator for board reporting',
    'working capital calculator for investor reporting',
    'working capital calculator for lender reporting',
    'working capital calculator for regulatory reporting',
    'working capital calculator for audit preparation',
    'working capital calculator for due diligence',
    'working capital calculator for acquisition analysis',
    'working capital calculator for merger analysis',
    'working capital calculator for investment analysis',
    'working capital calculator for credit analysis',
    'working capital calculator for valuation analysis'
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
        <meta name="subject" content="Working Capital Calculator & Liquidity Analysis" />
        <meta name="classification" content="Finance, Accounting, Business, Calculators, Liquidity Analysis" />
        <meta name="topic" content="Working Capital Calculation and Business Liquidity Assessment" />
        <meta name="summary" content="Free online working capital calculator for business liquidity analysis" />
        <meta name="url" content={`${siteUrl}/working-capital-calculator`} />
        
        {/* Verification & Ownership */}
        <meta name="google-site-verification" content="your_verification_code" />
        <meta name="msvalidate.01" content="your_bing_verification" />
        
        {/* Location & Business */}
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="United States" />
        <meta name="geo.position" content="39.8283;-98.5795" />
        <meta name="ICBM" content="39.8283, -98.5795" />
        
        {/* Canonical */}
        <link rel="canonical" href={`${siteUrl}/working-capital-calculator`} />
        
        {/* Alternate Languages */}
        <link rel="alternate" href={`${siteUrl}/working-capital-calculator`} hrefLang="x-default" />
        <link rel="alternate" href={`${siteUrl}/working-capital-calculator`} hrefLang="en" />
        <link rel="alternate" href={`${siteUrl}/es/working-capital-calculator`} hrefLang="es" />
        
        {/* Preload & Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/working-capital-calculator`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={`${siteUrl}/images/working-capital-calculator-preview.jpg`} />
        <meta property="og:image:alt" content="Working Capital Calculator Interface for Liquidity Analysis" />
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
        <meta name="twitter:image" content={`${siteUrl}/images/working-capital-calculator-preview.jpg`} />
        <meta name="twitter:image:alt" content="Free Working Capital Calculator for Business Analysis" />
        
        {/* Additional Social */}
        <meta name="pinterest" content="nopin" description="Free working capital calculator for liquidity analysis" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: pageTitle,
            description: pageDescription,
            url: `${siteUrl}/working-capital-calculator`,
            mainEntity: {
              '@type': 'SoftwareApplication',
              name: 'Working Capital Calculator',
              applicationCategory: 'FinanceApplication',
              operatingSystem: 'Any',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD'
              },
              description: 'Free online working capital calculator for calculating current ratio, liquidity analysis, and assessing business financial health and short-term solvency.',
              featureList: [
                'Working capital calculation',
                'Current ratio analysis',
                'Liquidity assessment',
                'Multiple business type support',
                'Financial health evaluation'
              ],
              processorRequirements: 'Web browser',
              permission: 'No special permissions required'
            },
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
                { '@type': 'ListItem', position: 2, name: 'Working Capital Calculator', item: `${siteUrl}/working-capital-calculator` }
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
            name: 'Working Capital Calculator',
            description: 'A tool for calculating working capital and analyzing business liquidity and short-term financial health',
            url: `${siteUrl}/working-capital-calculator`,
            step: [
              {
                '@type': 'HowToStep',
                name: 'Enter Current Assets',
                text: 'Input your total current assets including cash, accounts receivable, and inventory'
              },
              {
                '@type': 'HowToStep',
                name: 'Set Current Liabilities',
                text: 'Enter your total current liabilities including accounts payable and short-term debt'
              },
              {
                '@type': 'HowToStep',
                name: 'Calculate Working Capital',
                text: 'View your working capital amount and current ratio for liquidity analysis'
              },
              {
                '@type': 'HowToStep',
                name: 'Assess Financial Health',
                text: 'Compare your results to industry benchmarks and identify improvement opportunities'
              }
            ],
            tool: ['Current assets calculator', 'Current liabilities tracker', 'Working capital analyzer', 'Liquidity ratio calculator'],
            about: {
              '@type': 'Thing',
              name: 'Business Liquidity Analysis'
            },
            audience: {
              '@type': 'Audience',
              audienceType: ['Business Owners', 'Financial Managers', 'CFOs', 'Lenders', 'Investors']
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
                name: 'Is this working capital calculator completely free to use?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes, our working capital calculator is 100% free with no hidden costs, registration requirements, or usage limits. Business owners, financial managers, and analysts can use it for unlimited liquidity analysis.'
                }
              },
              {
                '@type': 'Question',
                name: 'What is the difference between working capital and current ratio?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Working capital is the dollar amount difference between current assets and liabilities, while current ratio is the proportion (assets divided by liabilities) that shows relative liquidity strength.'
                }
              },
              {
                '@type': 'Question',
                name: 'What is considered a healthy current ratio?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'A current ratio between 1.2 and 2.0 is generally considered healthy. Below 1.0 indicates potential liquidity issues, while above 2.0 may suggest inefficient asset utilization.'
                }
              },
              {
                '@type': 'Question',
                name: 'Can negative working capital be acceptable?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Some businesses like Walmart and Amazon operate with negative working capital due to fast inventory turnover and strong supplier terms, but generally positive working capital is preferred for most companies.'
                }
              },
              {
                '@type': 'Question',
                name: 'How often should I calculate working capital?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Calculate working capital monthly for active monitoring, quarterly for strategic planning, and annually for comprehensive financial health assessment and reporting purposes.'
                }
              },
              {
                '@type': 'Question',
                name: 'What are common ways to improve working capital?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Key strategies include accelerating accounts receivable collection, optimizing inventory levels, negotiating extended payment terms with suppliers, and using working capital financing when needed.'
                }
              },
              {
                '@type': 'Question',
                name: 'How does working capital affect business loans?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Lenders closely examine working capital and current ratio when evaluating loan applications, as these metrics indicate your ability to meet short-term obligations and manage cash flow effectively.'
                }
              }
            ]
          })}
        </script>
      </Head>

      {/* Gap above content (from navbar) */}
      <div className={styles.spacerTop}></div>

      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Working Capital Calculator</h1>
          <p className={styles.subtitle}>
            Calculate your business's working capital and current ratio to assess short-term financial health.
          </p>
        </section>

        {/* Calculator Section */}
        <section>
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter your current assets and current liabilities to calculate working capital and liquidity.
              </p>

              <div className={styles.inputGroup}>
                <label htmlFor="currentAssets" className={styles.label}>
                  Current Assets ($)
                </label>
                <input
                  id="currentAssets"
                  type="text"
                  value={currentAssets}
                  onChange={(e) => setCurrentAssets(e.target.value)}
                  placeholder="e.g. 150,000 or $150K"
                  className={styles.input}
                />
                <small className={styles.note}>
                  Cash, accounts receivable, inventory, marketable securities.
                </small>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="currentLiabilities" className={styles.label}>
                  Current Liabilities ($)
                </label>
                <input
                  id="currentLiabilities"
                  type="text"
                  value={currentLiabilities}
                  onChange={(e) => setCurrentLiabilities(e.target.value)}
                  placeholder="e.g. 90,000 or $90K"
                  className={styles.input}
                />
                <small className={styles.note}>
                  Accounts payable, short-term debt, accrued expenses, upcoming taxes.
                </small>
              </div>

              <button type="submit" className={styles.submitBtn}>
                <span className="taxpro-btn-label">Calculate Working Capital</span>
                <span className="taxpro-btn-arrow">→</span>
              </button>
            </form>

            {result && (
              <div className={styles.resultSection}>
                <h3>Working Capital Summary</h3>
                <div className={styles.resultGrid}>
                  <div className={styles.resultItem}>
                    <strong>Current Assets:</strong> ${result.assets}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Current Liabilities:</strong> ${result.liabilities}
                  </div>
                  <div className={`${styles.resultItem} highlight ${result.capital >= 0 ? styles.positive : styles.negative}`}>
                    <strong>Working Capital:</strong> ${result.capital}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Current Ratio:</strong> {result.ratio}
                  </div>
                </div>
                <div className={styles.note}>
                  {result.capital >= 0
                    ? `You have $${result.capital} in working capital. This means you can cover short-term obligations.`
                    : `Negative working capital ($${result.capital}) indicates potential liquidity issues.`
                  }
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h3>Why Working Capital Matters</h3>
            <p>
              <strong>Working capital</strong> measures a company’s short-term financial health — its ability to pay bills, manage operations, and handle emergencies. It’s the lifeblood of day-to-day business.
            </p>

            <h4>How to Use This Calculator</h4>
            <ul className={styles.list}>
              <li><strong>Current Assets:</strong> Cash, receivables, inventory — anything convertible to cash within a year.</li>
              <li><strong>Current Liabilities:</strong> Debts due within one year (payables, short-term loans, etc.).</li>
              <li>Enter values freely — we extract numbers from any format (e.g., 150k, $90,000).</li>
              <li>Click “Calculate” to see your working capital and current ratio.</li>
            </ul>

            <h4>Formulas Used</h4>
            <div className={styles.formula}>
              <code>Working Capital = Current Assets − Current Liabilities</code>
            </div>
            <div className={styles.formula}>
              <code>Current Ratio = Current Assets ÷ Current Liabilities</code>
            </div>
            <p>
              <strong>Example:</strong> $150K assets, $90K liabilities →
              <br />
              Working Capital = 150,000 − 90,000 = <strong>$60,000</strong>
              <br />
              Current Ratio = 150,000 / 90,000 = <strong>1.67</strong> → <strong>Healthy</strong>
            </p>

            <h4>Interpreting the Results</h4>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Healthy Range</th>
                  <th>Interpretation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Working Capital</td>
                  <td>Positive</td>
                  <td>✅ Can cover short-term debts</td>
                </tr>
                <tr>
                  <td>Current Ratio</td>
                  <td>1.2 – 2.0</td>
                  <td>✅ Ideal liquidity balance</td>
                </tr>
                <tr>
                  <td>Current Ratio less than 1.0</td>
                  <td>N/A</td>
                  <td>❌ Risk of default</td>
                </tr>
                <tr>
                  <td>Current Ratio greater than 2.0</td>
                  <td>N/A</td>
                  <td>⚠️ Excess idle assets</td>
                </tr>
              </tbody>
            </table>

            <h4>Real-World Applications</h4>
            <ul className={styles.list}>
              <li><strong>Small Businesses:</strong> Ensure you can pay rent, payroll, and suppliers</li>
              <li><strong>Startups:</strong> Monitor runway and cash flow during growth phases</li>
              <li><strong>Lenders:</strong> Assess creditworthiness before approving loans</li>
              <li><strong>Investors:</strong> Evaluate financial stability of potential investments</li>
              <li><strong>Seasonal Businesses:</strong> Plan for low-revenue periods</li>
            </ul>

            <h4>Tips to Improve Working Capital</h4>
            <ul className={styles.list}>
              <li>✅ <strong>Speed up receivables</strong> — offer early payment discounts</li>
              <li>✅ <strong>Negotiate longer payables</strong> — extend terms with suppliers</li>
              <li>✅ <strong>Reduce excess inventory</strong> — free up cash</li>
              <li>✅ <strong>Use a line of credit</strong> for temporary shortfalls</li>
              <li>✅ <strong>Monitor cash flow weekly</strong> — catch issues early</li>
            </ul>

            <h4>Advanced Use: Operating Cycle</h4>
            <p>
              Combine working capital with:
            </p>
            <ul className={styles.list}>
              <li><strong>Days Sales Outstanding (DSO)</strong> — how fast you collect receivables</li>
              <li><strong>Days Inventory Outstanding (DIO)</strong> — how long inventory sits</li>
              <li><strong>Days Payable Outstanding (DPO)</strong> — how long you take to pay bills</li>
            </ul>
            <p>
              <strong>Net Operating Cycle = DSO + DIO − DPO</strong>
              <br />
              A shorter cycle means faster cash generation.
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <h2 className={styles.ctaSectionHeading}>
            Free Financial Planning Tools: Budget, Invest & Plan Retirement
          </h2>
          <p className={styles.ctaSectionSubtext}>
            Free Financial Planning Tools – Try Now
          </p>
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

      {/* Gap below content (before footer) */}
      <div className={styles.spacerBottom}></div>
    </>
  );
};

export default WorkingCapitalCalculator;