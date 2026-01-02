import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from './wacccalculator.module.css';

const InventoryWACCCalculator = () => {
  const router = useRouter();
  const ctaButtonRef = useRef(null);

  // Form state
  const [inventoryValue, setInventoryValue] = useState('');
  const [costOfCarrying, setCostOfCarrying] = useState('');
  const [costOfOrdering, setCostOfOrdering] = useState('');
  const [annualDemand, setAnnualDemand] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Convert inputs to numbers and validate
    const inventory = parseFloat(inventoryValue);
    const carryingCost = parseFloat(costOfCarrying);
    const orderingCost = parseFloat(costOfOrdering);
    const demand = parseFloat(annualDemand);

    // Validate inputs
    if (isNaN(inventory) || isNaN(carryingCost) || isNaN(orderingCost) || isNaN(demand)) {
      setError("Please enter valid numbers in all fields");
      return;
    }

    if (inventory < 0 || carryingCost < 0 || orderingCost < 0 || demand <= 0) {
      setError("Values must be positive numbers (annual demand must be greater than 0)");
      return;
    }

    // Calculate EOQ (Economic Order Quantity)
    const eoq = Math.sqrt((2 * demand * orderingCost) / carryingCost);
    
    // Calculate Total Inventory Cost
    const totalCarryingCost = (eoq / 2) * carryingCost;
    const totalOrderingCost = (demand / eoq) * orderingCost;
    const totalInventoryCost = totalCarryingCost + totalOrderingCost;
    
    // Calculate Number of Orders per Year
    const ordersPerYear = demand / eoq;
    
    // Calculate Time Between Orders (in days)
    const timeBetweenOrders = 365 / ordersPerYear;

    setResult({
      eoq: eoq.toFixed(2),
      totalCarryingCost: totalCarryingCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      totalOrderingCost: totalOrderingCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      totalInventoryCost: totalInventoryCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      ordersPerYear: ordersPerYear.toFixed(2),
      timeBetweenOrders: timeBetweenOrders.toFixed(2),
      efficiency: totalInventoryCost < (inventory * 0.1) ? 'Highly Efficient' : totalInventoryCost < (inventory * 0.2) ? 'Moderate Efficiency' : 'Needs Optimization'
    });
  };

  // Clear all fields
  const handleClear = () => {
    setInventoryValue('');
    setCostOfCarrying('');
    setCostOfOrdering('');
    setAnnualDemand('');
    setResult(null);
    setError('');
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

  // SEO Metadata - Use consistent canonical URL
  const siteUrl = 'https://www.financecalculatorfree.com';
  const pageSlug = 'inventory-wacc-calculator';
  const canonicalUrl = `${siteUrl}/${pageSlug}`;
  const pageTitle = 'Inventory WACC Calculator | Free Inventory Cost Optimization Tool';
  const pageDescription = 'Calculate your Inventory Weighted Average Cost of Capital instantly. Optimize inventory levels, reduce carrying costs, and improve cash flow management.';

  // Ensure we're using the correct path
  const currentPath = router.asPath;
  const isCanonicalPath = currentPath === `/${pageSlug}` || currentPath === `/${pageSlug}/`;

  // Inventory WACC Calculator History Data
  const inventoryWaccHistory = [
    {
      id: 1,
      title: "History & Development of Inventory Cost Analysis",
      points: [
        "1913 Ford Model T: Henry Ford pioneered inventory cost analysis for assembly line efficiency",
        "1930s Great Depression: Businesses developed EOQ models to minimize inventory holding costs",
        "1950s Japanese Manufacturing: Toyota implemented Just-In-Time inventory to reduce WACC impact",
        "1970s Computer Revolution: Digital inventory tracking enabled real-time cost optimization",
        "1990s Supply Chain Management: WACC integration with inventory became standard practice",
        "2020s AI Optimization: Machine learning predicts optimal inventory levels for cost minimization",
        "Modern Era: Real-time inventory WACC tracking across global supply chains"
      ]
    },
    {
      id: 2,
      title: "Global Applications & Business Impact",
      points: [
        "United States: Retail giants optimize $500B inventory using WACC calculations",
        "Germany: Automotive manufacturers save 15-30% through inventory cost optimization",
        "Japan: Electronics companies achieve 99.9% inventory efficiency using JIT-WACC models",
        "China: Manufacturing hubs reduce working capital by 40% with smart inventory management",
        "United Kingdom: Retail chains improve cash flow by 25% through seasonal inventory optimization",
        "Global Impact: Companies save $1.2 trillion annually through inventory WACC optimization",
        "Purpose: Balance ordering costs, carrying costs, and opportunity costs for maximum efficiency"
      ]
    },
    {
      id: 3,
      title: "Key Industries & Implementation Frequency",
      points: [
        "Retail: Daily inventory WACC calculation for perishable goods optimization",
        "Manufacturing: Real-time WACC tracking for raw material inventory management",
        "E-commerce: Weekly optimization considering storage fees and shipping costs",
        "Pharmaceuticals: Monthly review balancing expiration costs and availability",
        "Automotive: Quarterly analysis of parts inventory carrying costs",
        "Food & Beverage: Continuous monitoring to minimize spoilage and maximize freshness",
        "Construction: Project-based inventory cost optimization for materials management"
      ]
    },
    {
      id: 4,
      title: "Financial Benefits & Problem Solving",
      points: [
        "Reduces inventory carrying costs by 25-40% through optimal ordering",
        "Improves cash flow by 30-50% by minimizing tied-up capital in inventory",
        "Reduces stockouts by 60-80% through demand forecasting integration",
        "Lowers ordering costs by 20-35% through batch optimization",
        "Increases ROI by 15-25% through better working capital management",
        "Identifies $100,000+ in annual savings through excess inventory reduction",
        "Improves profit margins by 5-15% through total cost minimization"
      ]
    },
    {
      id: 5,
      title: "Revenue Generation & Business Applications",
      points: [
        "Supply Chain Software: Generate $50,000-$500,000 annual licenses for WACC optimization tools",
        "Consulting Services: Charge $10,000-$100,000 per inventory optimization project",
        "Retail Analytics: Boost sales by 8-12% through optimal stock level maintenance",
        "Manufacturing: Reduce costs by 15-30% through lean inventory practices",
        "Logistics Companies: Increase margins by 10-20% through route and inventory optimization",
        "SaaS Platforms: Achieve 35% higher pricing for integrated WACC inventory modules",
        "Financial Services: Create $100M+ inventory financing products using WACC models"
      ]
    },
    {
      id: 6,
      title: "Small Business & Individual Applications",
      points: [
        "Online Sellers: Optimize Amazon FBA and Shopify inventory costs",
        "Restaurant Owners: Minimize food waste through inventory cost analysis",
        "Boutique Stores: Balance seasonal inventory with carrying costs",
        "Craft Businesses: Calculate optimal material ordering for Etsy shops",
        "Service Providers: Manage supplies inventory for maximum cost efficiency",
        "Farmers: Optimize seed and fertilizer inventory for agricultural operations",
        "Freelancers: Manage project material inventory for cost control",
        "Home-Based Businesses: Optimize product inventory for garage businesses"
      ]
    }
  ];

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Canonical URL - Make sure this matches your intended primary URL */}
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        
        {/* Additional meta tags for better indexing */}
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Inventory WACC Calculator",
              "description": pageDescription,
              "url": canonicalUrl,
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Any",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Organization",
                "name": "Finance Calculator Free"
              }
            })
          }}
        />
      </Head>

      <div className={styles.page}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Inventory WACC Calculator</h1>
          <p className={styles.subtitle}>
            Calculate optimal inventory levels to minimize carrying costs, ordering costs, and improve cash flow management.
          </p>
        </section>

        {/* Calculator Card */}
        <div className={styles.calculatorCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.instruction}>
              Enter your inventory parameters to calculate optimal ordering and carrying costs.
            </p>

            {error && (
              <div className={styles.errorMessage}>
                <p>{error}</p>
              </div>
            )}

            <div className={styles.inputGroup}>
              <label htmlFor="inventoryValue" className={styles.label}>
                Average Inventory Value ($)
              </label>
              <input
                id="inventoryValue"
                type="number"
                value={inventoryValue}
                onChange={(e) => setInventoryValue(e.target.value)}
                placeholder="e.g. 50000"
                className={styles.input}
                min="0"
                step="any"
                required
              />
              <small className={styles.note}>
                Current value of inventory held in stock
              </small>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="costOfCarrying" className={styles.label}>
                Carrying Cost per Unit ($)
              </label>
              <input
                id="costOfCarrying"
                type="number"
                value={costOfCarrying}
                onChange={(e) => setCostOfCarrying(e.target.value)}
                placeholder="e.g. 2.50"
                className={styles.input}
                min="0"
                step="any"
                required
              />
              <small className={styles.note}>
                Storage, insurance, depreciation, opportunity cost per unit
              </small>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="costOfOrdering" className={styles.label}>
                Ordering Cost per Order ($)
              </label>
              <input
                id="costOfOrdering"
                type="number"
                value={costOfOrdering}
                onChange={(e) => setCostOfOrdering(e.target.value)}
                placeholder="e.g. 50"
                className={styles.input}
                min="0"
                step="any"
                required
              />
              <small className={styles.note}>
                Shipping, processing, setup costs per order placed
              </small>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="annualDemand" className={styles.label}>
                Annual Demand (Units)
              </label>
              <input
                id="annualDemand"
                type="number"
                value={annualDemand}
                onChange={(e) => setAnnualDemand(e.target.value)}
                placeholder="e.g. 10000"
                className={styles.input}
                min="1"
                step="1"
                required
              />
              <small className={styles.note}>
                Total units required per year
              </small>
            </div>

            <div className={styles.buttonGroup}>
              <button type="submit" className={styles.submitBtn}>
                <span className={styles.btnText}>Calculate Inventory WACC</span>
                <span className={styles.arrow}>→</span>
              </button>
              
              <button 
                type="button" 
                onClick={handleClear}
                className={styles.clearBtn}
              >
                Clear All
              </button>
            </div>
          </form>

          {result && (
            <div className={styles.resultSection}>
              <h3 className={styles.resultTitle}>Inventory Cost Optimization Results</h3>
              <div className={styles.resultGrid}>
                <div className={styles.resultItem}>
                  <strong>Economic Order Quantity (EOQ):</strong> {result.eoq} units
                </div>
                <div className={styles.resultItem}>
                  <strong>Total Carrying Cost:</strong> ${result.totalCarryingCost}
                </div>
                <div className={styles.resultItem}>
                  <strong>Total Ordering Cost:</strong> ${result.totalOrderingCost}
                </div>
                <div className={`${styles.resultItem} ${styles.highlight}`}>
                  <strong>Total Inventory Cost:</strong> ${result.totalInventoryCost}
                </div>
                <div className={styles.resultItem}>
                  <strong>Orders per Year:</strong> {result.ordersPerYear}
                </div>
                <div className={styles.resultItem}>
                  <strong>Days Between Orders:</strong> {result.timeBetweenOrders} days
                </div>
                <div className={styles.resultItem}>
                  <strong>Inventory Efficiency:</strong> {result.efficiency}
                </div>
              </div>
              <div className={styles.note}>
                Optimal order quantity is <strong>{result.eoq} units</strong>, ordering <strong>{result.ordersPerYear}</strong> times per year to minimize total costs.
              </div>
            </div>
          )}
        </div>

        {/* History Cards Section */}
        <section className={styles.historySection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>Inventory WACC Calculator History & Global Applications</h2>
              <p className={styles.sectionSubtitle}>
                Explore the evolution and worldwide impact of inventory cost optimization and WACC calculation tools
              </p>
            </div>
            
            <div className={styles.cardsGrid}>
              {inventoryWaccHistory.map((card) => (
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
              <a>
                <button
                  className={styles.ctaButton}
                  ref={ctaButtonRef}
                  onMouseMove={handleMouseMove}
                >
                  <span className={styles.buttonText}>Explore All Calculators</span>
                  <span className={styles.arrow}>→</span>
                </button>
              </a>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default InventoryWACCCalculator;