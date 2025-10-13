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

  // 2024 U.S. Federal Tax Brackets (standard)
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

  // SEO Metadata
  const siteUrl = 'https://www.financecalculatorfree.com';
  const pageTitle = 'Tax Calculator | Estimate Your U.S. Federal Income Tax & Rate';
  const pageDescription =
    'Estimate your U.S. federal income tax and effective tax rate based on income and filing status. Free, private, no ads.';
  const imagePreview = `${siteUrl}/images/tax-calculator-preview.jpg`;

  return (
    <>
      <Head>
        {/* Basic Meta */}
        <html lang="en" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta
          name="keywords"
          content="tax calculator, federal tax calculator, income tax estimator, tax rate calculator, U.S. tax, free tax tool"
        />
        <meta name="author" content="financecalculatorfree" />
        <meta name="robots" content="index, follow" />

        {/* Canonical URL */}
        <link rel="canonical" href={`${siteUrl}/tax-calculator`} />

        {/* Open Graph / Social */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/tax-calculator`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={imagePreview} />
        <meta property="og:image:alt" content="U.S. Federal Tax Calculator interface" />
        <meta property="og:site_name" content="financecalculatorfree" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@calci" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={imagePreview} />
        <meta name="twitter:image:alt" content="Free tax calculator for estimating federal income tax" />

        {/* Structured Data - WebPage */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: pageTitle,
            description: pageDescription,
            url: `${siteUrl}/tax-calculator`,
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
                { '@type': 'ListItem', position: 2, name: 'Tax Calculator', item: `${siteUrl}/tax-calculator` }
              ]
            }
          })}
        </script>

        {/* Structured Data - Tool */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Tool',
            name: 'Tax Calculator',
            description: 'Estimate U.S. federal income tax based on annual income and filing status.',
            url: `${siteUrl}/tax-calculator`,
            applicationCategory: 'Finance',
            offers: {
              '@type': 'Offer',
              availability: 'https://schema.org/InStock',
              price: '0',
              priceCurrency: 'USD'
            },
            featureList: [
              'Federal income tax estimation',
              'Supports Single, Married, Head of Household',
              'Shows effective tax rate',
              'No personal data collected'
            ]
          })}
        </script>
      </Head>

      <div className={styles.page}>
        {/* Top Spacer (gap from navbar) */}
        <div className={styles.spacerTop}></div>

        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Tax Calculator</h1>
          <p className={styles.subtitle}>
            Estimate your federal income tax and effective tax rate.
          </p>
        </section>

        {/* Calculator Card */}
        <div className={styles.calculatorCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.instruction}>
              Enter your annual income and select your filing status.
            </p>

            <div className={styles.inputGroup}>
              <label htmlFor="income" className={styles.label}>
                Annual Income ($)
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
              <span className={styles.btnText}>Calculate Tax</span>
              <span className={styles.arrow}>→</span>
            </button>
          </form>

          {result && (
            <div className={styles.resultSection}>
              <h3>Tax Estimate</h3>
              <div className={styles.resultGrid}>
                <div className={styles.resultItem}><strong>Estimated Tax:</strong> ${result.tax}</div>
                <div className={styles.resultItem}><strong>Effective Rate:</strong> {result.effectiveRate}%</div>
                <div className={styles.resultItem}><strong>Income:</strong> ${result.income}</div>
                <div className={styles.resultItem}><strong>Status:</strong> {result.filingStatus}</div>
              </div>
              <div className={styles.note}>
                Estimate for federal income tax only. Excludes state, payroll, or self-employment taxes.
              </div>
            </div>
          )}
        </div>

        {/* Info Section */}
        <section className={styles.infoSection}>
          <div className={styles.container}>
            <div className={styles.infoCard}>
              <h3>Why It Matters</h3>
              <p>
                A <strong>Tax Calculator</strong> helps you estimate your federal tax so you can plan your budget, adjust withholdings, or prepare for tax season.
              </p>

              <h4>How to Use</h4>
              <ul className={styles.list}>
                <li>Enter your <strong>gross annual income</strong></li>
                <li>Select your <strong>filing status</strong></li>
                <li>Click “Calculate Tax”</li>
              </ul>

              <h4>Formula: Progressive Tax System</h4>
              <div className={styles.formula}>
                <code>Tax = Σ (Income in Bracket × Rate)</code>
              </div>
              <p><strong>Example:</strong> $75,000 (Single): ~$11,553 (15.4% effective rate).</p>

              <h4>2024 Brackets (Single)</h4>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Range</th>
                    <th>Rate</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>$0 – $11,600</td><td>10%</td></tr>
                  <tr><td>$11,601 – $47,150</td><td>12%</td></tr>
                  <tr><td>$47,151 – $100,525</td><td>22%</td></tr>
                  <tr><td>$100,526 – $191,950</td><td>24%</td></tr>
                  <tr><td>$191,951 – $243,725</td><td>32%</td></tr>
                  <tr><td>$243,726 – $609,350</td><td>35%</td></tr>
                  <tr><td>$609,351+</td><td>37%</td></tr>
                </tbody>
              </table>

              <h4>Real-World Uses</h4>
              <ul className={styles.list}>
                <li><strong>Employees:</strong> Adjust W-4 withholding</li>
                <li><strong>Freelancers:</strong> Plan quarterly payments</li>
                <li><strong>Job Changers:</strong> Compare after-tax income</li>
                <li><strong>Retirees:</strong> Optimize withdrawals</li>
                <li><strong>Business Owners:</strong> Forecast liabilities</li>
              </ul>

              <h4>What’s Not Included</h4>
              <ul className={styles.list}>
                <li>✅ Deductions (standard/itemized)</li>
                <li>✅ Tax credits (EITC, Child, etc.)</li>
                <li>✅ State/local taxes</li>
                <li>✅ Payroll taxes (FICA: 7.65%)</li>
                <li>✅ Self-employment tax (15.3%)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <h2>More Financial Tools?</h2>
            <p>Explore 50+ free calculators — no login, just results.</p>
            <Link href="/suite" legacyBehavior>
              <button
                className={styles.ctaButton}
                ref={ctaButtonRef}
                onMouseMove={handleMouseMove}
              >
                <span className={styles.buttonText}>Explore All Calculators</span>
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