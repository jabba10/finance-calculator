import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './artc.module.css';

const AccountsReceivableTurnoverCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [inputs, setInputs] = useState({
    netCreditSales: '500000',
    beginningReceivables: '50000',
    endingReceivables: '70000'
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateARTurnover = () => {
    const netCreditSales = parseFloat(inputs.netCreditSales);
    const beginning = parseFloat(inputs.beginningReceivables);
    const ending = parseFloat(inputs.endingReceivables);

    if (isNaN(netCreditSales) || isNaN(beginning) || isNaN(ending)) {
      alert("Please enter valid numbers for all fields.");
      return;
    }

    if (netCreditSales < 0 || beginning < 0 || ending < 0) {
      alert("Values cannot be negative.");
      return;
    }

    // Average Accounts Receivable
    const averageReceivables = (beginning + ending) / 2;

    // Avoid division by zero
    if (averageReceivables === 0) {
      alert("Average receivables cannot be zero.");
      return;
    }

    // Accounts Receivable Turnover Ratio
    const turnover = netCreditSales / averageReceivables;

    // Average Collection Period (in days)
    const collectionPeriod = 365 / turnover;

    setResult({
      netCreditSales: netCreditSales.toLocaleString(),
      beginning: beginning.toLocaleString(),
      ending: ending.toLocaleString(),
      averageReceivables: averageReceivables.toFixed(2),
      turnover: turnover.toFixed(2),
      collectionPeriod: collectionPeriod.toFixed(1)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateARTurnover();
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

  // Accounts Receivable Turnover History Data
  const arTurnoverHistory = [
    {
      id: 1,
      title: "History & Discovery of Accounts Receivable Turnover Formula",
      points: [
        "1920s: Early accounting textbooks introduced turnover ratio concepts",
        "1930s: Corporate finance departments began tracking receivables efficiency",
        "1950s: Standardized financial ratio analysis included A/R turnover",
        "1970s: Financial software incorporated automated A/R turnover calculation",
        "1990s: Online calculators made the ratio accessible to small businesses",
        "2000s: Real-time A/R dashboards integrated turnover metrics"
      ]
    },
    {
      id: 2,
      title: "Global Origins & Business Purpose",
      points: [
        "United States: Developed by Wall Street analysts for credit risk assessment",
        "United Kingdom: Adapted by chartered accountants for audit efficiency analysis",
        "Germany: Implemented in Mittelstand (mid-sized) company financial controls",
        "Japan: Kaizen methodology applied to optimize receivables collection cycles",
        "India: GST implementation necessitated improved receivables tracking",
        "Purpose: Measure how efficiently companies collect payments from customers"
      ]
    },
    {
      id: 3,
      title: "Key Industries & Monthly Applications",
      points: [
        "Manufacturing: Weekly monitoring of distributor payment collection",
        "Wholesale Distribution: Daily turnover analysis for cash flow forecasting",
        "Software/SaaS: Monthly DSO (Days Sales Outstanding) tracking",
        "Healthcare: Bimonthly insurance claim collection efficiency measurement",
        "Construction: Project-based receivables turnover during billing cycles",
        "Professional Services: Weekly WIP (Work in Progress) to cash conversion",
        "Retail: Seasonal turnover analysis for credit department staffing"
      ]
    },
    {
      id: 4,
      title: "Problem Solving & Financial Impact",
      points: [
        "Reduces average collection period by 15-30 days through process improvements",
        "Increases cash flow by 20-40% through better receivables management",
        "Lowers borrowing costs by $10,000-$100,000 annually through reduced working capital needs",
        "Improves credit ratings by demonstrating strong operational efficiency",
        "Prevents $50,000+ in bad debt write-offs through early warning indicators",
        "Reduces collection department staffing needs by 25% through automation",
        "Increases investor confidence with transparent receivables performance"
      ]
    },
    {
      id: 5,
      title: "Revenue Generation Applications",
      points: [
        "Accounting Firms: Charge $5,000-$50,000 for receivables efficiency audits",
        "FinTech Companies: Generate $100-$500/month per client for A/R automation",
        "Consulting Services: Earn $10,000-$100,000 for collections process redesign",
        "Software Providers: License A/R analytics modules for $20,000-$200,000/year",
        "Financial Analysts: Produce $50,000 reports on industry receivables benchmarks",
        "Collection Agencies: Increase recovery rates by 15-30% with targeted strategies",
        "Training Companies: Offer $2,000 workshops on receivables management"
      ]
    },
    {
      id: 6,
      title: "Ordinary People A/R Turnover Calculator Uses",
      points: [
        "Small Business Owners: Tracking customer payment patterns for cash flow planning",
        "Freelancers: Monitoring client payment speed for project selection",
        "Startup Founders: Measuring investor appeal through operational efficiency",
        "Side Hustlers: Evaluating which product lines have fastest payment cycles",
        "E-commerce Sellers: Analyzing B2B customer payment reliability",
        "Consultants: Assessing client financial health before accepting projects",
        "Nonprofit Directors: Monitoring donor pledge collection efficiency",
        "Real Estate Agents: Tracking commission payment timelines from brokers"
      ]
    }
  ];

  return (
    <>
      <Head>
        <html lang="en" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Accounts Receivable Turnover Calculator | A/R Efficiency Tool</title>
        <meta
          name="description"
          content="Free accounts receivable turnover calculator to measure how efficiently your business collects customer payments and manages credit."
        />
        <link rel="canonical" href="/accounts-receivable-turnover-calculator" />
      </Head>

      <div className={styles.page}>
        <div className={styles.contentWrapper}>
          
          {/* Hero Section */}
          <section className={styles.hero}>
            <h1 className={styles.title}>Accounts Receivable Turnover Calculator</h1>
            <p className={styles.subtitle}>
              Measure how efficiently your business collects customer payments.
            </p>
          </section>

          {/* Calculator Card */}
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter your credit sales and receivables to assess collection efficiency.
              </p>

              <div className={styles.inputGroup}>
                <label htmlFor="netCreditSales" className={styles.label}>
                  Net Credit Sales ($)
                </label>
                <input
                  type="number"
                  id="netCreditSales"
                  name="netCreditSales"
                  value={inputs.netCreditSales}
                  onChange={handleChange}
                  placeholder="e.g. 500,000"
                  step="100"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="beginningReceivables" className={styles.label}>
                  Beginning A/R ($)
                </label>
                <input
                  type="number"
                  id="beginningReceivables"
                  name="beginningReceivables"
                  value={inputs.beginningReceivables}
                  onChange={handleChange}
                  placeholder="e.g. 50,000"
                  step="100"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="endingReceivables" className={styles.label}>
                  Ending A/R ($)
                </label>
                <input
                  type="number"
                  id="endingReceivables"
                  name="endingReceivables"
                  value={inputs.endingReceivables}
                  onChange={handleChange}
                  placeholder="e.g. 70,000"
                  step="100"
                  required
                  className={styles.input}
                />
              </div>

              <button type="submit" className={styles.submitBtn}>
                <span className={styles.btnText}>Calculate A/R Turnover</span>
                <span className={styles.arrow}>→</span>
              </button>

              {result && (
                <div className={styles.resultSection}>
                  <h3>Accounts Receivable Efficiency</h3>
                  <div className={styles.resultGrid}>
                    <div className={styles.resultItem}>
                      <strong>Net Credit Sales:</strong> ${result.netCreditSales}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Avg. Receivables:</strong> ${result.averageReceivables}
                    </div>
                    <div className={`${styles.resultItem} ${styles.highlight}`}>
                      <strong>Turnover Ratio:</strong> {result.turnover}x
                    </div>
                    <div className={`${styles.resultItem} ${styles.highlight}`}>
                      <strong>Avg. Collection:</strong> {result.collectionPeriod} days
                    </div>
                  </div>
                  <div className={styles.note}>
                    A higher turnover ratio means faster collections. Compare to industry benchmarks.
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* History Cards Section */}
          <section className={styles.historySection}>
            <div className={styles.container}>
              <div className={styles.sectionHeader}>
                <h2>Accounts Receivable Turnover Calculator History & Global Applications</h2>
                <p className={styles.sectionSubtitle}>
                  Explore the evolution and worldwide impact of accounts receivable efficiency calculation tools
                </p>
              </div>
              
              <div className={styles.cardsGrid}>
                {arTurnoverHistory.map((card) => (
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
            <div className={styles.container}>
              <h2>Free Financial Planning Tools: Budget, Invest & Plan Retirement</h2>
              <p>Free Financial Planning Tools – Try Now</p>
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
        </div>
      </div>
    </>
  );
};

export default AccountsReceivableTurnoverCalculator;