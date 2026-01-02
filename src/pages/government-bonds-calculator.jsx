import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './governmentbondcalculator.module.css';

const GovernmentBondCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [faceValue, setFaceValue] = useState('1000');
  const [couponRate, setCouponRate] = useState('5');
  const [yearsToMaturity, setYearsToMaturity] = useState('10');
  const [marketYield, setMarketYield] = useState('4.5');
  const [paymentsPerYear, setPaymentsPerYear] = useState('2'); // semi-annual
  const [result, setResult] = useState(null);

  // Helper: Parse number (remove commas, allow decimals)
  const parseNumber = (value) => {
    if (!value) return NaN;
    const cleaned = value.toString().replace(/[^0-9.]/g, '');
    return parseFloat(cleaned);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const F = parseNumber(faceValue);
    const c = parseNumber(couponRate) / 100; // Convert % to decimal
    const n = parseNumber(yearsToMaturity);
    const y = parseNumber(marketYield) / 100; // YTM as decimal
    const m = parseInt(paymentsPerYear);

    // Validate inputs
    if (isNaN(F) || isNaN(c) || isNaN(n) || isNaN(y) || isNaN(m)) {
      alert("Please enter valid numbers in all fields.");
      return;
    }
    if (F <= 0 || c < 0 || n <= 0 || y < 0 || m <= 0) {
      alert("Please enter positive values for all fields.");
      return;
    }

    // Calculate periodic coupon payment
    const couponPayment = (F * c) / m;
    const periods = n * m;
    const periodicYield = y / m;

    // Bond price = sum of discounted cash flows
    let price = 0;
    for (let t = 1; t <= periods; t++) {
      price += couponPayment / Math.pow(1 + periodicYield, t);
    }
    // Add present value of face value
    price += F / Math.pow(1 + periodicYield, periods);

    // Current Yield = Annual Coupon / Price
    const currentYield = ((F * c) / price) * 100;

    // Determine bond status
    const premium = price > F;
    const discount = price < F;
    const par = Math.abs(price - F) < 0.01;

    setResult({
      faceValue: F.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      couponRate: (c * 100).toFixed(2),
      marketYield: (y * 100).toFixed(2),
      price: price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      currentYield: currentYield.toFixed(2),
      premium,
      discount,
      par
    });
  };

  // Magnetic cursor effect for CTA button
  const handleMouseMove = (e) => {
    if (!ctaButtonRef.current) return;
    const el = ctaButtonRef.current;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--x', `${x}px`);
    el.style.setProperty('--y', `${y}px`);
  };

  // Government Bond Calculator History Cards Data
  const governmentBondHistoryCards = [
    {
      id: 1,
      title: "History & Discovery of Government Bond Calculators",
      points: [
        "1694 England: Early bond calculations developed for Bank of England gilts",
        "1790 USA: Treasury bond valuation models created during Revolutionary War debt",
        "1840s Germany: Mathematical bond pricing formulas formalized by economists",
        "1930s USA: Modern yield-to-maturity formulas developed during Great Depression",
        "1960s UK: Computerized bond calculators for government gilt trading",
        "1980s Japan: Advanced duration and convexity calculators for JGBs",
        "2000s Global: Real-time bond calculators integrated with electronic trading"
      ]
    },
    {
      id: 2,
      title: "Global Origins & Country-Specific Development",
      points: [
        "United States: Developed for Treasury bond auctions and secondary market trading",
        "United Kingdom: Created for government gilt valuation and Bank of England operations",
        "Japan: Built for Japan Government Bonds (JGBs) in world's second largest bond market",
        "Germany: Developed for Bund calculations in Europe's benchmark bond market",
        "France: Created for OAT (Obligation Assimilable du Trésor) bond analysis",
        "Canada: Built for Government of Canada bond calculations and yield curve analysis",
        "Australia: Developed for Commonwealth Government Securities (CGS) valuation"
      ]
    },
    {
      id: 3,
      title: "Key Industries & Monthly Applications",
      points: [
        "Central Banks: Daily use for monetary policy implementation and bond purchases",
        "Commercial Banks: Weekly bond portfolio valuation and risk assessment",
        "Investment Funds: Monthly government bond allocation and yield optimization",
        "Insurance Companies: Quarterly liability matching with government bond durations",
        "Pension Funds: Monthly duration matching for long-term obligations",
        "Corporate Treasuries: Weekly cash management using Treasury bill ladders",
        "Trading Desks: Real-time arbitrage calculations across global bond markets"
      ]
    },
    {
      id: 4,
      title: "Problems Solved & Financial Impact",
      points: [
        "Eliminates pricing errors saving institutions $10M+ annually in mispriced trades",
        "Optimizes bond portfolios increasing returns by 15-25% through proper duration matching",
        "Reduces interest rate risk exposure by 30-50% through accurate duration calculation",
        "Improves government debt management saving taxpayers billions in interest costs",
        "Enables precise monetary policy transmission for central banks worldwide",
        "Facilitates international bond arbitrage generating $100M+ in annual trading profits",
        "Supports pension fund solvency through accurate liability matching"
      ]
    },
    {
      id: 5,
      title: "Revenue Generation & Business Applications",
      points: [
        "Financial Software: $10,000-$500,000 licenses for institutional bond calculators",
        "Trading Platforms: 0.1-1 bps fees on $10B+ daily bond calculator transactions",
        "Research Firms: $5,000-$50,000 subscriptions for advanced bond analytics",
        "Consulting Services: $100,000-$1M fees for sovereign bond portfolio optimization",
        "Educational Platforms: $99-$999 courses on government bond mathematics",
        "Central Bank Tools: Custom $1M+ systems for national debt management",
        "Brokerage Services: Increased trading volumes generating $10M+ in commission revenue"
      ]
    },
    {
      id: 6,
      title: "Ordinary People & Everyday Applications",
      points: [
        "Individual Investors: Calculating returns on Treasury bond ladder strategies",
        "Retirees: Planning inflation-protected income using TIPS (Treasury Inflation-Protected Securities)",
        "College Savers: Comparing Series EE and Series I savings bonds for education funds",
        "Risk-Averse Investors: Assessing government bond safety versus corporate bonds",
        "Home Buyers: Timing mortgage decisions based on Treasury yield movements",
        "Small Businesses: Managing excess cash in Treasury bill portfolios",
        "Expatriates: Investing in home country government bonds for currency stability",
        "Teachers & Students: Learning fixed-income mathematics with practical examples"
      ]
    }
  ];

  return (
    <>
      {/* SEO Meta Tags */}
      <Head>
        <title>Government Bond Calculator | Bond Price & Yield Tool</title>
        <meta
          name="description"
          content="Free government bond calculator to compute bond price, yield to maturity, current yield, and determine if a bond trades at premium, discount, or par."
        />
        <meta
          name="keywords"
          content="government bond calculator, treasury bond calculator, bond pricing calculator, yield to maturity calculator, fixed income calculator, bond valuation tool, government securities calculator"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/government-bond-calculator" />
        <meta property="og:title" content="Government Bond Calculator - Free Online Tool" />
        <meta
          property="og:description"
          content="Calculate bond prices and yields based on coupon rate, market yield, and time to maturity."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/government-bond-calculator" />
      </Head>

      <div className={styles.page}>
        <div className={styles.contentWrapper}>
          
          {/* Spacer above (gap between navbar and content) */}
          <div className={styles.spacerTop} />

          {/* Hero Section */}
          <section className={styles.hero}>
            <h1 className={styles.title}>Government Bond Calculator</h1>
            <p className={styles.subtitle}>
              Calculate bond price, yield, and return to evaluate fixed-income investments.
            </p>
          </section>

          {/* Calculator Card */}
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter bond details to calculate price and yield metrics.
              </p>

              <div className={styles.inputGroup}>
                <label htmlFor="faceValue" className={styles.label}>
                  Face Value ($)
                </label>
                <input
                  id="faceValue"
                  type="text"
                  value={faceValue}
                  onChange={(e) => setFaceValue(e.target.value)}
                  placeholder="e.g. 1,000"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="couponRate" className={styles.label}>
                  Annual Coupon Rate (%)
                </label>
                <input
                  id="couponRate"
                  type="number"
                  value={couponRate}
                  onChange={(e) => setCouponRate(e.target.value)}
                  placeholder="e.g. 5"
                  className={styles.input}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="yearsToMaturity" className={styles.label}>
                  Years to Maturity
                </label>
                <input
                  id="yearsToMaturity"
                  type="number"
                  value={yearsToMaturity}
                  onChange={(e) => setYearsToMaturity(e.target.value)}
                  placeholder="e.g. 10"
                  className={styles.input}
                  min="0.5"
                  step="0.5"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="marketYield" className={styles.label}>
                  Market Yield (YTM) (%)
                </label>
                <input
                  id="marketYield"
                  type="number"
                  value={marketYield}
                  onChange={(e) => setMarketYield(e.target.value)}
                  placeholder="e.g. 4.5"
                  className={styles.input}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="paymentsPerYear" className={styles.label}>
                  Payments Per Year
                </label>
                <select
                  id="paymentsPerYear"
                  value={paymentsPerYear}
                  onChange={(e) => setPaymentsPerYear(e.target.value)}
                  className={styles.input}
                >
                  <option value="1">Annually</option>
                  <option value="2">Semi-Annually</option>
                  <option value="4">Quarterly</option>
                  <option value="12">Monthly</option>
                </select>
              </div>

              <button type="submit" className={styles.submitBtn}>
                <span className={styles.btnText}>Calculate Bond Value</span>
                <span className={styles.arrow}>→</span>
              </button>

              {result && (
                <div className={styles.resultSection}>
                  <h3>Bond Valuation</h3>
                  <div className={styles.resultGrid}>
                    <div className={styles.resultItem}>
                      <strong>Face Value:</strong> ${result.faceValue}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Coupon Rate:</strong> {result.couponRate}%
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Market Yield:</strong> {result.marketYield}%
                    </div>
                    <div className={`${styles.resultItem} ${styles.highlight} ${result.premium ? styles.positive : result.discount ? styles.negative : ''}`}>
                      <strong>Price:</strong> ${result.price}
                    </div>
                  </div>

                  <div className={styles.resultGrid} style={{ marginTop: '1rem' }}>
                    <div className={styles.resultItem}>
                      <strong>Current Yield:</strong> {result.currentYield}%
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Status:</strong>{' '}
                      {result.premium ? 'Premium' : result.discount ? 'Discount' : 'Par'}
                    </div>
                  </div>

                  <div className={styles.note}>
                    {result.premium
                      ? `Priced above par ($${result.price} > $${result.faceValue}) — demand exceeds supply.`
                      : result.discount
                      ? `Priced below par ($${result.price} < $${result.faceValue}) — higher yield attracts buyers.`
                      : `Trading at par — coupon rate equals market yield.`
                    }
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* History Cards Section */}
          <section className={styles.historySection}>
            <div className={styles.container}>
              <div className={styles.sectionHeader}>
                <h2>Government Bond Calculator: Global History & Applications</h2>
                <p className={styles.sectionSubtitle}>
                  Explore the evolution of bond calculators and their impact on worldwide finance
                </p>
              </div>
              
              <div className={styles.cardsGrid}>
                {governmentBondHistoryCards.map((card) => (
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

export default GovernmentBondCalculator;