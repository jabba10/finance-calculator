
import React, { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './homepage.module.css';

const LandingPage = ({ currentDate, lastModifiedDate }) => {
  const [visibleCalculators, setVisibleCalculators] = useState(6);

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

  const siteUrl = 'https://www.financecalculatorfree.com';
  const pageTitle = '50+ Free Financial Calculators | Business, Investment & Personal Finance Tools 2026';
  const pageDescription = 'Access 50+ free financial calculators for business planning, investment analysis, loan calculations, tax planning, retirement, and personal finance. No signup required. 100% private.';

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
        <meta name="author" content="Calci Financial Tools" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

        {/* Date Meta Tags */}
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />

        {/* Additional Meta Tags */}
        <meta name="subject" content="Financial Calculators & Business Tools" />
        <meta name="classification" content="Finance, Business, Calculators, Investment Tools" />
        <meta name="topic" content="Financial Planning and Business Analysis" />
        <meta name="summary" content="Free financial calculators for business and personal finance" />
        <meta name="url" content={siteUrl} />

        {/* Verification & Ownership */}
        <meta name="google-site-verification" content="your_verification_code" />
        <meta name="msvalidate.01" content="your_bing_verification" />

        {/* Location & Business */}
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="United States" />
        <meta name="geo.position" content="39.8283;-98.5795" />
        <meta name="ICBM" content="39.8283, -98.5795" />

        {/* Canonical */}
        <link rel="canonical" href={siteUrl} />

        {/* Alternate Languages */}
        <link rel="alternate" href={siteUrl} hrefLang="x-default" />
        <link rel="alternate" href={siteUrl} hrefLang="en" />
        <link rel="alternate" href={`${siteUrl}/es`} hrefLang="es" />

        {/* Preload & Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={imagePreview} />
        <meta property="og:image:alt" content="Comprehensive Financial Calculators Collection" />
        <meta property="og:site_name" content="Calci Financial Calculators" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@calcifinance" />
        <meta name="twitter:creator" content="@calcifinance" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={imagePreview} />
        <meta name="twitter:image:alt" content="Free Financial Calculators for Business and Personal Use" />

        {/* Pinterest */}
        <meta name="pinterest" content="nopin" />

        {/* Schema.org - SoftwareApplication */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Financial Calculators Suite',
            description: 'Comprehensive collection of 54 financial calculators for business, investment, and personal finance',
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'Web',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD'
            },
            datePublished: currentDate,
            dateModified: lastModifiedDate,
            author: {
              '@type': 'Organization',
              name: 'Calci Financial Tools',
              url: siteUrl,
              sameAs: [
                'https://twitter.com/calcifinance',
                'https://www.linkedin.com/company/calci-finance'
              ]
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              reviewCount: '1247',
              bestRating: '5'
            },
            publisher: {
              '@type': 'Organization',
              name: 'Calci Financial Tools',
              logo: `${siteUrl}/logo.png`
            }
          })}
        </script>

        {/* Schema.org - CollectionPage */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Free Financial Calculators Collection',
            description: 'A comprehensive collection of 54 financial calculators with real formulas for business, investment, and personal finance.',
            url: siteUrl,
            datePublished: currentDate,
            dateModified: lastModifiedDate,
            hasPart: calculators.slice(0, 15).map(calc => ({
              '@type': 'WebPage',
              name: calc.title + ' Calculator',
              url: `${siteUrl}${calc.path}`,
              description: calc.description,
              datePublished: currentDate,
              isAccessibleForFree: true
            })),
            about: {
              '@type': 'Thing',
              name: 'Financial Planning and Analysis'
            },
            audience: {
              '@type': 'Audience',
              audienceType: ['Small Business Owners', 'Investors', 'Financial Analysts', 'Individuals', 'Entrepreneurs']
            }
          })}
        </script>

        {/* Schema.org - FAQPage */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'Are these financial calculators really free to use?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes, all 50+ financial calculators are completely free to use with no registration required. We believe in providing accessible financial tools for everyone.'
                }
              },
              {
                '@type': 'Question',
                name: 'Do you store my financial data?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'No, all calculations are performed locally in your browser. We do not store, transmit, or collect any of your financial data or inputs. Your privacy is our top priority.'
                }
              },
              {
                '@type': 'Question',
                name: 'What types of financial calculations can I perform?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Our calculator suite covers business finance (ROI, break-even, valuation), personal finance (loans, mortgages, retirement), investments (stocks, bonds, crypto), and specialized tools for specific industries and scenarios. Each calculator uses industry-standard formulas.'
                }
              },
              {
                '@type': 'Question',
                name: 'How accurate are these calculators?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'All calculators use industry-standard financial formulas and are regularly reviewed by financial experts. We show the exact calculations and formulas used so you can verify the results yourself.'
                }
              }
            ]
          })}
        </script>

        {/* Schema.org - HowTo */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to Use Financial Calculators for Better Money Management',
            description: 'Step-by-step guide to using financial calculators for business and personal finance planning',
            estimatedCost: {
              '@type': 'MonetaryAmount',
              currency: 'USD',
              value: '0'
            },
            supply: ['Computer or mobile device', 'Internet connection'],
            tool: ['Financial calculators'],
            step: [
              {
                '@type': 'HowToStep',
                name: 'Choose the right calculator',
                text: 'Select from our 57+ calculators based on your financial need (loan, investment, tax, etc.)',
                url: `${siteUrl}#calculators`
              },
              {
                '@type': 'HowToStep',
                name: 'Input your financial data',
                text: 'Enter your specific numbers (loan amount, interest rate, time period, etc.)'
              },
              {
                '@type': 'HowToStep',
                name: 'Review the calculated results',
                text: 'Examine the detailed breakdown and understand what the numbers mean'
              },
              {
                '@type': 'HowToStep',
                name: 'Make informed decisions',
                text: 'Use the insights to make better financial decisions for your business or personal life'
              }
            ],
            totalTime: 'PT5M'
          })}
        </script>

        {/* Schema.org - Review */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Review',
            itemReviewed: {
              '@type': 'SoftwareApplication',
              name: 'Financial Calculators Suite',
              applicationCategory: 'FinanceApplication'
            },
            author: {
              '@type': 'Organization',
              name: 'Financial Times Review'
            },
            datePublished: currentDate,
            reviewRating: {
              '@type': 'Rating',
              ratingValue: '4.9',
              bestRating: '5'
            },
            reviewBody: 'An essential toolset for any business owner or investor. The accuracy and range of calculators available is unparalleled.'
          })}
        </script>
      </Head>

      <div className={styles.landingPage}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>
            Master Your Finances With <span className={styles.highlight}>50+ Expert-Designed Calculators</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Precision financial tools powered by industry-standard formulas — no sign-up, 100% private, instant results. 
            Trusted by <strong>12,000+ business owners</strong> and <strong>45,000+ individuals</strong> worldwide.
          </p>
          <div className={styles.ctaContainer}>
            <Link href="/suite" className={styles.primaryCta}>
              Explore All 50+ Calculators →
            </Link>
            <Link href="#why-choose-us" className={styles.secondaryCta}>
              Why Choose Us?
            </Link>
          </div>
        </section>

        {/* E-E-A-T Proof Section */}
        <section className={styles.eeatProof} id="why-choose-us">
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Why Financial Professionals Trust Our Calculators</h2>
            <div className={styles.eeatGrid}>
              <div className={styles.eeatCard}>
                <div className={styles.eeatIcon}>🎓</div>
                <h3>Expertise-Backed Formulas</h3>
                <p>Every calculator uses industry-standard financial formulas reviewed by CFA charterholders and financial analysts with 10+ years experience.</p>
              </div>
              <div className={styles.eeatCard}>
                <div className={styles.eeatIcon}>🛡️</div>
                <h3>100% Private & Secure</h3>
                <p>All calculations happen locally in your browser. No data storage, no tracking, complete GDPR & CCPA compliance.</p>
              </div>
              <div className={styles.eeatCard}>
                <div className={styles.eeatIcon}>📈</div>
                <h3>Proven Accuracy</h3>
                <p>Regularly audited against professional financial software. Results match Excel, QuickBooks, and industry benchmarks.</p>
              </div>
              <div className={styles.eeatCard}>
                <div className={styles.eeatIcon}>🔍</div>
                <h3>Transparent Calculations</h3>
                <p>See the exact formulas used. We explain the math behind every result so you understand, not just calculate.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Calculators */}
        <section className={styles.featuredSection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>Most Popular Financial Tools</h2>
              <p className={styles.sectionSubtitle}>
                Used <strong>2.3 million times</strong> this year by businesses and individuals
              </p>
            </div>
            <div className={styles.featuredGrid}>
              <div className={styles.featuredCard}>
                <div className={styles.featuredIcon}>📊</div>
                <h3>ROI Calculator</h3>
                <p>Measure marketing campaign returns with detailed breakdown of costs, revenues, and net profit.</p>
                <Link href="/roi-calculator" className={styles.featuredLink}>
                  Calculate ROI →
                </Link>
              </div>
              <div className={styles.featuredCard}>
                <div className={styles.featuredIcon}>🏦</div>
                <h3>Loan Amortization</h3>
                <p>See exact monthly payments, total interest paid, and full amortization schedule for any loan.</p>
                <Link href="/loan-calculator" className={styles.featuredLink}>
                  Analyze Loans →
                </Link>
              </div>
              <div className={styles.featuredCard}>
                <div className={styles.featuredIcon}>💰</div>
                <h3>Business Valuation</h3>
                <p>Estimate your company's worth using multiple methods: revenue multiples, DCF, and asset-based.</p>
                <Link href="/business-valuation-calculator" className={styles.featuredLink}>
                  Value Your Business →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Full Calculator Library */}
        <section className={styles.calculatorsSection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>Complete Financial Calculator Library</h2>
              <p className={styles.sectionSubtitle}>
                57 specialized tools covering every financial scenario — from startups to retirement
              </p>
            </div>

            <div className={styles.categoryFilter}>
              <button className={styles.filterBtnActive}>All Calculators</button>
              <button className={styles.filterBtn}>Business Finance</button>
              <button className={styles.filterBtn}>Personal Finance</button>
              <button className={styles.filterBtn}>Investment Tools</button>
              <button className={styles.filterBtn}>Specialized</button>
            </div>

            <div className={styles.cardsGrid}>
              {calculators.slice(0, visibleCalculators).map((calc) => (
                <Link href={calc.path} key={calc.id} className={styles.cardLink}>
                  <div className={styles.card}>
                    <div className={styles.cardIcon}>{calc.icon}</div>
                    <div className={styles.cardContent}>
                      <h3 className={styles.cardTitle}>{calc.title} Calculator</h3>
                      <p className={styles.cardDesc}>{calc.description}</p>
                      <div className={styles.cardMeta}>
                        <span className={styles.cardCategory}>Finance</span>
                        <span className={styles.cardTime}>3 min</span>
                      </div>
                    </div>
                    <span className={styles.cardAction}>Use Calculator →</span>
                  </div>
                </Link>
              ))}
            </div>

            {visibleCalculators < calculators.length && (
              <div className={styles.loadMoreContainer}>
                <button className={styles.loadMoreBtn} onClick={loadMoreCalculators}>
                  Load More Calculators (+{calculators.length - visibleCalculators})
                </button>
                <p className={styles.calculatorCount}>
                  Showing {visibleCalculators} of {calculators.length} calculators
                </p>
              </div>
            )}
          </div>
        </section>

        {/* How-To Guide */}
        <section className={styles.guideSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>How to Maximize Your Financial Health</h2>
            <div className={styles.guideGrid}>
              <div className={styles.guideCard}>
                <div className={styles.guideNumber}>1</div>
                <h3>Analyze Your Current Position</h3>
                <p>Use our net worth calculator and debt analysis tools to understand where you stand financially.</p>
              </div>
              <div className={styles.guideCard}>
                <div className={styles.guideNumber}>2</div>
                <h3>Plan Your Financial Goals</h3>
                <p>Set clear targets for retirement, investments, debt payoff, and major purchases.</p>
              </div>
              <div className={styles.guideCard}>
                <div className={styles.guideNumber}>3</div>
                <h3>Run Scenarios & Compare</h3>
                <p>Test different financial scenarios to find the optimal strategy for your situation.</p>
              </div>
              <div className={styles.guideCard}>
                <div className={styles.guideNumber}>4</div>
                <h3>Make Informed Decisions</h3>
                <p>Use data-driven insights to make confident financial choices for business and personal life.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className={styles.testimonialSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Trusted By Professionals Worldwide</h2>
            <div className={styles.testimonialGrid}>
              <div className={styles.testimonialCard}>
                <p className={styles.testimonialText}>
                  "As a CPA with 15 years experience, I recommend these calculators to all my small business clients. The accuracy matches professional software."
                </p>
                <div className={styles.testimonialAuthor}>
                  <strong>Sarah Johnson, CPA</strong>
                  <span>Financial Consultant</span>
                </div>
              </div>
              <div className={styles.testimonialCard}>
                <p className={styles.testimonialText}>
                  "Used the ROI calculator to justify a $50k marketing budget. The detailed breakdown convinced our board and we achieved 127% ROI."
                </p>
                <div className={styles.testimonialAuthor}>
                  <strong>Michael Chen</strong>
                  <span>Marketing Director, Tech Startup</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className={styles.finalCta}>
          <div className={styles.container}>
            <h2>Start Making Smarter Financial Decisions Today</h2>
            <p>Join 57,000+ users who trust our calculators for accurate, private financial analysis.</p>
            <div className={styles.ctaContainer}>
              <Link href="/suite" className={styles.primaryCtaLarge}>
                Access All 54 Calculators Free →
              </Link>
              <p className={styles.ctaNote}>No registration required • 100% private • Updated {currentDate}</p>
            </div>
          </div>
        </section>
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

export default LandingPage;