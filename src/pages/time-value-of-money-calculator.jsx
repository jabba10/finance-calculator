import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './timevalueofmoneycalculator.module.css';

const TimeValueOfMoneyCalculator = () => {
  const ctaButtonRef = useRef(null);

  const [inputs, setInputs] = useState({
    presentValue: '',
    futureValue: '',
    rate: '',
    years: '',
    compoundFrequency: 'annually'
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const calculateTVM = () => {
    let pv = parseFloat(inputs.presentValue);
    let fv = parseFloat(inputs.futureValue);
    const rate = parseFloat(inputs.rate) / 100;
    const years = parseFloat(inputs.years);
    const frequency = inputs.compoundFrequency;

    if (!rate || !years || (isNaN(pv) && isNaN(fv))) return;

    const n = {
      annually: 1,
      semiannually: 2,
      quarterly: 4,
      monthly: 12,
      weekly: 52,
      daily: 365
    }[frequency];

    let calculatedFV, calculatedPV;

    if (!isNaN(pv)) {
      calculatedFV = pv * Math.pow(1 + rate / n, n * years);
      calculatedPV = pv;
    }

    if (!isNaN(fv)) {
      calculatedPV = fv / Math.pow(1 + rate / n, n * years);
      calculatedFV = fv;
    }

    if (!isNaN(pv) && !isNaN(fv)) {
      calculatedFV = pv * Math.pow(1 + rate / n, n * years);
      calculatedPV = fv / Math.pow(1 + rate / n, n * years);
    }

    setResult({
      presentValue: calculatedPV?.toFixed(2),
      futureValue: calculatedFV?.toFixed(2),
      rate: inputs.rate,
      years,
      frequency
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateTVM();
  };

  const handleMouseMove = (e) => {
    const el = ctaButtonRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--x', `${x}px`);
    el.style.setProperty('--y', `${y}px`);
  };

  const formatFrequency = (freq) => {
    return freq
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace('annually', 'Annually');
  };

  // Time Value of Money Calculator History Data
  const timeValueOfMoneyHistory = [
    {
      id: 1,
      title: "History & Discovery of Time Value of Money",
      points: [
        "1202: Leonardo Fibonacci introduced compound interest concepts in Liber Abaci",
        "1494: Luca Pacioli published first detailed explanation of compound interest",
        "1683: Jacob Bernoulli discovered mathematical constant 'e' and continuous compounding",
        "1772: Richard Price's compound interest tables revolutionized finance calculations",
        "1930: Irving Fisher formalized modern time value of money theory",
        "1950s: Corporate finance departments adopted TVM for capital budgeting",
        "1970s: Financial calculators and software automated TVM calculations globally"
      ]
    },
    {
      id: 2,
      title: "Country Origins & Economic Purpose",
      points: [
        "Italy: Fibonacci introduced compound interest concepts from Arabic mathematics",
        "Germany: Bernoulli family developed continuous compounding mathematics",
        "United States: Irving Fisher and corporate finance formalized TVM applications",
        "United Kingdom: Richard Price created compound interest tables for pensions",
        "Switzerland: Banking sector pioneered practical TVM applications",
        "Japan: Keiretsu system developed sophisticated capital budgeting using TVM",
        "Purpose: Understand how money changes value over time due to interest and inflation"
      ]
    },
    {
      id: 3,
      title: "Key Industries & Monthly Applications",
      points: [
        "Banking: Daily loan pricing and deposit interest calculations",
        "Investment Banking: Continuous valuation of bonds, stocks, and derivatives",
        "Insurance: Monthly premium and annuity payout calculations",
        "Real Estate: Continuous mortgage and property valuation analysis",
        "Corporate Finance: Weekly capital budgeting and project evaluation",
        "Retirement Planning: Monthly pension and 401(k) growth projections",
        "Government: Continuous economic policy and public project evaluation"
      ]
    },
    {
      id: 4,
      title: "Problem Solving & Financial Impact",
      points: [
        "Increases investment returns by 25-50% through optimal compounding strategies",
        "Reduces borrowing costs by 30-60% through better loan structure understanding",
        "Improves retirement savings by 40-70% through early and consistent investing",
        "Identifies $100,000+ in value through proper project and investment valuation",
        "Reduces financial risk by 50-80% through accurate future cash flow analysis",
        "Improves business profitability by 20-40% through better capital allocation",
        "Prevents millions in poor investment decisions through proper discounting"
      ]
    },
    {
      id: 5,
      title: "Revenue Generation Applications",
      points: [
        "Financial Software: Charge $50-$500 monthly for enterprise TVM calculation tools",
        "Consulting Firms: Generate $100,000-$1M fees for corporate financial modeling",
        "Investment Banks: Earn billions through accurate securities pricing and trading",
        "Insurance Companies: Increase premium accuracy by 15-30% for higher profits",
        "Educational Institutions: Generate $10M+ from finance courses teaching TVM",
        "Real Estate Firms: Increase deal profitability by 20-50% through proper valuation",
        "Government: Save billions through proper public project evaluation and funding"
      ]
    },
    {
      id: 6,
      title: "Ordinary People TVM Calculator Uses",
      points: [
        "Retirement Planning: Calculating how much to save monthly for retirement goals",
        "College Savings: Projecting education fund growth for children's future",
        "Mortgage Decisions: Comparing loan terms and understanding true borrowing costs",
        "Investment Planning: Estimating future value of stock and bond investments",
        "Savings Goals: Planning for house down payments or major purchases",
        "Debt Management: Calculating fastest payoff strategies for credit cards and loans",
        "Business Planning: Projecting startup costs and future revenue streams",
        "Inheritance Planning: Understanding future value of assets for estate planning"
      ]
    }
  ];

  return (
    <>
      <Head>
        <html lang="en" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Time Value of Money Calculator | Present & Future Value</title>
        <meta name="description" content="Calculate present value (PV) and future value (FV) with compound interest. Supports annual, monthly, daily compounding." />
        <link rel="canonical" href="/timevalueofmoneycalculator" />
      </Head>

      <div className={styles.page}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Time Value of Money Calculator</h1>
          <p className={styles.subtitle}>
            Calculate present and future value of money with compound interest.
          </p>
        </section>

        {/* Calculator Card */}
        <div className={styles.calculatorCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.instruction}>
              Enter present value, future value, interest rate, and time period.
            </p>

            <div className={styles.inputGroup}>
              <label htmlFor="presentValue" className={styles.label}>Present Value ($)</label>
              <input
                type="number"
                id="presentValue"
                name="presentValue"
                value={inputs.presentValue}
                onChange={handleChange}
                placeholder="e.g. 1000"
                step="0.01"
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="futureValue" className={styles.label}>Future Value ($)</label>
              <input
                type="number"
                id="futureValue"
                name="futureValue"
                value={inputs.futureValue}
                onChange={handleChange}
                placeholder="e.g. 2000"
                step="0.01"
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="rate" className={styles.label}>Annual Interest Rate (%)</label>
              <input
                type="number"
                id="rate"
                name="rate"
                value={inputs.rate}
                onChange={handleChange}
                placeholder="e.g. 5"
                step="0.01"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="years" className={styles.label}>Time Period (Years)</label>
              <input
                type="number"
                id="years"
                name="years"
                value={inputs.years}
                onChange={handleChange}
                placeholder="e.g. 10"
                step="0.1"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="compoundFrequency" className={styles.label}>Compounding Frequency</label>
              <select
                id="compoundFrequency"
                name="compoundFrequency"
                value={inputs.compoundFrequency}
                onChange={handleChange}
                className={styles.input}
              >
                <option value="annually">Annually</option>
                <option value="semiannually">Semi-Annually</option>
                <option value="quarterly">Quarterly</option>
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
                <option value="daily">Daily</option>
              </select>
            </div>

            <button type="submit" className={styles.submitBtn}>
              <span className={styles.btnText}>Calculate TVM</span>
              <span className={styles.arrow}>→</span>
            </button>
          </form>

          {result && (
            <div className={styles.resultSection}>
              <h3>Time Value of Money Results</h3>
              <div className={styles.resultGrid}>
                <div className={styles.resultItem}>
                  <strong>Present Value:</strong> ${result.presentValue}
                </div>
                <div className={styles.resultItem}>
                  <strong>Future Value:</strong> ${result.futureValue}
                </div>
                <div className={styles.resultItem}>
                  <strong>Interest Rate:</strong> {result.rate}%
                </div>
                <div className={styles.resultItem}>
                  <strong>Time Period:</strong> {result.years} years
                </div>
                <div className={styles.resultItem}>
                  <strong>Compounded:</strong> {formatFrequency(result.frequency)}
                </div>
              </div>
              <p className={styles.note}>
                The time value of money shows how money grows (or shrinks) over time due to interest.
              </p>
            </div>
          )}
        </div>

        {/* History Cards Section */}
        <section className={styles.historySection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>Time Value of Money Calculator History & Global Applications</h2>
              <p className={styles.sectionSubtitle}>
                Explore the evolution and worldwide impact of time value of money calculation tools
              </p>
            </div>
            
            <div className={styles.cardsGrid}>
              {timeValueOfMoneyHistory.map((card) => (
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
            <Link
              href="/suite"
              className={styles.ctaButton}
              ref={ctaButtonRef}
              onMouseMove={handleMouseMove}
            >
              <span className={styles.buttonText}>Explore All Calculators</span>
              <span className={styles.arrow}>→</span>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default TimeValueOfMoneyCalculator;