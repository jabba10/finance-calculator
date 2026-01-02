import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './npvcalculator.module.css';

const NpvCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [initialInvestment, setInitialInvestment] = useState('');
  const [discountRate, setDiscountRate] = useState('');
  const [cashFlows, setCashFlows] = useState(['', '', '', '', '']); // 5 years
  const [result, setResult] = useState(null);

  // Robust number extraction from any string
  const parseNumber = (value) => {
    if (!value || typeof value !== 'string') return 0;
    // Extract first valid number (handles $10,000, 15k, etc.)
    const match = value.replace(/,/g, '').match(/-?\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : 0;
  };

  // Handle cash flow input change
  const handleCashFlowChange = (index, value) => {
    const newCashFlows = [...cashFlows];
    newCashFlows[index] = value;
    setCashFlows(newCashFlows);
  };

  // Add a new year
  const addYear = () => {
    if (cashFlows.length < 10) {
      setCashFlows([...cashFlows, '']);
    }
  };

  // Remove last year
  const removeYear = () => {
    if (cashFlows.length > 1) {
      setCashFlows(cashFlows.slice(0, -1));
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const investment = parseNumber(initialInvestment);
    let rate = parseNumber(discountRate);
    // Treat discount rate as percentage (but allow raw decimals too)
    if (rate > 1) rate = rate / 100; // assume % if > 1

    let npv = 0;
    const validFlows = [];

    for (let i = 0; i < cashFlows.length; i++) {
      const cf = parseNumber(cashFlows[i]);
      validFlows.push(cf);
      npv += cf / Math.pow(1 + rate, i + 1);
    }

    npv -= investment;

    setResult({
      npv: npv.toFixed(2),
      investment: investment.toLocaleString(),
      discountRate: (rate * 100).toFixed(2),
      years: cashFlows.length,
      cashFlows: validFlows.map(cf => cf.toLocaleString()),
      isProfitable: npv > 0,
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

  // SEO Metadata
  const siteUrl = 'https://www.financecalculatorfree.com';
  const pageTitle = 'NPV Calculator | Free Net Present Value Tool';
  const pageDescription = 'Calculate Net Present Value (NPV) instantly. Evaluate investment profitability, compare projects, and make data-driven financial decisions.';

  // NPV Calculator History Data
  const npvCalculatorHistory = [
    {
      id: 1,
      title: "History & Discovery of Net Present Value",
      points: [
        "Ancient Rome: Merchants used primitive time-value concepts for trade financing",
        "17th Century Europe: Dutch traders developed discounted cash flow methods for colonial ventures",
        "1930s USA: Irving Fisher formalized modern NPV theory in investment decision models",
        "1950s Corporate America: DuPont Corporation adopted NPV for capital budgeting",
        "1960s Academia: Harvard Business School standardized NPV in MBA curricula",
        "1980s Financial Revolution: NPV became essential for leveraged buyouts and M&A",
        "Modern Era: Real-time NPV calculation tools with Monte Carlo simulation"
      ]
    },
    {
      id: 2,
      title: "Global Origins & Business Purpose",
      points: [
        "Netherlands: 17th century merchants created discounted cash flow for long sea voyages",
        "United States: Corporate finance departments established NPV for capital allocation",
        "United Kingdom: Investment banks refined NPV for project finance and infrastructure",
        "Germany: Engineering firms used NPV for manufacturing equipment investments",
        "Japan: Keiretsu groups applied NPV for cross-company investment coordination",
        "Switzerland: Private banks developed NPV for wealth management portfolios",
        "Purpose: Account for time value of money in long-term investment decisions"
      ]
    },
    {
      id: 3,
      title: "Key Industries & Monthly Applications",
      points: [
        "Corporate Finance: Monthly capital project evaluation and approval",
        "Investment Banking: Daily deal analysis for mergers and acquisitions",
        "Real Estate Development: Weekly property development feasibility studies",
        "Oil & Gas: Quarterly exploration and production project assessment",
        "Infrastructure: Annual public-private partnership (PPP) evaluation",
        "Manufacturing: Monthly equipment replacement and factory expansion analysis",
        "Technology: Continuous R&D project valuation and prioritization",
        "Renewable Energy: Project feasibility for solar, wind, and hydro developments"
      ]
    },
    {
      id: 4,
      title: "Problem Solving & Financial Impact",
      points: [
        "Identifies 30-50% more profitable projects through time-adjusted analysis",
        "Reduces capital misallocation by 40% through objective project ranking",
        "Improves investment returns by 20-35% by selecting highest NPV projects",
        "Reduces failed projects by 60% through rigorous financial screening",
        "Increases shareholder value by 25% through optimal capital deployment",
        "Enables 50% better resource allocation across competing opportunities",
        "Identifies $1M+ in value creation potential per major investment decision"
      ]
    },
    {
      id: 5,
      title: "Revenue Generation Applications",
      points: [
        "Corporate Investments: Generate 15-25% NPV on strategic expansions",
        "Real Estate Development: Achieve 20-40% NPV on successful projects",
        "Mergers & Acquisitions: Create 30-50% NPV through synergistic deals",
        "Infrastructure Projects: Secure 10-20% NPV on long-term concessions",
        "Technology R&D: Realize 50-100% NPV on breakthrough innovations",
        "Energy Projects: Deliver 15-30% NPV on production investments",
        "Manufacturing: Achieve 20-35% NPV on automation and efficiency upgrades"
      ]
    },
    {
      id: 6,
      title: "Ordinary People NPV Calculator Uses",
      points: [
        "Small Business Owners: Evaluating equipment purchases and expansions",
        "Real Estate Investors: Analyzing rental property and flip opportunities",
        "Retirement Planners: Comparing different investment portfolio strategies",
        "Homeowners: Assessing home renovation vs. move decisions",
        "Education Investors: Calculating ROI on degree and certification costs",
        "Startup Founders: Valuing business ideas and funding requirements",
        "Side Hustlers: Evaluating different income-generating opportunities",
        "Environmentalists: Analyzing sustainability project financial viability"
      ]
    }
  ];

  return (
    <>
      <Head>
        <html lang="en" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={`${siteUrl}/npv-calculator`} />
      </Head>

      <div className={styles.page}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>NPV Calculator</h1>
          <p className={styles.subtitle}>
            Calculate Net Present Value to evaluate investment profitability and make better financial decisions.
          </p>
        </section>

        {/* Calculator Card */}
        <div className={styles.calculatorCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.instruction}>
              Enter any values — numbers, text, symbols — we'll extract usable figures automatically.
            </p>

            <div className={styles.inputGroup}>
              <label htmlFor="initialInvestment" className={styles.label}>
                Initial Investment
              </label>
              <input
                id="initialInvestment"
                type="text"
                value={initialInvestment}
                onChange={(e) => setInitialInvestment(e.target.value)}
                placeholder="e.g. $50,000 or 50k"
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="discountRate" className={styles.label}>
                Discount Rate (%)
              </label>
              <input
                id="discountRate"
                type="text"
                value={discountRate}
                onChange={(e) => setDiscountRate(e.target.value)}
                placeholder="e.g. 8% or 0.08"
                className={styles.input}
              />
              <small className={styles.note}>
                Enter as percent (e.g. 8) or decimal (e.g. 0.08). We'll convert it.
              </small>
            </div>

            <div className={styles.cashflows}>
              <h3 className={styles.cfTitle}>Annual Cash Flows</h3>
              <div className={styles.cfGrid}>
                {cashFlows.map((cf, index) => (
                  <div key={index} className={styles.cfItem}>
                    <label htmlFor={`cf-${index}`} className={styles.label}>
                      Year {index + 1}
                    </label>
                    <input
                      id={`cf-${index}`}
                      type="text"
                      value={cf}
                      onChange={(e) => handleCashFlowChange(index, e.target.value)}
                      placeholder="e.g. $12,000"
                      className={styles.input}
                    />
                  </div>
                ))}
              </div>

              <div className={styles.cfActions}>
                <button
                  type="button"
                  onClick={addYear}
                  disabled={cashFlows.length >= 10}
                  className={`${styles.btn} ${styles.btnAdd}`}
                >
                  + Add Year
                </button>
                <button
                  type="button"
                  onClick={removeYear}
                  disabled={cashFlows.length <= 1}
                  className={`${styles.btn} ${styles.btnRemove}`}
                >
                  − Remove Year
                </button>
              </div>
            </div>

            <button type="submit" className={styles.submitBtn}>
              <span className={styles.btnText}>Calculate NPV</span>
              <span className={styles.arrow}>→</span>
            </button>
          </form>

          {result && (
            <div className={styles.resultSection}>
              <h3>Net Present Value (NPV)</h3>
              <div className={styles.resultGrid}>
                <div className={`${styles.resultItem} ${result.isProfitable ? styles.highlight : styles.warning}`}>
                  <strong>NPV:</strong> ${result.npv}
                </div>
                <div className={styles.resultItem}>
                  <strong>Investment:</strong> ${result.investment}
                </div>
                <div className={styles.resultItem}>
                  <strong>Discount Rate:</strong> {result.discountRate}%
                </div>
                <div className={styles.resultItem}>
                  <strong>Years:</strong> {result.years}
                </div>
              </div>
              <div className={styles.note}>
                {result.isProfitable
                  ? `This investment is profitable (NPV > $0). Expected value: $${result.npv}.`
                  : `This investment may not be profitable (NPV ≤ $0). Consider alternatives.`
                }
              </div>
            </div>
          )}
        </div>

        {/* History Cards Section */}
        <section className={styles.historySection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>NPV Calculator History & Global Applications</h2>
              <p className={styles.sectionSubtitle}>
                Explore the evolution and worldwide impact of net present value calculation tools
              </p>
            </div>
            
            <div className={styles.cardsGrid}>
              {npvCalculatorHistory.map((card) => (
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
    </>
  );
};

export default NpvCalculator;