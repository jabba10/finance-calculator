// components/CacCalculator.jsx
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './cac.module.css';

const CacCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [marketingCosts, setMarketingCosts] = useState('');
  const [salesCosts, setSalesCosts] = useState('');
  const [newCustomers, setNewCustomers] = useState('');
  const [result, setResult] = useState(null);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert inputs to numbers and validate
    const marketing = parseFloat(marketingCosts);
    const sales = parseFloat(salesCosts);
    const customers = parseFloat(newCustomers);

    // Validate inputs
    if (isNaN(marketing) || isNaN(sales) || isNaN(customers)) {
      alert("Please enter valid numbers in all fields");
      return;
    }

    if (marketing < 0 || sales < 0 || customers <= 0) {
      alert("Values must be positive numbers (customers must be greater than 0)");
      return;
    }

    const totalCost = marketing + sales;
    const cac = (totalCost / customers).toFixed(2);

    setResult({
      totalCost: totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      customers: customers.toLocaleString(),
      cac: cac,
      efficiency: cac < 100 ? 'High Efficiency' : cac < 300 ? 'Moderate Cost' : 'High Cost'
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
  const pageTitle = 'CAC Calculator | Free Customer Acquisition Cost Tool';
  const pageDescription = 'Calculate your Customer Acquisition Cost (CAC) instantly. Measure marketing efficiency, optimize budgets, and improve profitability.';

  // CAC Calculator History Data
  const cacCalculatorHistory = [
    {
      id: 1,
      title: "History & Discovery of Customer Acquisition Cost",
      points: [
        "1990s Dot-com Boom: Venture capitalists created CAC to evaluate startup marketing efficiency",
        "Amazon (1994): Pioneered CAC analysis for e-commerce customer lifetime value optimization",
        "Subscription Economy (2000s): SaaS companies formalized CAC as core growth metric",
        "Growth Hacking (2010s): Digital marketers refined CAC tracking across acquisition channels",
        "Mobile App Era (2015+): CAC became critical for user acquisition ROI measurement",
        "Modern Analytics (2020s): AI-driven CAC prediction models for real-time optimization"
      ]
    },
    {
      id: 2,
      title: "Global Origins & Business Purpose",
      points: [
        "United States: Silicon Valley VC firms developed CAC for tech startup investment decisions",
        "United Kingdom: Marketing agencies adapted CAC for client ROI measurement",
        "Germany: Manufacturing companies used CAC for B2B customer acquisition analysis",
        "Japan: E-commerce giants refined CAC for high-volume customer acquisition strategies",
        "China: Digital platforms created sophisticated CAC models for user growth optimization",
        "Purpose: Measure marketing efficiency, optimize acquisition channels, and maximize customer lifetime value"
      ]
    },
    {
      id: 3,
      title: "Key Industries & Monthly Applications",
      points: [
        "SaaS Companies: Daily tracking of marketing channel performance and ROI",
        "E-commerce: Weekly optimization of ad spend across platforms (Google, Facebook, Instagram)",
        "Mobile Gaming: Continuous user acquisition cost analysis for app store optimization",
        "FinTech: Monthly CAC analysis for customer onboarding and retention strategies",
        "Subscription Services: Quarterly CAC review for pricing and packaging decisions",
        "B2B Software: Weekly sales and marketing cost allocation analysis",
        "Digital Agencies: Client CAC reporting for campaign performance optimization"
      ]
    },
    {
      id: 4,
      title: "Problem Solving & Financial Impact",
      points: [
        "Reduces customer acquisition costs by 30-50% through channel optimization",
        "Improves marketing ROI by 40-60% through data-driven budget allocation",
        "Increases customer lifetime value by identifying highest-quality acquisition sources",
        "Reduces customer churn by 25-40% through better targeting and onboarding",
        "Enables 50% faster business scaling with predictable acquisition costs",
        "Identifies $100,000+ in annual marketing waste through inefficient channel detection",
        "Improves fundraising success rates by 70% through clear unit economics"
      ]
    },
    {
      id: 5,
      title: "Revenue Generation Applications",
      points: [
        "Marketing Agencies: Charge 15-25% management fees based on CAC reduction results",
        "SaaS Companies: Increase valuation multiples by demonstrating strong CAC efficiency",
        "E-commerce Brands: Boost profit margins by 10-30% through CAC optimization",
        "Investment Firms: Earn 20% carried interest on CAC-efficient portfolio companies",
        "Consulting Services: Generate $50,000-$250,000 fees for CAC optimization projects",
        "Marketing Software: Achieve 40% higher pricing for CAC analytics features",
        "Analytics Platforms: Create $100,000+ enterprise contracts for CAC prediction tools"
      ]
    },
    {
      id: 6,
      title: "Ordinary People CAC Calculator Uses",
      points: [
        "Side Business Owners: Calculating marketing costs for Etsy, Shopify, or Amazon stores",
        "Freelancers: Measuring client acquisition costs for service-based businesses",
        "Content Creators: Analyzing subscriber acquisition costs for YouTube or Patreon",
        "Small Business Owners: Optimizing local advertising spend for restaurants or shops",
        "Online Course Creators: Calculating student acquisition costs for digital products",
        "Real Estate Agents: Measuring lead generation costs for property sales",
        "Consultants: Analyzing client acquisition costs for professional services",
        "Nonprofits: Calculating donor acquisition costs for fundraising campaigns"
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
        <link rel="canonical" href={`${siteUrl}/cac-calculator`} />
      </Head>

      <div className={styles.page}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>CAC Calculator</h1>
          <p className={styles.subtitle}>
            Calculate your Customer Acquisition Cost to measure marketing efficiency and profitability.
          </p>
        </section>

        {/* Calculator Card */}
        <div className={styles.calculatorCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.instruction}>
              Enter your marketing, sales costs, and number of new customers acquired.
            </p>

            <div className={styles.inputGroup}>
              <label htmlFor="marketingCosts" className={styles.label}>
                Marketing Costs ($)
              </label>
              <input
                id="marketingCosts"
                type="number"
                value={marketingCosts}
                onChange={(e) => setMarketingCosts(e.target.value)}
                placeholder="e.g. 15000"
                className={styles.input}
                min="0"
                step="any"
                required
              />
              <small className={styles.note}>
                Ads, content, SEO, social media, email campaigns, etc.
              </small>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="salesCosts" className={styles.label}>
                Sales Costs ($)
              </label>
              <input
                id="salesCosts"
                type="number"
                value={salesCosts}
                onChange={(e) => setSalesCosts(e.target.value)}
                placeholder="e.g. 8000"
                className={styles.input}
                min="0"
                step="any"
                required
              />
              <small className={styles.note}>
                Salaries, commissions, tools, travel, CRM software, etc.
              </small>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="newCustomers" className={styles.label}>
                New Customers Acquired
              </label>
              <input
                id="newCustomers"
                type="number"
                value={newCustomers}
                onChange={(e) => setNewCustomers(e.target.value)}
                placeholder="e.g. 230"
                className={styles.input}
                min="1"
                step="1"
                required
              />
            </div>

            <button type="submit" className={styles.submitBtn}>
              <span className={styles.btnText}>Calculate CAC</span>
              <span className={styles.arrow}>→</span>
            </button>
          </form>

          {result && (
            <div className={styles.resultSection}>
              <h3>Customer Acquisition Cost (CAC)</h3>
              <div className={styles.resultGrid}>
                <div className={styles.resultItem}>
                  <strong>Total Spend:</strong> ${result.totalCost}
                </div>
                <div className={styles.resultItem}>
                  <strong>New Customers:</strong> {result.customers}
                </div>
                <div className={`${styles.resultItem} ${styles.highlight}`}>
                  <strong>CAC:</strong> ${result.cac}
                </div>
                <div className={styles.resultItem}>
                  <strong>Efficiency:</strong> {result.efficiency}
                </div>
              </div>
              <div className={styles.note}>
                You spent <strong>${result.cac}</strong> to acquire each customer. Compare this to customer lifetime value (LTV) to assess profitability.
              </div>
            </div>
          )}
        </div>

        {/* History Cards Section */}
        <section className={styles.historySection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>CAC Calculator History & Global Applications</h2>
              <p className={styles.sectionSubtitle}>
                Explore the evolution and worldwide impact of customer acquisition cost calculation tools
              </p>
            </div>
            
            <div className={styles.cardsGrid}>
              {cacCalculatorHistory.map((card) => (
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

export default CacCalculator;