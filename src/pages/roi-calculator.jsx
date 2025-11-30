import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './roicalculator.module.css';

const ROICalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [initialInvestment, setInitialInvestment] = useState('');
  const [finalValue, setFinalValue] = useState('');
  const [timePeriod, setTimePeriod] = useState('1');
  const [result, setResult] = useState(null);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const investment = parseFloat(initialInvestment);
    const value = parseFloat(finalValue);
    const period = parseFloat(timePeriod);

    // Validation
    if (isNaN(investment) || isNaN(value) || isNaN(period)) {
      alert("Please enter valid numbers in all fields");
      return;
    }

    if (investment <= 0) {
      alert("Initial investment must be greater than zero.");
      return;
    }

    if (period < 0) {
      alert("Time period cannot be negative.");
      return;
    }

    // Calculations
    const netProfit = value - investment;
    const roi = ((netProfit / investment) * 100).toFixed(2);
    const annualizedRoi = period > 0
      ? ((Math.pow(1 + netProfit / investment, 1 / period) - 1) * 100).toFixed(2)
      : roi;

    setResult({
      initialInvestment: investment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      finalValue: value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      netProfit: netProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      roi,
      annualizedRoi,
      timePeriod: period,
      isProfitable: netProfit >= 0
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

  // SEO Metadata - Enhanced with comprehensive ROI keywords
  const siteUrl = 'https://www.financecalculatorfree.com';
  const pageTitle = 'Free ROI Calculator 2024 | Return on Investment Analysis Tool';
  const pageDescription = 'Calculate Return on Investment (ROI) for stocks, real estate, business, and marketing. Free ROI calculator with annualized returns and profit analysis.';

  // Comprehensive SEO Keywords Collections for ROI Calculator
  const singleKeywords = [
    'roi', 'calculator', 'return', 'investment', 'profit', 'loss', 'percentage', 
    'rate', 'yield', 'gain', 'performance', 'metric', 'analysis', 'evaluation', 
    'efficiency', 'effectiveness', 'profitability', 'measurement', 'comparison', 
    'benchmark', 'target', 'goal', 'threshold', 'hurdle', 'minimum', 'maximum', 
    'optimal', 'ideal', 'actual', 'expected', 'projected', 'historical', 
    'annualized', 'compounded', 'simple', 'total', 'net', 'gross', 'absolute', 
    'relative', 'risk', 'adjusted', 'weighted', 'average', 'median', 'peak', 
    'trough', 'volatility', 'variance', 'deviation', 'correlation', 'beta', 
    'alpha', 'sharpe', 'ratio', 'multiple', 'factor', 'driver', 'determinant'
  ];

  const twoWordKeywords = [
    'roi calculator', 'return on investment', 'investment return', 'profit calculator', 
    'investment calculator', 'roi analysis', 'roi calculation', 'roi formula', 
    'roi percentage', 'roi rate', 'roi yield', 'annualized roi', 'compounded roi', 
    'simple roi', 'total roi', 'net roi', 'gross roi', 'absolute roi', 
    'relative roi', 'risk adjusted roi', 'weighted roi', 'average roi', 
    'expected roi', 'projected roi', 'historical roi', 'target roi', 
    'minimum roi', 'maximum roi', 'optimal roi', 'ideal roi', 'actual roi', 
    'roi benchmark', 'roi comparison', 'roi metric', 'roi measurement', 
    'roi evaluation', 'roi efficiency', 'roi effectiveness', 'roi profitability', 
    'investment performance', 'portfolio return', 'asset return', 'stock return', 
    'bond return', 'real estate return', 'business return', 'marketing roi', 
    'campaign roi', 'advertising roi', 'digital roi', 'social media roi', 
    'email roi', 'seo roi', 'ppc roi', 'content roi', 'influencer roi', 
    'affiliate roi', 'sales roi', 'customer roi', 'employee roi', 'training roi', 
    'equipment roi', 'technology roi', 'software roi', 'saas roi', 'startup roi', 
    'venture roi', 'angel roi', 'private equity', 'hedge fund', 'mutual fund', 
    'etf return', 'index return', 'market return', 'sector return', 'industry return'
  ];

  const longTailKeywords = [
    'free online roi calculator for investment analysis',
    'how to calculate return on investment percentage',
    'roi calculator for real estate investment properties',
    'stock market roi calculator with dividends',
    'business investment roi calculator for startups',
    'marketing campaign roi calculator for digital ads',
    'annualized roi calculator for multiple years',
    'real estate rental property roi calculator with expenses',
    'stock portfolio roi calculator with multiple investments',
    'small business roi calculator for equipment purchase',
    'startup funding roi calculator for investors',
    'angel investment roi calculator for early stage',
    'venture capital roi calculator for tech startups',
    'private equity roi calculator for acquisitions',
    'mutual fund roi calculator with expense ratios',
    'etf investment roi calculator for index funds',
    'bond investment roi calculator with yield to maturity',
    'cd investment roi calculator certificate of deposit',
    'annuity roi calculator for retirement planning',
    'crypto investment roi calculator for bitcoin ethereum',
    'nft investment roi calculator for digital assets',
    'precious metals roi calculator gold silver',
    'commodities roi calculator oil gas agriculture',
    'forex trading roi calculator currency exchange',
    'options trading roi calculator calls puts',
    'futures trading roi calculator derivatives',
    'reit investment roi calculator real estate trusts',
    'crowdfunding roi calculator for real estate projects',
    'peer to peer lending roi calculator p2p investing',
    'royalty financing roi calculator for creative works',
    'franchise investment roi calculator for business owners',
    'business acquisition roi calculator for buying companies',
    'merger roi calculator for corporate combinations',
    'capital expenditure roi calculator for equipment',
    'technology investment roi calculator for software',
    'saas subscription roi calculator for business tools',
    'cloud computing roi calculator for infrastructure',
    'digital transformation roi calculator for modernization',
    'automation roi calculator for process improvement',
    'ai investment roi calculator for artificial intelligence',
    'machine learning roi calculator for data projects',
    'iot roi calculator for internet of things',
    'blockchain roi calculator for distributed ledger',
    'cybersecurity roi calculator for protection',
    'compliance roi calculator for regulatory requirements',
    'sustainability roi calculator for green initiatives',
    'esg investment roi calculator environmental social governance',
    'impact investment roi calculator for social good',
    'philanthropy roi calculator for charitable giving',
    'education roi calculator for college degrees',
    'training roi calculator for employee development',
    'certification roi calculator for professional credentials',
    'conference roi calculator for business events',
    'trade show roi calculator for exhibitions',
    'networking roi calculator for professional connections',
    'mentorship roi calculator for career development',
    'coaching roi calculator for personal growth',
    'consulting roi calculator for expert advice',
    'legal services roi calculator for law firms',
    'accounting roi calculator for financial services',
    'marketing agency roi calculator for campaigns',
    'pr agency roi calculator for public relations',
    'advertising roi calculator for media buys',
    'seo agency roi calculator for search optimization',
    'social media agency roi calculator for management',
    'content marketing roi calculator for creation',
    'email marketing roi calculator for campaigns',
    'influencer marketing roi calculator for partnerships',
    'affiliate marketing roi calculator for commissions',
    'referral program roi calculator for customer acquisition',
    'loyalty program roi calculator for retention',
    'customer lifetime value roi calculator for ltv',
    'acquisition cost roi calculator for cac',
    'conversion rate roi calculator for optimization',
    'lead generation roi calculator for marketing',
    'sales funnel roi calculator for conversion',
    'website redesign roi calculator for improvements',
    'mobile app roi calculator for development',
    'ecommerce roi calculator for online stores',
    'amazon fba roi calculator for sellers',
    'shopify store roi calculator for ecommerce',
    'dropshipping roi calculator for business',
    'print on demand roi calculator for products',
    'subscription box roi calculator for recurring',
    'membership site roi calculator for communities',
    'online course roi calculator for education',
    'digital product roi calculator for creators',
    'saas product roi calculator for software',
    'api roi calculator for integrations',
    'microservice roi calculator for architecture',
    'containerization roi calculator for docker',
    'serverless roi calculator for computing',
    'edge computing roi calculator for distribution',
    'quantum computing roi calculator for future',
    'ar vr roi calculator for augmented reality',
    'metaverse roi calculator for virtual worlds',
    'web3 roi calculator for decentralized internet',
    'dao roi calculator for decentralized organizations',
    'defi roi calculator for decentralized finance',
    'cefi roi calculator for centralized finance',
    'staking roi calculator for cryptocurrency',
    'mining roi calculator for blockchain',
    'liquidity provision roi calculator for defi',
    'yield farming roi calculator for crypto',
    'nft staking roi calculator for digital art',
    'play to earn roi calculator for gaming',
    'move to earn roi calculator for fitness',
    'learn to earn roi calculator for education',
    'create to earn roi calculator for content',
    'social to earn roi calculator for engagement'
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
        <meta name="subject" content="ROI Calculator & Investment Analysis" />
        <meta name="classification" content="Finance, Investment, Calculators, ROI Analysis" />
        <meta name="topic" content="Return on Investment Calculation and Analysis" />
        <meta name="summary" content="Free online ROI calculator for investment performance analysis" />
        <meta name="url" content={`${siteUrl}/roi-calculator`} />
        
        {/* Verification & Ownership */}
        <meta name="google-site-verification" content="your_verification_code" />
        <meta name="msvalidate.01" content="your_bing_verification" />
        
        {/* Location & Business */}
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="United States" />
        <meta name="geo.position" content="40.7128;-74.0060" />
        <meta name="ICBM" content="40.7128, -74.0060" />
        
        {/* Canonical */}
        <link rel="canonical" href={`${siteUrl}/roi-calculator`} />
        
        {/* Alternate Languages */}
        <link rel="alternate" href={`${siteUrl}/roi-calculator`} hrefLang="x-default" />
        <link rel="alternate" href={`${siteUrl}/roi-calculator`} hrefLang="en" />
        <link rel="alternate" href={`${siteUrl}/es/roi-calculator`} hrefLang="es" />
        
        {/* Preload & Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/roi-calculator`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={`${siteUrl}/images/roi-calculator-preview.jpg`} />
        <meta property="og:image:alt" content="ROI Calculator Interface for Investment Analysis" />
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
        <meta name="twitter:image" content={`${siteUrl}/images/roi-calculator-preview.jpg`} />
        <meta name="twitter:image:alt" content="Free ROI Calculator for Investment Analysis" />
        
        {/* Additional Social */}
        <meta name="pinterest" content="nopin" description="Free ROI calculator for investment analysis" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: pageTitle,
            description: pageDescription,
            url: `${siteUrl}/roi-calculator`,
            mainEntity: {
              '@type': 'SoftwareApplication',
              name: 'ROI Calculator',
              applicationCategory: 'FinanceApplication',
              operatingSystem: 'Any',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD'
              },
              description: 'Free online ROI calculator for calculating return on investment, annualized returns, and profit analysis across all investment types.',
              featureList: [
                'ROI percentage calculation',
                'Annualized return analysis',
                'Multiple investment type support',
                'Profit/loss visualization',
                'Industry benchmark comparisons'
              ],
              processorRequirements: 'Web browser',
              permission: 'No special permissions required'
            },
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
                { '@type': 'ListItem', position: 2, name: 'ROI Calculator', item: `${siteUrl}/roi-calculator` }
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
            name: 'ROI Calculator',
            description: 'A tool for calculating return on investment and analyzing investment performance',
            url: `${siteUrl}/roi-calculator`,
            step: [
              {
                '@type': 'HowToStep',
                name: 'Enter Initial Investment',
                text: 'Input your total initial investment amount including all costs and fees'
              },
              {
                '@type': 'HowToStep',
                name: 'Set Final Value',
                text: 'Enter the current or final value of your investment including returns'
              },
              {
                '@type': 'HowToStep',
                name: 'Choose Time Period',
                text: 'Select the investment duration in years for annualized ROI calculation'
              },
              {
                '@type': 'HowToStep',
                name: 'Calculate ROI',
                text: 'View your total ROI percentage, annualized returns, and profit analysis'
              }
            ],
            tool: ['Investment calculator', 'ROI analyzer', 'Profit calculator', 'Performance tracker'],
            about: {
              '@type': 'Thing',
              name: 'Investment Performance Analysis'
            },
            audience: {
              '@type': 'Audience',
              audienceType: ['Investors', 'Business Owners', 'Financial Analysts', 'Fund Managers', 'Individual Traders']
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
                name: 'Is this ROI calculator completely free to use?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes, our ROI calculator is 100% free with no hidden costs, registration requirements, or usage limits. You can analyze as many investments as needed.'
                }
              },
              {
                '@type': 'Question',
                name: 'What is the difference between ROI and annualized ROI?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'ROI shows total return over the entire investment period, while annualized ROI calculates the average yearly return, making it easier to compare investments of different durations.'
                }
              },
              {
                '@type': 'Question',
                name: 'Can I use this calculator for marketing campaign ROI?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Absolutely! For marketing ROI, use campaign cost as initial investment and revenue generated as final value to calculate your marketing return on investment.'
                }
              },
              {
                '@type': 'Question',
                name: 'What is considered a good ROI percentage?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'A good ROI varies by investment type: Stocks 7-10%, Real Estate 8-12%, Marketing 500%+ (5:1 ratio). Always compare to industry benchmarks and alternative investments.'
                }
              },
              {
                '@type': 'Question',
                name: 'Does the calculator account for inflation and fees?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'This calculator provides nominal ROI. For real returns, subtract inflation from your results. Include all fees and costs in your initial investment for accurate calculations.'
                }
              },
              {
                '@type': 'Question',
                name: 'Can I calculate ROI for multiple investments?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'While this calculator analyzes individual investments, you can use it sequentially for multiple investments and compare results to build your portfolio analysis.'
                }
              },
              {
                '@type': 'Question',
                name: 'What ROI should I target for my business investments?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Business investments typically target 15-25% ROI depending on risk. Consider your cost of capital, industry standards, and strategic importance when setting ROI targets.'
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
          <h1 className={styles.title}>ROI Calculator</h1>
          <p className={styles.subtitle}>
            Calculate Return on Investment to measure the profitability of your investments and business decisions.
          </p>
        </section>

        {/* Calculator Section */}
        <section>
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter your investment details to calculate ROI.
              </p>

              <div className={styles.inputGroup}>
                <label htmlFor="initialInvestment" className={styles.label}>
                  Initial Investment ($)
                </label>
                <input
                  id="initialInvestment"
                  type="number"
                  value={initialInvestment}
                  onChange={(e) => setInitialInvestment(e.target.value)}
                  placeholder="e.g. 10000.00"
                  className={styles.input}
                  min="0.01"
                  step="0.01"
                  required
                />
                <small className={styles.note}>
                  Amount initially invested
                </small>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="finalValue" className={styles.label}>
                  Final Value ($)
                </label>
                <input
                  id="finalValue"
                  type="number"
                  value={finalValue}
                  onChange={(e) => setFinalValue(e.target.value)}
                  placeholder="e.g. 15000.00"
                  className={styles.input}
                  min="0"
                  step="0.01"
                  required
                />
                <small className={styles.note}>
                  Current or final value of investment
                </small>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="timePeriod" className={styles.label}>
                  Time Period (Years)
                </label>
                <input
                  id="timePeriod"
                  type="number"
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(e.target.value)}
                  placeholder="e.g. 3"
                  className={styles.input}
                  min="0.1"
                  step="0.1"
                  required
                />
                <small className={styles.note}>
                  Duration of investment in years
                </small>
              </div>

              <button type="submit" className={styles.submitBtn}>
                <span className="taxpro-btn-label">Calculate ROI</span>
                <span className="taxpro-btn-arrow">→</span>
              </button>
            </form>

            {result && (
              <div className={styles.resultSection}>
                <h3>Investment Analysis</h3>
                <div className={styles.resultGrid}>
                  <div className={styles.resultItem}>
                    <strong>Initial Investment:</strong> ${result.initialInvestment}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Final Value:</strong> ${result.finalValue}
                  </div>
                  <div className={`${styles.resultItem} ${result.isProfitable ? styles.highlight : styles.warning}`}>
                    <strong>Net Profit/Loss:</strong> ${result.netProfit}
                  </div>
                  <div className={`${styles.resultItem} ${result.isProfitable ? styles.highlight : styles.warning}`}>
                    <strong>ROI:</strong> {result.roi}%
                  </div>
                  {result.timePeriod > 1 && (
                    <div className={`${styles.resultItem} ${result.isProfitable ? styles.highlight : styles.warning}`}>
                      <strong>Annualized ROI:</strong> {result.annualizedRoi}%
                    </div>
                  )}
                  <div className={styles.resultItem}>
                    <strong>Time Period:</strong> {result.timePeriod} year{result.timePeriod !== 1 ? 's' : ''}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Status:</strong>{' '}
                    <span className={result.isProfitable ? styles.textSuccess : styles.textDanger}>
                      {result.isProfitable ? 'Profitable' : 'Not Profitable'}
                    </span>
                  </div>
                </div>
                <div className={styles.note}>
                  Your investment returned <strong>{result.roi}%</strong> overall
                  {result.timePeriod > 1 ? `, with an annualized return of ${result.annualizedRoi}%` : ''}.
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h3>Why ROI Matters</h3>
            <p>
              <strong>Return on Investment (ROI)</strong> is the most important metric for evaluating the efficiency of an investment. It compares the magnitude and timing of gains to the investment cost, helping you <strong>compare investments, justify decisions, and allocate resources effectively</strong>.
            </p>

            <h4>How to Use This Calculator</h4>
            <ul className={styles.list}>
              <li><strong>Initial Investment:</strong> Total amount invested (purchase price + any additional costs)</li>
              <li><strong>Final Value:</strong> Current value or sale price of investment</li>
              <li><strong>Time Period:</strong> Duration of investment in years (for annualized ROI)</li>
              <li>Click "Calculate ROI" to see your return percentage and profit/loss</li>
            </ul>

            <h4>Formulas Used</h4>
            <div className={styles.formula}>
              <code>ROI = ((Final Value - Initial Investment) ÷ Initial Investment) × 100</code>
            </div>
            <div className={styles.formula}>
              <code>Annualized ROI = ((1 + ROI)<sup>1/Years</sup> - 1) × 100</code>
            </div>
            <p>
              <strong>Example:</strong> $10,000 investment grows to $15,000 in 3 years
              <br />
              ROI = (($15,000 - $10,000) ÷ $10,000) × 100 = <strong>50%</strong>
              <br />
              Annualized ROI = ((1 + 0.5)<sup>1/3</sup> - 1) × 100 = <strong>14.47%</strong>
            </p>

            <h4>Interpreting ROI Results</h4>
            <ul className={styles.list}>
              <li><strong>Positive ROI:</strong> Investment generated profit</li>
              <li><strong>Negative ROI:</strong> Investment resulted in loss</li>
              <li><strong>0% ROI:</strong> Broke even (no profit or loss)</li>
              <li><strong>Higher ROI:</strong> More efficient use of capital</li>
              <li>Compare ROI to alternative investments and industry benchmarks</li>
            </ul>

            <h4>Industry Benchmarks (Average ROI)</h4>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Investment Type</th>
                  <th>Average Annual ROI</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>S&P 500 (Stocks)</td>
                  <td>7-10%</td>
                </tr>
                <tr>
                  <td>Real Estate</td>
                  <td>8-12%</td>
                </tr>
                <tr>
                  <td>Startup Investments</td>
                  <td>25%+ (high risk)</td>
                </tr>
                <tr>
                  <td>Bonds</td>
                  <td>2-5%</td>
                </tr>
                <tr>
                  <td>Marketing Campaigns</td>
                  <td>5:1 ratio (500%)</td>
                </tr>
              </tbody>
            </table>

            <h4>Tips to Improve ROI</h4>
            <ul className={styles.list}>
              <li>✅ <strong>Reduce investment costs</strong> — negotiate better terms</li>
              <li>✅ <strong>Increase returns</strong> — optimize performance</li>
              <li>✅ <strong>Shorten payback period</strong> — faster returns improve annualized ROI</li>
              <li>✅ <strong>Diversify</strong> — balance high and low risk investments</li>
              <li>✅ <strong>Monitor regularly</strong> — adjust strategy as needed</li>
            </ul>

            <h4>Advanced ROI Considerations</h4>
            <p>
              For more sophisticated analysis:
            </p>
            <ul className={styles.list}>
              <li><strong>Risk-Adjusted ROI:</strong> ROI ÷ Investment Risk</li>
              <li><strong>ROI with Time Value:</strong> Discounted cash flow analysis</li>
              <li><strong>Social ROI:</strong> Measuring non-financial benefits</li>
              <li><strong>Marketing ROI:</strong> (Sales Growth - Marketing Cost) ÷ Marketing Cost</li>
              <li><strong>ROI vs. ROE:</strong> Return on Equity considers leverage</li>
            </ul>
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

export default ROICalculator;