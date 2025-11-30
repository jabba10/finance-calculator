import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './breakevencalculator.module.css';

const BreakEvenCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state — allow any string input
  const [fixedCosts, setFixedCosts] = useState('');
  const [variableCosts, setVariableCosts] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [result, setResult] = useState(null);

  // Helper: Extract first valid number from string
  const parseNumber = (input) => {
    if (!input) return NaN;
    const match = input.toString().replace(/,/g, '').match(/-?\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : NaN;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const fixed = parseNumber(fixedCosts);
    const variable = parseNumber(variableCosts);
    const price = parseNumber(pricePerUnit);

    if (isNaN(fixed) || isNaN(variable) || isNaN(price)) {
      alert("Please enter valid numbers in all fields.");
      return;
    }

    if (fixed < 0 || variable < 0 || price <= 0) {
      alert("Fixed costs and variable cost must be non-negative. Price per unit must be positive.");
      return;
    }

    if (price <= variable) {
      alert("Price per unit must be greater than variable cost per unit to break even.");
      return;
    }

    const breakEvenUnits = Math.ceil(fixed / (price - variable));
    const breakEvenRevenue = (breakEvenUnits * price).toFixed(2);

    setResult({
      fixedCosts: fixed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      variableCosts: variable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      pricePerUnit: price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      breakEvenUnits: breakEvenUnits.toLocaleString(),
      breakEvenRevenue,
      contributionMargin: ((price - variable) / price * 100).toFixed(1)
    });
  };

  // Magnetic effect on CTA
  const handleMouseMove = (e) => {
    if (!ctaButtonRef.current) return;
    const el = ctaButtonRef.current;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--x', `${x}px`);
    el.style.setProperty('--y', `${y}px`);
  };

  // SEO Metadata - Enhanced with comprehensive break-even keywords
  const siteUrl = 'https://www.financecalculatorfree.com';
  const pageTitle = 'Free Break-Even Calculator 2024 | Business Profitability Analysis Tool';
  const pageDescription = 'Calculate your business break-even point with our free calculator. Determine units needed, revenue targets, and contribution margin for profitability analysis.';

  // Comprehensive SEO Keywords Collections for Break-Even Calculator
  const singleKeywords = [
    'break-even', 'calculator', 'analysis', 'point', 'business', 'profitability', 
    'fixed', 'costs', 'variable', 'price', 'unit', 'revenue', 'margin', 
    'contribution', 'profit', 'loss', 'sales', 'volume', 'target', 
    'viability', 'planning', 'strategy', 'pricing', 'startup', 'small', 
    'enterprise', 'manufacturing', 'retail', 'service', 'restaurant', 
    'ecommerce', 'saas', 'subscription', 'financial', 'model', 'forecast',
    'budget', 'expenses', 'overhead', 'operating', 'leverage', 'safety',
    'threshold', 'crossover', 'zero', 'equilibrium', 'coverage', 'capacity'
  ];

  const twoWordKeywords = [
    'break-even calculator', 'break-even point', 'break-even analysis', 
    'fixed costs', 'variable costs', 'price per unit', 'contribution margin', 
    'profit margin', 'sales volume', 'revenue target', 'business viability', 
    'financial planning', 'pricing strategy', 'cost analysis', 'profit analysis', 
    'loss analysis', 'sales target', 'unit economics', 'business model', 
    'financial model', 'startup costs', 'operating costs', 'overhead costs', 
    'direct costs', 'indirect costs', 'marginal cost', 'average cost', 
    'total cost', 'gross margin', 'net profit', 'operating profit', 
    'profitability analysis', 'cost volume profit', 'CVP analysis', 
    'margin of safety', 'operating leverage', 'financial leverage', 
    'business planning', 'feasibility study', 'investment analysis', 
    'capital budgeting', 'cash flow', 'return on investment', 'ROI analysis',
    'budget planning', 'expense management', 'cost management', 'price optimization',
    'revenue optimization', 'profit optimization', 'business strategy'
  ];

  const longTailKeywords = [
    'free online break-even calculator for small business',
    'how to calculate break-even point for startup',
    'break-even analysis calculator for manufacturing',
    'restaurant break-even calculator monthly expenses',
    'ecommerce break-even calculator with shipping costs',
    'saas break-even calculator for subscription business',
    'break-even point calculator for service business',
    'how many units do I need to sell to break even',
    'break-even calculator for retail store inventory',
    'free break-even analysis tool for business plan',
    'calculate break-even point with fixed and variable costs',
    'break-even calculator for product pricing strategy',
    'small business break-even analysis template',
    'break-even calculator for startup funding pitch',
    'how to calculate break-even point in units',
    'break-even analysis for restaurant menu pricing',
    'manufacturing break-even calculator with labor costs',
    'service business break-even point calculation',
    'break-even calculator for consulting firm',
    'free break-even analysis for freelance business',
    'break-even point calculator for online store',
    'how to determine break-even sales volume',
    'break-even calculator for physical product business',
    'break-even analysis for mobile app startup',
    'calculate break-even point for coffee shop',
    'break-even calculator for construction business',
    'break-even analysis for real estate investment',
    'break-even point calculator for franchise business',
    'break-even calculator for gym or fitness center',
    'break-even analysis for digital marketing agency',
    'calculate break-even for online course business',
    'break-even calculator for photography business',
    'break-even analysis for cleaning service company',
    'break-even point calculator for tutoring service',
    'break-even calculator for food truck business',
    'break-even analysis for beauty salon or spa',
    'calculate break-even for consulting services',
    'break-even calculator for software development',
    'break-even analysis for subscription box business',
    'break-even point calculator for dropshipping',
    'break-even calculator for amazon FBA business',
    'break-even analysis for Shopify store',
    'calculate break-even for wholesale distribution',
    'break-even calculator for manufacturing startup',
    'break-even analysis for import export business',
    'break-even point calculator for service franchise',
    'break-even calculator for home based business',
    'break-even analysis for professional services',
    'calculate break-even for legal practice',
    'break-even calculator for accounting firm',
    'break-even analysis for medical practice',
    'break-even point calculator for dental office',
    'break-even calculator for veterinary clinic',
    'break-even analysis for therapy practice',
    'calculate break-even for coaching business',
    'break-even calculator for online coaching',
    'break-even analysis for membership site',
    'break-even point calculator for SaaS product',
    'break-even calculator for mobile application',
    'break-even analysis for tech startup',
    'calculate break-even for biotech company',
    'break-even calculator for renewable energy'
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
        <meta name="subject" content="Break-Even Calculator & Business Analysis" />
        <meta name="classification" content="Business, Finance, Calculators, Profitability Analysis" />
        <meta name="topic" content="Break-Even Point Calculation and Business Planning" />
        <meta name="summary" content="Free online break-even calculator for business profitability analysis" />
        <meta name="url" content={`${siteUrl}/break-even-calculator`} />
        
        {/* Verification & Ownership */}
        <meta name="google-site-verification" content="your_verification_code" />
        <meta name="msvalidate.01" content="your_bing_verification" />
        
        {/* Location & Business */}
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="United States" />
        <meta name="geo.position" content="39.8283;-98.5795" />
        <meta name="ICBM" content="39.8283, -98.5795" />
        
        {/* Canonical */}
        <link rel="canonical" href={`${siteUrl}/break-even-calculator`} />
        
        {/* Alternate Languages */}
        <link rel="alternate" href={`${siteUrl}/break-even-calculator`} hrefLang="x-default" />
        <link rel="alternate" href={`${siteUrl}/break-even-calculator`} hrefLang="en" />
        <link rel="alternate" href={`${siteUrl}/es/break-even-calculator`} hrefLang="es" />
        
        {/* Preload & Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/break-even-calculator`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={`${siteUrl}/images/break-even-calculator-preview.jpg`} />
        <meta property="og:image:alt" content="Break-Even Calculator Interface for Business Analysis" />
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
        <meta name="twitter:image" content={`${siteUrl}/images/break-even-calculator-preview.jpg`} />
        <meta name="twitter:image:alt" content="Free Break-Even Calculator for Business Planning" />
        
        {/* Additional Social */}
        <meta name="pinterest" content="nopin" description="Free break-even calculator for business analysis" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: pageTitle,
            description: pageDescription,
            url: `${siteUrl}/break-even-calculator`,
            mainEntity: {
              '@type': 'SoftwareApplication',
              name: 'Break-Even Calculator',
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'Any',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD'
              },
              description: 'Free online break-even calculator for business profitability analysis and financial planning.',
              featureList: [
                'Break-even point calculation',
                'Contribution margin analysis',
                'Revenue target estimation',
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
                { '@type': 'ListItem', position: 2, name: 'Break-Even Calculator', item: `${siteUrl}/break-even-calculator` }
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
            name: 'Break-Even Calculator',
            description: 'A tool for calculating business break-even points and profitability analysis',
            url: `${siteUrl}/break-even-calculator`,
            step: [
              {
                '@type': 'HowToStep',
                name: 'Enter Fixed Costs',
                text: 'Input your monthly fixed business expenses like rent and salaries'
              },
              {
                '@type': 'HowToStep',
                name: 'Set Variable Costs',
                text: 'Enter the cost per unit for materials, labor, and other variable expenses'
              },
              {
                '@type': 'HowToStep',
                name: 'Input Price per Unit',
                text: 'Enter the selling price for each unit of your product or service'
              },
              {
                '@type': 'HowToStep',
                name: 'Calculate Break-Even',
                text: 'View your break-even point in units and revenue with contribution margin'
              }
            ],
            tool: ['Fixed costs input', 'Variable costs calculator', 'Price per unit selector', 'Break-even analyzer'],
            about: {
              '@type': 'Thing',
              name: 'Business Profitability Analysis'
            },
            audience: {
              '@type': 'Audience',
              audienceType: ['Small Business Owners', 'Startup Founders', 'Entrepreneurs', 'Financial Analysts', 'Business Students']
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
                name: 'Is this break-even calculator completely free to use?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes, our break-even calculator is 100% free with no hidden costs, registration requirements, or usage limits. You can analyze your business profitability as many times as needed.'
                }
              },
              {
                '@type': 'Question',
                name: 'What types of businesses can use this break-even calculator?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'This calculator works for all business types including retail, manufacturing, service-based businesses, restaurants, SaaS companies, ecommerce stores, consulting firms, and startups of any size.'
                }
              },
              {
                '@type': 'Question',
                name: 'How accurate are the break-even calculations?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Our calculator uses standard break-even analysis formulas and provides accurate estimates based on your inputs. Actual business performance may vary based on market conditions and operational factors.'
                }
              },
              {
                '@type': 'Question',
                name: 'What is the difference between fixed and variable costs?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Fixed costs remain constant regardless of production volume (rent, salaries, insurance). Variable costs change with each unit produced (materials, shipping, commissions).'
                }
              },
              {
                '@type': 'Question',
                name: 'Can I use this for service-based businesses?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes, for service businesses, consider each service appointment or project as a "unit" and calculate your costs and pricing accordingly.'
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
                name: 'What is contribution margin and why is it important?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Contribution margin is the amount each unit contributes to covering fixed costs after variable costs are deducted. It shows how efficiently your business generates profit and covers overhead.'
                }
              }
            ]
          })}
        </script>
      </Head>

      {/* Spacing above */}
      <div className={styles.spacerTop} />

      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Break-Even Point Calculator</h1>
          <p className={styles.subtitle}>
            Determine when your business will become profitable by calculating your break-even point.
          </p>
        </section>

        {/* Calculator Card */}
        <div className={styles.calculatorCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.instruction}>
              Enter your business costs and pricing to calculate your break-even point.
            </p>

            <div className={styles.inputGroup}>
              <label htmlFor="fixedCosts" className={styles.label}>
                Fixed Costs ($)
              </label>
              <input
                id="fixedCosts"
                type="text"
                value={fixedCosts}
                onChange={(e) => setFixedCosts(e.target.value)}
                placeholder="e.g. $10,000 or 10000"
                className={styles.input}
              />
              <small className={styles.note}>
                Costs that don't change with production volume (rent, salaries, etc.)
              </small>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="variableCosts" className={styles.label}>
                Variable Cost per Unit ($)
              </label>
              <input
                id="variableCosts"
                type="text"
                value={variableCosts}
                onChange={(e) => setVariableCosts(e.target.value)}
                placeholder="e.g. $5.50 or 5.5"
                className={styles.input}
              />
              <small className={styles.note}>
                Costs that vary with each unit produced (materials, labor, etc.)
              </small>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="pricePerUnit" className={styles.label}>
                Price per Unit ($)
              </label>
              <input
                id="pricePerUnit"
                type="text"
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(e.target.value)}
                placeholder="e.g. $12.99 or 12.99"
                className={styles.input}
              />
              <small className={styles.note}>
                Selling price for each unit of your product/service
              </small>
            </div>

            <button type="submit" className={styles.submitBtn}>
              <span className={styles.btnText}>Calculate Break-Even</span>
              <span className={styles.arrow}>→</span>
            </button>

            {result && (
              <div className={styles.resultSection}>
                <h3>Break-Even Analysis</h3>
                <div className={styles.resultGrid}>
                  <div className={styles.resultItem}>
                    <strong>Fixed Costs:</strong> ${result.fixedCosts}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Variable Cost per Unit:</strong> ${result.variableCosts}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Price per Unit:</strong> ${result.pricePerUnit}
                  </div>
                  <div className={`${styles.resultItem} ${styles.highlight}`}>
                    <strong>Break-Even Units:</strong> {result.breakEvenUnits}
                  </div>
                  <div className={`${styles.resultItem} ${styles.highlight}`}>
                    <strong>Break-Even Revenue:</strong> ${result.breakEvenRevenue}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Contribution Margin:</strong> {result.contributionMargin}%
                  </div>
                </div>
                <div className={styles.note}>
                  You need to sell <strong>{result.breakEvenUnits}</strong> units to cover your costs, generating{' '}
                  <strong>${result.breakEvenRevenue}</strong> in revenue.
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Info Section */}
        <section className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h3>Understanding Break-Even Analysis</h3>
            <p>
              The <strong>Break-Even Point</strong> is the sales amount where total revenue equals total costs, resulting in neither profit nor loss. It's a fundamental metric for assessing{' '}
              <strong>business viability, pricing strategy, and financial planning</strong>.
            </p>

            <h4>How to Use This Calculator</h4>
            <ul className={styles.list}>
              <li><strong>Fixed Costs:</strong> Ongoing expenses that don't vary with production</li>
              <li><strong>Variable Costs:</strong> Expenses that change with each unit produced</li>
              <li><strong>Price per Unit:</strong> What you charge customers for each unit</li>
              <li>Click "Calculate Break-Even" to see your break-even point</li>
            </ul>

            <h4>Formula Used</h4>
            <div className={styles.formula}>
              <code>
                Break-Even Units = Fixed Costs ÷ (Price per Unit - Variable Cost per Unit)
              </code>
            </div>
            <p>
              <strong>Example:</strong> $10,000 fixed costs ÷ ($12.99 - $5.50) = <strong>1,334 units</strong>
            </p>

            <h4>Key Business Metrics</h4>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Calculation</th>
                  <th>Importance</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Contribution Margin</td>
                  <td>(Price - Variable Cost) ÷ Price</td>
                  <td>Shows what portion of revenue contributes to fixed costs</td>
                </tr>
                <tr>
                  <td>Margin of Safety</td>
                  <td>(Actual Sales - Break-Even Sales) ÷ Actual Sales</td>
                  <td>Measures how much sales can drop before losses occur</td>
                </tr>
                <tr>
                  <td>Operating Leverage</td>
                  <td>Contribution Margin ÷ Net Income</td>
                  <td>Shows how revenue changes affect profitability</td>
                </tr>
              </tbody>
            </table>

            <h4>Industry Benchmarks</h4>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Industry</th>
                  <th>Typical Break-Even Time</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Retail</td>
                  <td>6-18 months</td>
                </tr>
                <tr>
                  <td>Restaurants</td>
                  <td>1-3 years</td>
                </tr>
                <tr>
                  <td>Software (SaaS)</td>
                  <td>2-4 years</td>
                </tr>
                <tr>
                  <td>Manufacturing</td>
                  <td>3-5 years</td>
                </tr>
                <tr>
                  <td>Consulting Services</td>
                  <td>3-12 months</td>
                </tr>
              </tbody>
            </table>

            <h4>Strategies to Lower Your Break-Even Point</h4>
            <ul className={styles.list}>
              <li>✅ <strong>Reduce fixed costs</strong> — negotiate better leases, outsource non-core functions</li>
              <li>✅ <strong>Lower variable costs</strong> — bulk purchasing, process optimization</li>
              <li>✅ <strong>Increase prices</strong> — if market conditions allow</li>
              <li>✅ <strong>Product mix optimization</strong> — focus on higher-margin products</li>
              <li>✅ <strong>Increase sales volume</strong> — through marketing and sales efforts</li>
            </ul>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <h2>Free Financial Planning Tools: Budget, Invest & Plan Retirement</h2>
          <p>Free Financial Planning Tools – Try Now</p>
          <Link href="/suite" legacyBehavior>
            <a
              className={styles.ctaButton}
              ref={ctaButtonRef}
              onMouseMove={handleMouseMove}
            >
              <span className={styles.btnText}>Explore All Calculators</span>
              <span className={styles.arrow}>→</span>
            </a>
          </Link>
        </section>
      </div>

      {/* Spacing below */}
      <div className={styles.spacerBottom} />
    </>
  );
};

export default BreakEvenCalculator;