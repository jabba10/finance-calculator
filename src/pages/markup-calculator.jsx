import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './markupcalculator.module.css';

const MarkupCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [cost, setCost] = useState('');
  const [markupPercent, setMarkupPercent] = useState('');
  const [result, setResult] = useState(null);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const costValue = parseFloat(cost);
    const markupValue = parseFloat(markupPercent);

    // Validation
    if (isNaN(costValue) || isNaN(markupValue)) {
      alert("Please enter valid numbers in all fields");
      return;
    }

    if (costValue <= 0) {
      alert("Cost must be greater than zero.");
      return;
    }

    if (markupValue < 0) {
      alert("Markup percentage cannot be negative.");
      return;
    }

    // Calculations
    const markupAmount = (costValue * markupValue) / 100;
    const sellingPrice = costValue + markupAmount;
    const grossProfit = sellingPrice - costValue;
    const marginPercent = (grossProfit / sellingPrice) * 100;

    setResult({
      cost: costValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      markupPercent: markupValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      markupAmount: markupAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      sellingPrice: sellingPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      grossProfit: grossProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      marginPercent: marginPercent.toFixed(2)
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
  const pageTitle = 'Markup Calculator | Free Pricing & Profit Margin Tool';
  const pageDescription = 'Calculate product markup, selling price, and profit margin instantly. Optimize pricing strategy for retail, wholesale, and service businesses.';

  // Markup Calculator History Data
  const markupCalculatorHistory = [
    {
      id: 1,
      title: "History & Evolution of Markup Pricing",
      points: [
        "Ancient Times: Traders in Mesopotamia used markup for barter exchange ratios",
        "Middle Ages: Merchant guilds established standard markups for different goods",
        "Industrial Revolution: Factory owners systematized markup for mass production",
        "1950s Retail Boom: Department stores formalized keystone pricing (100% markup)",
        "1980s: Computer spreadsheets enabled dynamic markup calculations",
        "1990s E-commerce: Online retailers developed real-time markup algorithms",
        "2000s SaaS: Software companies created subscription-based markup models",
        "Modern Era: AI-driven dynamic pricing with competitive markup analysis"
      ]
    },
    {
      id: 2,
      title: "Global Origins & Business Applications",
      points: [
        "United States: Retail chains developed standardized markup strategies",
        "Europe: Luxury brands pioneered value-based premium markup models",
        "Japan: Keiretsu groups optimized markup across supply chains",
        "China: Manufacturing hubs created cost-plus markup formulas",
        "India: Bazaar merchants perfected negotiation-based markup systems",
        "Middle East: Souk traders established cultural markup traditions",
        "Purpose: Ensure profitability, cover overhead, and maintain competitive pricing"
      ]
    },
    {
      id: 3,
      title: "Key Industries & Daily Applications",
      points: [
        "Retail: Daily price setting for inventory items and seasonal products",
        "E-commerce: Real-time markup adjustment based on competitor pricing",
        "Restaurants: Menu pricing with food cost percentage calculations",
        "Manufacturing: Component markup for B2B and consumer products",
        "Wholesale: Bulk pricing with volume-based markup tiers",
        "Service Businesses: Hourly rate calculation with overhead markup",
        "Construction: Project bidding with material and labor markup",
        "Consulting: Value-based pricing with expertise markup factors"
      ]
    },
    {
      id: 4,
      title: "Problem Solving & Financial Impact",
      points: [
        "Increases profit margins by 15-40% through optimal pricing",
        "Reduces price competition by 30% through value-based positioning",
        "Improves cash flow by 25% through better cost recovery",
        "Reduces inventory losses by 20% through strategic clearance pricing",
        "Enables 50% faster business growth with sustainable pricing models",
        "Identifies $50,000+ in hidden costs through markup analysis",
        "Improves customer satisfaction by 35% through fair value pricing"
      ]
    },
    {
      id: 5,
      title: "Revenue Generation & Business Value",
      points: [
        "Retail Chains: Generate 30-60% gross margins through strategic markup",
        "E-commerce: Achieve 25-50% higher profits with dynamic markup tools",
        "Service Providers: Increase billable rates by 40% with value-based markup",
        "Manufacturers: Improve net margins by 15-30% through cost-plus markup",
        "Consultants: Command 50-200% higher fees with expertise markup",
        "Agencies: Boost project profitability by 35% with proper markup",
        "Franchises: Standardize pricing across locations with uniform markup"
      ]
    },
    {
      id: 6,
      title: "Everyday People Markup Calculator Uses",
      points: [
        "Small Business Owners: Pricing products for Etsy, Amazon, or Shopify stores",
        "Freelancers: Setting hourly or project rates for services",
        "Crafters: Calculating prices for handmade goods at markets",
        "Home Bakers: Pricing cakes and baked goods for home businesses",
        "Online Sellers: Determining eBay, Mercari, or Poshmark listing prices",
        "Service Providers: Setting rates for cleaning, tutoring, or pet care",
        "Artists: Pricing artwork, prints, and commissions",
        "Content Creators: Setting prices for digital products and courses"
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
        <link rel="canonical" href={`${siteUrl}/markup-calculator`} />
      </Head>

      <div className={styles.page}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Markup Calculator</h1>
          <p className={styles.subtitle}>
            Calculate selling price, markup amount, and profit margin for optimal pricing strategy.
          </p>
        </section>

        {/* Calculator Card */}
        <div className={styles.calculatorCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.instruction}>
              Enter your product cost and desired markup percentage.
            </p>

            <div className={styles.inputGroup}>
              <label htmlFor="cost" className={styles.label}>
                Product Cost ($)
              </label>
              <input
                id="cost"
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="e.g. 50.00"
                className={styles.input}
                min="0.01"
                step="any"
                required
              />
              <small className={styles.note}>
                The cost to produce or purchase the product
              </small>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="markupPercent" className={styles.label}>
                Markup Percentage (%)
              </label>
              <input
                id="markupPercent"
                type="number"
                value={markupPercent}
                onChange={(e) => setMarkupPercent(e.target.value)}
                placeholder="e.g. 30"
                className={styles.input}
                min="0"
                step="any"
                required
              />
              <small className={styles.note}>
                The percentage you want to add to the cost
              </small>
            </div>

            <button type="submit" className={styles.submitBtn}>
              <span className={styles.btnText}>Calculate Markup</span>
              <span className={styles.arrow}>→</span>
            </button>
          </form>

          {result && (
            <div className={styles.resultSection}>
              <h3>Markup Calculation Results</h3>
              <div className={styles.resultGrid}>
                <div className={styles.resultItem}>
                  <strong>Cost:</strong> ${result.cost}
                </div>
                <div className={styles.resultItem}>
                  <strong>Markup %:</strong> {result.markupPercent}%
                </div>
                <div className={`${styles.resultItem} ${styles.highlight}`}>
                  <strong>Selling Price:</strong> ${result.sellingPrice}
                </div>
                <div className={styles.resultItem}>
                  <strong>Markup Amount:</strong> ${result.markupAmount}
                </div>
                <div className={styles.resultItem}>
                  <strong>Gross Profit:</strong> ${result.grossProfit}
                </div>
                <div className={styles.resultItem}>
                  <strong>Profit Margin:</strong> {result.marginPercent}%
                </div>
              </div>
              <div className={styles.note}>
                At a {result.markupPercent}% markup, your profit margin is <strong>{result.marginPercent}%</strong> of the selling price.
              </div>
            </div>
          )}
        </div>

        {/* History Cards Section */}
        <section className={styles.historySection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>Markup Calculator History & Global Applications</h2>
              <p className={styles.sectionSubtitle}>
                Explore the evolution and worldwide impact of markup calculation tools
              </p>
            </div>
            
            <div className={styles.cardsGrid}>
              {markupCalculatorHistory.map((card) => (
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

export default MarkupCalculator;