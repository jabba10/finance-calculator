import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'react-helmet';
import styles from './cac.module.css';

const CacCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [marketingCosts, setMarketingCosts] = useState('');
  const [salesCosts, setSalesCosts] = useState('');
  const [newCustomers, setNewCustomers] = useState('');
  const [result, setResult] = useState(null);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert inputs to numbers and validate
    const marketing = parseFloat(marketingCosts);
    const sales = parseFloat(salesCosts);
    const customers = parseFloat(newCustomers);

    // Validate inputs
    if (isNaN(marketing) || isNaN(sales) || isNaN(customers)) {
      alert("Please enter valid numbers in all fields");
      return;
    }

    if (marketing < 0 || sales < 0 || customers <= 0) {
      alert("Values must be positive numbers (customers must be greater than 0)");
      return;
    }

    const totalCost = marketing + sales;
    const cac = (totalCost / customers).toFixed(2);

    setResult({
      totalCost: totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      customers: customers.toLocaleString(),
      cac: cac,
      efficiency: cac < 100 ? 'High Efficiency' : cac < 300 ? 'Moderate Cost' : 'High Cost'
    });
  };

  // Magnetic effect on CTA button
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
      {/* SEO Metadata */}
      <Head>
        <title>CAC Calculator | Free Customer Acquisition Cost Tool</title>
        <meta
          name="description"
          content="Calculate your Customer Acquisition Cost (CAC) instantly. Measure marketing efficiency, optimize budgets, and improve profitability."
        />
        <meta
          name="keywords"
          content="CAC calculator, customer acquisition cost, marketing ROI, sales efficiency, startup metrics, SaaS tools"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/cac-calculator" />

        {/* Open Graph / Social Sharing */}
        <meta property="og:title" content="CAC Calculator | Measure Marketing Efficiency" />
        <meta
          property="og:description"
          content="Free tool to calculate how much it costs to acquire a customer. Optimize growth and spending."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/cac-calculator" />
        <meta property="og:image" content="https://www.financecalculatorfree.com/images/cac-og.png" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="CAC Calculator | Measure Marketing Efficiency" />
        <meta
          name="twitter:description"
          content="Find your true cost per customer and compare against industry benchmarks."
        />
        <meta name="twitter:image" content="https://financecalculatorfree.com/images/cac-twitter.png" />
      </Head>

      {/* Spacing above content (gap from navbar) */}
      <div className={styles.spacerTop}></div>

      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>CAC Calculator</h1>
          <p className={styles.subtitle}>
            Calculate your Customer Acquisition Cost to measure marketing efficiency and profitability.
          </p>
        </section>

        {/* Calculator Section */}
        <section>
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter your marketing, sales costs, and number of new customers acquired.
              </p>

              <div className={styles.inputGroup}>
                <label htmlFor="marketingCosts" className={styles.label}>
                  Marketing Costs ($)
                </label>
                <input
                  id="marketingCosts"
                  type="number"
                  value={marketingCosts}
                  onChange={(e) => setMarketingCosts(e.target.value)}
                  placeholder="e.g. 15000"
                  className={styles.input}
                  min="0"
                  step="any"
                  required
                />
                <small className={styles.note}>
                  Ads, content, SEO, social media, email campaigns, etc.
                </small>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="salesCosts" className={styles.label}>
                  Sales Costs ($)
                </label>
                <input
                  id="salesCosts"
                  type="number"
                  value={salesCosts}
                  onChange={(e) => setSalesCosts(e.target.value)}
                  placeholder="e.g. 8000"
                  className={styles.input}
                  min="0"
                  step="any"
                  required
                />
                <small className={styles.note}>
                  Salaries, commissions, tools, travel, CRM software, etc.
                </small>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="newCustomers" className={styles.label}>
                  New Customers Acquired
                </label>
                <input
                  id="newCustomers"
                  type="number"
                  value={newCustomers}
                  onChange={(e) => setNewCustomers(e.target.value)}
                  placeholder="e.g. 230"
                  className={styles.input}
                  min="1"
                  step="1"
                  required
                />
              </div>

              <button type="submit" className={styles.submitBtn}>
                <span className="taxpro-btn-label">Calculate CAC</span>
                <span className="taxpro-btn-arrow">→</span>
              </button>
            </form>

            {result && (
              <div className={styles.resultSection}>
                <h3>Customer Acquisition Cost (CAC)</h3>
                <div className={styles.resultGrid}>
                  <div className={styles.resultItem}>
                    <strong>Total Spend:</strong> ${result.totalCost}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>New Customers:</strong> {result.customers}
                  </div>
                  <div className={`${styles.resultItem} ${styles.highlight}`}>
                    <strong>CAC:</strong> ${result.cac}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Efficiency:</strong> {result.efficiency}
                  </div>
                </div>
                <div className={styles.note}>
                  You spent <strong>${result.cac}</strong> to acquire each customer. Compare this to customer lifetime value (LTV) to assess profitability.
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h3>Why CAC Matters</h3>
            <p>
              <strong>Customer Acquisition Cost (CAC)</strong> tells you how much it costs to win a new customer. It's a critical metric for startups, SaaS companies, e-commerce, and any business investing in marketing and sales. Knowing your CAC helps you <strong>optimize budgets, measure ROI, and improve profitability</strong>.
            </p>

            <h4>How to Use This Calculator</h4>
            <ul className={styles.list}>
              <li><strong>Marketing Costs:</strong> All expenses for advertising, content, SEO, etc.</li>
              <li><strong>Sales Costs:</strong> Salaries, commissions, tools, and overhead for sales team.</li>
              <li><strong>New Customers:</strong> Number of paying customers acquired in the same period.</li>
              <li>Click "Calculate CAC" to see your average cost per customer.</li>
            </ul>

            <h4>Formula Used</h4>
            <div className={styles.formula}>
              <code>CAC = (Total Marketing + Sales Costs) ÷ Number of New Customers</code>
            </div>
            <p>
              <strong>Example:</strong> $20,000 spent on marketing and sales → 400 new customers →
              <br />
              CAC = 20,000 / 400 = <strong>$50 per customer</strong>
            </p>

            <h4>Real-World Applications</h4>
            <ul className={styles.list}>
              <li><strong>Startups:</strong> Validate growth strategy before scaling</li>
              <li><strong>E-commerce:</strong> Compare CAC across ad platforms (Facebook vs Google)</li>
              <li><strong>SaaS:</strong> Measure efficiency of free-to-paid conversion</li>
              <li><strong>Subscription Services:</strong> Optimize onboarding and trial-to-paid rates</li>
              <li><strong>Marketing Teams:</strong> Justify budget requests with ROI data</li>
            </ul>

            <h4>Industry Benchmarks (Average CAC)</h4>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Industry</th>
                  <th>Avg. CAC</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>E-commerce</td>
                  <td>$45 – $120</td>
                </tr>
                <tr>
                  <td>SaaS (B2B)</td>
                  <td>$95 – $400</td>
                </tr>
                <tr>
                  <td>Mobile Apps</td>
                  <td>$3 – $15</td>
                </tr>
                <tr>
                  <td>Real Estate</td>
                  <td>$500 – $2,000</td>
                </tr>
                <tr>
                  <td>Insurance</td>
                  <td>$800 – $3,000</td>
                </tr>
              </tbody>
            </table>

            <h4>Tips to Lower Your CAC</h4>
            <ul className={styles.list}>
              <li>✅ <strong>Improve targeting</strong> — focus on high-intent audiences</li>
              <li>✅ <strong>Optimize landing pages</strong> for higher conversion rates</li>
              <li>✅ <strong>Use referral programs</strong> — existing customers bring in new ones cheaply</li>
              <li>✅ <strong>Retarget website visitors</strong> with ads</li>
              <li>✅ <strong>Invest in SEO & content</strong> for long-term organic growth</li>
            </ul>

            <h4>Advanced Use: CAC vs. LTV</h4>
            <p>
              The true test of profitability is the <strong>LTV:CAC ratio</strong>:
            </p>
            <div className={styles.formula}>
              <code>LTV:CAC = Customer Lifetime Value ÷ CAC</code>
            </div>
            <p>
              <strong>Rule of thumb:</strong>
            </p>
            <ul className={styles.list}>
              
              <li>Ratio {"<"} 1 → Losing money</li>
               <li>Ratio = 3 → Healthy</li>
              <li>Ratio {">"} 5 → Excellent efficiency</li>
            </ul>
            <p>
              Example: If LTV is $1,200 and CAC is $300 → LTV:CAC = 4 → <strong>Strong return</strong>.
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <h2 className={styles.ctaSectionHeading}>
            Free Financial Planning Tools: Budget, Invest & Plan Retirement
          </h2>
          <p className={styles.ctaSectionSubtext}>Free Financial Planning Tools – Try Now</p>
          <Link href="/suite" passHref legacyBehavior>
            <a
              className={styles.ctaButton}
              ref={ctaButtonRef}
              onMouseMove={handleMouseMove}
            >
              <span className="btn-label">Explore All Calculators</span>
              <span className="btn-icon" aria-hidden="true">→</span>
            </a>
          </Link>
        </section>
      </div>

      {/* Spacing below content (gap before footer) */}
      <div className={styles.spacerBottom}></div>
    </>
  );
};

export default CacCalculator;