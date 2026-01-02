import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './inventorycalculator.module.css';

const InventoryTurnoverCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [costOfGoodsSold, setCostOfGoodsSold] = useState('');
  const [averageInventory, setAverageInventory] = useState('');
  const [result, setResult] = useState(null);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert inputs to numbers and validate
    const cogs = parseFloat(costOfGoodsSold);
    const avgInventory = parseFloat(averageInventory);

    // Validate inputs
    if (isNaN(cogs) || isNaN(avgInventory)) {
      alert("Please enter valid numbers in all fields");
      return;
    }

    if (cogs < 0 || avgInventory <= 0) {
      alert("Values must be positive numbers (average inventory must be greater than 0)");
      return;
    }

    const turnover = (cogs / avgInventory).toFixed(2);
    const daysInInventory = (365 / (cogs / avgInventory)).toFixed(1);

    let efficiency = '';
    if (turnover >= 8) {
      efficiency = 'Excellent Turnover';
    } else if (turnover >= 4) {
      efficiency = 'Good Efficiency';
    } else if (turnover >= 2) {
      efficiency = 'Moderate Turnover';
    } else {
      efficiency = 'Slow Turnover';
    }

    setResult({
      turnover: turnover,
      daysInInventory: daysInInventory,
      cogs: cogs.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      avgInventory: avgInventory.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      efficiency: efficiency
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
  const pageTitle = 'Inventory Turnover Calculator | Free Stock Efficiency Tool';
  const pageDescription = 'Calculate your Inventory Turnover Ratio instantly. Measure stock efficiency, optimize inventory levels, and improve cash flow management.';

  // Inventory Turnover Calculator History Data
  const inventoryTurnoverCalculatorHistory = [
    {
      id: 1,
      title: "History & Discovery of Inventory Turnover",
      points: [
        "1910s Industrial Revolution: Manufacturers developed inventory ratios to optimize production cycles",
        "1920s Retail Boom: Department stores created turnover metrics to manage seasonal merchandise",
        "1950s Toyota Production System: Introduced Just-in-Time (JIT) inventory, revolutionizing turnover concepts",
        "1970s Retail Analytics: Chain stores used turnover to manage multi-location stock efficiently",
        "1990s Supply Chain Revolution: Walmart pioneered sophisticated inventory turnover optimization",
        "E-commerce Era (2000s+): Amazon achieved industry-leading 8-12x turnover rates"
      ]
    },
    {
      id: 2,
      title: "Global Origins & Business Purpose",
      points: [
        "United States: Retail giants developed turnover metrics for large-scale inventory management",
        "Japan: Manufacturing excellence led to JIT inventory systems with maximum turnover",
        "Germany: Engineering companies optimized turnover for capital-intensive inventory",
        "United Kingdom: Fashion retailers pioneered turnover analysis for seasonal collections",
        "China: Manufacturing hubs created rapid turnover models for global supply chains",
        "Purpose: Measure inventory efficiency, optimize stock levels, and improve cash flow"
      ]
    },
    {
      id: 3,
      title: "Key Industries & Monthly Applications",
      points: [
        "Retail Chains: Weekly monitoring of inventory turnover across product categories",
        "Manufacturing: Daily tracking of raw material and finished goods turnover",
        "E-commerce: Continuous analysis of SKU-level turnover for warehouse optimization",
        "Wholesale Distribution: Monthly review of inventory velocity and carrying costs",
        "Automotive: Quarterly assessment of parts inventory turnover and obsolescence risk",
        "Pharmaceutical: Regular monitoring of perishable inventory turnover rates",
        "Food & Beverage: Frequent analysis of fresh inventory turnover to reduce waste"
      ]
    },
    {
      id: 4,
      title: "Problem Solving & Financial Impact",
      points: [
        "Reduces carrying costs by 30-50% through optimal inventory levels",
        "Improves cash flow by 40-70% through faster inventory conversion",
        "Reduces stock obsolescence by 60-80% through better turnover monitoring",
        "Increases profit margins by 15-25% through reduced storage and financing costs",
        "Eliminates $500,000+ in dead stock annually through proactive turnover analysis",
        "Reduces stockouts by 45-65% through balanced inventory management",
        "Improves working capital efficiency by 50-80% through faster inventory cycles"
      ]
    },
    {
      id: 5,
      title: "Revenue Generation Applications",
      points: [
        "Inventory Software: Charge $500-$5,000/month for turnover analytics and optimization",
        "Supply Chain Consulting: Generate $50,000-$300,000 fees for turnover improvement projects",
        "Retail Analytics: Create 20-35% revenue growth through inventory optimization services",
        "Warehousing: Increase storage fees by 40% for clients with poor turnover rates",
        "Logistics Services: Achieve 30% higher margins for rapid turnover clients",
        "Business Valuation: Add 2-3x EBITDA multiples for companies with excellent turnover",
        "Investment Analysis: Generate 25%+ returns by investing in high-turnover businesses"
      ]
    },
    {
      id: 6,
      title: "Ordinary People Inventory Calculator Uses",
      points: [
        "Small Retailers: Calculating turnover for boutique shops and specialty stores",
        "Amazon Sellers: Analyzing FBA inventory turnover for storage fee optimization",
        "Restaurant Owners: Measuring food inventory turnover to reduce waste and costs",
        "Craft Businesses: Tracking material turnover for Etsy or handmade product shops",
        "Service Businesses: Managing supply inventory turnover for trades and contractors",
        "Online Course Creators: Calculating digital inventory turnover for evergreen products",
        "Real Estate Flippers: Measuring renovation material inventory turnover",
        "Farmers: Analyzing crop and livestock inventory turnover for seasonal planning"
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
        <link rel="canonical" href={`${siteUrl}/inventory-turnover-calculator`} />
      </Head>

      <div className={styles.page}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Inventory Turnover Calculator</h1>
          <p className={styles.subtitle}>
            Calculate your Inventory Turnover Ratio to measure stock efficiency and optimize inventory management.
          </p>
        </section>

        {/* Calculator Card */}
        <div className={styles.calculatorCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.instruction}>
              Enter your Cost of Goods Sold and Average Inventory value.
            </p>

            <div className={styles.inputGroup}>
              <label htmlFor="costOfGoodsSold" className={styles.label}>
                Cost of Goods Sold ($)
              </label>
              <input
                id="costOfGoodsSold"
                type="number"
                value={costOfGoodsSold}
                onChange={(e) => setCostOfGoodsSold(e.target.value)}
                placeholder="e.g. 500000"
                className={styles.input}
                min="0"
                step="any"
                required
              />
              <small className={styles.note}>
                Total cost of inventory sold during the period
              </small>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="averageInventory" className={styles.label}>
                Average Inventory ($)
              </label>
              <input
                id="averageInventory"
                type="number"
                value={averageInventory}
                onChange={(e) => setAverageInventory(e.target.value)}
                placeholder="e.g. 125000"
                className={styles.input}
                min="1"
                step="any"
                required
              />
              <small className={styles.note}>
                (Beginning Inventory + Ending Inventory) ÷ 2
              </small>
            </div>

            <button type="submit" className={styles.submitBtn}>
              <span className={styles.btnText}>Calculate Turnover</span>
              <span className={styles.arrow}>→</span>
            </button>
          </form>

          {result && (
            <div className={styles.resultSection}>
              <h3>Inventory Turnover Results</h3>
              <div className={styles.resultGrid}>
                <div className={styles.resultItem}>
                  <strong>COGS:</strong> ${result.cogs}
                </div>
                <div className={styles.resultItem}>
                  <strong>Avg Inventory:</strong> ${result.avgInventory}
                </div>
                <div className={`${styles.resultItem} ${styles.highlight}`}>
                  <strong>Turnover Ratio:</strong> {result.turnover}x
                </div>
                <div className={styles.resultItem}>
                  <strong>Days in Inventory:</strong> {result.daysInInventory} days
                </div>
                <div className={styles.resultItem}>
                  <strong>Efficiency:</strong> {result.efficiency}
                </div>
              </div>
              <div className={styles.note}>
                Your inventory turns over <strong>{result.turnover}x per year</strong> (every <strong>{result.daysInInventory} days</strong>). 
                {result.turnover >= 8 ? " Excellent turnover rate!" : result.turnover >= 4 ? " Good efficiency!" : " Consider optimizing your inventory levels."}
              </div>
            </div>
          )}
        </div>

        {/* History Cards Section */}
        <section className={styles.historySection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>Inventory Turnover Calculator History & Global Applications</h2>
              <p className={styles.sectionSubtitle}>
                Explore the evolution and worldwide impact of inventory turnover calculation tools
              </p>
            </div>
            
            <div className={styles.cardsGrid}>
              {inventoryTurnoverCalculatorHistory.map((card) => (
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

export default InventoryTurnoverCalculator;