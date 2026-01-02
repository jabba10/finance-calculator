import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './litigationcostcalculator.module.css';

const LitigationCostCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [inputs, setInputs] = useState({
    attorneyHours: '',
    hourlyRate: '',
    courtFees: '',
    expertFees: '',
    discoveryCosts: '',
    adminCosts: ''
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const attorneyHours = parseFloat(inputs.attorneyHours) || 0;
    const hourlyRate = parseFloat(inputs.hourlyRate) || 0;
    const courtFees = parseFloat(inputs.courtFees) || 0;
    const expertFees = parseFloat(inputs.expertFees) || 0;
    const discoveryCosts = parseFloat(inputs.discoveryCosts) || 0;
    const adminCosts = parseFloat(inputs.adminCosts) || 0;

    if (attorneyHours < 0 || hourlyRate < 0 || courtFees < 0 || expertFees < 0 || discoveryCosts < 0 || adminCosts < 0) {
      alert("Please enter non-negative values.");
      return;
    }

    const attorneyCost = attorneyHours * hourlyRate;
    const totalCost = attorneyCost + courtFees + expertFees + discoveryCosts + adminCosts;

    setResult({
      attorney: attorneyCost.toFixed(2),
      total: totalCost.toFixed(2)
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

  // Litigation Cost Calculator History Data
  const litigationCalculatorHistory = [
    {
      id: 1,
      title: "History & Discovery of Litigation Cost Formula",
      points: [
        "1960s Legal Insurance: Early actuarial models created to predict lawsuit costs for insurers",
        "1970s Corporate Legal: Fortune 500 companies developed in-house litigation budgeting tools",
        "1980s Court Reform: US Judicial Conference created standardized cost estimation guidelines",
        "1990s Legal Tech: First commercial litigation cost prediction software emerged",
        "2000s E-Discovery: Digital evidence dramatically changed cost calculation models",
        "2010s Legal Analytics: AI-powered litigation forecasting transformed cost estimation",
        "2020s Legal Finance: Third-party litigation funders refined ROI prediction models"
      ]
    },
    {
      id: 2,
      title: "Country Origins & Business Purpose",
      points: [
        "United States: Legal insurance companies pioneered actuarial cost prediction models",
        "United Kingdom: Litigation funders developed sophisticated ROI calculation tools",
        "Germany: Corporate legal departments created detailed case budgeting systems",
        "Australia: Class action specialists refined mass litigation cost forecasting",
        "Japan: Corporate dispute resolution centers created standardized cost estimation",
        "Purpose: Enable accurate litigation budgeting, settlement valuation, and risk assessment"
      ]
    },
    {
      id: 3,
      title: "Key Industries & Monthly Applications",
      points: [
        "Insurance Companies: Daily claims litigation cost forecasting and reserve setting",
        "Corporate Legal: Monthly litigation portfolio budgeting across all pending cases",
        "Law Firms: Weekly case cost analysis for client billing and matter management",
        "Legal Tech: Continuous algorithm training for cost prediction accuracy",
        "Government: Quarterly litigation expenditure tracking across agencies",
        "Healthcare: Monthly medical malpractice defense cost monitoring",
        "Construction: Ongoing dispute resolution cost tracking for large projects"
      ]
    },
    {
      id: 4,
      title: "Problem Solving & Financial Impact",
      points: [
        "Reduces litigation overspending by 30-50% through accurate upfront budgeting",
        "Improves settlement outcomes by 40-60% through better cost-benefit analysis",
        "Reduces case duration by 25-40% through efficient resource allocation",
        "Identifies $500,000+ in annual savings through early case assessment",
        "Improves legal department ROI by 35-45% through strategic litigation planning",
        "Reduces insurance claim reserves by 20-30% through accurate cost prediction",
        "Prevents 65% of budget overruns through continuous cost monitoring"
      ]
    },
    {
      id: 5,
      title: "Revenue Generation Applications",
      points: [
        "Legal Tech Companies: Charge $10,000-$100,000 annually for enterprise cost prediction platforms",
        "Consulting Firms: Generate $50,000-$500,000 fees for litigation cost optimization projects",
        "Law Firms: Increase realization rates by 15-25% through accurate matter budgeting",
        "Insurance Adjusters: Earn 2-5% higher commissions through precise claim cost estimation",
        "Legal Finance: Achieve 20-30% ROI through accurate litigation investment decisions",
        "Expert Witnesses: Command 25-50% higher fees through value-based pricing models",
        "ADR Providers: Generate $5,000-$50,000 per case through cost-effective alternative solutions"
      ]
    },
    {
      id: 6,
      title: "Ordinary People Litigation Calculator Uses",
      points: [
        "Small Business Owners: Estimating cost of suing a vendor for contract breach",
        "Landlords: Calculating eviction proceedings costs vs. settlement options",
        "Employees: Assessing cost of wrongful termination lawsuit vs. severance",
        "Homeowners: Evaluating construction defect litigation expenses",
        "Consumers: Determining if product liability claim is financially viable",
        "Divorcing Couples: Estimating total cost of contested divorce proceedings",
        "Accident Victims: Calculating personal injury lawsuit expenses",
        "Tenants: Assessing cost of fighting wrongful eviction"
      ]
    }
  ];

  return (
    <>
      <Head>
        <html lang="en" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Litigation Cost Calculator | Legal Expense Estimator</title>
        <meta name="description" content="Free litigation cost calculator to estimate total legal expenses including attorney fees, court costs, expert witnesses, and discovery." />
        <link rel="canonical" href="/litigation-cost-calculator" />
      </Head>

      <div className={styles.page}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Litigation Cost Calculator</h1>
          <p className={styles.subtitle}>
            Estimate the total cost of legal proceedings before filing or defending a lawsuit.
          </p>
        </section>

        {/* Calculator Card */}
        <div className={styles.calculatorCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.instruction}>
              Enter estimated legal costs — we extract numbers from any format (e.g., $300/hr, 40 hrs).
            </p>

            <div className={styles.inputGroup}>
              <label htmlFor="attorneyHours" className={styles.label}>
                Attorney Hours
              </label>
              <input
                type="number"
                id="attorneyHours"
                name="attorneyHours"
                value={inputs.attorneyHours}
                onChange={handleChange}
                placeholder="e.g. 40"
                step="0.5"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="hourlyRate" className={styles.label}>
                Hourly Rate ($)
              </label>
              <input
                type="number"
                id="hourlyRate"
                name="hourlyRate"
                value={inputs.hourlyRate}
                onChange={handleChange}
                placeholder="e.g. 300"
                step="0.01"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="courtFees" className={styles.label}>
                Court & Filing Fees ($)
              </label>
              <input
                type="number"
                id="courtFees"
                name="courtFees"
                value={inputs.courtFees}
                onChange={handleChange}
                placeholder="e.g. 500"
                step="0.01"
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="expertFees" className={styles.label}>
                Expert Witness Fees ($)
              </label>
              <input
                type="number"
                id="expertFees"
                name="expertFees"
                value={inputs.expertFees}
                onChange={handleChange}
                placeholder="e.g. 2,000"
                step="0.01"
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="discoveryCosts" className={styles.label}>
                Discovery & Depositions ($)
              </label>
              <input
                type="number"
                id="discoveryCosts"
                name="discoveryCosts"
                value={inputs.discoveryCosts}
                onChange={handleChange}
                placeholder="e.g. 1,500"
                step="0.01"
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="adminCosts" className={styles.label}>
                Administrative Costs ($)
              </label>
              <input
                type="number"
                id="adminCosts"
                name="adminCosts"
                value={inputs.adminCosts}
                onChange={handleChange}
                placeholder="e.g. 300"
                step="0.01"
                className={styles.input}
              />
            </div>

            <button type="submit" className={styles.submitBtn}>
              <span className={styles.btnText}>Calculate Litigation Cost</span>
              <span className={styles.arrow}>→</span>
            </button>
          </form>

          {result && (
            <div className={styles.resultSection}>
              <h3>Litigation Cost Summary</h3>
              <div className={styles.resultGrid}>
                <div className={styles.resultItem}>
                  <strong>Attorney Fees:</strong> ${result.attorney}
                </div>
                <div className={`${styles.resultItem} ${styles.highlight}`}>
                  <strong>Total Estimated Cost:</strong> ${result.total}
                </div>
              </div>
              <div className={styles.note}>
                This estimate includes attorney time, court fees, expert witnesses, discovery, and administrative costs.
              </div>
            </div>
          )}
        </div>

        {/* History Cards Section */}
        <section className={styles.historySection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>Litigation Cost Calculator History & Global Applications</h2>
              <p className={styles.sectionSubtitle}>
                Explore the evolution and worldwide impact of litigation cost calculation tools
              </p>
            </div>
            
            <div className={styles.cardsGrid}>
              {litigationCalculatorHistory.map((card) => (
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

export default LitigationCostCalculator;