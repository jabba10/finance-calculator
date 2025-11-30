import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './currentratiocalculator.module.css';

const CurrentRatioCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [currentAssets, setCurrentAssets] = useState('');
  const [currentLiabilities, setCurrentLiabilities] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Helper: Extract first number from any string
  const parseNumber = (input) => {
    if (!input) return NaN;
    const match = input.toString().replace(/,/g, '').match(/\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : NaN;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    const assets = parseNumber(currentAssets);
    const liabilities = parseNumber(currentLiabilities);

    // Validate inputs
    if (isNaN(assets)) {
      setError('Please enter a valid value for Current Assets.');
      return;
    }
    if (isNaN(liabilities)) {
      setError('Please enter a valid value for Current Liabilities.');
      return;
    }
    if (liabilities <= 0) {
      setError('Current Liabilities must be greater than zero.');
      return;
    }

    const ratio = (assets / liabilities).toFixed(2);
    const isHealthy = ratio >= 1.2 && ratio <= 2.0;

    setResult({
      assets: assets.toLocaleString(undefined, { maximumFractionDigits: 2 }),
      liabilities: liabilities.toLocaleString(undefined, { maximumFractionDigits: 2 }),
      ratio,
      isHealthy,
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

  // SEO Metadata - Enhanced with comprehensive current ratio keywords
  const siteUrl = 'https://www.financecalculatorfree.com';
  const pageTitle = 'Free Current Ratio Calculator 2024 | Liquidity Ratio Analysis Tool';
  const pageDescription = 'Calculate current ratio to measure business liquidity and short-term financial health. Free current ratio calculator for financial analysis and credit assessment.';

  // Comprehensive SEO Keywords Collections for Current Ratio Calculator
  const singleKeywords = [
    'current', 'ratio', 'calculator', 'liquidity', 'assets', 'liabilities', 
    'financial', 'health', 'analysis', 'metric', 'measurement', 'indicator', 
    'benchmark', 'standard', 'target', 'goal', 'optimal', 'ideal', 'minimum', 
    'maximum', 'adequate', 'sufficient', 'insufficient', 'deficient', 'negative', 
    'positive', 'neutral', 'balance', 'sheet', 'statement', 'position', 'condition', 
    'status', 'performance', 'evaluation', 'review', 'monitoring', 'tracking', 
    'reporting', 'planning', 'forecasting', 'budgeting', 'projection', 'estimation', 
    'calculation', 'computation', 'formula', 'equation', 'methodology', 'approach', 
    'technique', 'tool', 'resource', 'solution', 'application', 'software', 'platform',
    'system', 'interface', 'dashboard', 'display', 'result', 'output', 'input',
    'parameter', 'variable', 'factor', 'component', 'element', 'aspect', 'dimension'
  ];

  const twoWordKeywords = [
    'current ratio', 'current ratio calculator', 'liquidity ratio', 'financial health', 
    'current assets', 'current liabilities', 'balance sheet', 'financial statement', 
    'financial analysis', 'ratio analysis', 'liquidity analysis', 'financial metric', 
    'financial measurement', 'financial indicator', 'financial benchmark', 
    'financial standard', 'financial target', 'financial goal', 'optimal ratio', 
    'ideal ratio', 'minimum ratio', 'maximum ratio', 'adequate ratio', 
    'sufficient ratio', 'insufficient ratio', 'deficient ratio', 'negative ratio', 
    'positive ratio', 'neutral ratio', 'healthy ratio', 'unhealthy ratio', 
    'strong ratio', 'weak ratio', 'good ratio', 'bad ratio', 'acceptable ratio', 
    'unacceptable ratio', 'satisfactory ratio', 'unsatisfactory ratio', 
    'desirable ratio', 'undesirable ratio', 'preferable ratio', 'nonpreferable ratio', 
    'favorable ratio', 'unfavorable ratio', 'advantageous ratio', 'disadvantageous ratio', 
    'beneficial ratio', 'harmful ratio', 'productive ratio', 'counterproductive ratio', 
    'efficient ratio', 'inefficient ratio', 'effective ratio', 'ineffective ratio', 
    'optimal liquidity', 'ideal liquidity', 'minimum liquidity', 'maximum liquidity', 
    'adequate liquidity', 'sufficient liquidity', 'insufficient liquidity', 
    'deficient liquidity', 'negative liquidity', 'positive liquidity', 'neutral liquidity', 
    'healthy liquidity', 'unhealthy liquidity', 'strong liquidity', 'weak liquidity', 
    'good liquidity', 'bad liquidity', 'acceptable liquidity', 'unacceptable liquidity', 
    'satisfactory liquidity', 'unsatisfactory liquidity', 'desirable liquidity', 
    'undesirable liquidity', 'preferable liquidity', 'nonpreferable liquidity', 
    'favorable liquidity', 'unfavorable liquidity', 'advantageous liquidity', 
    'disadvantageous liquidity', 'beneficial liquidity', 'harmful liquidity', 
    'productive liquidity', 'counterproductive liquidity', 'efficient liquidity', 
    'inefficient liquidity', 'effective liquidity', 'ineffective liquidity'
  ];

  const longTailKeywords = [
    'free online current ratio calculator for business',
    'how to calculate current ratio from balance sheet',
    'current ratio calculator for liquidity analysis',
    'small business current ratio calculator for loans',
    'startup current ratio calculator for investors',
    'current ratio calculator for financial health assessment',
    'current assets and current liabilities calculator',
    'liquidity ratio calculator for credit analysis',
    'current ratio calculator for manufacturing companies',
    'retail business current ratio calculator with inventory',
    'service business current ratio calculator for cash flow',
    'construction company current ratio calculator for projects',
    'restaurant current ratio calculator for food industry',
    'healthcare current ratio calculator for medical practices',
    'technology current ratio calculator for saas companies',
    'ecommerce current ratio calculator for online stores',
    'nonprofit current ratio calculator for organizations',
    'franchise current ratio calculator for multiple locations',
    'family business current ratio calculator for planning',
    'corporate current ratio calculator for financial reporting',
    'public company current ratio calculator for sec filings',
    'private company current ratio calculator for valuation',
    'merger acquisition current ratio calculator for m&a',
    'due diligence current ratio calculator for investment',
    'turnaround current ratio calculator for distressed companies',
    'restructuring current ratio calculator for recovery',
    'bankruptcy current ratio calculator for chapter 11',
    'liquidation current ratio calculator for asset sales',
    'growth capital current ratio calculator for expansion',
    'venture capital current ratio calculator for startups',
    'private equity current ratio calculator for buyouts',
    'angel investor current ratio calculator for early stage',
    'commercial lender current ratio calculator for credit',
    'business appraiser current ratio calculator for valuation',
    'financial advisor current ratio calculator for consulting',
    'cpa current ratio calculator for accounting services',
    'cfa current ratio calculator for financial analysis',
    'mba current ratio calculator for business students',
    'entrepreneur current ratio calculator for planning',
    'ceo current ratio calculator for management',
    'cfo current ratio calculator for leadership',
    'controller current ratio calculator for accounting',
    'treasurer current ratio calculator for cash management',
    'credit manager current ratio calculator for risk',
    'supply chain current ratio calculator for optimization',
    'procurement current ratio calculator for vendors',
    'sales current ratio calculator for credit terms',
    'marketing current ratio calculator for budgeting',
    'operations current ratio calculator for efficiency',
    'hr current ratio calculator for payroll',
    'it current ratio calculator for technology',
    'legal current ratio calculator for compliance',
    'tax current ratio calculator for planning',
    'audit current ratio calculator for controls',
    'compliance current ratio calculator for regulations',
    'risk management current ratio calculator for mitigation',
    'strategic planning current ratio calculator for long term',
    'tactical planning current ratio calculator for short term',
    'operational planning current ratio calculator for daily',
    'budget planning current ratio calculator for annual',
    'forecast planning current ratio calculator for quarterly',
    'scenario analysis current ratio calculator for what if',
    'sensitivity analysis current ratio calculator for risk',
    'stress testing current ratio calculator for worst case',
    'benchmarking current ratio calculator for industry',
    'trend analysis current ratio calculator for historical',
    'ratio analysis current ratio calculator for financial',
    'peer analysis current ratio calculator for competitors',
    'industry analysis current ratio calculator for sectors',
    'sector analysis current ratio calculator for specific',
    'market analysis current ratio calculator for conditions',
    'economic analysis current ratio calculator for cycles',
    'seasonal analysis current ratio calculator for patterns',
    'cyclical analysis current ratio calculator for trends',
    'current ratio calculator with quick ratio comparison',
    'current ratio calculator with acid test ratio',
    'current ratio calculator with cash ratio analysis',
    'current ratio calculator with working capital',
    'current ratio calculator with liquidity coverage',
    'current ratio calculator with defensive interval',
    'current ratio calculator with asset turnover',
    'current ratio calculator with liability turnover',
    'current ratio calculator with cash conversion cycle',
    'current ratio calculator with operating cycle',
    'current ratio calculator with dso dpo dio',
    'current ratio calculator for cash flow forecasting',
    'current ratio calculator for budget preparation',
    'current ratio calculator for financial planning',
    'current ratio calculator for strategic planning',
    'current ratio calculator for operational planning',
    'current ratio calculator for tactical planning',
    'current ratio calculator for risk assessment',
    'current ratio calculator for opportunity analysis',
    'current ratio calculator for decision making',
    'current ratio calculator for performance measurement',
    'current ratio calculator for kpi tracking',
    'current ratio calculator for metric monitoring',
    'current ratio calculator for dashboard reporting',
    'current ratio calculator for executive reporting',
    'current ratio calculator for board reporting',
    'current ratio calculator for investor reporting',
    'current ratio calculator for lender reporting',
    'current ratio calculator for regulatory reporting',
    'current ratio calculator for audit preparation',
    'current ratio calculator for due diligence',
    'current ratio calculator for acquisition analysis',
    'current ratio calculator for merger analysis',
    'current ratio calculator for investment analysis',
    'current ratio calculator for credit analysis',
    'current ratio calculator for valuation analysis',
    'current ratio calculator for financial modeling',
    'current ratio calculator for business valuation',
    'current ratio calculator for loan applications',
    'current ratio calculator for credit decisions',
    'current ratio calculator for risk management',
    'current ratio calculator for compliance checking',
    'current ratio calculator for internal controls',
    'current ratio calculator for external reporting',
    'current ratio calculator for stakeholder communication',
    'current ratio calculator for performance evaluation',
    'current ratio calculator for strategic decisions',
    'current ratio calculator for operational improvements',
    'current ratio calculator for financial optimization',
    'current ratio calculator for liquidity management',
    'current ratio calculator for cash management',
    'current ratio calculator for working capital management',
    'current ratio calculator for asset management',
    'current ratio calculator for liability management',
    'current ratio calculator for capital structure',
    'current ratio calculator for financial structure',
    'current ratio calculator for corporate finance',
    'current ratio calculator for business finance',
    'current ratio calculator for small business finance',
    'current ratio calculator for corporate accounting',
    'current ratio calculator for managerial accounting',
    'current ratio calculator for financial accounting',
    'current ratio calculator for cost accounting',
    'current ratio calculator for audit accounting',
    'current ratio calculator for tax accounting',
    'current ratio calculator for forensic accounting',
    'current ratio calculator for government accounting',
    'current ratio calculator for nonprofit accounting',
    'current ratio calculator for international accounting',
    'current ratio calculator for gaap compliance',
    'current ratio calculator for ifrs compliance',
    'current ratio calculator for sec compliance',
    'current ratio calculator for bank compliance',
    'current ratio calculator for regulatory compliance',
    'current ratio calculator for internal audit',
    'current ratio calculator for external audit',
    'current ratio calculator for statutory audit',
    'current ratio calculator for operational audit',
    'current ratio calculator for compliance audit',
    'current ratio calculator for financial audit',
    'current ratio calculator for tax audit',
    'current ratio calculator for due diligence audit'
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
        <meta name="subject" content="Current Ratio Calculator & Liquidity Analysis" />
        <meta name="classification" content="Finance, Accounting, Business, Calculators, Liquidity Analysis" />
        <meta name="topic" content="Current Ratio Calculation and Financial Health Assessment" />
        <meta name="summary" content="Free online current ratio calculator for business liquidity analysis" />
        <meta name="url" content={`${siteUrl}/current-ratio-calculator`} />
        
        {/* Verification & Ownership */}
        <meta name="google-site-verification" content="your_verification_code" />
        <meta name="msvalidate.01" content="your_bing_verification" />
        
        {/* Location & Business */}
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="United States" />
        <meta name="geo.position" content="39.8283;-98.5795" />
        <meta name="ICBM" content="39.8283, -98.5795" />
        
        {/* Canonical */}
        <link rel="canonical" href={`${siteUrl}/current-ratio-calculator`} />
        
        {/* Alternate Languages */}
        <link rel="alternate" href={`${siteUrl}/current-ratio-calculator`} hrefLang="x-default" />
        <link rel="alternate" href={`${siteUrl}/current-ratio-calculator`} hrefLang="en" />
        <link rel="alternate" href={`${siteUrl}/es/current-ratio-calculator`} hrefLang="es" />
        
        {/* Preload & Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/current-ratio-calculator`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={`${siteUrl}/images/current-ratio-calculator-preview.jpg`} />
        <meta property="og:image:alt" content="Current Ratio Calculator Interface for Liquidity Analysis" />
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
        <meta name="twitter:image" content={`${siteUrl}/images/current-ratio-calculator-preview.jpg`} />
        <meta name="twitter:image:alt" content="Free Current Ratio Calculator for Financial Analysis" />
        
        {/* Additional Social */}
        <meta name="pinterest" content="nopin" description="Free current ratio calculator for liquidity analysis" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: pageTitle,
            description: pageDescription,
            url: `${siteUrl}/current-ratio-calculator`,
            mainEntity: {
              '@type': 'SoftwareApplication',
              name: 'Current Ratio Calculator',
              applicationCategory: 'FinanceApplication',
              operatingSystem: 'Any',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD'
              },
              description: 'Free online current ratio calculator for measuring business liquidity, financial health, and short-term solvency through current assets and liabilities analysis.',
              featureList: [
                'Current ratio calculation',
                'Liquidity assessment',
                'Financial health evaluation',
                'Industry benchmark comparison',
                'Multiple business type support'
              ],
              processorRequirements: 'Web browser',
              permission: 'No special permissions required'
            },
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
                { '@type': 'ListItem', position: 2, name: 'Current Ratio Calculator', item: `${siteUrl}/current-ratio-calculator` }
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
            name: 'Current Ratio Calculator',
            description: 'A tool for calculating current ratio and analyzing business liquidity and short-term financial health',
            url: `${siteUrl}/current-ratio-calculator`,
            step: [
              {
                '@type': 'HowToStep',
                name: 'Enter Current Assets',
                text: 'Input your total current assets including cash, accounts receivable, inventory, and marketable securities'
              },
              {
                '@type': 'HowToStep',
                name: 'Set Current Liabilities',
                text: 'Enter your total current liabilities including accounts payable, short-term debt, and accrued expenses'
              },
              {
                '@type': 'HowToStep',
                name: 'Calculate Current Ratio',
                text: 'View your current ratio result and receive immediate liquidity assessment'
              },
              {
                '@type': 'HowToStep',
                name: 'Analyze Financial Health',
                text: 'Compare your ratio to industry benchmarks and identify improvement opportunities'
              }
            ],
            tool: ['Current assets calculator', 'Current liabilities tracker', 'Current ratio analyzer', 'Liquidity assessment tool'],
            about: {
              '@type': 'Thing',
              name: 'Business Liquidity Analysis'
            },
            audience: {
              '@type': 'Audience',
              audienceType: ['Business Owners', 'Financial Managers', 'CFOs', 'Lenders', 'Investors', 'Analysts']
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
                name: 'Is this current ratio calculator completely free to use?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes, our current ratio calculator is 100% free with no hidden costs, registration requirements, or usage limits. Business owners, financial professionals, and students can use it for unlimited liquidity analysis.'
                }
              },
              {
                '@type': 'Question',
                name: 'What is considered a good current ratio?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'A current ratio between 1.2 and 2.0 is generally considered healthy. Below 1.0 indicates potential liquidity issues, while above 2.0 may suggest inefficient asset utilization. Industry benchmarks vary significantly.'
                }
              },
              {
                '@type': 'Question',
                name: 'How does current ratio differ from quick ratio?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Current ratio includes all current assets (including inventory), while quick ratio excludes inventory and prepaid expenses, providing a more conservative measure of immediate liquidity.'
                }
              },
              {
                '@type': 'Question',
                name: 'Can a current ratio be too high?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes, a current ratio significantly above 2.0 may indicate excess idle assets that could be better deployed for growth or investment, potentially reducing overall business efficiency.'
                }
              },
              {
                '@type': 'Question',
                name: 'How often should I calculate my current ratio?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Calculate current ratio monthly for active monitoring, quarterly for strategic planning, and annually for comprehensive financial health assessment and external reporting purposes.'
                }
              },
              {
                '@type': 'Question',
                name: 'What are the main components of current assets?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Current assets typically include cash and cash equivalents, accounts receivable, inventory, marketable securities, and prepaid expenses that can be converted to cash within one year.'
                }
              },
              {
                '@type': 'Question',
                name: 'How do lenders use current ratio in credit decisions?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Lenders use current ratio to assess your ability to meet short-term obligations. A strong ratio improves creditworthiness, while a weak ratio may require additional collateral or higher interest rates.'
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
          <h1 className={styles.title}>Current Ratio Calculator</h1>
          <p className={styles.subtitle}>
            Calculate your business's current ratio to assess short-term liquidity and financial health.
          </p>
        </section>

        {/* Calculator Section */}
        <section>
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter your current assets and liabilities — we'll extract numbers from any format (e.g., $120K, 80k, 1.2 million).
              </p>

              {error && (
                <div className={styles.error}>{error}</div>
              )}

              <div className={styles.inputGroup}>
                <label htmlFor="currentAssets" className={styles.label}>
                  Current Assets ($)
                </label>
                <input
                  id="currentAssets"
                  type="text"
                  value={currentAssets}
                  onChange={(e) => setCurrentAssets(e.target.value)}
                  placeholder="e.g. $120,000 or 120K"
                  className={styles.input}
                />
                <small className={styles.note}>
                  Cash, accounts receivable, inventory, prepaid expenses — all convertible within a year.
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
                  placeholder="e.g. $80,000 or 80K"
                  className={styles.input}
                />
                <small className={styles.note}>
                  Accounts payable, short-term loans, accrued expenses, taxes due within 12 months.
                </small>
              </div>

              <button type="submit" className={styles.submitBtn}>
                <span className="taxpro-btn-label">Calculate Current Ratio</span>
                <span className="taxpro-btn-arrow">→</span>
              </button>
            </form>

            {result && (
              <div className={styles.resultSection}>
                <h3>Current Ratio Result</h3>
                <div className={styles.resultGrid}>
                  <div className={styles.resultItem}>
                    <strong>Current Assets:</strong> ${result.assets}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Current Liabilities:</strong> ${result.liabilities}
                  </div>
                  <div className={`${styles.resultItem} highlight ${result.isHealthy ? styles.positive : styles.negative}`}>
                    <strong>Current Ratio:</strong> {result.ratio}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Status:</strong> {result.isHealthy ? 'Healthy' : 'Needs Attention'}
                  </div>
                </div>
                <div className={styles.note}>
                  {result.isHealthy
                    ? `A ratio of ${result.ratio} indicates strong short-term financial health.`
                    : `A ratio below 1.2 or above 2.0 may signal liquidity risk or inefficient asset use.`
                  }
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h3>Why the Current Ratio Matters</h3>
            <p>
              The <strong>Current Ratio</strong> is a key liquidity metric that measures a company's ability to pay its short-term obligations using its short-term assets. It's one of the most widely used indicators of financial health by lenders, investors, and managers.
            </p>

            <h4>How to Use This Calculator</h4>
            <ul className={styles.list}>
              <li><strong>Current Assets:</strong> All assets expected to be converted to cash within one year.</li>
              <li><strong>Current Liabilities:</strong> Debts due within one year.</li>
              <li>Enter values freely — we extract numbers from any format (e.g., $120K, 80k, 1.2 million).</li>
              <li>Click "Calculate" to get your current ratio and liquidity assessment.</li>
            </ul>

            <h4>Formula Used</h4>
            <div className={styles.formula}>
              <code>Current Ratio = Current Assets ÷ Current Liabilities</code>
            </div>
            <p>
              <strong>Example:</strong> $120,000 in assets, $80,000 in liabilities →
              <br />
              Current Ratio = 120,000 / 80,000 = <strong>1.5</strong>
              <br />
              This means you have $1.50 in assets for every $1.00 of liabilities.
            </p>

            <h4>Interpreting the Results</h4>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Current Ratio</th>
                  <th>Interpretation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>less than 1.0</td>
                  <td>❌ Insufficient assets to cover debts — high risk of default</td>
                </tr>
                <tr>
                  <td>1.0 – 1.2</td>
                  <td>⚠️ Minimum acceptable — tight liquidity</td>
                </tr>
                <tr>
                  <td>1.2 – 2.0</td>
                  <td>✅ Healthy — good balance of liquidity and efficiency</td>
                </tr>
                <tr>
                  <td>greater than 2.0</td>
                  <td>⚠️ Excess assets — may indicate underutilized capital</td>
                </tr>
              </tbody>
            </table>

            <h4>Real-World Applications</h4>
            <ul className={styles.list}>
              <li><strong>Small Businesses:</strong> Ensure you can cover payroll, rent, and suppliers</li>
              <li><strong>Startups:</strong> Monitor financial runway and investor confidence</li>
              <li><strong>Lenders:</strong> Assess creditworthiness before approving loans</li>
              <li><strong>Investors:</strong> Compare liquidity across companies</li>
              <li><strong>Management:</strong> Track financial performance over time</li>
            </ul>

            <h4>Tips to Improve Your Current Ratio</h4>
            <ul className={styles.list}>
              <li>✅ <strong>Collect receivables faster</strong> — offer discounts for early payment</li>
              <li>✅ <strong>Reduce inventory levels</strong> — avoid overstocking</li>
              <li>✅ <strong>Refinance short-term debt</strong> into long-term loans</li>
              <li>✅ <strong>Delay non-essential purchases</strong> to preserve cash</li>
              <li>✅ <strong>Use a line of credit</strong> strategically to smooth cash flow</li>
            </ul>

            <h4>Related Metrics</h4>
            <p>
              The Current Ratio is part of a family of liquidity ratios:
            </p>
            <ul className={styles.list}>
              <li><strong>Quick Ratio (Acid-Test):</strong> Excludes inventory — stricter test</li>
              <li><strong>Cash Ratio:</strong> Only cash and marketable securities</li>
              <li><strong>Working Capital:</strong> Current Assets − Current Liabilities</li>
            </ul>
            <p>
              Use these together for a complete picture of short-term financial strength.
            </p>

            <h4>Industry Benchmarks</h4>
            <ul className={styles.list}>
              <li><strong>Retail:</strong> 1.4 – 2.0</li>
              <li><strong>Manufacturing:</strong> 1.3 – 1.8</li>
              <li><strong>Technology (SaaS):</strong> 2.0 – 3.0+</li>
              <li><strong>Restaurants:</strong> 1.0 – 1.5</li>
              <li><strong>Construction:</strong> 1.5 – 2.5</li>
            </ul>
            <p>
              Always compare your ratio to industry peers for meaningful insights.
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

export default CurrentRatioCalculator;