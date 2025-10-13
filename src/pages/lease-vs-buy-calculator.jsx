import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'react-helmet';
import styles from './leasevsbuycalculator.module.css';

const LeaseVsBuyCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [assetCost, setAssetCost] = useState('');
  const [leaseTerm, setLeaseTerm] = useState('36');
  const [monthlyLease, setMonthlyLease] = useState('');
  const [downPayment, setDownPayment] = useState('0');
  const [loanTerm, setLoanTerm] = useState('60');
  const [interestRate, setInterestRate] = useState('5');
  const [residualValue, setResidualValue] = useState('0');
  const [taxRate, setTaxRate] = useState('25');
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

    // Parse required fields
    const cost = Math.max(0, parseNumber(assetCost) || 0);
    const leaseMonthly = Math.max(0, parseNumber(monthlyLease) || 0);

    // Prevent calculation if no cost or lease payment
    if (cost === 0 || leaseMonthly === 0) {
      alert("Please enter valid values for Asset Cost and Monthly Lease Payment.");
      return;
    }

    // Optional fields with defaults
    const down = Math.max(0, parseNumber(downPayment) || 0);
    const residual = Math.max(0, parseNumber(residualValue) || 0);
    const rate = Math.max(0, parseNumber(interestRate) || 0) / 100;
    const taxPercent = Math.max(0, Math.min(100, parseNumber(taxRate) || 0));
    const tax = taxPercent / 100;

    const term = parseInt(leaseTerm) || 36;
    const loanTermMonths = parseInt(loanTerm) || 60;

    // --- Lease Calculations ---
    const totalLeasePayments = leaseMonthly * term;
    const leaseTaxSavings = totalLeasePayments * tax;
    const netLeaseCost = totalLeasePayments - leaseTaxSavings;

    // --- Purchase Calculations ---
    const loanAmount = Math.max(0, cost - down);
    const monthlyInterestRate = rate / 12;
    const monthlyLoanPayment = loanAmount > 0 && monthlyInterestRate > 0
      ? (loanAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -loanTermMonths))
      : 0;

    const totalLoanPayments = monthlyLoanPayment * loanTermMonths;
    const interestPayments = totalLoanPayments - loanAmount;
    const depreciation = cost - residual;
    const taxSavings = (interestPayments + depreciation) * tax;
    const netPurchaseCost = cost + interestPayments - taxSavings - residual;

    // Format result for display
    setResult({
      assetCost: cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      leaseTerm: term,
      monthlyLease: leaseMonthly.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      totalLeasePayments: totalLeasePayments.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      leaseTaxSavings: leaseTaxSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      netLeaseCost: netLeaseCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      downPayment: down.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      loanTerm: loanTermMonths,
      interestRate: (rate * 100).toFixed(2),
      monthlyLoanPayment: monthlyLoanPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      totalLoanPayments: totalLoanPayments.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      interestPayments: interestPayments.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      residualValue: residual.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      taxSavings: taxSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      netPurchaseCost: netPurchaseCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      recommendation: netLeaseCost < netPurchaseCost ? 'Leasing' : 'Buying',
      costDifference: Math.abs(netLeaseCost - netPurchaseCost).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
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
        <title>Lease vs Buy Calculator | Equipment & Vehicle Decision Tool</title>
        <meta
          name="description"
          content="Compare leasing vs buying equipment or vehicles with our free calculator. Analyze costs, tax benefits, and financing to make the best financial decision."
        />
        <meta
          name="keywords"
          content="lease vs buy calculator, equipment leasing, vehicle lease calculator, purchase vs lease, business finance tools"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/lease-vs-buy-calculator" />
        <meta property="og:title" content="Lease vs Buy Calculator - Financial Comparison Tool" />
        <meta
          property="og:description"
          content="Compare the total cost of leasing versus buying assets like vehicles and equipment with tax and financing considerations."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/lease-vs-buy-calculator" />
      </Head>

      <div className={styles.page}>
        <div className={styles.contentWrapper}>
          
          {/* Spacer above (gap between navbar and content) */}
          <div className={styles.spacerTop} />

          {/* Hero Section */}
          <section className={styles.hero}>
            <h1 className={styles.title}>Lease vs. Buy Calculator</h1>
            <p className={styles.subtitle}>
              Compare the financial impact of leasing versus buying equipment or vehicles.
            </p>
          </section>

          {/* Calculator Card */}
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter details for both options — we extract numbers from any format (e.g., $50K, $800/mo, 25%).
              </p>

              <div className={styles.inputGroup}>
                <label htmlFor="assetCost" className={styles.label}>
                  Asset Cost ($)
                </label>
                <input
                  id="assetCost"
                  type="text"
                  value={assetCost}
                  onChange={(e) => setAssetCost(e.target.value)}
                  placeholder="e.g. $50,000 or 50K"
                  className={styles.input}
                />
              </div>

              <h4 className={styles.sectionTitle}>Lease Details</h4>

              <div className={styles.inputGroup}>
                <label htmlFor="leaseTerm" className={styles.label}>
                  Lease Term (months)
                </label>
                <select
                  id="leaseTerm"
                  value={leaseTerm}
                  onChange={(e) => setLeaseTerm(e.target.value)}
                  className={styles.input}
                >
                  <option value="24">24 months</option>
                  <option value="36">36 months</option>
                  <option value="48">48 months</option>
                  <option value="60">60 months</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="monthlyLease" className={styles.label}>
                  Monthly Lease Payment ($)
                </label>
                <input
                  id="monthlyLease"
                  type="text"
                  value={monthlyLease}
                  onChange={(e) => setMonthlyLease(e.target.value)}
                  placeholder="e.g. $800 or 800/mo"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="residualValue" className={styles.label}>
                  Residual/Buyout Value ($)
                </label>
                <input
                  id="residualValue"
                  type="text"
                  value={residualValue}
                  onChange={(e) => setResidualValue(e.target.value)}
                  placeholder="e.g. $10,000 or 10K"
                  className={styles.input}
                />
                <small className={styles.note}>
                  Optional - value to purchase asset at lease end
                </small>
              </div>

              <h4 className={styles.sectionTitle}>Purchase Details</h4>

              <div className={styles.inputGroup}>
                <label htmlFor="downPayment" className={styles.label}>
                  Down Payment ($)
                </label>
                <input
                  id="downPayment"
                  type="text"
                  value={downPayment}
                  onChange={(e) => setDownPayment(e.target.value)}
                  placeholder="e.g. $5,000 or 5K"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="loanTerm" className={styles.label}>
                  Loan Term (months)
                </label>
                <select
                  id="loanTerm"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  className={styles.input}
                >
                  <option value="36">36 months</option>
                  <option value="48">48 months</option>
                  <option value="60">60 months</option>
                  <option value="72">72 months</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="interestRate" className={styles.label}>
                  Interest Rate (%)
                </label>
                <input
                  id="interestRate"
                  type="text"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  placeholder="e.g. 5 or 5%"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="taxRate" className={styles.label}>
                  Tax Rate (%)
                </label>
                <input
                  id="taxRate"
                  type="text"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  placeholder="e.g. 25 or 25%"
                  className={styles.input}
                />
                <small className={styles.note}>
                  For tax deduction calculations
                </small>
              </div>

              <button type="submit" className={styles.ctaButton}>
                <span className={styles.btnText}>Compare Options</span>
                <span className={styles.btnArrow}>→</span>
              </button>

              {result && (
                <div className={styles.result}>
                  <h3>Lease vs. Buy Comparison</h3>

                  <div className={styles.resultSummary}>
                    <div className={`${styles.option} ${result.recommendation === 'Leasing' ? styles.highlight : ''}`}>
                      <h4>Lease</h4>
                      <div className={styles.optionCost}>
                        <strong>Total Cost:</strong> ${result.netLeaseCost}
                      </div>
                      <div className={styles.optionDetails}>
                        <div>Monthly Payment: ${result.monthlyLease}</div>
                        <div>Term: {result.leaseTerm} months</div>
                        <div>Tax Savings: ${result.leaseTaxSavings}</div>
                      </div>
                    </div>

                    <div className={styles.vs}>VS</div>

                    <div className={`${styles.option} ${result.recommendation === 'Buying' ? styles.highlight : ''}`}>
                      <h4>Buy</h4>
                      <div className={styles.optionCost}>
                        <strong>Total Cost:</strong> ${result.netPurchaseCost}
                      </div>
                      <div className={styles.optionDetails}>
                        <div>Monthly Payment: ${result.monthlyLoanPayment}</div>
                        <div>Term: {result.loanTerm} months</div>
                        <div>Tax Savings: ${result.taxSavings}</div>
                        <div>Residual Value: ${result.residualValue}</div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.recommendation}>
                    <h4>Recommendation: {result.recommendation}</h4>
                    <p>
                      {result.recommendation === 'Leasing'
                        ? `Leasing is $${result.costDifference} cheaper than buying over the comparable period.`
                        : `Buying is $${result.costDifference} cheaper than leasing over the comparable period.`}
                    </p>
                  </div>

                  <div className={styles.resultGrid}>
                    <div className={styles.resultItem}>
                      <strong>Asset Cost:</strong> ${result.assetCost}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Down Payment:</strong> ${result.downPayment}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Interest Rate:</strong> {result.interestRate}%
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Tax Rate:</strong> {taxRate}%
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Info Section */}
          <section className={styles.infoSection}>
            <div className={styles.container}>
              <div className={styles.infoCard}>
                <h3>Why Lease vs. Buy Analysis Matters</h3>
                <p>
                  The decision to <strong>lease or buy</strong> equipment, vehicles, or property has significant financial implications. This calculator helps you compare the <strong>total cost of ownership</strong> for both options, considering financing costs, tax benefits, and residual values to determine the most cost-effective choice for your situation.
                </p>

                <h4>How to Use This Calculator</h4>
                <ul className={styles.list}>
                  <li><strong>Asset Cost:</strong> Total purchase price if buying</li>
                  <li><strong>Lease Term:</strong> Duration of lease agreement</li>
                  <li><strong>Monthly Lease Payment:</strong> Fixed lease payment amount</li>
                  <li><strong>Residual Value:</strong> Optional buyout amount at lease end</li>
                  <li><strong>Down Payment:</strong> Initial payment if purchasing</li>
                  <li><strong>Loan Term:</strong> Duration of financing if buying</li>
                  <li><strong>Interest Rate:</strong> APR on purchase financing</li>
                  <li><strong>Tax Rate:</strong> Your marginal tax rate for deduction calculations</li>
                  <li>Enter any format — we extract numbers from text, symbols, and units</li>
                </ul>

                <h4>Key Formulas Used</h4>
                <div className={styles.formula}>
                  <code>Loan Payment = (Loan Amount × Monthly Interest Rate) / (1 - (1 + Monthly Interest Rate)^-Term)</code>
                </div>
                <div className={styles.formula}>
                  <code>Net Lease Cost = Total Lease Payments - (Total Lease Payments × Tax Rate)</code>
                </div>
                <div className={styles.formula}>
                  <code>Net Purchase Cost = Asset Cost + Total Interest - (Interest + Depreciation) × Tax Rate - Residual Value</code>
                </div>

                <h4>When Leasing Makes Sense</h4>
                <ul className={styles.list}>
                  <li>✅ You need the latest equipment/technology regularly</li>
                  <li>✅ Cash flow is more important than ownership</li>
                  <li>✅ Tax benefits are greater with operating leases</li>
                  <li>✅ Maintenance is included in lease terms</li>
                  <li>✅ You don't want disposal/resale hassles</li>
                </ul>

                <h4>When Buying Makes Sense</h4>
                <ul className={styles.list}>
                  <li>✅ You'll use the asset beyond the lease term</li>
                  <li>✅ You can take advantage of capital allowances/depreciation</li>
                  <li>✅ The asset holds value well (low depreciation)</li>
                  <li>✅ You want to build equity in the asset</li>
                  <li>✅ Interest rates are favorable compared to lease factors</li>
                </ul>

                <h4>Tax Considerations</h4>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Option</th>
                      <th>Tax Treatment</th>
                      <th>Benefit</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Lease</td>
                      <td>Lease payments typically fully deductible as operating expense</td>
                      <td>Immediate tax savings on entire payment</td>
                    </tr>
                    <tr>
                      <td>Buy (Loan)</td>
                      <td>Interest deductible; depreciation claimed over time</td>
                      <td>Longer-term tax benefits from depreciation</td>
                    </tr>
                    <tr>
                      <td>Buy (Cash)</td>
                      <td>Depreciation claimed over time; possible Section 179 deduction</td>
                      <td>Potential for accelerated depreciation</td>
                    </tr>
                  </tbody>
                </table>

                <h4>Industry Benchmarks</h4>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Asset Type</th>
                      <th>Typical Lease Term</th>
                      <th>Common Buy Decision Factors</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Vehicles</td>
                      <td>24–48 months</td>
                      <td>Mileage, customization needs, long-term use</td>
                    </tr>
                    <tr>
                      <td>Equipment</td>
                      <td>36–60 months</td>
                      <td>Technology lifecycle, maintenance costs</td>
                    </tr>
                    <tr>
                      <td>Real Estate</td>
                      <td>5–10 years</td>
                      <td>Location stability, appreciation potential</td>
                    </tr>
                    <tr>
                      <td>Technology</td>
                      <td>12–36 months</td>
                      <td>Upgrade cycles, software compatibility</td>
                    </tr>
                  </tbody>
                </table>

                <h4>Financial Metrics to Consider</h4>
                <ul className={styles.list}>
                  <li><strong>Net Present Value (NPV):</strong> Compare discounted cash flows</li>
                  <li><strong>Internal Rate of Return (IRR):</strong> Effective cost of each option</li>
                  <li><strong>Cash Flow Impact:</strong> Monthly payment differences</li>
                  <li><strong>Balance Sheet Effect:</strong> How each affects your financial statements</li>
                  <li><strong>Opportunity Cost:</strong> Alternative uses for capital</li>
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

export default LeaseVsBuyCalculator;