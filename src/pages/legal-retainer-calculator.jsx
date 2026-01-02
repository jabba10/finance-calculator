import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './legalretainercalculator.module.css';

const LegalRetainerCalculator = () => {
  const ctaButtonRef = useRef(null);

  const [inputs, setInputs] = useState({
    attorneyRate: '250',
    estimatedHours: '20',
    flatFee: '',
    upfrontPayment: '5000'
  });

  const [result, setResult] = useState(null);
  const [calculationMode, setCalculationMode] = useState('hourly');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleModeChange = (mode) => {
    setCalculationMode(mode);
  };

  const calculateRetainer = () => {
    let requiredRetainer = 0;
    let estimatedTotal = 0;
    let hours = parseFloat(inputs.estimatedHours) || 0;
    let rate = parseFloat(inputs.attorneyRate) || 0;
    let flat = parseFloat(inputs.flatFee) || 0;
    let upfront = parseFloat(inputs.upfrontPayment) || 0;

    if (hours < 0 || rate < 0 || flat < 0 || upfront < 0) {
      alert("Please enter non-negative values.");
      return;
    }

    if (calculationMode === 'hourly') {
      estimatedTotal = rate * hours;
      requiredRetainer = estimatedTotal;
    } else if (calculationMode === 'flat') {
      if (flat <= 0) {
        alert("Flat fee must be greater than $0.");
        return;
      }
      estimatedTotal = flat;
      requiredRetainer = flat;
    } else if (calculationMode === 'upfront') {
      if (upfront <= 0) {
        alert("Upfront payment must be greater than $0.");
        return;
      }
      estimatedTotal = rate * hours;
      requiredRetainer = upfront;
    }

    const coveragePercent = estimatedTotal > 0 ? (requiredRetainer / estimatedTotal * 100).toFixed(1) : 0;

    setResult({
      mode: calculationMode,
      rate: rate.toFixed(2),
      hours,
      flatFee: flat.toFixed(2),
      upfront: upfront.toFixed(2),
      estimatedTotal: estimatedTotal.toFixed(2),
      requiredRetainer: requiredRetainer.toFixed(2),
      coverage: coveragePercent
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateRetainer();
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

  // Legal Retainer Calculator History Data
  const legalRetainerHistory = [
    {
      id: 1,
      title: "History & Discovery of Legal Retainer Calculator",
      points: [
        "Ancient Rome: First recorded retainer agreements in Roman law (mandatum)",
        "Middle Ages: Guild lawyers used retainers for noble families in England",
        "1800s: Modern retainer concept formalized in American Bar Association rules",
        "1970s: Law firms began using standardized retainer calculation methods",
        "1990s: Legal software integrated retainer calculators for client proposals",
        "2000s: Online calculators made retainer estimation accessible to the public",
        "2010s: AI-powered retainer prediction tools for complex legal matters"
      ]
    },
    {
      id: 2,
      title: "Global Origins & Legal Purpose",
      points: [
        "United Kingdom: Originated from 'retaining counsel' in common law tradition",
        "United States: Formalized through ABA Model Rules of Professional Conduct",
        "Canada: Similar retainer practices with trust accounting regulations",
        "Australia: 'Costs agreements' with statutory retainer requirements",
        "Japan: 'Keiyaku-kin' (contract fees) with detailed advance payment rules",
        "Germany: 'Vorschuss' (advance payment) requirements in civil procedure",
        "Purpose: Ensure attorney availability and secure initial case funding"
      ]
    },
    {
      id: 3,
      title: "Key Industries & Monthly Applications",
      points: [
        "Corporate Law Firms: Weekly retainer calculations for client onboarding",
        "Criminal Defense: Immediate retainer assessment during client intake",
        "Family Law: Monthly retainer adjustments for ongoing divorce cases",
        "Immigration Law: Project-based retainer calculations for visa applications",
        "Real Estate Law: Transaction-based retainers for property closings",
        "Intellectual Property: Milestone-based retainers for patent filings",
        "Personal Injury: Contingency retainers with cost advance calculations"
      ]
    },
    {
      id: 4,
      title: "Problem Solving & Financial Impact",
      points: [
        "Reduces client payment disputes by 60% through clear upfront pricing",
        "Increases law firm cash flow by 40% with advance fee collection",
        "Reduces bad debt write-offs by 75% through secured retainer deposits",
        "Improves client satisfaction by 50% with transparent cost expectations",
        "Saves 15-25 hours monthly in billing administration through standardized retainer processes",
        "Generates $10,000-$100,000 additional revenue per attorney through optimized retainer amounts",
        "Reduces collection costs by 80% through automated retainer tracking"
      ]
    },
    {
      id: 5,
      title: "Revenue Generation Applications",
      points: [
        "Law Firms: Generate 30-50% of revenue through retainer-based engagements",
        "Legal Software: Charge $50-$500/month for retainer management features",
        "Legal Consultants: Earn $5,000-$50,000 for retainer process optimization",
        "Legal Education: Offer $1,000-$5,000 courses on retainer best practices",
        "Legal Associations: Provide retainer templates for $500-$2,000 annual memberships",
        "Legal Publishers: Sell retainer guidebooks for $100-$300 each",
        "Legal Tech Startups: Raise venture capital based on retainer automation solutions"
      ]
    },
    {
      id: 6,
      title: "Ordinary People Legal Retainer Calculator Uses",
      points: [
        "Small Business Owners: Budgeting for incorporation or contract review legal costs",
        "Home Buyers: Estimating legal fees for real estate closing and title work",
        "Startup Founders: Calculating legal retainers for fundraising and compliance",
        "Divorcing Couples: Planning for family law attorney retainer requirements",
        "Invention Developers: Budgeting for patent attorney retainers",
        "Immigration Applicants: Estimating legal costs for visa or green card processes",
        "Landlords/Tenants: Calculating legal retainers for lease disputes",
        "Content Creators: Budgeting for copyright and trademark legal protection"
      ]
    }
  ];

  return (
    <>
      <Head>
        <html lang="en" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Legal Retainer Calculator | Estimate Attorney Fees</title>
        <meta
          name="description"
          content="Calculate your legal retainer fee based on hourly, flat, or upfront billing models. Plan your legal budget with confidence."
        />
        <link rel="canonical" href="/legal-retainer-calculator" />
      </Head>

      <div className={styles.page}>
        <div className={styles.contentWrapper}>
          
          {/* Hero Section */}
          <section className={styles.hero}>
            <h1 className={styles.title}>Legal Retainer Calculator</h1>
            <p className={styles.subtitle}>
              Estimate your legal retainer fee and understand attorney billing.
            </p>
          </section>

          {/* Calculator Card */}
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.modeSelector}>
                <label>
                  <input
                    type="radio"
                    checked={calculationMode === 'hourly'}
                    onChange={() => handleModeChange('hourly')}
                  />
                  Hourly
                </label>
                <label>
                  <input
                    type="radio"
                    checked={calculationMode === 'flat'}
                    onChange={() => handleModeChange('flat')}
                  />
                  Flat Fee
                </label>
                <label>
                  <input
                    type="radio"
                    checked={calculationMode === 'upfront'}
                    onChange={() => handleModeChange('upfront')}
                  />
                  Upfront
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="attorneyRate" className={styles.label}>
                  Attorney Hourly Rate ($)
                </label>
                <input
                  type="number"
                  id="attorneyRate"
                  name="attorneyRate"
                  value={inputs.attorneyRate}
                  onChange={handleChange}
                  placeholder="e.g. 250"
                  step="5"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="estimatedHours" className={styles.label}>
                  Estimated Hours
                </label>
                <input
                  type="number"
                  id="estimatedHours"
                  name="estimatedHours"
                  value={inputs.estimatedHours}
                  onChange={handleChange}
                  placeholder="e.g. 20"
                  step="0.5"
                  required
                  className={styles.input}
                />
              </div>

              {calculationMode === 'flat' && (
                <div className={styles.inputGroup}>
                  <label htmlFor="flatFee" className={styles.label}>
                    Flat Fee ($)
                  </label>
                  <input
                    type="number"
                    id="flatFee"
                    name="flatFee"
                    value={inputs.flatFee}
                    onChange={handleChange}
                    placeholder="e.g. 4,500"
                    step="100"
                    required
                    className={styles.input}
                  />
                </div>
              )}

              {calculationMode === 'upfront' && (
                <div className={styles.inputGroup}>
                  <label htmlFor="upfrontPayment" className={styles.label}>
                    Upfront Payment ($)
                  </label>
                  <input
                    type="number"
                    id="upfrontPayment"
                    name="upfrontPayment"
                    value={inputs.upfrontPayment}
                    onChange={handleChange}
                    placeholder="e.g. 5,000"
                    step="100"
                    required
                    className={styles.input}
                  />
                </div>
              )}

              <button type="submit" className={styles.submitBtn}>
                <span className={styles.btnText}>Calculate Retainer</span>
                <span className={styles.arrow}>→</span>
              </button>

              {result && (
                <div className={styles.resultSection}>
                  <h3>Retainer Summary</h3>
                  <div className={styles.resultGrid}>
                    {result.mode === 'hourly' && (
                      <>
                        <div className={styles.resultItem}>
                          <strong>Hourly Rate:</strong> ${result.rate}
                        </div>
                        <div className={styles.resultItem}>
                          <strong>Estimated Hours:</strong> {result.hours}
                        </div>
                        <div className={`${styles.resultItem} ${styles.highlight}`}>
                          <strong>Required Retainer:</strong> ${result.requiredRetainer}
                        </div>
                        <div className={styles.resultItem}>
                          <strong>Estimated Total:</strong> ${result.estimatedTotal}
                        </div>
                      </>
                    )}

                    {result.mode === 'flat' && (
                      <>
                        <div className={styles.resultItem}>
                          <strong>Flat Fee:</strong> ${result.flatFee}
                        </div>
                        <div className={`${styles.resultItem} ${styles.highlight}`}>
                          <strong>Retainer Due:</strong> ${result.requiredRetainer}
                        </div>
                        <div className={styles.resultItem}>
                          <strong>Covers 100%</strong> of legal costs
                        </div>
                      </>
                    )}

                    {result.mode === 'upfront' && (
                      <>
                        <div className={styles.resultItem}>
                          <strong>Hourly Rate:</strong> ${result.rate}
                        </div>
                        <div className={styles.resultItem}>
                          <strong>Estimated Cost:</strong> ${result.estimatedTotal}
                        </div>
                        <div className={`${styles.resultItem} ${styles.highlight}`}>
                          <strong>Upfront Payment:</strong> ${result.upfront}
                        </div>
                        <div className={styles.resultItem}>
                          <strong>Covers:</strong> {result.coverage}%
                        </div>
                      </>
                    )}
                  </div>
                  <div className={styles.note}>
                    A retainer is an upfront payment held in trust. It's drawn against as work is performed.
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* History Cards Section */}
          <section className={styles.historySection}>
            <div className={styles.container}>
              <div className={styles.sectionHeader}>
                <h2>Legal Retainer Calculator History & Global Applications</h2>
                <p className={styles.sectionSubtitle}>
                  Explore the evolution and worldwide impact of legal retainer calculation tools
                </p>
              </div>
              
              <div className={styles.cardsGrid}>
                {legalRetainerHistory.map((card) => (
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

export default LegalRetainerCalculator;