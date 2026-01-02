import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './profitmargincalculator.module.css';

const ProfitMarginCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [revenue, setRevenue] = useState('');
  const [cost, setCost] = useState('');
  const [result, setResult] = useState(null);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const revenueValue = parseFloat(revenue);
    const costValue = parseFloat(cost);

    // Validation
    if (isNaN(revenueValue) || isNaN(costValue)) {
      alert("Please enter valid numbers in all fields");
      return;
    }

    if (revenueValue <= 0) {
      alert("Revenue must be greater than zero.");
      return;
    }

    if (costValue < 0) {
      alert("Cost cannot be negative.");
      return;
    }

    // Calculations
    const grossProfit = revenueValue - costValue;
    const profitMargin = (grossProfit / revenueValue) * 100;
    const markup = (grossProfit / costValue) * 100;

    setResult({
      revenue: revenueValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      cost: costValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      grossProfit: grossProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      profitMargin: profitMargin.toFixed(2),
      markup: markup.toFixed(2),
      isProfitable: grossProfit >= 0
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
  const pageTitle = 'Profit Margin Calculator | Free Gross Profit Calculator';
  const pageDescription = 'Calculate your profit margin instantly. Measure business profitability, optimize pricing, and improve financial performance.';

  // Profit Margin Calculator History Data
  const profitMarginCalculatorHistory = [
    {
      id: 1,
      title: "History & Discovery of Profit Margin",
      points: [
        "Medieval Italy: Venetian merchants first documented profit margin concepts in trade ledgers",
        "19th Century Industrial Revolution: Factory owners systematized margin calculations for mass production",
        "1920s America: Retail giants like Sears pioneered standardized margin analysis",
        "1970s Japan: Toyota developed lean manufacturing with margin optimization",
        "1990s Tech Boom: Silicon Valley startups made margin a key venture capital metric",
        "2000s Globalization: Multinational corporations created global margin benchmarking",
        "Modern Era: AI-powered margin prediction and real-time optimization tools"
      ]
    },
    {
      id: 2,
      title: "Global Origins & Business Purpose",
      points: [
        "Italy: Venetian and Genoese merchants created early margin formulas for trade",
        "United States: Industrial giants formalized margin analysis for mass production",
        "Germany: Engineering firms developed precision margin calculations",
        "Japan: Manufacturing companies created kaizen margin improvement systems",
        "United Kingdom: Financial institutions established margin reporting standards",
        "China: Export manufacturers optimized margins for global competitiveness",
        "Purpose: Measure business efficiency, optimize pricing, and ensure sustainable profitability"
      ]
    },
    {
      id: 3,
      title: "Key Industries & Monthly Applications",
      points: [
        "Retail Chains: Daily margin tracking across thousands of SKUs",
        "SaaS Companies: Monthly recurring revenue margin analysis",
        "Restaurants: Weekly food cost and margin optimization",
        "Manufacturing: Production efficiency margin calculations",
        "E-commerce: Real-time margin monitoring across platforms",
        "Consulting Firms: Project profitability margin assessment",
        "Healthcare: Procedure cost and margin analysis",
        "Construction: Bid margin calculations for project proposals"
      ]
    },
    {
      id: 4,
      title: "Problem Solving & Financial Impact",
      points: [
        "Identifies 20-40% cost reduction opportunities through margin analysis",
        "Increases overall profitability by 15-35% through margin optimization",
        "Reduces business failure rates by 60% through early margin warning signs",
        "Improves investor confidence with 50% better financial transparency",
        "Enables 30% faster business scaling with margin-based decision making",
        "Reduces pricing errors by 75% through accurate margin calculations",
        "Increases operational efficiency by 25-40% through margin-focused improvements"
      ]
    },
    {
      id: 5,
      title: "Revenue Generation Applications",
      points: [
        "Retail: Achieve 30-50% gross margins through strategic pricing",
        "SaaS: Maintain 70-90% margins with scalable digital products",
        "Consulting: Command 40-60% margins for specialized expertise",
        "Manufacturing: Optimize 20-35% margins through efficiency gains",
        "E-commerce: Scale 25-45% margins with volume and automation",
        "Services: Secure 30-50% margins through value-based pricing",
        "Franchises: Standardize 15-30% margins across locations"
      ]
    },
    {
      id: 6,
      title: "Ordinary People Profit Margin Uses",
      points: [
        "Small Business Owners: Calculating margins for local shops and services",
        "Freelancers: Determining project rates with sustainable margins",
        "Etsy Sellers: Pricing handmade goods with proper margins",
        "Food Trucks: Calculating food cost margins for mobile businesses",
        "Online Course Creators: Setting prices for digital products",
        "Consultants: Pricing services with competitive margins",
        "Artisans: Determining fair prices for craft items",
        "Side Hustlers: Evaluating profitability of gig economy work"
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
        <link rel="canonical" href={`${siteUrl}/profit-margin-calculator`} />
      </Head>

      <div className={styles.page}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Profit Margin Calculator</h1>
          <p className={styles.subtitle}>
            Calculate your profit margin to understand business profitability and make informed pricing decisions.
          </p>
        </section>

        {/* Calculator Card */}
        <div className={styles.calculatorCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.instruction}>
              Enter your revenue and costs to calculate profit margin.
            </p>

            <div className={styles.inputGroup}>
              <label htmlFor="revenue" className={styles.label}>
                Total Revenue ($)
              </label>
              <input
                id="revenue"
                type="number"
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
                placeholder="e.g. 10000.00"
                className={styles.input}
                min="0.01"
                step="any"
                required
              />
              <small className={styles.note}>
                Total sales or income from products/services
              </small>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="cost" className={styles.label}>
                Total Costs ($)
              </label>
              <input
                id="cost"
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="e.g. 6500.00"
                className={styles.input}
                min="0"
                step="any"
                required
              />
              <small className={styles.note}>
                Cost of goods sold, labor, overhead, etc.
              </small>
            </div>

            <button type="submit" className={styles.submitBtn}>
              <span className={styles.btnText}>Calculate Profit Margin</span>
              <span className={styles.arrow}>→</span>
            </button>
          </form>

          {result && (
            <div className={styles.resultSection}>
              <h3>Profitability Analysis</h3>
              <div className={styles.resultGrid}>
                <div className={styles.resultItem}>
                  <strong>Revenue:</strong> ${result.revenue}
                </div>
                <div className={styles.resultItem}>
                  <strong>Costs:</strong> ${result.cost}
                </div>
                <div className={`${styles.resultItem} ${result.isProfitable ? styles.highlight : styles.warning}`}>
                  <strong>Gross Profit:</strong> ${result.grossProfit}
                </div>
                <div className={`${styles.resultItem} ${result.isProfitable ? styles.highlight : styles.warning}`}>
                  <strong>Profit Margin:</strong> {result.profitMargin}%
                </div>
                <div className={styles.resultItem}>
                  <strong>Markup Percentage:</strong> {result.markup}%
                </div>
                <div className={styles.resultItem}>
                  <strong>Status:</strong>{' '}
                  <span className={result.isProfitable ? styles.textSuccess : styles.textDanger}>
                    {result.isProfitable ? 'Profitable' : 'Not Profitable'}
                  </span>
                </div>
              </div>
              <div className={styles.note}>
                Your business has a <strong>{result.profitMargin}%</strong> profit margin, meaning you keep ${result.profitMargin} from every $100 in revenue.
              </div>
            </div>
          )}
        </div>

        {/* History Cards Section */}
        <section className={styles.historySection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>Profit Margin Calculator History & Global Applications</h2>
              <p className={styles.sectionSubtitle}>
                Explore the evolution and worldwide impact of profit margin calculation tools
              </p>
            </div>
            
            <div className={styles.cardsGrid}>
              {profitMarginCalculatorHistory.map((card) => (
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

export default ProfitMarginCalculator;