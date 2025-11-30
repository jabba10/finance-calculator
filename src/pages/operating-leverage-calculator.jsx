import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'react-helmet';
import styles from './leveragecalculator.module.css';

const LeverageCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [totalAssets, setTotalAssets] = useState('');
  const [totalEquity, setTotalEquity] = useState('');
  const [ebit, setEbit] = useState('');
  const [interestExpense, setInterestExpense] = useState('');
  const [result, setResult] = useState(null);

  // Helper: Extract first number from any string
  const parseNumber = (input) => {
    if (!input) return NaN;
    const match = input.toString().replace(/,/g, '').match(/\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : NaN;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setResult(null);

    // Parse all inputs safely
    const assets = Math.max(0, parseNumber(totalAssets) || 0);
    const equity = Math.max(0, parseNumber(totalEquity) || 0);
    const ebitValue = Math.max(0, parseNumber(ebit) || 0);
    const interest = Math.max(0, parseNumber(interestExpense) || 0);

    // Avoid division by zero
    if (equity === 0 || assets === 0 || interest === 0) {
      alert("Please enter valid positive values. Equity, Assets, and Interest Expense must be greater than zero.");
      return;
    }

    // Calculate derived values
    const debt = assets - equity;

    // Ratios
    const debtToEquity = equity > 0 ? debt / equity : Infinity;
    const debtToAssets = assets > 0 ? (debt / assets) * 100 : 0;
    const equityMultiplier = equity > 0 ? assets / equity : 0;
    const interestCoverage = interest > 0 ? ebitValue / interest : Infinity;

    // Format result for display
    setResult({
      totalAssets: assets.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      totalEquity: equity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      totalDebt: debt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      debtToEquity: isFinite(debtToEquity) ? debtToEquity.toFixed(2) : 'Infinity',
      debtToAssets: debtToAssets.toFixed(2),
      equityMultiplier: equityMultiplier.toFixed(2),
      interestCoverage: isFinite(interestCoverage) ? interestCoverage.toFixed(2) : 'Infinity',
      ebit: ebitValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      interestExpense: interest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
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

  return (
    <>
      {/* SEO Meta Tags */}
      <Head>
        <title>Leverage Calculator | Debt-to-Equity & Coverage Ratios</title>
        <meta
          name="description"
          content="Free leverage calculator to analyze debt-to-equity, debt-to-assets, equity multiplier, and interest coverage ratios for business financial health."
        />
        <meta
          name="keywords"
          content="leverage calculator, debt to equity, financial leverage, interest coverage ratio, business finance tools, debt calculator, financial leverage calculator, operating leverage calculator, financial ratio calculator, debt to equity calculator, leverage ratio calculator, business leverage calculator, company leverage analysis, financial risk calculator, capital structure calculator, debt analysis tool, equity multiplier calculator, interest coverage calculator, debt ratio calculator, financial health calculator, leverage analysis, corporate finance calculator, investment leverage calculator, trading leverage calculator, margin calculator, financial leverage ratio, debt management calculator, business debt calculator, financial risk assessment, leverage metrics, debt capacity calculator, financial leverage analysis, optimal leverage calculator, debt financing calculator, equity financing calculator, capital leverage calculator, financial leverage tool, business risk calculator, debt service coverage, leverage effect calculator, financial leverage measurement, debt equity ratio calculator, company debt analysis, financial leverage assessment, leverage calculation tool, debt structure analysis, financial leverage metrics, business financial calculator, corporate leverage calculator, investment leverage analysis, trading margin calculator, financial leverage evaluation, debt optimization calculator, leverage ratio analysis, financial leverage management, debt to capital calculator, equity ratio calculator, financial leverage optimization, business financing calculator, debt assessment tool, financial leverage planning, leverage strategy calculator, debt management tool, financial leverage simulation, business leverage analysis, corporate debt calculator, investment leverage tool, trading leverage analysis, financial leverage calculator online, free leverage calculator, business leverage ratio calculator, debt to equity ratio calculator, financial leverage ratio calculator, operating leverage ratio calculator, combined leverage calculator, degree of leverage calculator, financial leverage calculator excel, leverage ratio formula calculator, debt calculator business, equity calculator finance, financial leverage calculator for business, company leverage ratio calculator, small business leverage calculator, startup leverage calculator, corporate leverage ratio calculator, financial leverage calculator app, online leverage calculator free, business financial ratio calculator, debt analysis calculator, financial health assessment calculator, capital structure analysis calculator, business risk assessment calculator, debt financing analysis, equity financing analysis, financial leverage calculator with steps, leverage calculator for investors, trading leverage calculator forex, margin leverage calculator, financial leverage calculator for trading, investment leverage calculator stock, business loan leverage calculator, debt to equity ratio analysis, financial leverage calculator for companies, corporate finance leverage calculator, financial leverage calculator for small business, leverage ratio calculator online, debt ratio calculator business, interest coverage ratio calculator, debt service coverage ratio calculator, equity multiplier calculator online, financial leverage calculator free online, business calculator leverage ratio, debt calculator for business owners, financial leverage calculator for startups, company financial health calculator, business financial analysis calculator, corporate financial ratio calculator, financial leverage calculator download, leverage calculator mobile app, financial leverage calculator web, business finance calculator online, debt to equity calculator free, financial leverage calculator tool, business financial calculator app, corporate financial calculator online, investment leverage calculator free, trading leverage calculator online, margin calculator leverage, financial leverage calculator software, business leverage calculation tool, debt analysis online calculator, financial health calculator tool, capital structure calculator online, business risk calculator free, debt financing calculator online, equity financing calculator free, financial leverage calculator business, company leverage calculator free, small business leverage calculator online, startup leverage calculator free, corporate leverage calculator tool, financial leverage calculator application, online leverage calculator tool, business financial ratio calculator free, debt analysis calculator online, financial health assessment tool, capital structure analysis tool, business risk assessment tool, debt financing analysis calculator, equity financing analysis tool, financial leverage calculator step by step, leverage calculator for investment, trading leverage calculator free, margin leverage calculator online, financial leverage calculator for traders, investment leverage calculator online, business loan leverage calculator free, debt to equity ratio calculator tool, financial leverage calculator for corporations, corporate finance leverage tool, financial leverage calculator for entrepreneurs, leverage ratio calculator free, debt ratio calculator online, interest coverage ratio calculator free, debt service coverage ratio calculator online, equity multiplier calculator free, financial leverage calculator no download, business calculator leverage free, debt calculator for small business, financial leverage calculator for new business, company financial health tool, business financial analysis tool, corporate financial ratio tool, financial leverage calculator mobile, leverage calculator android ios, financial leverage calculator responsive, business finance calculator mobile, debt to equity calculator mobile, financial leverage calculator PWA, business financial calculator mobile app, corporate financial calculator mobile, investment leverage calculator app, trading leverage calculator mobile, margin calculator app, financial leverage calculator cross platform, business leverage calculation mobile, debt analysis mobile calculator, financial health calculator app, capital structure calculator mobile, business risk calculator app, debt financing calculator mobile, equity financing calculator app, financial leverage calculator business app, company leverage calculator mobile, small business leverage calculator app, startup leverage calculator mobile, corporate leverage calculator app, financial leverage calculator progressive web app, online leverage calculator mobile optimized, business financial ratio calculator app, debt analysis calculator mobile, financial health assessment app, capital structure analysis app, business risk assessment app, debt financing analysis mobile, equity financing analysis app, financial leverage calculator step by step mobile, leverage calculator for investment app, trading leverage calculator mobile app, margin leverage calculator app, financial leverage calculator for traders app, investment leverage calculator mobile, business loan leverage calculator app, debt to equity ratio calculator app, financial leverage calculator for corporations app, corporate finance leverage app, financial leverage calculator for entrepreneurs app, leverage ratio calculator app, debt ratio calculator app, interest coverage ratio calculator app, debt service coverage ratio calculator app, equity multiplier calculator app, financial leverage calculator web app, business calculator leverage app, debt calculator for business owners app, financial leverage calculator for startups app, company financial health app, business financial analysis app, corporate financial ratio app, financial leverage calculator desktop, leverage calculator windows mac, financial leverage calculator chrome, business finance calculator desktop, debt to equity calculator desktop, financial leverage calculator extension, business financial calculator desktop, corporate financial calculator desktop, investment leverage calculator desktop, trading leverage calculator desktop, margin calculator desktop, financial leverage calculator for desktop, business leverage calculation desktop, debt analysis desktop calculator, financial health calculator desktop, capital structure calculator desktop, business risk calculator desktop, debt financing calculator desktop, equity financing calculator desktop, financial leverage calculator business desktop, company leverage calculator desktop, small business leverage calculator desktop, startup leverage calculator desktop, corporate leverage calculator desktop, financial leverage calculator browser based, online leverage calculator desktop, business financial ratio calculator desktop, debt analysis calculator desktop, financial health assessment desktop, capital structure analysis desktop, business risk assessment desktop, debt financing analysis desktop, equity financing analysis desktop, financial leverage calculator step by step desktop, leverage calculator for investment desktop, trading leverage calculator desktop app, margin leverage calculator desktop, financial leverage calculator for traders desktop, investment leverage calculator desktop version, business loan leverage calculator desktop, debt to equity ratio calculator desktop, financial leverage calculator for corporations desktop, corporate finance leverage desktop, financial leverage calculator for entrepreneurs desktop, leverage ratio calculator desktop, debt ratio calculator desktop, interest coverage ratio calculator desktop, debt service coverage ratio calculator desktop, equity multiplier calculator desktop"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/leverage-calculator" />
        <meta property="og:title" content="Leverage Calculator - Analyze Financial Risk" />
        <meta
          property="og:description"
          content="Calculate key leverage ratios to assess your company's capital structure and risk exposure."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/leverage-calculator" />
      </Head>

      <div className={styles.page}>
        <div className={styles.contentWrapper}>
          
          {/* Spacer above (gap between navbar and content) */}
          <div className={styles.spacerTop} />

          {/* Hero Section */}
          <section className={styles.hero}>
            <h1 className={styles.title}>Leverage Calculator</h1>
            <p className={styles.subtitle}>
              Analyze your company's financial leverage and debt structure.
            </p>
          </section>

          {/* Calculator Card */}
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter your financial data — we extract numbers from any format (e.g., $1M, 500K, EBIT: $150k).
              </p>

              <div className={styles.inputGroup}>
                <label htmlFor="totalAssets" className={styles.label}>
                  Total Assets ($)
                </label>
                <input
                  id="totalAssets"
                  type="text"
                  value={totalAssets}
                  onChange={(e) => setTotalAssets(e.target.value)}
                  placeholder="e.g. $1,000,000 or 1M"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="totalEquity" className={styles.label}>
                  Total Equity ($)
                </label>
                <input
                  id="totalEquity"
                  type="text"
                  value={totalEquity}
                  onChange={(e) => setTotalEquity(e.target.value)}
                  placeholder="e.g. $400,000 or 400K"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="ebit" className={styles.label}>
                  EBIT ($)
                </label>
                <input
                  id="ebit"
                  type="text"
                  value={ebit}
                  onChange={(e) => setEbit(e.target.value)}
                  placeholder="e.g. $150,000 or 150K"
                  className={styles.input}
                />
                <small className={styles.note}>
                  Earnings Before Interest and Taxes
                </small>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="interestExpense" className={styles.label}>
                  Interest Expense ($)
                </label>
                <input
                  id="interestExpense"
                  type="text"
                  value={interestExpense}
                  onChange={(e) => setInterestExpense(e.target.value)}
                  placeholder="e.g. $25,000 or 25K"
                  className={styles.input}
                />
              </div>

              <button type="submit" className={styles.submitBtn}>
                <span className={styles.btnText}>Calculate Leverage</span>
                <span className={styles.arrow}>→</span>
              </button>

              {result && (
                <div className={styles.resultSection}>
                  <h3>Leverage Analysis Results</h3>
                  <div className={styles.resultGrid}>
                    <div className={styles.resultItem}>
                      <strong>Total Debt:</strong> ${result.totalDebt}
                    </div>
                    <div className={`${styles.resultItem} ${styles.highlight}`}>
                      <strong>Debt-to-Equity Ratio:</strong> {result.debtToEquity}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Debt-to-Assets Ratio:</strong> {result.debtToAssets}%
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Equity Multiplier:</strong> {result.equityMultiplier}
                    </div>
                    <div className={`${styles.resultItem} ${styles.highlight}`}>
                      <strong>Interest Coverage Ratio:</strong> {result.interestCoverage}x
                    </div>
                  </div>
                  <div className={styles.note}>
                    {parseFloat(result.debtToEquity) > 2 && result.debtToEquity !== 'Infinity' ? (
                      <span>
                        Your debt-to-equity ratio of <strong>{result.debtToEquity}</strong> indicates{' '}
                        <strong>high financial leverage</strong>, which may increase risk but can amplify returns.
                      </span>
                    ) : result.debtToEquity === 'Infinity' ? (
                      <span>
                        <strong>Zero equity detected</strong> — this suggests a highly risky capital structure.
                      </span>
                    ) : (
                      <span>
                        Your debt-to-equity ratio of <strong>{result.debtToEquity}</strong> indicates{' '}
                        <strong>moderate financial leverage</strong>, suggesting a balanced capital structure.
                      </span>
                    )}
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Info Section */}
          <section className={styles.infoSection}>
            <div className={styles.container}>
              <div className={styles.infoCard}>
                <h3>Why Leverage Matters</h3>
                <p>
                  <strong>Financial leverage</strong> measures how much debt a company uses to finance its assets. While leverage can magnify returns, it also increases risk. Understanding your leverage ratios helps assess{' '}
                  <strong>financial stability, risk exposure, and capital structure efficiency</strong>.
                </p>

                <h4>How to Use This Calculator</h4>
                <ul className={styles.list}>
                  <li><strong>Total Assets:</strong> Sum of all assets on the balance sheet</li>
                  <li><strong>Total Equity:</strong> Total shareholders' equity</li>
                  <li><strong>EBIT:</strong> Operating profit before interest and taxes</li>
                  <li><strong>Interest Expense:</strong> Annual interest payments on debt</li>
                  <li>Enter values freely — we extract numbers from any format (e.g., $1M, 500K, EBIT: $150k)</li>
                  <li>Click "Calculate Leverage" to analyze your capital structure</li>
                </ul>

                <h4>Key Leverage Ratios</h4>
                <div className={styles.formula}>
                  <code>Debt-to-Equity = Total Debt / Total Equity</code>
                </div>
                <div className={styles.formula}>
                  <code>Debt-to-Assets = Total Debt / Total Assets</code>
                </div>
                <div className={styles.formula}>
                  <code>Equity Multiplier = Total Assets / Total Equity</code>
                </div>
                <div className={styles.formula}>
                  <code>Interest Coverage = EBIT / Interest Expense</code>
                </div>

                <h4>Interpreting Leverage Ratios</h4>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Ratio</th>
                      <th>Healthy Range</th>
                      <th>Interpretation</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Debt-to-Equity</td>
                      <td>0.5–2.0</td>
                      <td>Higher values indicate more aggressive financing</td>
                    </tr>
                    <tr>
                      <td>Debt-to-Assets</td>
                      <td>{'<'} 0.6</td>
                      <td>Percentage of assets financed by debt</td>
                    </tr>
                    <tr>
                      <td>Equity Multiplier</td>
                      <td>1.0–3.0</td>
                      <td>Higher values show more assets per equity dollar</td>
                    </tr>
                    <tr>
                      <td>Interest Coverage</td>
                      <td>{'>'} 3.0</td>
                      <td>Ability to pay interest from operating income</td>
                    </tr>
                  </tbody>
                </table>

                <h4>Industry Benchmarks</h4>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Industry</th>
                      <th>Avg Debt-to-Equity</th>
                      <th>Typical Interest Coverage</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Utilities</td>
                      <td>1.5–2.5</td>
                      <td>3–5x</td>
                    </tr>
                    <tr>
                      <td>Technology</td>
                      <td>0.3–1.0</td>
                      <td>8–12x</td>
                    </tr>
                    <tr>
                      <td>Manufacturing</td>
                      <td>0.8–1.5</td>
                      <td>4–6x</td>
                    </tr>
                    <tr>
                      <td>Retail</td>
                      <td>1.0–2.0</td>
                      <td>5–7x</td>
                    </tr>
                    <tr>
                      <td>Banking</td>
                      <td>4.0–10.0</td>
                      <td>N/A</td>
                    </tr>
                  </tbody>
                </table>

                <h4>Pros and Cons of Leverage</h4>
                <div className={styles.prosCons}>
                  <div className={styles.pros}>
                    <h5>Advantages</h5>
                    <ul className={styles.list}>
                      <li>✅ Amplifies returns on equity when profitable</li>
                      <li>✅ Interest payments are tax-deductible</li>
                      <li>✅ Allows faster growth than equity financing alone</li>
                      <li>✅ Maintains ownership control (no equity dilution)</li>
                    </ul>
                  </div>
                  <div className={styles.cons}>
                    <h5>Risks</h5>
                    <ul className={styles.list}>
                      <li>❌ Increases financial risk and potential bankruptcy</li>
                      <li>❌ Fixed interest payments reduce cash flow flexibility</li>
                      <li>❌ Higher leverage may increase borrowing costs</li>
                      <li>❌ Magnifies losses during downturns</li>
                    </ul>
                  </div>
                </div>

                <h4>Optimal Leverage Strategies</h4>
                <ul className={styles.list}>
                  <li><strong>Match debt maturity with asset life:</strong> Finance long-term assets with long-term debt</li>
                  <li><strong>Maintain coverage ratios:</strong> Ensure EBIT comfortably covers interest payments</li>
                  <li><strong>Consider industry norms:</strong> Leverage appropriate for your sector</li>
                  <li><strong>Stress test scenarios:</strong> Model performance under adverse conditions</li>
                  <li><strong>Monitor covenants:</strong> Stay compliant with lender requirements</li>
                </ul>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className={styles.ctaSection}>
            <div className={styles.ctaSectionInner}>
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
            </div>
          </section>

          {/* Footer Spacer */}
          <div className={styles.footerSpacer} />
        </div>
      </div>
    </>
  );
};

export default LeverageCalculator;