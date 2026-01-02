import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './grossprofitcalculator.module.css';

const GrossProfitCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [inputs, setInputs] = useState({
    revenue: '10000',
    cogs: '6000',
    operatingExpenses: '2000',
    taxRate: '25'
  });

  const [results, setResults] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const revenue = parseFloat(inputs.revenue);
    const cogs = parseFloat(inputs.cogs);
    const operatingExpenses = parseFloat(inputs.operatingExpenses);
    const taxRate = parseFloat(inputs.taxRate) / 100;

    // Validation
    if (isNaN(revenue) || isNaN(cogs) || isNaN(operatingExpenses) || isNaN(taxRate)) {
      alert("Please enter valid numbers in all fields");
      return;
    }

    if (revenue < 0 || cogs < 0 || operatingExpenses < 0 || taxRate < 0 || taxRate > 1) {
      alert("Values cannot be negative or invalid");
      return;
    }

    // Calculations
    const grossProfit = revenue - cogs;
    const grossMargin = (grossProfit / revenue) * 100;
    const operatingProfit = grossProfit - operatingExpenses;
    const taxAmount = operatingProfit * taxRate;
    const netProfit = operatingProfit - taxAmount;

    setResults({
      revenue: revenue.toFixed(2),
      cogs: cogs.toFixed(2),
      grossProfit: grossProfit.toFixed(2),
      grossMargin: grossMargin.toFixed(2),
      operatingExpenses: operatingExpenses.toFixed(2),
      operatingProfit: operatingProfit.toFixed(2),
      taxRate: (taxRate * 100).toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      netProfit: netProfit.toFixed(2)
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
  const pageTitle = 'Gross Profit Calculator | Free Business Profitability Tool';
  const pageDescription = 'Calculate gross profit, gross margin, and business profitability instantly. Analyze financial performance and optimize pricing strategies.';

  // Gross Profit Calculator History Data
  const grossProfitCalculatorHistory = [
    {
      id: 1,
      title: "History & Discovery of Gross Profit",
      points: [
        "Ancient Mesopotamia: Clay tablet records tracked grain surplus as early profit",
        "Medieval Europe: Merchant guilds calculated 'surplus value' from trade",
        "18th Century Britain: Adam Smith defined 'productive surplus' in Wealth of Nations",
        "Industrial Revolution: Factory owners systematized cost vs revenue tracking",
        "1920s America: Retail chains formalized gross margin as key performance metric",
        "1960s Corporate Era: Fortune 500 companies adopted standardized gross profit reporting",
        "1990s Digital Age: Software automated real-time gross profit calculation",
        "Modern Era: AI-driven predictive gross profit optimization"
      ]
    },
    {
      id: 2,
      title: "Global Origins & Business Purpose",
      points: [
        "United Kingdom: Industrial factories created cost accounting for profit measurement",
        "United States: Retail giants standardized gross margin for chain store management",
        "Germany: Engineering firms developed precision cost tracking for manufacturing",
        "Japan: Keiretsu groups implemented Just-in-Time cost reduction systems",
        "Switzerland: Luxury brands established premium pricing gross margin models",
        "China: Manufacturing hubs optimized gross profit for export competitiveness",
        "Purpose: Measure production efficiency, set optimal pricing, and evaluate business health"
      ]
    },
    {
      id: 3,
      title: "Key Industries & Monthly Applications",
      points: [
        "Retail Chains: Daily gross margin tracking across thousands of SKUs",
        "Manufacturing: Weekly material cost vs output value analysis",
        "Restaurants: Monthly food cost percentage and menu profitability",
        "Software Companies: Quarterly recurring revenue gross margin calculations",
        "E-commerce: Real-time product-level gross profit monitoring",
        "Construction: Project-based material and labor cost analysis",
        "Healthcare: Procedure cost vs reimbursement gross margin",
        "Agriculture: Seasonal crop production cost and market value tracking"
      ]
    },
    {
      id: 4,
      title: "Problem Solving & Financial Impact",
      points: [
        "Identifies 20-40% cost reduction opportunities through margin analysis",
        "Increases overall profitability by 15-30% through gross margin optimization",
        "Reduces business failure rates by 60% through early warning margin signals",
        "Improves pricing strategy effectiveness by 50% through cost-based calculations",
        "Enables 30% faster business scaling with margin-backed decision making",
        "Identifies $50,000+ in hidden waste through detailed gross profit analysis",
        "Increases investor confidence with transparent margin reporting"
      ]
    },
    {
      id: 5,
      title: "Revenue Generation Applications",
      points: [
        "Retail Businesses: Achieve 30-50% gross margins through strategic pricing",
        "Manufacturing Companies: Maintain 25-40% gross margins through efficiency",
        "Software Firms: Command 70-90% gross margins with scalable products",
        "Service Providers: Secure 40-60% gross margins through value pricing",
        "E-commerce: Scale 25-45% gross margins with volume and automation",
        "Franchises: Standardize 15-30% gross margins across locations",
        "Consultancies: Deliver 50-70% gross margins with expertise-based services"
      ]
    },
    {
      id: 6,
      title: "Ordinary People Gross Profit Calculator Uses",
      points: [
        "Small Business Owners: Calculating profit margins for products and services",
        "Freelancers: Determining fair project pricing based on costs",
        "Etsy Sellers: Setting prices for handmade goods with proper margins",
        "Food Truck Operators: Calculating food cost percentages for menu items",
        "Online Course Creators: Pricing digital products with sustainable margins",
        "Consultants: Determining hourly rates based on desired profit margins",
        "Home Bakers: Calculating ingredient costs vs selling prices",
        "Side Hustlers: Evaluating profitability of gig economy opportunities"
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
        <link rel="canonical" href={`${siteUrl}/gross-profit-calculator`} />
      </Head>

      <div className={styles.page}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Gross Profit Calculator</h1>
          <p className={styles.subtitle}>
            Analyze your business profitability by calculating gross profit, operating profit, and net profit margins.
          </p>
        </section>

        {/* Calculator Card */}
        <div className={styles.calculatorCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="revenue" className={styles.label}>
                Total Revenue ($)
              </label>
              <input
                type="number"
                id="revenue"
                name="revenue"
                value={inputs.revenue}
                onChange={handleChange}
                placeholder="e.g. 10000"
                step="100"
                min="0"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="cogs" className={styles.label}>
                Cost of Goods Sold ($)
              </label>
              <input
                type="number"
                id="cogs"
                name="cogs"
                value={inputs.cogs}
                onChange={handleChange}
                placeholder="e.g. 6000"
                step="100"
                min="0"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="operatingExpenses" className={styles.label}>
                Operating Expenses ($)
              </label>
              <input
                type="number"
                id="operatingExpenses"
                name="operatingExpenses"
                value={inputs.operatingExpenses}
                onChange={handleChange}
                placeholder="e.g. 2000"
                step="100"
                min="0"
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="taxRate" className={styles.label}>
                Tax Rate (%)
              </label>
              <input
                type="number"
                id="taxRate"
                name="taxRate"
                value={inputs.taxRate}
                onChange={handleChange}
                placeholder="e.g. 25"
                step="0.1"
                min="0"
                max="100"
                className={styles.input}
              />
            </div>

            <button type="submit" className={styles.submitBtn}>
              <span className={styles.btnText}>Calculate Profitability</span>
              <span className={styles.arrow}>→</span>
            </button>
          </form>

          {results && (
            <div className={styles.resultSection}>
              <h3>Profitability Analysis</h3>
              <div className={styles.resultGrid}>
                <div className={styles.resultItem}>
                  <strong>Revenue:</strong> ${results.revenue}
                </div>
                <div className={styles.resultItem}>
                  <strong>COGS:</strong> ${results.cogs}
                </div>
                <div className={`${styles.resultItem} ${styles.highlight}`}>
                  <strong>Gross Profit:</strong> ${results.grossProfit}
                </div>
                <div className={`${styles.resultItem} ${styles.highlight}`}>
                  <strong>Gross Margin:</strong> {results.grossMargin}%
                </div>
                <div className={styles.resultItem}>
                  <strong>Operating Expenses:</strong> ${results.operatingExpenses}
                </div>
                <div className={styles.resultItem}>
                  <strong>Operating Profit:</strong> ${results.operatingProfit}
                </div>
                <div className={styles.resultItem}>
                  <strong>Tax Rate:</strong> {results.taxRate}%
                </div>
                <div className={styles.resultItem}>
                  <strong>Tax Amount:</strong> ${results.taxAmount}
                </div>
                <div className={`${styles.resultItem} ${styles.highlight}`}>
                  <strong>Net Profit:</strong> ${results.netProfit}
                </div>
              </div>
              <div className={styles.note}>
                Results are estimates. Actual profitability may vary based on accounting methods and additional factors.
              </div>
            </div>
          )}
        </div>

        {/* History Cards Section */}
        <section className={styles.historySection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>Gross Profit Calculator History & Global Applications</h2>
              <p className={styles.sectionSubtitle}>
                Explore the evolution and worldwide impact of gross profit calculation tools
              </p>
            </div>
            
            <div className={styles.cardsGrid}>
              {grossProfitCalculatorHistory.map((card) => (
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

export default GrossProfitCalculator;