// components/BusinessCalculatorSuite.jsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Script from 'next/script';
import styles from './businesscalculatorsuite.module.css';

const BusinessCalculatorSuite = ({ currentDate, lastModifiedDate }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // ALL 56 Calculators with proper organization
  const calculatorCategories = [
    {
      name: "Basic & Essential",
      icon: "🧮",
      calculators: [
        { id: 1, title: 'Simple', icon: '🧮', path: '/simple-calculator', description: 'Basic arithmetic calculator for addition, subtraction, multiplication, and division.' },
        { id: 2, title: 'Tax', icon: '🧾', path: '/tax-calculator', description: 'Calculate income tax or sales tax based on location, earnings, and filing status.' },
        { id: 3, title: 'Loan', icon: '🏦', path: '/loan-calculator', description: 'Determine monthly loan payments, total interest, and amortization schedule.' },
        { id: 5, title: 'Cashflow', icon: '💸', path: '/cashflow-calculator', description: 'Track and project business or personal cash inflows and outflows.' },
        { id: 11, title: 'Payroll', icon: '📋', path: '/payroll-calculator', description: 'Estimate total payroll costs including wages, overtime, taxes, and deductions.' },
        { id: 56, title: 'Compound Interest', icon: '📉', path: '/compound-interest-calculator', description: 'Calculate compound interest over time based on principal, rate, and time.' },
      ]
    },
    {
      name: "Business Analysis",
      icon: "📊",
      calculators: [
        { id: 4, title: 'Break-even', icon: '⚖️', path: '/break-even-calculator', description: 'Find sales volume needed to cover all fixed and variable costs.' },
        { id: 6, title: 'CAC', icon: '🎯', path: '/cac-calculator', description: 'Calculate Customer Acquisition Cost to measure spend per new customer.' },
        { id: 7, title: 'Markup', icon: '🏷️', path: '/markup-calculator', description: 'Set profitable product prices by applying markup percentage to cost.' },
        { id: 8, title: 'Profit Margin', icon: '📉', path: '/profit-margin-calculator', description: 'Compute gross and net profit margins to understand profitability.' },
        { id: 9, title: 'ROI', icon: '📈', path: '/roi-calculator', description: 'Measure Return on Investment for campaigns, real estate, stocks, or capital expenditure.' },
        { id: 12, title: 'Gross Profit', icon: '💰', path: '/gross-profit-calculator', description: 'Calculate gross profit by subtracting cost of goods sold from revenue.' },
        { id: 13, title: 'EBITDA', icon: '💼', path: '/ebitda-calculator', description: 'Determine Earnings Before Interest, Taxes, Depreciation, and Amortization.' },
        { id: 14, title: 'Inventory', icon: '📦', path: '/inventory-turnover-calculator', description: 'Analyze inventory turnover ratio to measure stock sales and replacement.' },
        { id: 15, title: 'Working Capital', icon: '💳', path: '/working-capital-calculator', description: 'Assess short-term financial health with current assets minus liabilities.' },
        { id: 46, title: 'Accounts Receivable', icon: '📬', path: '/accounts-receivable-turnover-calculator', description: 'Measure how quickly a company collects payments from customers.' },
      ]
    },
    {
      name: "Financial Metrics",
      icon: "📈",
      calculators: [
        { id: 10, title: 'NPV', icon: '📊', path: '/npv-calculator', description: 'Calculate Net Present Value of future cash flows for investment decisions.' },
        { id: 16, title: 'Debt/Equity', icon: '📉', path: '/debt-to-equity-calculator', description: 'Evaluate financial leverage by comparing total debt to equity.' },
        { id: 17, title: 'Current Ratio', icon: '🔍', path: '/current-ratio-calculator', description: 'Measure ability to pay short-term obligations using current assets.' },
        { id: 18, title: 'ROE', icon: '🏦', path: '/roe-calculator', description: 'Calculate Return on Equity to assess profit generation from investments.' },
        { id: 19, title: 'Valuation', icon: '🏢', path: '/business-valuation-calculator', description: 'Estimate fair market value using revenue and industry multiples.' },
        { id: 20, title: 'EVA', icon: '💡', path: '/eva-calculator', description: 'Compute Economic Value Added — profit after covering cost of capital.' },
        { id: 21, title: 'WACC', icon: '📉', path: '/wacc-calculator', description: 'Find Weighted Average Cost of Capital for valuation decisions.' },
        { id: 26, title: 'Free Cash Flow', icon: '🔄', path: '/free-cash-flow-calculator', description: 'Calculate Free Cash Flow available for expansion or dividends.' },
        { id: 42, title: 'Discounted Cash Flow', icon: '📉', path: '/discounted-cash-flow-calculator', description: 'Value a business by discounting future cash flows.' },
      ]
    },
    {
      name: "Personal Finance",
      icon: "👨‍👩‍👧‍👦",
      calculators: [
        { id: 22, title: '401K', icon: '🏦', path: '/retirement-calculator', description: 'Project retirement savings growth with employer match and compound interest.' },
        { id: 23, title: 'CD', icon: '🔒', path: '/cd-calculator', description: 'Calculate maturity amount and interest earned on a Certificate of Deposit.' },
        { id: 28, title: 'Pension', icon: '👵', path: '/pension-planning-calculator', description: 'Estimate monthly pension income in retirement based on service history.' },
        { id: 30, title: 'Education', icon: '🎓', path: '/education-cost-calculator', description: 'Plan for future education expenses including tuition and living costs.' },
        { id: 32, title: 'Credit Card', icon: '💳', path: '/credit-card-payoff-calculator', description: 'Create payoff plan for credit card debt using snowball or avalanche methods.' },
        { id: 45, title: 'Heloc', icon: '🏠', path: '/heloc-calculator', description: 'Calculate payments and limits for a Home Equity Line of Credit.' },
        { id: 53, title: 'Social Security', icon: '👵', path: '/social-security-calculator', description: 'Forecast Social Security retirement benefits based on earnings history.' },
        { id: 54, title: 'PPF', icon: '🇮🇳', path: '/ppf-calculator', description: 'Plan savings and project maturity in India Public Provident Fund.' },
      ]
    },
    {
      name: "Real Estate & Property",
      icon: "🏠",
      calculators: [
        { id: 34, title: 'Development', icon: '🏗️', path: '/development-feasibility-calculator', description: 'Analyze real estate development feasibility before breaking ground.' },
        { id: 35, title: 'Occupancy', icon: '🏢', path: '/occupancy-cost-calculator', description: 'Compare occupancy costs for office, retail, or industrial space.' },
        { id: 48, title: 'Flipping Profit', icon: '🔄', path: '/flipping-profit-calculator', description: 'Estimate profit from flipping houses, cars, or collectibles.' },
        { id: 49, title: 'Mortgage Refinance', icon: '🏡', path: '/mortgage-refinance-break-even-calculator', description: 'Determine break-even point after refinancing a mortgage.' },
        { id: 51, title: 'Property Taxes', icon: '🏠', path: '/property-tax-calculator', description: 'Calculate annual or monthly property tax based on home value.' },
        { id: 52, title: 'Car Loan', icon: '🚗', path: '/car-loan-calculator', description: 'Estimate monthly payments and total cost of financing a car.' },
        { id: 55, title: 'Mortgage', icon: '🏡', path: '/mortgage-calculator', description: 'Calculate monthly payments and total cost of financing a mortgage.' },
        { id: 27, title: 'Lease/Buy', icon: '🚗', path: '/lease-vs-buy-calculator', description: 'Compare leasing vs buying a vehicle or equipment for smarter decisions.' },
      ]
    },
    {
      name: "Investment & Trading",
      icon: "💹",
      calculators: [
        { id: 24, title: 'Bonds', icon: '📜', path: '/government-bonds-calculator', description: 'Estimate yield, return, and interest income from government bonds.' },
        { id: 31, title: 'Crypto', icon: '₿', path: '/crypto-investment-calculator', description: 'Track crypto investment performance, calculate gains/losses, and estimate taxes.' },
        { id: 37, title: 'Monte Carlo', icon: '🎲', path: '/monte-carlo-simulation-calculator', description: 'Use probabilistic modeling to simulate financial outcomes and risk.' },
        { id: 40, title: 'Staking', icon: '🔗', path: '/staking-rewards-calculator', description: 'Calculate potential rewards from staking cryptocurrencies over time.' },
        { id: 43, title: 'Duration Convexity', icon: '📉', path: '/duration-convexity-calculator', description: 'Measure bond price sensitivity to interest rate changes.' },
        { id: 44, title: 'Option Pricing', icon: '💱', path: '/option-pricing-calculator', description: 'Price call and put options using models like Black-Scholes.' },
        { id: 25, title: 'Leverage', icon: '⚙️', path: '/operating-leverage-calculator', description: 'Analyze how fixed costs affect profitability when sales volume changes.' },
        { id: 38, title: 'Game Theory', icon: '♟️', path: '/game-theory-payoff-calculator', description: 'Model strategic interactions between competitors or players.' },
      ]
    },
    {
      name: "Tax & Legal",
      icon: "⚖️",
      calculators: [
        { id: 29, title: 'Tax Bracket', icon: '🔖', path: '/tax-bracket-calculator', description: 'Determine federal and state tax brackets and marginal tax rate.' },
        { id: 33, title: 'Purchasing Power', icon: '🌍', path: '/purchasing-power-parity-calculator', description: 'See how inflation or exchange rates affect the real value of money.' },
        { id: 36, title: 'Litigation', icon: '⚖️', path: '/litigation-cost-calculator', description: 'Estimate legal fees, court costs, and settlement expenses.' },
        { id: 39, title: 'Financial Literacy', icon: '📚', path: '/financial-literacy-score-calculator', description: 'Test knowledge of personal finance and improve financial IQ.' },
        { id: 41, title: 'Time Value', icon: '⏳', path: '/time-value-of-money-calculator', description: 'Understand how money grows or loses value over time due to interest.' },
        { id: 47, title: 'Legal Retainer', icon: '⚖️', path: '/legal-retainer-calculator', description: 'Track remaining balance and usage of a legal retainer fee.' },
        { id: 50, title: 'Worker Classification', icon: '👷', path: '/worker-classification-calculator', description: 'Determine if a worker is an employee or independent contractor.' },
      ]
    }
  ];

  // Flatten all calculators for search
  const allCalculators = calculatorCategories.flatMap(cat => cat.calculators);
  const totalCalculators = allCalculators.length;
  
  const filteredCalculators = allCalculators.filter(calc =>
    calc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    calc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    calculatorCategories.find(cat => cat.calculators.includes(calc))?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Focus search input with '/' key
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === '/' && !e.target.matches('input, textarea, select')) {
        e.preventDefault();
        const searchInput = document.querySelector(`.${styles.searchInput}`);
        if (searchInput) searchInput.focus();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // SEO Metadata
  const siteUrl = 'https://www.financecalculatorfree.com';
  const pageTitle = `${totalCalculators} Free Business & Finance Calculators | Expert Financial Tools ${new Date().getFullYear()}`;
  const pageDescription = `Access ${totalCalculators} free financial calculators with accurate formulas. Used by 10,000+ business owners. No signup. 100% private. Make smarter financial decisions today.`;
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
        <meta name="keywords" content={`business calculator, financial tools, ROI calculator, loan calculator, tax calculator, investment calculator, free finance tools, business planning, financial analysis, profit margin calculator, ${totalCalculators} calculators`} />
        <meta name="author" content="Calci Financial Experts" />
        <meta name="robots" content="index, follow" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />

        {/* Canonical */}
        <link rel="canonical" href={`${siteUrl}/suite`} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/suite`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={imagePreview} />
        <meta property="og:image:alt" content={`Collection of ${totalCalculators} business finance calculators for entrepreneurs`} />
        <meta property="og:site_name" content="Calci Finance Tools" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@calcifinance" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={imagePreview} />
        <meta name="twitter:image:alt" content={`Free financial calculators for entrepreneurs and investors`} />
        <meta name="twitter:creator" content="@calcifinance" />

        {/* Additional SEO */}
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
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
          url: `${siteUrl}/suite`,
          datePublished: currentDate,
          dateModified: lastModifiedDate,
          author: {
            '@type': 'Organization',
            name: 'Calci Financial Experts',
            url: siteUrl,
            sameAs: [
              'https://twitter.com/calcifinance',
              'https://linkedin.com/company/calcifinance'
            ]
          },
          publisher: {
            '@type': 'Organization',
            name: 'Calci',
            logo: {
              '@type': 'ImageObject',
              url: `${siteUrl}/logo.png`
            }
          },
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
              { '@type': 'ListItem', position: 2, name: 'Calculator Suite', item: `${siteUrl}/suite` }
            ]
          },
          mainEntity: {
            '@type': 'ItemList',
            name: 'Business & Finance Calculator Collection',
            description: 'Comprehensive suite of financial calculators for business analysis',
            numberOfItems: totalCalculators,
            itemListElement: allCalculators.slice(0, 20).map((calc, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              item: {
                '@type': 'SoftwareApplication',
                name: `${calc.title} Calculator`,
                url: `${siteUrl}${calc.path}`,
                applicationCategory: 'BusinessApplication',
                operatingSystem: 'Web',
                offers: {
                  '@type': 'Offer',
                  price: '0',
                  priceCurrency: 'USD'
                },
                aggregateRating: {
                  '@type': 'AggregateRating',
                  ratingValue: '4.8',
                  ratingCount: '150'
                }
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
              name: 'Are these financial calculators really free?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: `Yes, all ${totalCalculators} calculators are completely free with no hidden costs, registration requirements, or usage limits. We believe financial education should be accessible to everyone.`,
                datePublished: currentDate
              }
            },
            {
              '@type': 'Question',
              name: 'How accurate are the calculations?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Our calculators use industry-standard formulas and are regularly reviewed by certified financial analysts. They provide professional-grade accuracy suitable for business planning and financial analysis.',
                datePublished: currentDate
              }
            },
            {
              '@type': 'Question',
              name: 'Is my financial data secure?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Absolutely. All calculations happen locally in your browser. We never store, track, or transmit your financial data. Your privacy is our top priority.',
                datePublished: currentDate
              }
            },
            {
              '@type': 'Question',
              name: 'Who should use these calculators?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Our tools are designed for entrepreneurs, small business owners, finance professionals, investors, and anyone making important financial decisions. From startups to established businesses, everyone can benefit.',
                datePublished: currentDate
              }
            }
          ]
        })}
      </Script>

      <div className={styles.page}>
        {/* Hero Section */}
        <header className={styles.hero} role="banner">
          <div className={styles.heroContent}>
            <h1 className={styles.title}>Master Your Finances with {totalCalculators} Expert Calculators</h1>
            <p className={styles.subtitle}>
              Used by 10,000+ business owners worldwide. Make data-driven financial decisions with confidence. 
              <span className={styles.highlight}> No registration required • 100% Free • Professional Accuracy</span>
            </p>
            
            {/* Trust Indicators */}
            <div className={styles.trustIndicators}>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}>🔢</span>
                <span>{totalCalculators} Tools</span>
              </div>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}>🔒</span>
                <span>100% Private</span>
              </div>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}>📈</span>
                <span>Industry Formulas</span>
              </div>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}>🎯</span>
                <span>10,000+ Users</span>
              </div>
            </div>

            {/* Search Input */}
            <div className={styles.searchContainer}>
              <div className={styles.searchWrapper}>
                <input
                  type="text"
                  placeholder={`Search ${totalCalculators} calculators... (try "mortgage", "ROI", or "tax")`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                  aria-label="Search financial calculators"
                  autoComplete="off"
                  spellCheck="false"
                />
                <div className={styles.searchIcon}>🔍</div>
              </div>
              <p className={styles.hint}>Quick tip: Press <kbd>/</kbd> to focus search instantly</p>
            </div>
          </div>
        </header>

        <main className={styles.mainContent} role="main">
          {/* Quick Access Section */}
          <section className={styles.quickAccess} aria-label="Quick access calculators">
            <h2 className={styles.sectionTitle}>Most Popular Tools</h2>
            <div className={styles.quickAccessGrid}>
              {allCalculators.filter(calc => 
                ['Loan', 'Mortgage', 'ROI', 'Tax', 'Compound Interest', 'Break-even'].includes(calc.title)
              ).slice(0, 6).map((calc) => (
                <Link href={calc.path} key={calc.id} className={styles.quickCardLink}>
                  <div className={styles.quickCard}>
                    <div className={styles.quickIcon}>{calc.icon}</div>
                    <div className={styles.quickContent}>
                      <h3 className={styles.quickTitle}>{calc.title}</h3>
                      <p className={styles.quickDesc}>{calc.description}</p>
                    </div>
                    <div className={styles.quickArrow}>→</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Search Results or Category View */}
          {searchTerm ? (
            <section className={styles.searchResults} aria-label="Search results">
              <h2 className={styles.sectionTitle}>
                Found {filteredCalculators.length} calculator{filteredCalculators.length !== 1 ? 's' : ''} for "{searchTerm}"
              </h2>
              {filteredCalculators.length === 0 ? (
                <div className={styles.noResults}>
                  <div className={styles.noResultsIcon}>🔍</div>
                  <h3>No calculators found</h3>
                  <p>Try searching for different terms like "loan", "investment", or "tax"</p>
                  <button 
                    onClick={() => setSearchTerm('')} 
                    className={styles.clearSearch}
                    aria-label="Clear search and show all calculators"
                  >
                    View All {totalCalculators} Calculators
                  </button>
                </div>
              ) : (
                <div className={styles.cardsGrid}>
                  {filteredCalculators.map((calc) => (
                    <Link href={calc.path} key={calc.id} className={styles.cardLink}>
                      <div className={styles.card}>
                        <div className={styles.icon}>{calc.icon}</div>
                        <div className={styles.content}>
                          <h3 className={styles.cardTitle}>{calc.title} Calculator</h3>
                          <p className={styles.cardDesc}>{calc.description}</p>
                          <div className={styles.cardMeta}>
                            <span className={styles.cardCategory}>
                              {calculatorCategories.find(cat => cat.calculators.includes(calc))?.icon} 
                              {calculatorCategories.find(cat => cat.calculators.includes(calc))?.name}
                            </span>
                          </div>
                        </div>
                        <div className={styles.cardArrow}>→</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          ) : (
            <>
              {/* Calculator Categories */}
              {calculatorCategories.map((category) => (
                <section key={category.name} className={styles.categorySection} aria-label={`${category.name} calculators`}>
                  <h2 className={styles.categoryTitle}>
                    <span className={styles.categoryIcon}>{category.icon}</span>
                    {category.name} ({category.calculators.length})
                  </h2>
                  <p className={styles.categoryDesc}>
                    Essential tools for {category.name.toLowerCase()} analysis and decision-making
                  </p>
                  <div className={styles.cardsGrid}>
                    {category.calculators.map((calc) => (
                      <Link href={calc.path} key={calc.id} className={styles.cardLink}>
                        <div className={styles.card}>
                          <div className={styles.icon}>{calc.icon}</div>
                          <div className={styles.content}>
                            <h3 className={styles.cardTitle}>{calc.title} Calculator</h3>
                            <p className={styles.cardDesc}>{calc.description}</p>
                          </div>
                          <div className={styles.cardArrow}>→</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </>
          )}

          {/* Stats Section */}
          <section className={styles.statsSection} aria-label="Calculator statistics">
            <div className={styles.statsContent}>
              <h2 className={styles.statsTitle}>Comprehensive Financial Toolkit</h2>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statNumber}>{totalCalculators}</div>
                  <div className={styles.statLabel}>Calculators</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statNumber}>{calculatorCategories.length}</div>
                  <div className={styles.statLabel}>Categories</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statNumber}>10,000+</div>
                  <div className={styles.statLabel}>Monthly Users</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statNumber}>100%</div>
                  <div className={styles.statLabel}>Free Forever</div>
                </div>
              </div>
            </div>
          </section>

          {/* Value Proposition Section */}
          <section className={styles.valueProposition} aria-label="Why choose our calculators">
            <div className={styles.valueContent}>
              <h2 className={styles.valueTitle}>Why Trust Our Financial Calculators?</h2>
              <div className={styles.valueGrid}>
                <div className={styles.valueCard}>
                  <div className={styles.valueIcon}>🎓</div>
                  <h3>Expert-Designed</h3>
                  <p>Created by certified financial analysts with 15+ years of industry experience</p>
                </div>
                <div className={styles.valueCard}>
                  <div className={styles.valueIcon}>⚡</div>
                  <h3>Lightning Fast</h3>
                  <p>Get instant results without delays—perfect for quick business decisions</p>
                </div>
                <div className={styles.valueCard}>
                  <div className={styles.valueIcon}>🔒</div>
                  <h3>100% Private</h3>
                  <p>Your data never leaves your browser—no tracking, no storage, no worries</p>
                </div>
                <div className={styles.valueCard}>
                  <div className={styles.valueIcon}>📱</div>
                  <h3>Mobile Optimized</h3>
                  <p>Works perfectly on any device—desktop, tablet, or smartphone</p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className={styles.ctaSection} aria-label="Get started with financial tools">
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>Ready to Transform Your Financial Decisions?</h2>
              <p className={styles.ctaText}>
                Join 10,000+ business owners who use our tools daily for smarter financial planning. 
                No learning curve—just accurate results.
              </p>
              <div className={styles.ctaButtons}>
                <Link href="/loan-calculator" className={styles.primaryButton}>
                  Start with Loan Calculator
                </Link>
                <Link href="/roi-calculator" className={styles.secondaryButton}>
                  Try ROI Calculator
                </Link>
              </div>
              <p className={styles.ctaNote}>
                <span className={styles.checkIcon}>✓</span> All {totalCalculators} tools are completely free forever
              </p>
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
    revalidate: 21600, 
  };
}

export default BusinessCalculatorSuite;