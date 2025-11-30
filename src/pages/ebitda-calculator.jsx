import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './ebitdacalculator.module.css';

const EbitdaCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [revenue, setRevenue] = useState('');
  const [cogs, setCogs] = useState('');
  const [opex, setOpex] = useState('');
  const [result, setResult] = useState(null);

  // Enhanced number parsing: handles $, commas, k, M, etc.
  const parseCurrency = (input) => {
    if (!input || typeof input !== 'string') return NaN;

    // Convert k, M, B shortcuts
    const lower = input.toLowerCase();
    let multiplier = 1;
    if (lower.includes('k')) multiplier = 1e3;
    else if (lower.includes('m')) multiplier = 1e6;
    else if (lower.includes('b')) multiplier = 1e9;

    // Remove all non-digit or decimal characters except minus at start
    const cleaned = input.replace(/[^0-9.-]+/g, '');
    const num = parseFloat(cleaned);

    // Return NaN if invalid, otherwise apply multiplier
    return isNaN(num) ? NaN : num * multiplier;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const rev = parseCurrency(revenue);
    const cost = parseCurrency(cogs);
    const expenses = parseCurrency(opex);

    // If any value is NaN, treat as 0 (still compute)
    const safeRev = isNaN(rev) ? 0 : rev;
    const safeCost = isNaN(cost) ? 0 : cost;
    const safeExpenses = isNaN(expenses) ? 0 : expenses;

    const grossProfit = safeRev - safeCost;
    const ebitda = grossProfit - safeExpenses;
    const margin = safeRev > 0 ? ((ebitda / safeRev) * 100).toFixed(2) : 0;

    setResult({
      revenue: safeRev.toLocaleString(),
      grossProfit: grossProfit.toLocaleString(),
      ebitda: ebitda.toLocaleString(),
      margin,
      positive: ebitda >= 0,
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

  // SEO Metadata - Enhanced with comprehensive EBITDA keywords
  const siteUrl = 'https://www.financecalculatorfree.com';
  const pageTitle = 'Free EBITDA Calculator 2024 | Earnings Before Interest Taxes Depreciation Amortization';
  const pageDescription = 'Calculate EBITDA and EBITDA margin to measure business operational profitability. Free EBITDA calculator for investors, startups, and financial analysis.';

  // Comprehensive SEO Keywords Collections for EBITDA Calculator
  const singleKeywords = [
    'ebitda', 'calculator', 'earnings', 'profitability', 'operational', 'financial', 
    'metrics', 'analysis', 'valuation', 'multiple', 'margin', 'ratio', 'performance', 
    'efficiency', 'profit', 'loss', 'revenue', 'income', 'expenses', 'costs', 
    'cogs', 'operating', 'depreciation', 'amortization', 'interest', 'taxes', 
    'business', 'corporate', 'enterprise', 'company', 'firm', 'organization', 
    'startup', 'sme', 'public', 'private', 'listed', 'traded', 'quarterly', 
    'annual', 'fiscal', 'reporting', 'statement', 'income', 'operations', 
    'cashflow', 'balance', 'sheet', 'equity', 'debt', 'leverage', 'coverage', 
    'service', 'multiples', 'comparables', 'benchmarks', 'industry', 'sector', 
    'peers', 'competitors', 'acquisition', 'merger', 'm&a', 'due', 'diligence',
    'investment', 'investor', 'lender', 'banker', 'analyst', 'advisor', 'consultant'
  ];

  const twoWordKeywords = [
    'ebitda calculator', 'earnings before interest', 'operating profitability', 
    'financial metrics', 'business valuation', 'valuation multiples', 
    'ebitda margin', 'profitability analysis', 'operational efficiency', 
    'financial performance', 'business health', 'company valuation', 
    'enterprise value', 'equity value', 'debt capacity', 'leverage ratio', 
    'coverage ratio', 'interest coverage', 'debt service', 'cash flow', 
    'operating cash', 'free cash', 'capital structure', 'financial structure', 
    'income statement', 'profit loss', 'revenue growth', 'cost management', 
    'expense control', 'operating leverage', 'financial leverage', 
    'return investment', 'return equity', 'return assets', 'return capital', 
    'gross margin', 'operating margin', 'net margin', 'profit margin', 
    'contribution margin', 'break even', 'fixed costs', 'variable costs', 
    'direct costs', 'indirect costs', 'overhead costs', 'administrative costs', 
    'selling costs', 'marketing costs', 'research development', 'r&d costs', 
    'capital expenditures', 'capex planning', 'depreciation schedule', 
    'amortization schedule', 'tax planning', 'tax strategy', 'tax efficiency', 
    'financial modeling', 'business modeling', 'forecast model', 
    'projection model', 'scenario analysis', 'sensitivity analysis', 
    'what if analysis', 'financial planning', 'business planning', 
    'strategic planning', 'operational planning', 'budget planning', 
    'performance measurement', 'kpi tracking', 'metric monitoring', 
    'dashboard reporting', 'executive reporting', 'board reporting', 
    'investor reporting', 'lender reporting', 'regulatory reporting', 
    'compliance reporting', 'audit preparation', 'due diligence', 
    'acquisition analysis', 'merger analysis', 'investment analysis', 
    'credit analysis', 'risk analysis', 'opportunity analysis'
  ];

  const longTailKeywords = [
    'free online ebitda calculator for business valuation',
    'how to calculate ebitda from income statement',
    'ebitda calculator for startup companies and investors',
    'ebitda margin calculator for profitability analysis',
    'enterprise value ebitda multiple calculator valuation',
    'small business ebitda calculator for bank loans',
    'saas company ebitda calculator for subscription business',
    'manufacturing ebitda calculator with depreciation',
    'retail store ebitda calculator for brick and mortar',
    'restaurant ebitda calculator for food service industry',
    'healthcare ebitda calculator for medical practices',
    'real estate ebitda calculator for property management',
    'construction ebitda calculator for contractors',
    'technology ebitda calculator for software companies',
    'ecommerce ebitda calculator for online stores',
    'franchise ebitda calculator for business owners',
    'nonprofit ebitda calculator for charitable organizations',
    'public company ebitda calculator for stock analysis',
    'private company ebitda calculator for business sale',
    'merger acquisition ebitda calculator for m&a deals',
    'due diligence ebitda calculator for investment analysis',
    'bank loan ebitda calculator for debt financing',
    'venture capital ebitda calculator for startup funding',
    'private equity ebitda calculator for portfolio companies',
    'angel investor ebitda calculator for early stage',
    'business broker ebitda calculator for company valuation',
    'cpa ebitda calculator for accounting professionals',
    'cfa ebitda calculator for financial analysts',
    'mba ebitda calculator for business students',
    'entrepreneur ebitda calculator for business planning',
    'ceo ebitda calculator for executive management',
    'cfo ebitda calculator for financial leadership',
    'controller ebitda calculator for accounting management',
    'financial advisor ebitda calculator for client consulting',
    'investment banker ebitda calculator for deal making',
    'commercial lender ebitda calculator for credit decisions',
    'business appraiser ebitda calculator for valuation reports',
    'forensic accountant ebitda calculator for litigation support',
    'turnaround consultant ebitda calculator for restructuring',
    'management consultant ebitda calculator for strategy',
    'operational consultant ebitda calculator for efficiency',
    'financial consultant ebitda calculator for planning',
    'tax consultant ebitda calculator for optimization',
    'audit partner ebitda calculator for financial review',
    'board member ebitda calculator for governance',
    'shareholder ebitda calculator for investment decisions',
    'creditor ebitda calculator for risk assessment',
    'regulator ebitda calculator for compliance review',
    'academic ebitda calculator for research studies',
    'student ebitda calculator for finance education',
    'professor ebitda calculator for teaching finance',
    'trainer ebitda calculator for corporate training',
    'author ebitda calculator for financial writing',
    'journalist ebitda calculator for business reporting',
    'analyst ebitda calculator for equity research',
    'trader ebitda calculator for investment decisions',
    'portfolio manager ebitda calculator for asset management',
    'hedge fund ebitda calculator for alternative investments',
    'mutual fund ebitda calculator for retail investors',
    'pension fund ebitda calculator for institutional investors',
    'sovereign wealth ebitda calculator for government investing',
    'family office ebitda calculator for wealth management',
    'endowment ebitda calculator for nonprofit investing',
    'foundation ebitda calculator for philanthropic investing',
    'trust ebitda calculator for estate planning',
    'retirement plan ebitda calculator for pension analysis',
    'insurance company ebitda calculator for risk assessment',
    'reinsurance ebitda calculator for catastrophic risk',
    'bank holding ebitda calculator for financial institutions',
    'credit union ebitda calculator for member organizations',
    'fintech ebitda calculator for financial technology',
    'blockchain ebitda calculator for cryptocurrency',
    'crypto ebitda calculator for digital assets',
    'nft ebitda calculator for digital collectibles',
    'metaverse ebitda calculator for virtual worlds',
    'ai ebitda calculator for artificial intelligence',
    'machine learning ebitda calculator for data science',
    'iot ebitda calculator for internet of things',
    'cloud computing ebitda calculator for infrastructure',
    'saas ebitda calculator for software service',
    'paas ebitda calculator for platform service',
    'iaas ebitda calculator for infrastructure service',
    'biotech ebitda calculator for life sciences',
    'pharmaceutical ebitda calculator for drug development',
    'medical device ebitda calculator for healthcare technology',
    'telecom ebitda calculator for communications',
    'media ebitda calculator for entertainment',
    'publishing ebitda calculator for content creation',
    'advertising ebitda calculator for marketing',
    'pr ebitda calculator for public relations',
    'consulting ebitda calculator for professional services',
    'legal ebitda calculator for law firms',
    'accounting ebitda calculator for cpa firms',
    'architecture ebitda calculator for design firms',
    'engineering ebitda calculator for technical services',
    'construction ebitda calculator for building projects',
    'mining ebitda calculator for natural resources',
    'oil gas ebitda calculator for energy sector',
    'renewable energy ebitda calculator for sustainability',
    'utilities ebitda calculator for public services',
    'transportation ebitda calculator for logistics',
    'shipping ebitda calculator for freight',
    'aviation ebitda calculator for airlines',
    'railroad ebitda calculator for rail transport',
    'trucking ebitda calculator for road transport',
    'maritime ebitda calculator for shipping',
    'tourism ebitda calculator for travel industry',
    'hospitality ebitda calculator for hotels',
    'gaming ebitda calculator for casinos',
    'sports ebitda calculator for teams leagues',
    'fitness ebitda calculator for health clubs',
    'education ebitda calculator for schools universities',
    'training ebitda calculator for professional development',
    'coaching ebitda calculator for personal development',
    'mentoring ebitda calculator for career guidance',
    'recruiting ebitda calculator for staffing agencies',
    'outsourcing ebitda calculator for business process',
    'franchising ebitda calculator for brand expansion',
    'licensing ebitda calculator for intellectual property',
    'royalty ebitda calculator for creative works'
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
        <meta name="subject" content="EBITDA Calculator & Business Valuation" />
        <meta name="classification" content="Finance, Investment, Valuation, Calculators, EBITDA Analysis" />
        <meta name="topic" content="EBITDA Calculation and Business Profitability Analysis" />
        <meta name="summary" content="Free online EBITDA calculator for business valuation and profitability analysis" />
        <meta name="url" content={`${siteUrl}/ebitda-calculator`} />
        
        {/* Verification & Ownership */}
        <meta name="google-site-verification" content="your_verification_code" />
        <meta name="msvalidate.01" content="your_bing_verification" />
        
        {/* Location & Business */}
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="United States" />
        <meta name="geo.position" content="40.7128;-74.0060" />
        <meta name="ICBM" content="40.7128, -74.0060" />
        
        {/* Canonical */}
        <link rel="canonical" href={`${siteUrl}/ebitda-calculator`} />
        
        {/* Alternate Languages */}
        <link rel="alternate" href={`${siteUrl}/ebitda-calculator`} hrefLang="x-default" />
        <link rel="alternate" href={`${siteUrl}/ebitda-calculator`} hrefLang="en" />
        <link rel="alternate" href={`${siteUrl}/es/ebitda-calculator`} hrefLang="es" />
        
        {/* Preload & Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/ebitda-calculator`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={`${siteUrl}/images/ebitda-calculator-preview.jpg`} />
        <meta property="og:image:alt" content="EBITDA Calculator Interface for Business Valuation" />
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
        <meta name="twitter:image" content={`${siteUrl}/images/ebitda-calculator-preview.jpg`} />
        <meta name="twitter:image:alt" content="Free EBITDA Calculator for Business Analysis" />
        
        {/* Additional Social */}
        <meta name="pinterest" content="nopin" description="Free EBITDA calculator for business valuation" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: pageTitle,
            description: pageDescription,
            url: `${siteUrl}/ebitda-calculator`,
            mainEntity: {
              '@type': 'SoftwareApplication',
              name: 'EBITDA Calculator',
              applicationCategory: 'FinanceApplication',
              operatingSystem: 'Any',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD'
              },
              description: 'Free online EBITDA calculator for calculating earnings before interest, taxes, depreciation, and amortization for business valuation and profitability analysis.',
              featureList: [
                'EBITDA calculation',
                'EBITDA margin analysis',
                'Multiple industry support',
                'Valuation multiple estimation',
                'Operational efficiency measurement'
              ],
              processorRequirements: 'Web browser',
              permission: 'No special permissions required'
            },
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
                { '@type': 'ListItem', position: 2, name: 'EBITDA Calculator', item: `${siteUrl}/ebitda-calculator` }
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
            name: 'EBITDA Calculator',
            description: 'A tool for calculating EBITDA and analyzing business operational profitability',
            url: `${siteUrl}/ebitda-calculator`,
            step: [
              {
                '@type': 'HowToStep',
                name: 'Enter Revenue and COGS',
                text: 'Input your total revenue and cost of goods sold to calculate gross profit'
              },
              {
                '@type': 'HowToStep',
                name: 'Set Operating Expenses',
                text: 'Enter your operating expenses excluding interest, taxes, depreciation, and amortization'
              },
              {
                '@type': 'HowToStep',
                name: 'Calculate EBITDA',
                text: 'View your EBITDA amount and margin percentage for operational analysis'
              },
              {
                '@type': 'HowToStep',
                name: 'Analyze Results',
                text: 'Compare your EBITDA margin to industry benchmarks and track operational efficiency'
              }
            ],
            tool: ['Revenue calculator', 'COGS tracker', 'Operating expense analyzer', 'EBITDA margin calculator'],
            about: {
              '@type': 'Thing',
              name: 'Business Operational Profitability Analysis'
            },
            audience: {
              '@type': 'Audience',
              audienceType: ['Investors', 'Business Owners', 'Financial Analysts', 'CFOs', 'Investment Bankers']
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
                name: 'Is this EBITDA calculator completely free to use?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes, our EBITDA calculator is 100% free with no hidden costs, registration requirements, or usage limits. Investors, business owners, and analysts can use it for unlimited financial analysis.'
                }
              },
              {
                '@type': 'Question',
                name: 'What is the difference between EBITDA and net income?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'EBITDA shows operational profitability before financing and accounting decisions, while net income includes interest, taxes, depreciation, and amortization, providing the bottom-line profit.'
                }
              },
              {
                '@type': 'Question',
                name: 'How is EBITDA used in business valuation?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'EBITDA is used to calculate valuation multiples (Enterprise Value/EBITDA) that help compare companies across industries and determine fair market value for acquisitions and investments.'
                }
              },
              {
                '@type': 'Question',
                name: 'What is a good EBITDA margin for my industry?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'EBITDA margins vary by industry: Software 60-80%, Retail 5-10%, Manufacturing 15-25%, Healthcare 20-35%. Compare your margin to industry peers for accurate assessment.'
                }
              },
              {
                '@type': 'Question',
                name: 'Can startups use EBITDA for investor presentations?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes, startups often use EBITDA to show operational efficiency to investors, especially when they have significant depreciation from equipment or amortization from acquisitions.'
                }
              },
              {
                '@type': 'Question',
                name: 'What are the limitations of using EBITDA?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'EBITDA ignores capital expenditures, working capital needs, debt service requirements, and tax obligations. It should be used alongside other financial metrics for comprehensive analysis.'
                }
              },
              {
                '@type': 'Question',
                name: 'How often should I calculate EBITDA for my business?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Calculate EBITDA quarterly to track operational performance trends and annually for strategic planning and valuation purposes. Regular monitoring helps identify efficiency opportunities.'
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
          <h1 className={styles.title}>EBITDA Calculator</h1>
          <p className={styles.subtitle}>
            Calculate Earnings Before Interest, Taxes, Depreciation, and Amortization to assess business profitability.
          </p>
        </section>

        {/* Calculator Section */}
        <section>
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter your total revenue, cost of goods sold (COGS), and operating expenses.
                You can use formats like $1.2M, 500k, 1,200,000, etc.
              </p>

              <div className={styles.inputGroup}>
                <label htmlFor="revenue" className={styles.label}>
                  Total Revenue ($)
                </label>
                <input
                  id="revenue"
                  type="text"
                  value={revenue}
                  onChange={(e) => setRevenue(e.target.value)}
                  placeholder="e.g. 1,200,000 or $1.2M"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="cogs" className={styles.label}>
                  Cost of Goods Sold (COGS) ($)
                </label>
                <input
                  id="cogs"
                  type="text"
                  value={cogs}
                  onChange={(e) => setCogs(e.target.value)}
                  placeholder="e.g. 450,000 or $450k"
                  className={styles.input}
                />
                <small className={styles.note}>
                  Direct costs of producing goods or services (materials, labor, manufacturing).
                </small>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="opex" className={styles.label}>
                  Operating Expenses ($)
                </label>
                <input
                  id="opex"
                  type="text"
                  value={opex}
                  onChange={(e) => setOpex(e.target.value)}
                  placeholder="e.g. 300,000"
                  className={styles.input}
                />
                <small className={styles.note}>
                  Rent, salaries, marketing, utilities, admin — excluding interest, taxes, depreciation.
                </small>
              </div>

              <button type="submit" className={styles.submitBtn}>
                <span className="taxpro-btn-label">Calculate EBITDA</span>
                <span className="taxpro-btn-arrow">→</span>
              </button>
            </form>

            {result && (
              <div className={styles.resultSection}>
                <h3>EBITDA Results</h3>
                <div className={styles.resultGrid}>
                  <div className={styles.resultItem}>
                    <strong>Revenue:</strong> ${result.revenue}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Gross Profit:</strong> ${result.grossProfit}
                  </div>
                  <div className={`${styles.resultItem} ${styles.highlight} ${result.positive ? styles.positive : styles.negative}`}>
                    <strong>EBITDA:</strong> ${result.ebitda}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Margin:</strong> {result.margin}%
                  </div>
                </div>
                <div className={styles.note}>
                  {result.positive
                    ? `Your business generated $${result.ebitda} in EBITDA. This measures core operational profitability.`
                    : `Negative EBITDA suggests operational losses. Review costs or revenue strategy.`
                  }
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h3>Why EBITDA Matters</h3>
            <p>
              <strong>EBITDA (Earnings Before Interest, Taxes, Depreciation, and Amortization)</strong> is a key metric used to evaluate a company’s <strong>operating performance and profitability</strong>, independent of financing, accounting, or tax decisions. It’s widely used by investors, lenders, and executives.
            </p>

            <h4>How to Use This Calculator</h4>
            <ul className={styles.list}>
              <li><strong>Revenue:</strong> Total sales or service income.</li>
              <li><strong>COGS:</strong> Direct production costs (inventory, raw materials, direct labor).</li>
              <li><strong>Operating Expenses:</strong> Overhead (salaries, rent, marketing, admin).</li>
              <li>Click “Calculate EBITDA” to see profit before non-operating factors.</li>
            </ul>

            <h4>Formula Used</h4>
            <div className={styles.formula}>
              <code>EBITDA = Revenue − COGS − Operating Expenses</code>
            </div>
            <div className={styles.formula}>
              <code>EBITDA Margin = (EBITDA ÷ Revenue) × 100</code>
            </div>
            <p>
              <strong>Example:</strong> $1.2M revenue, $450K COGS, $300K opex →
              <br />
              EBITDA = 1,200,000 − 450,000 − 300,000 = <strong>$450,000</strong>
              <br />
              Margin = (450,000 / 1,200,000) × 100 = <strong>37.5%</strong>
            </p>

            <h4>Real-World Applications</h4>
            <ul className={styles.list}>
              <li><strong>Investors:</strong> Compare company profitability across industries</li>
              <li><strong>Startups:</strong> Show operational efficiency to attract funding</li>
              <li><strong>M&A:</strong> Used in valuation multiples (e.g., 8x EBITDA)</li>
              <li><strong>Lenders:</strong> Assess ability to service debt</li>
              <li><strong>Management:</strong> Track operational efficiency over time</li>
            </ul>

            <h4>Industry Benchmarks (EBITDA Margin)</h4>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Industry</th>
                  <th>Typical EBITDA Margin</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Software (SaaS)</td>
                  <td>60% – 80%</td>
                </tr>
                <tr>
                  <td>Retail</td>
                  <td>5% – 10%</td>
                </tr>
                <tr>
                  <td>Restaurants</td>
                  <td>10% – 15%</td>
                </tr>
                <tr>
                  <td>Manufacturing</td>
                  <td>15% – 25%</td>
                </tr>
                <tr>
                  <td>Healthcare Services</td>
                  <td>20% – 35%</td>
                </tr>
              </tbody>
            </table>

            <h4>Tips to Improve EBITDA</h4>
            <ul className={styles.list}>
              <li>✅ <strong>Increase pricing</strong> without losing volume</li>
              <li>✅ <strong>Negotiate lower COGS</strong> (bulk discounts, better suppliers)</li>
              <li>✅ <strong>Reduce overhead</strong> (remote work, automation)</li>
              <li>✅ <strong>Scale efficiently</strong> — grow revenue faster than expenses</li>
              <li>✅ <strong>Outsource non-core functions</strong> (HR, IT, accounting)</li>
            </ul>

            <h4>Limitations of EBITDA</h4>
            <p>
              While useful, EBITDA has limitations:
            </p>
            <ul className={styles.list}>
              <li>❌ Ignores <strong>debt and interest</strong> payments</li>
              <li>❌ Excludes <strong>tax burden</strong></li>
              <li>❌ Doesn’t account for <strong>capital expenditures</strong> (CapEx)</li>
              <li>❌ Can be <strong>misleading</strong> if used alone (e.g., hides high depreciation)</li>
            </ul>
            <p>
              Always use EBITDA alongside <strong>net income, cash flow, and CapEx</strong> for a full picture.
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

export default EbitdaCalculator;