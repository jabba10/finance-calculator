import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'react-helmet';
import styles from './flippingprofitcalculator.module.css';

const FlippingProfitCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [inputs, setInputs] = useState({
    purchasePrice: '150000',
    repairCosts: '30000',
    holdingPeriod: '6',
    monthlyHoldingCost: '1500',
    sellingPrice: '220000',
    sellingFees: '6'
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateFlip = () => {
    const purchase = parseFloat(inputs.purchasePrice) || 0;
    const repairs = parseFloat(inputs.repairCosts) || 0;
    const holdingMonths = parseFloat(inputs.holdingPeriod) || 0;
    const monthlyHolding = parseFloat(inputs.monthlyHoldingCost) || 0;
    const sale = parseFloat(inputs.sellingPrice) || 0;
    const feeRate = parseFloat(inputs.sellingFees) / 100 || 0;

    if (purchase < 0 || repairs < 0 || holdingMonths < 1 || monthlyHolding < 0 || sale < 0 || feeRate < 0) {
      alert("Please enter valid non-negative values. Holding period must be at least 1 month.");
      return;
    }

    // Total costs
    const totalHoldingCost = holdingMonths * monthlyHolding;
    const totalCost = purchase + repairs + totalHoldingCost;
    
    // Selling fees (e.g., agent commission, closing costs)
    const sellingFees = sale * feeRate;
    
    // Net proceeds and profit
    const netProceeds = sale - sellingFees;
    const profit = netProceeds - totalCost;
    
    // Return on Investment (ROI)
    const roi = totalCost > 0 ? (profit / totalCost) * 100 : 0;
    
    // Profit per month (annualized if desired)
    const profitPerMonth = holdingMonths > 0 ? profit / holdingMonths : 0;

    setResult({
      purchase: purchase.toLocaleString(),
      repairs: repairs.toLocaleString(),
      holdingCost: totalHoldingCost.toFixed(2),
      totalCost: totalCost.toLocaleString(),
      sale: sale.toLocaleString(),
      sellingFees: sellingFees.toFixed(2),
      netProceeds: netProceeds.toFixed(2),
      profit: profit.toFixed(2),
      roi: roi.toFixed(2),
      profitPerMonth: profitPerMonth.toFixed(2),
      holdingMonths
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateFlip();
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
        <title>Flipping Profit Calculator | Real Estate & Resale Tool</title>
        <meta
          name="description"
          content="Free flipping profit calculator to estimate ROI for real estate, cars, sneakers, or collectibles after purchase, repairs, and selling."
        />
        <meta
          name="keywords"
          content="flipping calculator, house flip, resale profit, real estate ROI, flipping tool"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/flipping-profit-calculator" />
        <meta property="og:title" content="Flipping Profit Calculator - Estimate Your Flip ROI" />
        <meta
          property="og:description"
          content="Calculate your expected profit and return on investment when flipping houses, cars, sneakers, or other assets."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/flipping-profit-calculator" />
      </Head>

      <div className={styles.page}>
        <div className={styles.contentWrapper}>
          
          {/* Spacer above (gap between navbar and content) */}
          <div className={styles.spacerTop} />

          {/* Hero Section */}
          <section className={styles.hero}>
            <h1 className={styles.title}>Flipping Profit Calculator</h1>
            <p className={styles.subtitle}>
              Estimate your profit from flipping real estate, cars, sneakers, or collectibles.
            </p>
          </section>

          {/* Calculator Card */}
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter purchase, repair, holding, and selling details to project your flip profit.
              </p>

              <div className={styles.inputGroup}>
                <label htmlFor="purchasePrice" className={styles.label}>
                  Purchase Price ($)
                </label>
                <input
                  type="number"
                  id="purchasePrice"
                  name="purchasePrice"
                  value={inputs.purchasePrice}
                  onChange={handleChange}
                  placeholder="e.g. 150,000"
                  step="1000"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="repairCosts" className={styles.label}>
                  Repair & Upgrade Costs ($)
                </label>
                <input
                  type="number"
                  id="repairCosts"
                  name="repairCosts"
                  value={inputs.repairCosts}
                  onChange={handleChange}
                  placeholder="e.g. 30,000"
                  step="500"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="holdingPeriod" className={styles.label}>
                  Holding Period (Months)
                </label>
                <input
                  type="number"
                  id="holdingPeriod"
                  name="holdingPeriod"
                  value={inputs.holdingPeriod}
                  onChange={handleChange}
                  placeholder="e.g. 6"
                  min="1"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="monthlyHoldingCost" className={styles.label}>
                  Monthly Holding Cost ($)
                </label>
                <input
                  type="number"
                  id="monthlyHoldingCost"
                  name="monthlyHoldingCost"
                  value={inputs.monthlyHoldingCost}
                  onChange={handleChange}
                  placeholder="e.g. 1,500"
                  step="50"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="sellingPrice" className={styles.label}>
                  Expected Selling Price ($)
                </label>
                <input
                  type="number"
                  id="sellingPrice"
                  name="sellingPrice"
                  value={inputs.sellingPrice}
                  onChange={handleChange}
                  placeholder="e.g. 220,000"
                  step="1000"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="sellingFees" className={styles.label}>
                  Selling Fees (%)
                </label>
                <input
                  type="number"
                  id="sellingFees"
                  name="sellingFees"
                  value={inputs.sellingFees}
                  onChange={handleChange}
                  placeholder="e.g. 6"
                  step="0.1"
                  required
                  className={styles.input}
                />
              </div>

              <button type="submit" className={styles.ctaButton}>
                <span className={styles.btnText}>Calculate Flip Profit</span>
                <span className={styles.btnArrow}>→</span>
              </button>

              {result && (
                <div className={styles.resultSection}>
                  <h3>Flip Profit Summary</h3>
                  <div className={styles.resultGrid}>
                    <div className={styles.resultItem}>
                      <strong>Purchase:</strong> ${result.purchase}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Repairs:</strong> ${result.repairs}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Holding Cost:</strong> ${result.holdingCost}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Total Cost:</strong> ${result.totalCost}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Selling Price:</strong> ${result.sale}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Selling Fees:</strong> ${result.sellingFees}
                    </div>
                    <div className={`${styles.resultItem} ${styles.highlight}`}>
                      <strong>Net Profit:</strong> ${result.profit}
                    </div>
                    <div className={`${styles.resultItem} ${styles.highlight}`}>
                      <strong>ROI:</strong> {result.roi}%
                    </div>
                  </div>
                  <div className={styles.note}>
                    Profit = (Selling Price - Fees) - (Purchase + Repairs + Holding). ROI = Profit / Total Cost.
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Info Section */}
          <section className={styles.infoSection}>
            <div className={styles.container}>
              <div className={styles.infoCard}>
                <h3>Why Flipping Profit Matters</h3>
                <p>
                  <strong>Flipping</strong> — buying low, improving, and selling high — is a popular strategy in real estate, automotive, fashion, and collectibles. A solid profit estimate helps avoid losses and ensures your time and capital are well spent.
                </p>

                <h4>How to Use This Calculator</h4>
                <p>
                  Enter the <strong>purchase price</strong>, <strong>repair costs</strong>, <strong>holding period</strong>, and <strong>expected selling price</strong>. Add monthly holding costs (mortgage, storage, insurance) and estimated <strong>selling fees</strong> (e.g., 5–6% for real estate). The tool calculates:
                </p>
                <ul className={styles.list}>
                  <li><strong>Total Investment</strong></li>
                  <li><strong>Net Profit</strong></li>
                  <li><strong>Return on Investment (ROI)</strong></li>
                  <li><strong>Profit per month held</strong></li>
                </ul>

                <h4>The Flipping Formula</h4>
                <div className={styles.formula}>
                  <code>Total Cost = Purchase + Repairs + (Monthly × Months)</code>
                </div>
                <div className={styles.formula}>
                  <code>Net Proceeds = Sale × (1 - Fee Rate)</code>
                </div>
                <div className={styles.formula}>
                  <code>Profit = Net Proceeds - Total Cost</code>
                </div>
                <div className={styles.formula}>
                  <code>ROI = (Profit / Total Cost) × 100%</code>
                </div>

                <h4>Real-World Applications</h4>
                <ul className={styles.list}>
                  <li><strong>Real Estate:</strong> House flipping with renovation</li>
                  <li><strong>Automotive:</strong> Restoring and reselling classic cars</li>
                  <li><strong>Sneakers:</strong> Copping limited editions for resale</li>
                  <li><strong>Collectibles:</strong> Trading cards, watches, designer bags</li>
                </ul>

                <h4>What’s a Good ROI?</h4>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Asset Type</th>
                      <th>Good ROI</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Real Estate</td>
                      <td>10–20%</td>
                    </tr>
                    <tr>
                      <td>Sneakers/Fashion</td>
                      <td>30%+</td>
                    </tr>
                    <tr>
                      <td>Classic Cars</td>
                      <td>15–25%</td>
                    </tr>
                    <tr>
                      <td>Trading Cards</td>
                      <td>50%+</td>
                    </tr>
                  </tbody>
                </table>

                <h4>Hidden Costs to Consider</h4>
                <ul className={styles.list}>
                  <li>✅ <strong>Permits & inspections</strong> (real estate)</li>
                  <li>✅ <strong>Storage or loan payments</strong> during hold</li>
                  <li>✅ <strong>Marketing & listing fees</strong></li>
                  <li>✅ <strong>Time & labor</strong> (if not outsourcing)</li>
                  <li>✅ <strong>Taxes</strong> on short-term capital gains</li>
                  <li>✅ <strong>Unexpected repairs</strong> (add 10–15% buffer)</li>
                </ul>

                <h4>Tips for Success</h4>
                <ul className={styles.list}>
                  <li>Set a maximum budget and stick to it</li>
                  <li>Get multiple contractor quotes before renovating</li>
                  <li>Research comps to price competitively</li>
                  <li>Build relationships with reliable buyers/sellers</li>
                  <li>Track every expense for tax and analysis purposes</li>
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

export default FlippingProfitCalculator;