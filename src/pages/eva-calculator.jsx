import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './evacalculator.module.css';

const EvaCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [nopat, setNopat] = useState('');
  const [capital, setCapital] = useState('');
  const [wacc, setWacc] = useState('');
  const [result, setResult] = useState(null);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const profit = parseFloat(nopat);
    const investedCapital = parseFloat(capital);
    const costOfCapital = parseFloat(wacc); // % value

    if (
      isNaN(profit) ||
      isNaN(investedCapital) ||
      isNaN(costOfCapital) ||
      investedCapital <= 0 ||
      costOfCapital < 0 ||
      costOfCapital > 100
    ) {
      alert("Please enter valid positive numbers. WACC must be between 0 and 100.");
      return;
    }

    // Convert WACC to decimal
    const waccDecimal = costOfCapital / 100;

    // EVA = NOPAT - (Invested Capital × WACC)
    const eva = profit - investedCapital * waccDecimal;
    const evaFormatted = eva.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    const isValueCreating = eva > 0;

    setResult({
      nopat: profit.toLocaleString(),
      capital: investedCapital.toLocaleString(),
      wacc: costOfCapital.toFixed(2),
      eva: evaFormatted,
      isValueCreating,
    });
  };

  // Magnetic effect on CTA button
  const handleMouseMove = (e) => {
    const el = ctaButtonRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--x', `${x}px`);
    el.style.setProperty('--y', `${y}px`);
  };

  // SEO Metadata
  const siteUrl = 'https://www.financecalculatorfree.com';
  const pageTitle = 'EVA Calculator | Free Economic Value Added Tool';
  const pageDescription = 'Calculate Economic Value Added (EVA) to measure true profitability after cost of capital. See if your business creates or destroys shareholder value.';

  // EVA History Data
  const evaHistory = [
    {
      id: 1,
      title: "History & Discovery of Economic Value Added",
      points: [
        "1980s Corporate America: Stern Stewart & Co. consulting firm invented EVA to measure true economic profit",
        "1990s Fortune 500 Adoption: Coca-Cola, AT&T, and Eli Lilly implemented EVA for executive compensation",
        "1990s Academic Validation: Harvard Business School and Columbia Business School published EVA research",
        "2000s Global Expansion: European and Asian companies adopted EVA for cross-border performance measurement",
        "2010s Technology Integration: Financial software companies embedded EVA in corporate performance management systems",
        "2020s ESG Integration: Modern EVA models incorporated environmental and social capital costs"
      ]
    },
    {
      id: 2,
      title: "Global Origins & Business Purpose",
      points: [
        "United States: New York consulting firms created EVA for Fortune 500 value-based management",
        "United Kingdom: London financial institutions used EVA for pension fund investment screening",
        "Germany: Manufacturing giants adopted EVA for capital-intensive project evaluation",
        "Japan: Keiretsu business groups implemented EVA for cross-company performance comparison",
        "Australia: Mining and resources companies used EVA for long-term investment decisions",
        "Purpose: Measure true economic profit, align management with shareholders, and optimize capital allocation"
      ]
    },
    {
      id: 3,
      title: "Key Industries & Monthly Applications",
      points: [
        "Manufacturing: Monthly EVA tracking for production facility capital efficiency",
        "Financial Services: Quarterly EVA calculation for investment portfolio performance",
        "Telecommunications: Annual EVA assessment for infrastructure investment returns",
        "Energy & Utilities: Continuous EVA monitoring for capital project ROI validation",
        "Pharmaceuticals: R&D project EVA evaluation for research funding allocation",
        "Retail Chains: Store-level EVA analysis for expansion and closure decisions",
        "Technology: Product line EVA assessment for resource allocation and pricing"
      ]
    },
    {
      id: 4,
      title: "Problem Solving & Financial Impact",
      points: [
        "Identifies 15-25% of capital investments that destroy shareholder value",
        "Improves capital allocation efficiency by 30-50% through EVA-based decision making",
        "Increases shareholder returns by 20-40% through focused value creation initiatives",
        "Reduces wasteful capital expenditures by 25-40% through EVA screening",
        "Improves merger success rates by 35-60% through EVA-based target evaluation",
        "Enables 2-4x higher executive bonus payouts through EVA-based compensation",
        "Reduces cost of capital by 1-2% through demonstrated value creation track record"
      ]
    },
    {
      id: 5,
      title: "Revenue Generation Applications",
      points: [
        "Consulting Firms: Charge $500,000-$5,000,000 for EVA implementation and training programs",
        "Financial Software: Sell $50,000-$500,000 EVA calculation and reporting platforms",
        "Executive Education: Generate $10,000-$100,000 per program for EVA certification courses",
        "Investment Research: Produce $25,000-$250,000 EVA-based stock analysis reports",
        "Corporate Training: Deliver $5,000-$50,000 EVA workshops for management teams",
        "Performance Management: Implement $100,000-$1,000,000 EVA-based bonus systems",
        "M&A Advisory: Earn 1-3% fees on EVA-driven acquisition transactions"
      ]
    },
    {
      id: 6,
      title: "Ordinary People EVA Calculator Uses",
      points: [
        "Small Business Owners: Measuring true profitability after accounting for owner's capital",
        "Real Estate Investors: Calculating property investment returns vs. alternative opportunities",
        "Startup Founders: Demonstrating to investors how efficiently capital is being used",
        "Franchise Operators: Comparing franchise performance on economic value basis",
        "Online Business Sellers: Valuing e-commerce businesses for sale on marketplaces",
        "Professional Practices: Assessing law firm or medical practice economic performance",
        "Family Businesses: Evaluating different business units for succession planning",
        "Side Business Owners: Determining if side hustle creates economic value vs. time invested"
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
        <link rel="canonical" href={`${siteUrl}/eva-calculator`} />
      </Head>

      <div className={styles.page}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>EVA Calculator</h1>
          <p className={styles.subtitle}>
            Calculate Economic Value Added (EVA) to measure true economic profit after cost of capital.
          </p>
        </section>

        {/* Calculator Card */}
        <div className={styles.calculatorCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.instruction}>
              Enter NOPAT, invested capital, and WACC to calculate Economic Value Added.
            </p>

            <div className={styles.inputGroup}>
              <label htmlFor="nopat" className={styles.label}>
                NOPAT ($)
              </label>
              <input
                id="nopat"
                type="text"
                value={nopat}
                onChange={(e) => setNopat(e.target.value)}
                placeholder="e.g. 250,000"
                className={styles.input}
                required
              />
              <small className={styles.note}>
                Net Operating Profit After Tax — profit after taxes but before interest.
              </small>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="capital" className={styles.label}>
                Invested Capital ($)
              </label>
              <input
                id="capital"
                type="text"
                value={capital}
                onChange={(e) => setCapital(e.target.value)}
                placeholder="e.g. 1,200,000"
                className={styles.input}
                required
              />
              <small className={styles.note}>
                Total capital invested in the business (equity + debt).
              </small>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="wacc" className={styles.label}>
                WACC (%)
              </label>
              <input
                id="wacc"
                type="number"
                value={wacc}
                onChange={(e) => setWacc(e.target.value)}
                placeholder="e.g. 8.5"
                className={styles.input}
                min="0"
                max="100"
                step="0.1"
                required
              />
              <small className={styles.note}>
                Weighted Average Cost of Capital — your required rate of return.
              </small>
            </div>

            <button type="submit" className={styles.submitBtn}>
              <span className={styles.btnText}>Calculate EVA</span>
              <span className={styles.arrow}>→</span>
            </button>
          </form>

          {result && (
            <div className={styles.resultSection}>
              <h3>Economic Value Added (EVA)</h3>
              <div className={styles.resultGrid}>
                <div className={styles.resultItem}>
                  <strong>NOPAT:</strong> ${result.nopat}
                </div>
                <div className={styles.resultItem}>
                  <strong>Capital:</strong> ${result.capital}
                </div>
                <div className={styles.resultItem}>
                  <strong>WACC:</strong> {result.wacc}%
                </div>
                <div className={`${styles.resultItem} ${styles.highlight} ${result.isValueCreating ? styles.positive : styles.negative}`}>
                  <strong>EVA:</strong> ${result.eva}
                </div>
              </div>
              <div className={styles.note}>
                {result.isValueCreating
                  ? `Your company is creating economic value. Every dollar invested earns more than the cost of capital.`
                  : `Negative EVA means your company is destroying value. Consider improving efficiency or reducing capital.`
                }
              </div>
            </div>
          )}
        </div>

        {/* History Cards Section */}
        <section className={styles.historySection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>EVA Calculator History & Global Applications</h2>
              <p className={styles.sectionSubtitle}>
                Explore the evolution and worldwide impact of economic value added calculation tools
              </p>
            </div>
            
            <div className={styles.cardsGrid}>
              {evaHistory.map((card) => (
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

export default EvaCalculator;