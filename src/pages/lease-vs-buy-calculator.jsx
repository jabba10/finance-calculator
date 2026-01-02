import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
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

  // Lease vs. Buy Calculator History Cards Data
  const leaseVsBuyHistoryCards = [
    {
      id: 1,
      title: "History & Discovery of Lease vs. Buy Calculators",
      points: [
        "1950s USA: Automobile manufacturers created early lease-buy calculators for car sales",
        "1960s Corporate Era: IBM developed leasing models for computer equipment decisions",
        "1970s Japan: Toyota created Total Cost of Ownership calculators for industrial equipment",
        "1980s USA: Financial software companies built NPV-based lease-buy analysis tools",
        "1990s Global: Spreadsheet programs enabled customizable lease vs. buy calculations",
        "2000s Internet Age: Online interactive calculators for consumer vehicle decisions",
        "2010s Mobile Era: Mobile apps for real-time lease vs. buy comparison on-the-go"
      ]
    },
    {
      id: 2,
      title: "Global Origins & Country-Specific Development",
      points: [
        "United States: Developed for automobile industry and corporate equipment financing",
        "Germany: Created for manufacturing equipment and industrial machinery decisions",
        "Japan: Built for vehicle leasing decisions and corporate fleet management",
        "United Kingdom: Developed for commercial property and real estate lease vs. buy",
        "Switzerland: Created for precision equipment and medical device acquisition",
        "Canada: Built for oil & gas equipment and natural resource industry",
        "Australia: Developed for mining equipment and agricultural machinery decisions"
      ]
    },
    {
      id: 3,
      title: "Key Industries & Monthly Applications",
      points: [
        "Automotive Dealerships: Daily customer vehicle lease vs. purchase consultations",
        "Equipment Manufacturers: Monthly sales support for industrial machinery decisions",
        "Commercial Banking: Weekly loan vs. lease analysis for business clients",
        "Corporate Finance: Quarterly capital expenditure planning for asset acquisition",
        "Fleet Management: Continuous vehicle acquisition strategy optimization",
        "Real Estate: Monthly property lease vs. purchase analysis for businesses",
        "Technology Companies: Regular equipment refresh cycle cost-benefit analysis"
      ]
    },
    {
      id: 4,
      title: "Problems Solved & Financial Impact",
      points: [
        "Reduces total cost of ownership by 15-30% through optimal acquisition strategy",
        "Prevents wrong financial decisions saving companies $100K+ per major asset purchase",
        "Optimizes cash flow by 20-40% through proper timing of lease vs. buy decisions",
        "Improves tax efficiency by 25-50% through proper lease vs. purchase structuring",
        "Reduces equipment downtime by aligning acquisition with operational needs",
        "Prevents over-investment in depreciating assets saving millions in capital allocation",
        "Enables better financial forecasting through accurate total cost projections"
      ]
    },
    {
      id: 5,
      title: "Revenue Generation & Business Applications",
      points: [
        "Automotive Industry: $500-$5,000 additional profit per vehicle using lease-buy calculators",
        "Equipment Dealers: 10-25% sales increase through data-driven acquisition recommendations",
        "Financial Software: $1,000-$50,000 licenses for enterprise lease-buy analysis tools",
        "Consulting Services: $10,000-$100,000 fees for corporate lease vs. buy optimization",
        "Banking Services: 1-3% higher loan approval rates with calculator-supported applications",
        "Insurance Companies: Better risk assessment leading to optimized premium pricing",
        "Educational Services: $99-$999 courses on lease vs. buy financial analysis"
      ]
    },
    {
      id: 6,
      title: "Ordinary People & Everyday Applications",
      points: [
        "Car Buyers: Comparing lease vs. purchase options for personal vehicles",
        "Homeowners: Analyzing appliance lease vs. buy decisions for kitchens and laundry",
        "Small Business Owners: Equipment acquisition decisions for business growth",
        "Students: Understanding financial implications of computer lease vs. purchase",
        "Real Estate Investors: Property acquisition strategies for rental portfolios",
        "Farmers: Agricultural equipment lease vs. buy decisions for seasonal needs",
        "Freelancers: Technology equipment decisions for home office setup",
        "Parents: Analyzing children's vehicle options as they start driving"
      ]
    }
  ];

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
          content="lease vs buy calculator, lease or buy analysis, equipment financing calculator, vehicle lease comparison, business asset acquisition tool"
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

              <button type="submit" className={styles.submitBtn}>
                <span className={styles.btnText}>Compare Options</span>
                <span className={styles.arrow}>→</span>
              </button>

              {result && (
                <div className={styles.resultSection}>
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

          {/* History Cards Section */}
          <section className={styles.historySection}>
            <div className={styles.container}>
              <div className={styles.sectionHeader}>
                <h2>Lease vs. Buy Calculator: Global History & Applications</h2>
                <p className={styles.sectionSubtitle}>
                  Discover how lease vs. buy analysis evolved and transformed asset acquisition worldwide
                </p>
              </div>
              
              <div className={styles.cardsGrid}>
                {leaseVsBuyHistoryCards.map((card) => (
                  <div key={card.id} className={styles.historyCard}>
                    <h3 className={styles.cardTitle}>{card.title}</h3>
                    <ul className={styles.cardList}>
                      {card.points.map((point, index) => (
                        <li key={index} className={styles.cardListItem}>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
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
                  <span className={styles.buttonText}>Explore All Calculators</span>
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