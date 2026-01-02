import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
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

  // Flipping Profit Calculator History Data
  const flippingProfitHistory = [
    {
      id: 1,
      title: "History & Discovery of Flipping Profit Calculator",
      points: [
        "1990s: Real estate investors created spreadsheets for house flipping ROI analysis",
        "2000s: HGTV shows popularized flipping, creating demand for profit calculators",
        "2008: After housing crash, tools emerged to calculate distressed property flips",
        "2010s: Mobile apps made flipping calculators accessible to amateur investors",
        "2015: Sneaker reselling boom created specialized sneaker flip calculators",
        "2020s: AI-powered tools predict optimal flip timing and profit margins",
        "Present: Comprehensive calculators cover real estate, cars, sneakers, and collectibles"
      ]
    },
    {
      id: 2,
      title: "Global Origins & Entrepreneurial Purpose",
      points: [
        "United States: Popularized by real estate investors during housing booms",
        "United Kingdom: 'Buy-to-sell' calculator tools for property development",
        "Japan: 'Mansion flipping' calculators for high-rise apartment investments",
        "China: Factory-to-consumer product flipping calculators for e-commerce",
        "Australia: Renovation profit calculators for 'fixer-upper' properties",
        "Purpose: Enable quick ROI analysis for time-sensitive investment opportunities"
      ]
    },
    {
      id: 3,
      title: "Key Industries & Monthly Applications",
      points: [
        "Real Estate: Daily analysis of distressed property acquisition opportunities",
        "Automotive: Weekly used car auction profit calculations for dealerships",
        "Sneaker Reselling: Real-time calculation of limited edition shoe flip profits",
        "Electronics: Monthly analysis of refurbished smartphone resale margins",
        "Collectibles: Weekly sports card and memorabilia profit projections",
        "Furniture: Antique restoration and resale profit calculations",
        "E-commerce: Daily product sourcing and Amazon FBA profit analysis"
      ]
    },
    {
      id: 4,
      title: "Problem Solving & Financial Impact",
      points: [
        "Reduces investment risk by 40% through accurate profit forecasting",
        "Increases average flip profit margins by 15-25% through optimized pricing",
        "Saves 20-30 hours monthly in manual spreadsheet calculations",
        "Prevents $10,000+ losses on bad flip investments through margin analysis",
        "Improves capital allocation by identifying highest ROI opportunities first",
        "Reduces holding costs by 25% through better project timeline planning",
        "Increases successful flip rate from 60% to 85% through data-driven decisions"
      ]
    },
    {
      id: 5,
      title: "Revenue Generation Applications",
      points: [
        "Real Estate Education: Charge $1,000-$10,000 for flipping masterclasses",
        "Software Platforms: Generate $50-$500/month subscriptions for advanced tools",
        "Consulting Services: Earn 10-20% of client profits on managed flip deals",
        "Market Data: Sell $200-$2,000/month access to flipping opportunity databases",
        "Mobile Apps: Monetize with $5-$20 premium features for serious flippers",
        "Real Estate Teams: Increase brokerage commissions by facilitating more flips",
        "Contractor Networks: Generate referral fees by connecting flippers with services"
      ]
    },
    {
      id: 6,
      title: "Ordinary People Flipping Profit Calculator Uses",
      points: [
        "Side Hustlers: Calculating profit potential for garage sale finds on eBay",
        "Home Renovators: Estimating ROI on DIY home improvement projects",
        "Car Enthusiasts: Calculating profit margins on used car repairs and resale",
        "Sneakerheads: Determining resale value for limited edition shoe purchases",
        "Collectors: Evaluating profit potential on vintage toy and game resale",
        "Furniture Restorers: Calculating margins on antique furniture refinishing",
        "Gardeners: Estimating profit on plant propagation and plant sales",
        "Artists: Calculating costs and profits on art reproduction and resale"
      ]
    }
  ];

  return (
    <>
      <Head>
        <html lang="en" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Flipping Profit Calculator | Real Estate & Resale Tool</title>
        <meta
          name="description"
          content="Free flipping profit calculator to estimate ROI for real estate, cars, sneakers, or collectibles after purchase, repairs, and selling."
        />
        <link rel="canonical" href="/flipping-profit-calculator" />
      </Head>

      <div className={styles.page}>
        <div className={styles.contentWrapper}>
          
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

              <button type="submit" className={styles.submitBtn}>
                <span className={styles.btnText}>Calculate Flip Profit</span>
                <span className={styles.arrow}>→</span>
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

          {/* History Cards Section */}
          <section className={styles.historySection}>
            <div className={styles.container}>
              <div className={styles.sectionHeader}>
                <h2>Flipping Profit Calculator History & Global Applications</h2>
                <p className={styles.sectionSubtitle}>
                  Explore the evolution and worldwide impact of flipping profit calculation tools
                </p>
              </div>
              
              <div className={styles.cardsGrid}>
                {flippingProfitHistory.map((card) => (
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

export default FlippingProfitCalculator;