// components/WACCCalculator.jsx
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './wacccalculator.module.css';

const WACCCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [equityValue, setEquityValue] = useState('');
  const [debtValue, setDebtValue] = useState('');
  const [costOfEquity, setCostOfEquity] = useState('');
  const [costOfDebt, setCostOfDebt] = useState('');
  const [taxRate, setTaxRate] = useState('');
  const [result, setResult] = useState(null);

  // Format number with commas
  const formatNumber = (num) => {
    if (!num && num !== 0) return '';
    return parseFloat(num).toLocaleString('en-US', {
      maximumFractionDigits: 2,
      useGrouping: true,
    });
  };

  // Parse input (remove non-digit characters except decimal)
  const parseNumber = (value) => {
    const num = value.toString().replace(/[^0-9.]/g, '');
    return num === '' ? '' : parseFloat(num);
  };

  // Handle equity input with formatting
  const handleEquityChange = (e) => {
    const input = e.target.value;
    const numericValue = parseNumber(input);
    if (input === '' || numericValue === '') {
      setEquityValue('');
      return;
    }
    if (numericValue <= 0) return;
    setEquityValue(numericValue.toString());
  };

  // Handle debt input with formatting
  const handleDebtChange = (e) => {
    const input = e.target.value;
    const numericValue = parseNumber(input);
    if (input === '' || numericValue === '') {
      setDebtValue('');
      return;
    }
    if (numericValue <= 0) return;
    setDebtValue(numericValue.toString());
  };

  // Display formatted values
  const displayEquity = equityValue ? formatNumber(equityValue) : '';
  const displayDebt = debtValue ? formatNumber(debtValue) : '';

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!equityValue || !debtValue || !costOfEquity || !costOfDebt || !taxRate) return;

    const equity = parseFloat(equityValue);
    const debt = parseFloat(debtValue);
    const totalCapital = equity + debt;

    if (totalCapital <= 0) return;

    const re = parseFloat(costOfEquity) / 100; // Cost of Equity
    const rd = parseFloat(costOfDebt) / 100; // Cost of Debt
    const tax = parseFloat(taxRate) / 100; // Tax Rate

    const weightEquity = equity / totalCapital;
    const weightDebt = debt / totalCapital;
    const afterTaxCostOfDebt = rd * (1 - tax);
    const wacc = weightEquity * re + weightDebt * afterTaxCostOfDebt;

    setResult({
      totalCapital: formatNumber(totalCapital),
      equityWeight: (weightEquity * 100).toFixed(2),
      debtWeight: (weightDebt * 100).toFixed(2),
      costOfEquity: (re * 100).toFixed(2),
      costOfDebt: (rd * 100).toFixed(2),
      afterTaxDebtCost: (afterTaxCostOfDebt * 100).toFixed(2),
      taxRate: (tax * 100).toFixed(2),
      wacc: (wacc * 100).toFixed(2),
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

  // SEO Metadata
  const siteUrl = 'https://www.financecalculatorfree.com';
  const pageTitle = 'WACC Calculator | Weighted Average Cost of Capital Tool';
  const pageDescription =
    'Calculate your company’s Weighted Average Cost of Capital (WACC) instantly. Evaluate investments, valuation, and capital structure.';
  const imagePreview = `${siteUrl}/images/wacc-calculator-preview.jpg`;

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
          content="WACC calculator, cost of capital, financial modeling, CAPM, discount rate, valuation, investment analysis"
        />
        <meta name="author" content="Calci" />
        <meta name="robots" content="index, follow" />

        {/* Canonical URL */}
        <link rel="canonical" href={`${siteUrl}/wacc-calculator`} />

        {/* Open Graph / Social */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/wacc-calculator`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={imagePreview} />
        <meta property="og:image:alt" content="WACC calculator interface showing cost of capital breakdown" />
        <meta property="og:site_name" content="Calci" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@calci" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={imagePreview} />
        <meta name="twitter:image:alt" content="Free WACC calculator for financial valuation and investment decisions" />

        {/* Structured Data - WebPage */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: pageTitle,
            description: pageDescription,
            url: `${siteUrl}/wacc-calculator`,
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
                { '@type': 'ListItem', position: 2, name: 'WACC Calculator', item: `${siteUrl}/wacc-calculator` }
              ]
            }
          })}
        </script>

        {/* Structured Data - Tool */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Tool',
            name: 'WACC Calculator',
            description: 'Calculate the weighted average cost of capital for valuation, investment, and financing decisions.',
            url: `${siteUrl}/wacc-calculator`,
            applicationCategory: 'Finance',
            offers: {
              '@type': 'Offer',
              availability: 'https://schema.org/InStock',
              price: '0',
              priceCurrency: 'USD'
            },
            featureList: [
              'Weighted Average Cost of Capital calculation',
              'Supports equity and debt inputs',
              'After-tax cost of debt included',
              'No signup or data collection'
            ]
          })}
        </script>
      </Head>

      <div className={styles.page}>
        {/* Top Spacer (gap from navbar) */}
        <div className={styles.spacerTop}></div>

        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>WACC Calculator</h1>
          <p className={styles.subtitle}>
            Calculate your company's Weighted Average Cost of Capital (WACC) to evaluate investments and valuations.
          </p>
        </section>

        {/* Calculator Card */}
        <div className={styles.calculatorCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.instruction}>
              Enter your capital structure and costs to calculate WACC.
            </p>

            <div className={styles.inputGroup}>
              <label htmlFor="equityValue" className={styles.label}>
                Market Value of Equity ($)
              </label>
              <input
                id="equityValue"
                type="text"
                value={displayEquity}
                onChange={handleEquityChange}
                placeholder="e.g. 1,000,000"
                className={styles.input}
                required
              />
              <small className={styles.note}>
                Total market cap or shareholder equity
              </small>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="debtValue" className={styles.label}>
                Market Value of Debt ($)
              </label>
              <input
                id="debtValue"
                type="text"
                value={displayDebt}
                onChange={handleDebtChange}
                placeholder="e.g. 500,000"
                className={styles.input}
                required
              />
              <small className={styles.note}>
                Includes loans, bonds, and interest-bearing liabilities
              </small>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="costOfEquity" className={styles.label}>
                Cost of Equity (%)
              </label>
              <input
                id="costOfEquity"
                type="number"
                value={costOfEquity}
                onChange={(e) => setCostOfEquity(e.target.value)}
                placeholder="e.g. 10"
                className={styles.input}
                min="0"
                step="0.01"
                required
              />
              <small className={styles.note}>
                Often estimated via CAPM (8–15% typical)
              </small>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="costOfDebt" className={styles.label}>
                Cost of Debt (%)
              </label>
              <input
                id="costOfDebt"
                type="number"
                value={costOfDebt}
                onChange={(e) => setCostOfDebt(e.target.value)}
                placeholder="e.g. 5"
                className={styles.input}
                min="0"
                step="0.01"
                required
              />
              <small className={styles.note}>
                Pre-tax interest rate on borrowings
              </small>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="taxRate" className={styles.label}>
                Corporate Tax Rate (%)
              </label>
              <input
                id="taxRate"
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                placeholder="e.g. 25"
                className={styles.input}
                min="0"
                max="100"
                step="0.01"
                required
              />
              <small className={styles.note}>
                Used for debt tax shield (e.g., US federal is 21%)
              </small>
            </div>

            <button type="submit" className={styles.submitBtn}>
              <span className={styles.btnText}>Calculate WACC</span>
              <span className={styles.arrow}>→</span>
            </button>
          </form>

          {result && (
            <div className={styles.resultSection}>
              <h3>WACC Results</h3>
              <div className={styles.resultGrid}>
                <div className={styles.resultItem}><strong>Total Capital:</strong> ${result.totalCapital}</div>
                <div className={styles.resultItem}><strong>Equity Weight:</strong> {result.equityWeight}%</div>
                <div className={styles.resultItem}><strong>Debt Weight:</strong> {result.debtWeight}%</div>
                <div className={styles.resultItem}><strong>Cost of Equity:</strong> {result.costOfEquity}%</div>
                <div className={styles.resultItem}><strong>After-Tax Cost of Debt:</strong> {result.afterTaxDebtCost}%</div>
                <div className={`${styles.resultItem} ${styles.highlight}`}>
                  <strong>WACC:</strong> {result.wacc}%
                </div>
              </div>
              <div className={styles.note}>
                Use this <strong>{result.wacc}%</strong> rate as a discount rate in DCF models and investment appraisals.
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
                The <strong>Weighted Average Cost of Capital (WACC)</strong> represents the minimum return a company must earn to satisfy its investors and creditors. It’s a cornerstone in <strong>valuation, capital budgeting, and strategic finance</strong>.
              </p>

              <h4>How to Use</h4>
              <ul className={styles.list}>
                <li>Enter the <strong>market value of equity</strong></li>
                <li>Add the <strong>market value of debt</strong></li>
                <li>Input the <strong>cost of equity</strong> (e.g., from CAPM)</li>
                <li>Enter the <strong>cost of debt</strong> (pre-tax interest)</li>
                <li>Set the <strong>corporate tax rate</strong> for tax shield</li>
                <li>Click “Calculate WACC”</li>
              </ul>

              <h4>Formula: WACC</h4>
              <div className={styles.formula}>
                <code>WACC = (E/V × Re) + (D/V × Rd × (1−Tc))</code>
              </div>
              <p>
                <strong>E</strong> = Equity<br />
                <strong>D</strong> = Debt<br />
                <strong>V</strong> = E + D<br />
                <strong>Re</strong> = Cost of Equity<br />
                <strong>Rd</strong> = Cost of Debt<br />
                <strong>Tc</strong> = Tax Rate
              </p>

              <h4>Real-World Uses</h4>
              <ul className={styles.list}>
                <li><strong>Valuation:</strong> Discount rate in DCF models</li>
                <li><strong>M&A:</strong> Assess acquisition feasibility</li>
                <li><strong>Capital Budgeting:</strong> Evaluate project ROI</li>
                <li><strong>Investor Reporting:</strong> Show hurdle rate</li>
                <li><strong>Financing Strategy:</strong> Optimize capital mix</li>
              </ul>

              <h4>Example Output</h4>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Component</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Equity</td><td>$1M</td></tr>
                  <tr><td>Debt</td><td>$500K</td></tr>
                  <tr><td>Cost of Equity</td><td>10%</td></tr>
                  <tr><td>Cost of Debt</td><td>6%</td></tr>
                  <tr><td>Tax Rate</td><td>25%</td></tr>
                  <tr><td><strong>WACC</strong></td><td><strong>7.92%</strong></td></tr>
                </tbody>
              </table>

              <h4>Tips to Improve Accuracy</h4>
              <ul className={styles.list}>
                <li>✅ Use market values, not book values</li>
                <li>✅ Estimate cost of equity using CAPM</li>
                <li>✅ Include all interest-bearing debt</li>
                <li>✅ Adjust tax rate for regional differences</li>
                <li>✅ Recalculate quarterly for dynamic firms</li>
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

export default WACCCalculator;