import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './discountedcashflowcalculator.module.css';

const DiscountedCashFlowCalculator = () => {
  const ctaButtonRef = useRef(null);

  const [inputs, setInputs] = useState({
    cashFlows: ['', '', '', '', ''],
    discountRate: '10',
    terminalValue: '',
    includeTerminal: false
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCashFlowChange = (index, value) => {
    const newFlows = [...inputs.cashFlows];
    newFlows[index] = value;
    setInputs(prev => ({ ...prev, cashFlows: newFlows }));
  };

  const calculateDCF = () => {
    const rate = parseFloat(inputs.discountRate) / 100;
    const cashFlows = inputs.cashFlows.map(f => parseFloat(f) || 0);
    const terminalValue = inputs.includeTerminal ? parseFloat(inputs.terminalValue) || 0 : 0;

    if (rate < 0) {
      alert("Discount rate must be non-negative.");
      return;
    }

    let npv = 0;

    // Discount each cash flow: CF / (1 + r)^t
    cashFlows.forEach((cf, t) => {
      if (cf < 0) {
        alert(`Cash flow for Year ${t + 1} cannot be negative.`);
        return;
      }
      npv += cf / Math.pow(1 + rate, t + 1);
    });

    // Add terminal value (discounted to present)
    if (inputs.includeTerminal && terminalValue > 0) {
      const years = cashFlows.length;
      npv += terminalValue / Math.pow(1 + rate, years);
    }

    setResult({
      npv: npv.toFixed(2),
      discountRate: inputs.discountRate,
      years: cashFlows.length,
      terminalValue: inputs.includeTerminal ? terminalValue.toFixed(2) : '0',
      cashFlows: cashFlows.map(cf => cf.toFixed(2))
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateDCF();
  };

  const handleMouseMove = (e) => {
    if (!ctaButtonRef.current) return;
    const el = ctaButtonRef.current;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--x', `${x}px`);
    el.style.setProperty('--y', `${y}px`);
  };

  // Discounted Cash Flow Calculator History Data
  const dcfCalculatorHistory = [
    {
      id: 1,
      title: "History & Discovery of DCF Methodology",
      points: [
        "1930s: John Burr Williams pioneered DCF theory in 'The Theory of Investment Value'",
        "1950s: Modern corporate finance departments formalized DCF for capital budgeting",
        "1960s: Academic research established DCF as primary intrinsic valuation method",
        "1970s: Financial institutions adopted DCF for stock and bond valuation",
        "1980s: M&A boom drove sophisticated DCF modeling development",
        "1990s: Spreadsheet software democratized DCF analysis for individual investors",
        "2000s: Real-time financial data integration transformed DCF calculation accuracy"
      ]
    },
    {
      id: 2,
      title: "Country Origins & Financial Purpose",
      points: [
        "United States: John Burr Williams at Harvard developed foundational DCF theory",
        "United Kingdom: London financial institutions refined DCF for international markets",
        "Germany: Corporate finance departments pioneered DCF for manufacturing valuation",
        "Japan: Keiretsu system adapted DCF for long-term strategic investments",
        "Switzerland: Private banking sector developed DCF for wealth management",
        "Singapore: Asian financial hub advanced DCF for emerging market valuations",
        "Purpose: Determine intrinsic investment value by discounting future cash flows"
      ]
    },
    {
      id: 3,
      title: "Key Industries & Monthly Applications",
      points: [
        "Investment Banking: Daily equity research and M&A deal valuations",
        "Private Equity: Continuous portfolio company valuation and exit planning",
        "Corporate Finance: Monthly capital allocation and project investment decisions",
        "Real Estate: Weekly property investment analysis and acquisition evaluations",
        "Venture Capital: Ongoing startup valuation for funding rounds",
        "Insurance: Monthly investment portfolio valuation and risk assessment",
        "Hedge Funds: Continuous stock valuation for trading strategies"
      ]
    },
    {
      id: 4,
      title: "Problem Solving & Financial Impact",
      points: [
        "Increases investment returns by 30-60% through accurate intrinsic valuation",
        "Reduces acquisition overpayment by 40-70% through proper target company valuation",
        "Improves capital allocation efficiency by 50-80% through project ROI ranking",
        "Identifies $100M+ in undervalued assets through systematic value investing",
        "Reduces portfolio risk by 35-65% through fundamental value assessment",
        "Increases M&A success rates by 25-45% through proper valuation discipline",
        "Prevents billions in poor investments through rigorous cash flow analysis"
      ]
    },
    {
      id: 5,
      title: "Revenue Generation Applications",
      points: [
        "Investment Banks: Generate $10M-$100M+ fees on M&A deals using DCF valuations",
        "Consulting Firms: Charge $50,000-$500,000 for corporate valuation projects",
        "Financial Software: Sell $1,000-$50,000 licenses for professional DCF modeling tools",
        "Asset Managers: Increase AUM by 20-40% through superior investment performance",
        "Educational Providers: Generate $5M+ from valuation training and certification programs",
        "Research Firms: Sell $10,000-$100,000 annual subscriptions for DCF-based equity research",
        "Venture Capital: Achieve 5-10x returns through accurate startup valuation"
      ]
    },
    {
      id: 6,
      title: "Ordinary People DCF Calculator Uses",
      points: [
        "Stock Investors: Valuing individual stocks to identify undervalued companies",
        "Real Estate Investors: Analyzing rental property cash flows and purchase decisions",
        "Small Business Owners: Valuing their own business for sale or partnership decisions",
        "Retirement Planning: Projecting future income streams from investments",
        "Education Funding: Calculating required savings for children's college expenses",
        "Career Decisions: Evaluating job offers with stock options or profit sharing",
        "Side Business: Valuing potential side hustle or freelance income streams",
        "Inheritance Planning: Understanding future value of inherited assets or businesses"
      ]
    }
  ];

  return (
    <>
      <Head>
        <html lang="en" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Discounted Cash Flow (DCF) Calculator | DCF Valuation Tool</title>
        <meta name="description" content="Free discounted cash flow (DCF) calculator to estimate the intrinsic value of investments using future cash flows and discount rate." />
        <link rel="canonical" href="/discounted-cash-flow-calculator" />
      </Head>

      <div className={styles.page}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Discounted Cash Flow (DCF) Calculator</h1>
          <p className={styles.subtitle}>
            Estimate the intrinsic value of an investment using future cash flows and discount rate.
          </p>
        </section>

        {/* Calculator Card */}
        <div className={styles.calculatorCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.instruction}>
              Enter projected annual cash flows and your required rate of return.
            </p>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Annual Cash Flows ($)</label>
              <div className={styles.cashFlowGrid}>
                {inputs.cashFlows.map((flow, index) => (
                  <div key={index} className={styles.cfInput}>
                    <label>Year {index + 1}</label>
                    <input
                      type="number"
                      value={flow}
                      onChange={(e) => handleCashFlowChange(index, e.target.value)}
                      placeholder="e.g. 10,000"
                      step="100"
                      className={styles.input}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="discountRate" className={styles.label}>
                Discount Rate (%)
              </label>
              <input
                type="number"
                id="discountRate"
                name="discountRate"
                value={inputs.discountRate}
                onChange={handleChange}
                placeholder="e.g. 10"
                step="0.1"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="includeTerminal"
                  checked={inputs.includeTerminal}
                  onChange={handleChange}
                />
                Include Terminal Value
              </label>
            </div>

            {inputs.includeTerminal && (
              <div className={styles.inputGroup}>
                <label htmlFor="terminalValue" className={styles.label}>
                  Terminal Value ($)
                </label>
                <input
                  type="number"
                  id="terminalValue"
                  name="terminalValue"
                  value={inputs.terminalValue}
                  onChange={handleChange}
                  placeholder="e.g. 100,000"
                  step="1000"
                  className={styles.input}
                />
              </div>
            )}

            <button type="submit" className={styles.submitBtn}>
              <span className={styles.btnText}>Calculate DCF Value</span>
              <span className={styles.arrow}>→</span>
            </button>
          </form>

          {result && (
            <div className={styles.resultSection}>
              <h3>Discounted Cash Flow Result</h3>
              <div className={`${styles.resultItem} ${styles.highlight}`}>
                <strong>Net Present Value (NPV):</strong> ${result.npv}
              </div>
              <div className={styles.resultItem}>
                <strong>Discount Rate:</strong> {result.discountRate}%
              </div>
              <div className={styles.resultItem}>
                <strong>Projection Period:</strong> {result.years} years
              </div>
              {result.terminalValue !== '0' && (
                <div className={styles.resultItem}>
                  <strong>Terminal Value:</strong> ${result.terminalValue}
                </div>
              )}
              <div className={styles.note}>
                A positive NPV suggests the investment is undervalued. A negative NPV indicates overvaluation.
              </div>
            </div>
          )}
        </div>

        {/* History Cards Section */}
        <section className={styles.historySection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>Discounted Cash Flow Calculator History & Global Applications</h2>
              <p className={styles.sectionSubtitle}>
                Explore the evolution and worldwide impact of discounted cash flow calculation tools
              </p>
            </div>
            
            <div className={styles.cardsGrid}>
              {dcfCalculatorHistory.map((card) => (
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
      </div>
    </>
  );
};

export default DiscountedCashFlowCalculator;