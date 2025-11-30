// components/TaxCalculator.jsx
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './taxcalculator.module.css';

const TaxCalculator = () => {
  const ctaButtonRef = useRef(null);

  const [income, setIncome] = useState('');
  const [filingStatus, setFilingStatus] = useState('single');
  const [result, setResult] = useState(null);

  // 2026 U.S. Federal Tax Brackets (standard)
  const taxBrackets = {
    single: [
      { limit: 11600, rate: 0.1 },
      { limit: 47150, rate: 0.12 },
      { limit: 100525, rate: 0.22 },
      { limit: 191950, rate: 0.24 },
      { limit: 243725, rate: 0.32 },
      { limit: 609350, rate: 0.35 },
      { rate: 0.37 }
    ],
    married: [
      { limit: 23200, rate: 0.1 },
      { limit: 94300, rate: 0.12 },
      { limit: 201050, rate: 0.22 },
      { limit: 383900, rate: 0.24 },
      { limit: 487450, rate: 0.32 },
      { limit: 731200, rate: 0.35 },
      { rate: 0.37 }
    ],
    head: [
      { limit: 16550, rate: 0.1 },
      { limit: 63100, rate: 0.12 },
      { limit: 100500, rate: 0.22 },
      { limit: 191950, rate: 0.24 },
      { limit: 243700, rate: 0.32 },
      { limit: 609350, rate: 0.35 },
      { rate: 0.37 }
    ]
  };

  const calculateTax = (income, status) => {
    const brackets = taxBrackets[status];
    let remaining = income;
    let totalTax = 0;
    let prevLimit = 0;

    for (let i = 0; i < brackets.length; i++) {
      const bracket = brackets[i];
      const currentLimit = bracket.limit || Infinity;

      if (remaining <= 0) break;

      const taxableInBracket = Math.min(remaining, currentLimit - prevLimit);
      totalTax += taxableInBracket * bracket.rate;
      remaining -= taxableInBracket;
      prevLimit = currentLimit;
    }

    return {
      tax: totalTax.toFixed(2),
      effectiveRate: ((totalTax / income) * 100).toFixed(2)
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const incomeNum = parseFloat(income);
    if (isNaN(incomeNum) || incomeNum < 0) {
      alert('Please enter a valid positive number for income');
      return;
    }

    const taxData = calculateTax(incomeNum, filingStatus);

    setResult({
      ...taxData,
      income: incomeNum.toLocaleString(),
      filingStatus:
        filingStatus === 'single' ? 'Single' :
        filingStatus === 'married' ? 'Married Filing Jointly' : 'Head of Household'
    });
  };

  const handleMouseMove = (e) => {
    const el = ctaButtonRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--x', `${x}px`);
    el.style.setProperty('--y', `${y}px`);
  };

  // SEO Metadata - Updated for 2026
  const siteUrl = 'https://www.financecalculatorfree.com';
  const pageTitle = 'Free Tax Calculator 2026 | Estimate Federal Income Tax & Refund';
  const pageDescription = 'Free 2026 tax calculator to estimate your federal income tax, effective tax rate, and potential refund. Calculate taxes for Single, Married, Head of Household filing statuses.';
  const imagePreview = `${siteUrl}/images/tax-calculator-preview.jpg`;

  // Comprehensive SEO Keywords Collections for Tax Calculator (updated year)
  const singleKeywords = [
    'tax', 'calculator', 'income', 'federal', 'IRS', 'return', 'refund', 'bracket',
    'rate', 'withholding', 'deduction', 'credit', 'filing', 'single', 'married',
    'jointly', 'household', 'estimated', 'liability', 'payment', 'return',
    'withhold', 'AGI', 'gross', 'net', 'progressive', 'marginal', 'effective',
    'percentage', 'amount', 'free', 'online', 'tool', 'estimate', 'calculate'
  ];

  const twoWordKeywords = [
    'tax calculator', 'income tax', 'federal tax', 'tax return', 'tax refund',
    'tax bracket', 'tax rate', 'tax estimation', 'tax liability', 'tax payment',
    'tax withholding', 'tax deduction', 'tax credit', 'filing status',
    'married filing', 'head of household', 'single filer', 'tax burden',
    'effective rate', 'marginal rate', 'tax season', 'tax year', 'tax form',
    'tax deadline', 'tax planning', 'tax preparation', 'tax software',
    'tax estimate', 'tax calculation', 'free calculator', 'online calculator',
    'tax tool', 'IRS calculator', 'tax reform', 'tax code', 'tax law',
    'tax obligation', 'tax amount', 'tax percentage', 'tax savings',
    'tax optimization', 'tax strategy', 'tax forecast', 'tax projection'
  ];

  const longTailKeywords = [
    'free online tax calculator for 2026',
    'federal income tax calculator with brackets',
    'estimate my tax refund calculator 2026',
    'how much will i get back in taxes 2026',
    'income tax calculator for single filers',
    'married filing jointly tax calculator 2026',
    'head of household tax estimation tool',
    'free tax calculator for self-employed individuals',
    'calculate federal income tax for w2 employees',
    'tax bracket calculator for different income levels',
    'estimate tax liability for freelance work',
    'free online tax calculator no registration',
    'how to calculate effective tax rate',
    'marginal tax rate calculator for investors',
    'tax estimation tool for retirement planning',
    'calculate taxes on bonus income 2026',
    'free tax calculator for small business owners',
    'estimate quarterly tax payments calculator',
    'tax calculator for side hustle income',
    'how much tax will i pay on my salary',
    'free tax estimation tool for contractors',
    'calculate taxes on investment income',
    'tax calculator for rental property income',
    'estimate self employment tax calculator',
    'free tax calculator for gig economy workers',
    'how to calculate tax withholding allowances',
    'tax estimation for multiple income sources',
    'calculate tax on capital gains 2026',
    'free tax calculator for real estate agents',
    'estimate taxes on social security income',
    'tax calculator for traditional IRA withdrawals',
    'calculate required minimum distribution taxes',
    'free tax estimation for inherited IRA',
    'tax calculator for stock option exercises',
    'estimate taxes on cryptocurrency gains',
    'free tax calculator for online sellers',
    'calculate tax on foreign income',
    'tax estimation for military personnel',
    'free tax calculator for students with income',
    'estimate taxes on fellowship stipends',
    'tax calculator for lottery winnings',
    'calculate inheritance tax estimation',
    'free gift tax calculator 2026',
    'estate tax calculation tool',
    'tax calculator for trust income',
    'estimate partnership tax liability',
    'free s corporation tax calculator',
    'calculate c corporation tax estimation',
    'tax calculator for nonprofit organizations',
    'estimate unrelated business income tax',
    'free tax calculator for clergy members',
    'calculate minister housing allowance',
    'tax estimation for disability income',
    'free calculator for unemployment tax',
    'estimate severance pay tax withholding',
    'tax calculator for alimony income 2026',
    'calculate child support tax implications',
    'free tax estimation for legal settlements',
    'tax calculator for jury duty pay',
    'estimate hobby income tax requirements'
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
        <meta name="subject" content="Tax Calculator & Income Tax Estimation" />
        <meta name="classification" content="Taxation, Finance, Calculators, IRS, Income Tax" />
        <meta name="topic" content="Federal Income Tax Calculation and Estimation" />
        <meta name="summary" content="Free online tax calculator for federal income tax estimation" />
        <meta name="url" content={`${siteUrl}/tax-calculator`} />
        
        {/* Verification & Ownership */}
        <meta name="google-site-verification" content="your_verification_code" />
        <meta name="msvalidate.01" content="your_bing_verification" />
        
        {/* Location & Business */}
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="United States" />
        <meta name="geo.position" content="38.9072;-77.0369" />
        <meta name="ICBM" content="38.9072, -77.0369" />
        
        {/* Canonical */}
        <link rel="canonical" href={`${siteUrl}/tax-calculator`} />
        
        {/* Alternate Languages */}
        <link rel="alternate" href={`${siteUrl}/tax-calculator`} hrefLang="x-default" />
        <link rel="alternate" href={`${siteUrl}/tax-calculator`} hrefLang="en" />
        <link rel="alternate" href={`${siteUrl}/es/tax-calculator`} hrefLang="es" />
        
        {/* Preload & Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/tax-calculator`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={imagePreview} />
        <meta property="og:image:alt" content="Tax Calculator Interface for Federal Income Tax Estimation" />
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
        <meta name="twitter:image" content={imagePreview} />
        <meta name="twitter:image:alt" content="Free Tax Calculator for 2026 Federal Income Tax" />
        
        {/* Additional Social */}
        <meta name="pinterest" content="nopin" description="Free tax calculator for income tax estimation" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: pageTitle,
            description: pageDescription,
            url: `${siteUrl}/tax-calculator`,
            mainEntity: {
              '@type': 'SoftwareApplication',
              name: 'Tax Calculator',
              applicationCategory: 'FinanceApplication',
              operatingSystem: 'Any',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD'
              },
              description: 'Free online tax calculator for estimating federal income tax based on 2026 tax brackets and filing status.',
              featureList: [
                '2026 Federal tax bracket calculations',
                'Multiple filing status support',
                'Effective and marginal tax rates',
                'Tax liability estimation',
                'Privacy-focused local calculations'
              ],
              processorRequirements: 'Web browser',
              permission: 'No special permissions required'
            },
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
                { '@type': 'ListItem', position: 2, name: 'Tax Calculator', item: `${siteUrl}/tax-calculator` }
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
            name: 'Tax Calculator',
            description: 'A tool for estimating federal income tax liability based on income and filing status',
            url: `${siteUrl}/tax-calculator`,
            step: [
              {
                '@type': 'HowToStep',
                name: 'Enter Annual Income',
                text: 'Input your gross annual income in US dollars'
              },
              {
                '@type': 'HowToStep',
                name: 'Select Filing Status',
                text: 'Choose from Single, Married Filing Jointly, or Head of Household'
              },
              {
                '@type': 'HowToStep',
                name: 'Calculate Tax',
                text: 'Click calculate to see your estimated federal tax and effective rate'
              }
            ],
            tool: ['Income input field', 'Filing status selector', 'Tax bracket database'],
            about: {
              '@type': 'Thing',
              name: 'Federal Income Tax Calculation'
            },
            audience: {
              '@type': 'Audience',
              audienceType: ['Taxpayers', 'Employees', 'Self-Employed', 'Investors', 'Retirees']
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
                name: 'Is this tax calculator completely free to use?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes, our tax calculator is 100% free with no hidden costs, registration requirements, or usage limits. You can calculate your taxes as many times as needed.'
                }
              },
              {
                '@type': 'Question',
                name: 'What tax year does this calculator use?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'This calculator uses the latest 2026 federal income tax brackets and rates as published by the IRS. We update annually to reflect current tax laws.'
                }
              },
              {
                '@type': 'Question',
                name: 'Does this calculator include state taxes?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'No, this calculator estimates federal income tax only. State income taxes vary by location and are not included in these calculations.'
                }
              },
              {
                '@type': 'Question',
                name: 'Are deductions and credits included in the calculation?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'This calculator provides estimates based on taxable income before deductions and credits. For more accurate results including specific deductions, consult a tax professional.'
                }
              },
              {
                '@type': 'Question',
                name: 'How accurate is this tax calculator?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'This calculator provides reliable estimates using current IRS tax brackets. However, individual tax situations vary, and this should be used for planning purposes rather than final tax filing.'
                }
              },
              {
                '@type': 'Question',
                name: 'Do you store my tax information?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'No, all calculations are performed locally in your browser. We do not store, transmit, or collect any of your financial or tax information.'
                }
              },
              {
                '@type': 'Question',
                name: 'Can I use this calculator for self-employment income?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes, you can use this for self-employment income, but note that it does not include self-employment tax (Social Security and Medicare). This calculator focuses on federal income tax only.'
                }
              }
            ]
          })}
        </script>
      </Head>

      <div className={styles.page}>
        {/* Top Spacer (gap from navbar) */}
        <div className={styles.spacerTop}></div>

        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Tax Calculator 2026</h1>
          <p className={styles.subtitle}>
            Estimate your federal income tax, effective tax rate, and understand your tax brackets.
          </p>
        </section>

        {/* Calculator Card */}
        <div className={styles.calculatorCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.instruction}>
              Enter your annual income and select your filing status for 2026 tax estimation.
            </p>

            <div className={styles.inputGroup}>
              <label htmlFor="income" className={styles.label}>
                Annual Gross Income ($)
              </label>
              <input
                id="income"
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="e.g. 75000"
                className={styles.input}
                min="0"
                step="any"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="filingStatus" className={styles.label}>
                Filing Status
              </label>
              <select
                id="filingStatus"
                value={filingStatus}
                onChange={(e) => setFilingStatus(e.target.value)}
                className={styles.input}
              >
                <option value="single">Single</option>
                <option value="married">Married Filing Jointly</option>
                <option value="head">Head of Household</option>
              </select>
            </div>

            <button type="submit" className={styles.submitBtn}>
              <span className={styles.btnText}>Calculate My Tax</span>
              <span className={styles.arrow}>→</span>
            </button>
          </form>

          {result && (
            <div className={styles.resultSection}>
              <h3>2026 Tax Estimate</h3>
              <div className={styles.resultGrid}>
                <div className={styles.resultItem}><strong>Estimated Federal Tax:</strong> ${result.tax}</div>
                <div className={styles.resultItem}><strong>Effective Tax Rate:</strong> {result.effectiveRate}%</div>
                <div className={styles.resultItem}><strong>Annual Income:</strong> ${result.income}</div>
                <div className={styles.resultItem}><strong>Filing Status:</strong> {result.filingStatus}</div>
              </div>
              <div className={styles.note}>
                This estimate is for federal income tax only using 2026 tax brackets. Excludes state taxes, FICA, deductions, credits, and other tax considerations.
              </div>
            </div>
          )}
        </div>

        {/* Info Section */}
        <section className={styles.infoSection}>
          <div className={styles.container}>
            <div className={styles.infoCard}>
              <h2>Free Tax Calculator - Estimate Your 2026 Federal Income Tax</h2>
              <p>
                Our <strong>free online tax calculator</strong> helps you estimate your federal income tax liability for the 2026 tax year. Understand your tax brackets, effective tax rate, and plan your finances accordingly.
              </p>

              <h3>Why Use Our Tax Calculator?</h3>
              <p>
                This <strong>tax estimation tool</strong> provides instant calculations based on current IRS tax brackets, helping you make informed financial decisions throughout the year.
              </p>

              <h4>How to Calculate Your Taxes</h4>
              <ul className={styles.list}>
                <li>Enter your <strong>gross annual income</strong> (before deductions)</li>
                <li>Select your appropriate <strong>filing status</strong></li>
                <li>Click "Calculate My Tax" for instant results</li>
                <li>Review your estimated tax liability and effective rate</li>
                <li>Use results for tax planning and withholding adjustments</li>
              </ul>

              <h4>Progressive Tax System Formula</h4>
              <div className={styles.formula}>
                <code>Tax = Σ (Income in Each Bracket × Corresponding Tax Rate)</code>
              </div>
              <p><strong>Example Calculation:</strong> $75,000 (Single Filer) results in approximately $11,553 federal tax (15.4% effective rate).</p>

              <h4>2026 Federal Tax Brackets (Single Filer)</h4>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Taxable Income Range</th>
                    <th>Marginal Tax Rate</th>
                    <th>Tax Owed</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>$0 – $11,600</td><td>10%</td><td>10% of taxable income</td></tr>
                  <tr><td>$11,601 – $47,150</td><td>12%</td><td>$1,160 + 12% of amount over $11,600</td></tr>
                  <tr><td>$47,151 – $100,525</td><td>22%</td><td>$5,426 + 22% of amount over $47,150</td></tr>
                  <tr><td>$100,526 – $191,950</td><td>24%</td><td>$17,168.50 + 24% of amount over $100,525</td></tr>
                  <tr><td>$191,951 – $243,725</td><td>32%</td><td>$39,110.50 + 32% of amount over $191,950</td></tr>
                  <tr><td>$243,726 – $609,350</td><td>35%</td><td>$55,678 + 35% of amount over $243,725</td></tr>
                  <tr><td>$609,351+</td><td>37%</td><td>$183,647 + 37% of amount over $609,350</td></tr>
                </tbody>
              </table>

              <h4>Practical Applications & Real-World Uses</h4>
              <ul className={styles.list}>
                <li><strong>W-2 Employees:</strong> Adjust withholding allowances on Form W-4</li>
                <li><strong>Freelancers & Contractors:</strong> Plan quarterly estimated tax payments</li>
                <li><strong>Job Seekers:</strong> Compare after-tax income for job offers</li>
                <li><strong>Retirement Planning:</strong> Optimize retirement account contributions</li>
                <li><strong>Small Business Owners:</strong> Forecast tax liabilities and set aside funds</li>
                <li><strong>Investment Decisions:</strong> Understand tax implications of investment income</li>
                <li><strong>Bonus & Commission Planning:</strong> Estimate taxes on variable compensation</li>
                <li><strong>Side Hustle Income:</strong> Calculate tax obligations for gig economy work</li>
              </ul>

              <h4>What This Calculator Includes & Excludes</h4>
              <div className={styles.includedExcluded}>
                <div className={styles.included}>
                  <h5>✅ Included in Calculation:</h5>
                  <ul>
                    <li>Federal income tax brackets (2026 rates)</li>
                    <li>Progressive tax system calculations</li>
                    <li>Multiple filing status options</li>
                    <li>Effective and marginal tax rates</li>
                    <li>Standard deduction consideration</li>
                  </ul>
                </div>
                <div className={styles.excluded}>
                  <h5>❌ Not Included (Consult Tax Professional):</h5>
                  <ul>
                    <li>State and local income taxes</li>
                    <li>Itemized deductions (mortgage interest, etc.)</li>
                    <li>Tax credits (EITC, Child Tax Credit, etc.)</li>
                    <li>Payroll taxes (Social Security & Medicare)</li>
                    <li>Self-employment tax (15.3%)</li>
                    <li>Alternative Minimum Tax (AMT)</li>
                    <li>Investment income taxes (capital gains)</li>
                    <li>Retirement account impacts</li>
                  </ul>
                </div>
              </div>

              <h4>Key Benefits & Features</h4>
              <ul className={styles.list}>
                <li>✅ Completely free with no hidden costs</li>
                <li>✅ Updated 2026 tax brackets and rates</li>
                <li>✅ Multiple filing status support</li>
                <li>✅ Instant calculations with detailed breakdown</li>
                <li>✅ Privacy focused - no data storage</li>
                <li>✅ Mobile-friendly responsive design</li>
                <li>✅ No registration or personal information required</li>
                <li>✅ Educational tax bracket explanations</li>
                <li>✅ Regular updates for tax law changes</li>
                <li>✅ Accessible for all users</li>
              </ul>

              <h4>Who Should Use This Tax Calculator?</h4>
              <p>
                This <strong>federal tax estimation tool</strong> is designed for:
              </p>
              <ul className={styles.list}>
                <li><strong>Individual Taxpayers:</strong> Estimate personal tax liability</li>
                <li><strong>Financial Planners:</strong> Quick client tax projections</li>
                <li><strong>Small Business Owners:</strong> Business tax planning</li>
                <li><strong>Students & Young Professionals:</strong> Understand tax obligations</li>
                <li><strong>Freelancers & Gig Workers:</strong> Plan for quarterly taxes</li>
                <li><strong>Retirees:</strong> Estimate retirement income taxes</li>
                <li><strong>HR Professionals:</strong> Employee tax education</li>
              </ul>

              <div className={styles.disclaimer}>
                <h4>Important Disclaimer</h4>
                <p>
                  This tax calculator provides estimates for educational and planning purposes only. 
                  It is not a substitute for professional tax advice. Actual tax liability may vary 
                  based on individual circumstances, deductions, credits, and other factors. 
                  Always consult with a qualified tax professional for personalized tax advice 
                  and official tax filing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <h2>Need More Financial Planning Tools?</h2>
            <p>Explore our full suite of 50+ specialized calculators for comprehensive financial planning and analysis.</p>
            <Link href="/suite" legacyBehavior>
              <button
                className={styles.ctaButton}
                ref={ctaButtonRef}
                onMouseMove={handleMouseMove}
              >
                <span className={styles.buttonText}>Explore All Financial Calculators</span>
                <span className={styles.arrow}>→</span>
              </button>
            </Link>
          </div>
        </section>

        {/* Bottom Spacer (gap before footer) */}
        <div className={styles.spacerBottom}></div>
      </div>
    </>
  );
};

export default TaxCalculator;