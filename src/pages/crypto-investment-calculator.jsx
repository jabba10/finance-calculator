import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'react-helmet';
import styles from './cryptoinvestmentcalculator.module.css';

const CryptoInvestmentCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [initialInvestment, setInitialInvestment] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('0');
  const [investmentPeriod, setInvestmentPeriod] = useState('5');
  const [expectedReturn, setExpectedReturn] = useState('100');
  const [volatility, setVolatility] = useState('70');
  const [result, setResult] = useState(null);

  // Helper: Extract first number from any string
  const parseNumber = (input) => {
    if (!input) return NaN;
    const match = input.toString().replace(/,/g, '').match(/-?\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : NaN;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setResult(null);

    // Parse required field
    const initial = Math.max(0, parseNumber(initialInvestment) || 0);
    if (initial === 0) {
      alert("Please enter a valid initial investment amount.");
      return;
    }

    // Parse optional fields with defaults
    const monthly = Math.max(0, parseNumber(monthlyContribution) || 0);
    const years = Math.max(1, Math.min(50, parseInt(investmentPeriod) || 5));

    const rawReturn = parseNumber(expectedReturn) || 100;
    const returnRate = rawReturn / 100;

    const rawVolatility = parseNumber(volatility) || 70;
    const vol = Math.max(0, Math.min(3, rawVolatility / 100)); // Max 300%

    // Calculate future value
    const months = years * 12;
    const monthlyRate = Math.pow(1 + returnRate, 1 / 12) - 1;

    let futureValue = initial * Math.pow(1 + returnRate, years);

    if (monthly > 0 && monthlyRate > 0) {
      futureValue += monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    } else if (monthly > 0 && returnRate === 0) {
      futureValue += monthly * months;
    }

    // Calculate volatility range
    const optimisticValue = futureValue * (1 + vol);
    const pessimisticValue = futureValue * Math.max(0, 1 - vol);

    setResult({
      initialInvestment: initial.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      monthlyContribution: monthly.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      investmentPeriod: years,
      expectedReturn: rawReturn.toFixed(2),
      volatility: (rawVolatility > 300 ? 300 : rawVolatility).toFixed(2),
      futureValue: futureValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      optimisticValue: optimisticValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      pessimisticValue: pessimisticValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      totalContributions: (initial + monthly * months).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
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
        <title>Crypto Investment Calculator | Cryptocurrency ROI Tool</title>
        <meta
          name="description"
          content="Free cryptocurrency investment calculator to project potential returns, account for volatility, and plan your digital asset strategy."
        />
        <meta
          name="keywords"
          content="crypto calculator, cryptocurrency investment, bitcoin calculator, crypto ROI, digital assets, crypto portfolio"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/crypto-investment-calculator" />
        <meta property="og:title" content="Crypto Investment Calculator - Project Your Returns" />
        <meta
          property="og:description"
          content="Estimate potential cryptocurrency investment growth with volatility ranges and risk considerations."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/crypto-investment-calculator" />
      </Head>

      <div className={styles.page}>
        <div className={styles.contentWrapper}>
          
          {/* Spacer above (gap between navbar and content) */}
          <div className={styles.spacerTop} />

          {/* Hero Section */}
          <section className={styles.hero}>
            <h1 className={styles.title}>Cryptocurrency Investment Calculator</h1>
            <p className={styles.subtitle}>
              Project your potential cryptocurrency investment returns and volatility.
            </p>
          </section>

          {/* Calculator Card */}
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter your investment details — we extract numbers from any format (e.g., $1K, 100%, 5 years).
              </p>

              <div className={styles.inputGroup}>
                <label htmlFor="initialInvestment" className={styles.label}>
                  Initial Investment ($)
                </label>
                <input
                  id="initialInvestment"
                  type="text"
                  value={initialInvestment}
                  onChange={(e) => setInitialInvestment(e.target.value)}
                  placeholder="e.g. $1,000 or 1K"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="monthlyContribution" className={styles.label}>
                  Monthly Contribution ($)
                </label>
                <input
                  id="monthlyContribution"
                  type="text"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(e.target.value)}
                  placeholder="e.g. $100 or 100/mo"
                  className={styles.input}
                />
                <small className={styles.note}>
                  Optional - recurring monthly investment
                </small>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="investmentPeriod" className={styles.label}>
                  Investment Period (years)
                </label>
                <select
                  id="investmentPeriod"
                  value={investmentPeriod}
                  onChange={(e) => setInvestmentPeriod(e.target.value)}
                  className={styles.input}
                >
                  {Array.from({ length: 20 }, (_, i) => i + 1).map(year => (
                    <option key={year} value={year}>{year} {year === 1 ? 'year' : 'years'}</option>
                  ))}
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="expectedReturn" className={styles.label}>
                  Expected Annual Return (%)
                </label>
                <input
                  id="expectedReturn"
                  type="text"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(e.target.value)}
                  placeholder="e.g. 200 or 200%"
                  className={styles.input}
                />
                <small className={styles.note}>
                  Historical Bitcoin return: ~100% annually (can exceed 1000%)
                </small>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="volatility" className={styles.label}>
                  Expected Volatility (%)
                </label>
                <input
                  id="volatility"
                  type="text"
                  value={volatility}
                  onChange={(e) => setVolatility(e.target.value)}
                  placeholder="e.g. 70 or 70%"
                  className={styles.input}
                />
                <small className={styles.note}>
                  Typical crypto volatility: 70–100%
                </small>
              </div>

              <button type="submit" className={styles.ctaButton}>
                <span className={styles.btnText}>Calculate Projection</span>
                <span className={styles.btnArrow}>→</span>
              </button>

              {result && (
                <div className={styles.resultSection}>
                  <h3>Cryptocurrency Investment Projection</h3>

                  <div className={styles.resultSummary}>
                    <div className={`${styles.resultItem} ${styles.highlight}`}>
                      <strong>Projected Value:</strong> ${result.futureValue}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Optimistic Scenario:</strong> ${result.optimisticValue}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Pessimistic Scenario:</strong> ${result.pessimisticValue}
                    </div>
                  </div>

                  <div className={styles.resultGrid}>
                    <div className={styles.resultItem}>
                      <strong>Initial Investment:</strong> ${result.initialInvestment}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Monthly Contribution:</strong> ${result.monthlyContribution}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Investment Period:</strong> {result.investmentPeriod} years
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Total Contributions:</strong> ${result.totalContributions}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Expected Annual Return:</strong> {result.expectedReturn}%
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Expected Volatility:</strong> {result.volatility}%
                    </div>
                  </div>

                  <div className={styles.volatilityNote}>
                    <p>
                      <strong>Note:</strong> Cryptocurrency investments are highly volatile. The projected value could range between{' '}
                      <strong>${result.pessimisticValue}</strong> and{' '}
                      <strong>${result.optimisticValue}</strong> based on the expected volatility.
                    </p>
                  </div>

                  <div className={styles.riskWarning}>
                    <h4>Risk Considerations</h4>
                    <ul className={styles.list}>
                      <li>Cryptocurrency markets can experience extreme volatility</li>
                      <li>Past performance is not indicative of future results</li>
                      <li>Only invest what you can afford to lose</li>
                      <li>Consider dollar-cost averaging to reduce volatility impact</li>
                      <li>Diversify your portfolio beyond cryptocurrencies</li>
                    </ul>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Info Section */}
          <section className={styles.infoSection}>
            <div className={styles.container}>
              <div className={styles.infoCard}>
                <h3>Why Cryptocurrency Investment Planning Matters</h3>
                <p>
                  Cryptocurrencies offer potentially high returns but come with significant volatility. This calculator helps you understand the{' '}
                  <strong>potential growth</strong> of your crypto investments while accounting for the extreme price swings characteristic of digital assets. Proper planning can help you set realistic expectations and manage risk.
                </p>

                <h4>How to Use This Calculator</h4>
                <ul className={styles.list}>
                  <li><strong>Initial Investment:</strong> Amount you're investing upfront</li>
                  <li><strong>Monthly Contribution:</strong> Optional recurring investment (DCA strategy)</li>
                  <li><strong>Investment Period:</strong> How long you plan to hold the investment</li>
                  <li><strong>Expected Annual Return:</strong> Projected yearly growth rate (e.g., 100%, 500%)</li>
                  <li><strong>Expected Volatility:</strong> Price fluctuation range (e.g., 70–100%)</li>
                  <li>Enter any format — we extract numbers from text, symbols, and units</li>
                </ul>

                <h4>Key Formulas Used</h4>
                <div className={styles.formula}>
                  <code>Future Value = Initial Investment × (1 + Annual Return)^Years + Monthly Contributions × [(1 + Monthly Return)^Months - 1] / Monthly Return</code>
                </div>
                <div className={styles.formula}>
                  <code>Monthly Return = (1 + Annual Return)^(1/12) - 1</code>
                </div>
                <div className={styles.formula}>
                  <code>Optimistic Value = Future Value × (1 + Volatility)</code>
                </div>
                <div className={styles.formula}>
                  <code>Pessimistic Value = Future Value × (1 - Volatility)</code>
                </div>

                <h4>Historical Cryptocurrency Returns</h4>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Cryptocurrency</th>
                      <th>5-Year Annualized Return</th>
                      <th>Max Drawdown</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Bitcoin (BTC)</td>
                      <td>~100%</td>
                      <td>-83% (2018)</td>
                    </tr>
                    <tr>
                      <td>Ethereum (ETH)</td>
                      <td>~150%</td>
                      <td>-94% (2018)</td>
                    </tr>
                    <tr>
                      <td>Binance Coin (BNB)</td>
                      <td>~200%</td>
                      <td>-80% (2022)</td>
                    </tr>
                    <tr>
                      <td>Cardano (ADA)</td>
                      <td>~50%</td>
                      <td>-90% (2018)</td>
                    </tr>
                  </tbody>
                </table>

                <h4>Investment Strategies</h4>
                <div className={styles.strategies}>
                  <div className={styles.strategy}>
                    <h5>Dollar-Cost Averaging (DCA)</h5>
                    <ul className={styles.list}>
                      <li>Invest fixed amounts at regular intervals</li>
                      <li>Reduces impact of volatility</li>
                      <li>Eliminates timing the market</li>
                      <li>Works well with monthly contributions</li>
                    </ul>
                  </div>
                  <div className={styles.strategy}>
                    <h5>HODL Strategy</h5>
                    <ul className={styles.list}>
                      <li>Buy and hold long-term regardless of price</li>
                      <li>Based on belief in long-term appreciation</li>
                      <li>Requires strong conviction</li>
                      <li>Minimizes trading fees and taxes</li>
                    </ul>
                  </div>
                  <div className={styles.strategy}>
                    <h5>Diversification</h5>
                    <ul className={styles.list}>
                      <li>Spread investments across multiple assets</li>
                      <li>Reduces single-asset risk</li>
                      <li>Consider mix of large and small caps</li>
                      <li>Rebalance portfolio periodically</li>
                    </ul>
                  </div>
                </div>

                <h4>Risk Management Techniques</h4>
                <ul className={styles.list}>
                  <li><strong>Position Sizing:</strong> Limit crypto to 5–10% of total portfolio</li>
                  <li><strong>Stop-Loss Orders:</strong> Automatically sell if price drops too much</li>
                  <li><strong>Take-Profit Targets:</strong> Secure profits at predetermined levels</li>
                  <li><strong>Cold Storage:</strong> Keep most assets in offline wallets</li>
                  <li><strong>Stablecoin Allocation:</strong> Maintain portion in stable assets</li>
                  <li><strong>Tax Planning:</strong> Understand capital gains implications</li>
                </ul>

                <h4>Tax Considerations</h4>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Country</th>
                      <th>Capital Gains Tax</th>
                      <th>Holding Period</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>United States</td>
                      <td>0–37%</td>
                      <td>Short-term: less than 1 year, Long-term: ≥1 year</td>
                    </tr>
                    <tr>
                      <td>United Kingdom</td>
                      <td>10–20%</td>
                      <td>Tax-free allowance: £12,300</td>
                    </tr>
                    <tr>
                      <td>Germany</td>
                      <td>0% after 1 year</td>
                      <td>Tax-free after 1 year holding</td>
                    </tr>
                    <tr>
                      <td>Australia</td>
                      <td>Income tax rate</td>
                      <td>Discount if held for more than 12 months</td>
                    </tr>
                  </tbody>
                </table>
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
                  className={styles.ctaButtonLink}
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

export default CryptoInvestmentCalculator;