import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './purchasingpowerparitycalculator.module.css';

const PurchasingPowerParityCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [inputs, setInputs] = useState({
    priceA: '',
    exchangeRate: ''
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const priceA = parseFloat(inputs.priceA);
    const exchangeRate = parseFloat(inputs.exchangeRate); // Units of Currency B per 1 Unit of Currency A

    if (isNaN(priceA) || isNaN(exchangeRate) || priceA <= 0 || exchangeRate <= 0) {
      alert("Please enter valid positive values for both fields.");
      return;
    }

    const priceB = priceA * exchangeRate;

    setResult({
      priceA: priceA.toFixed(2),
      exchangeRate: exchangeRate.toFixed(4),
      priceB: priceB.toFixed(2)
    });
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

  // PPP Calculator History Data
  const pppCalculatorHistory = [
    {
      id: 1,
      title: "History & Discovery of PPP Formulas",
      points: [
        "1920s: Swedish economist Gustav Cassel formalized modern PPP theory",
        "1944: Bretton Woods Conference used PPP for international monetary planning",
        "1960s: IMF and World Bank began systematic PPP data collection",
        "1970s: OECD developed first standardized PPP calculation methodologies",
        "1986: The Economist created Big Mac Index as simplified PPP measure",
        "1990s: Penn World Tables provided comprehensive PPP GDP comparisons",
        "2000s: ICP (International Comparison Program) globalized PPP calculations",
        "2010s: Real-time PPP calculators emerged with global e-commerce data",
        "2020s: AI-powered PPP calculators with dynamic basket adjustments"
      ]
    },
    {
      id: 2,
      title: "Global Origins & Discovery Purpose",
      points: [
        "Sweden: Gustav Cassel developed PPP to analyze post-WWI currency values",
        "United Kingdom: Used to manage Sterling's gold standard relationships",
        "United States: Federal Reserve employs PPP for monetary policy decisions",
        "Germany: Bundesbank uses PPP for Eurozone inflation targeting",
        "Japan: Ministry of Finance applies PPP for trade competitiveness analysis",
        "China: PBOC utilizes PPP for RMB internationalization strategy",
        "India: Reserve Bank uses PPP for emerging market comparisons",
        "Brazil: Central Bank employs PPP for inflation basket adjustments",
        "Purpose: Eliminate exchange rate distortions in international comparisons"
      ]
    },
    {
      id: 3,
      title: "Key Industries & Monthly Applications",
      points: [
        "Central Banks: Monthly monetary policy and currency valuation analysis",
        "Multinational Corporations: Quarterly pricing strategy and market entry decisions",
        "Investment Banks: Daily currency trading and international arbitrage",
        "Economic Research: Annual GDP and productivity cross-country comparisons",
        "International Organizations: Biannual poverty line and development assessments",
        "Academic Institutions: Continuous economic research and teaching tools",
        "Government Agencies: Budget allocation for international aid and programs",
        "Retail Chains: Global pricing strategy and cost structure optimization",
        "Tourism Industry: Destination pricing and competitiveness analysis"
      ]
    },
    {
      id: 4,
      title: "Problem Solving & Financial Impact",
      points: [
        "Reduces pricing errors by 20-40% in international markets",
        "Increases profit margins by 15-30% through optimal global pricing",
        "Prevents $100M+ currency mispricing in multinational operations",
        "Improves investment returns by 25-50% through currency valuation insights",
        "Reduces supply chain costs by 10-20% through efficient sourcing decisions",
        "Enhances market entry success rates by 60-80% through proper pricing",
        "Minimizes currency risk exposure through PPP-based hedging strategies",
        "Optimizes tax planning through accurate transfer pricing calculations"
      ]
    },
    {
      id: 5,
      title: "Revenue Generation Applications",
      points: [
        "Financial Data Providers: $10,000+ annual subscriptions for PPP databases",
        "Economic Consulting: $200-500 hourly rates for PPP analysis services",
        "Software Companies: $5,000-50,000 enterprise PPP calculation platforms",
        "Investment Funds: 20% performance fees on PPP-based currency strategies",
        "Academic Publishing: $5,000-20,000 PPP research paper publication fees",
        "Government Contracts: Multi-million dollar ICP participation projects",
        "Corporate Training: $2,000-10,000 PPP strategy workshops",
        "Media Companies: Ad revenue from Big Mac Index and PPP content",
        "Research Grants: $100,000+ for PPP methodology development"
      ]
    },
    {
      id: 6,
      title: "Ordinary People PPP Calculator Uses",
      points: [
        "International Travelers: Budgeting for trips and comparing destination costs",
        "Expatriates: Negotiating salary adjustments for overseas assignments",
        "Online Shoppers: Comparing prices for international e-commerce purchases",
        "Students: Understanding relative costs for study abroad programs",
        "Immigrants: Planning relocation budgets and cost of living adjustments",
        "Remote Workers: Determining fair compensation across different countries",
        "Investors: Analyzing currency valuations for foreign investment decisions",
        "Small Businesses: Pricing products for international customers",
        "Retirees: Comparing retirement destinations based on purchasing power",
        "Salary Negotiators: Benchmarking compensation across global markets"
      ]
    }
  ];

  return (
    <>
      {/* SEO Meta Tags */}
      <Head>
        <html lang="en" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Purchasing Power Parity Calculator | PPP Tool</title>
        <meta
          name="description"
          content="Free purchasing power parity (PPP) calculator to compare currency values and cost of living between countries."
        />
        <meta
          name="keywords"
          content="PPP calculator, purchasing power parity, currency comparison, cost of living, international economics, exchange rate calculator, PPP tool, cost of living calculator, currency value, real exchange rate, PPP exchange rate, Big Mac Index, GDP PPP, international purchasing power, currency valuation, inflation-adjusted exchange rate, cross country cost comparison, currency parity, economic parity, global price comparison, forex calculator, international salary calculator, living cost abroad, currency conversion tool, relative purchasing power, PPP theory, macroeconomic calculator, IMF PPP, World Bank PPP, currency overvaluation, currency undervaluation, cost parity, price level comparison, international finance tool, economic indicator"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/purchasing-power-parity-calculator" />
        <meta property="og:title" content="Purchasing Power Parity Calculator - Compare Currencies" />
        <meta
          property="og:description"
          content="Calculate how much a good should cost in another country based on exchange rates and PPP theory."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/purchasing-power-parity-calculator" />
      </Head>

      <div className={styles.page}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Purchasing Power Parity (PPP) Calculator</h1>
          <p className={styles.subtitle}>
            Compare the relative value of currencies based on the cost of goods across countries.
          </p>
        </section>

        {/* Calculator Card */}
        <div className={styles.calculatorCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.instruction}>
              Enter the price of a good in one country and the exchange rate to calculate PPP value.
            </p>

            <div className={styles.inputGroup}>
              <label htmlFor="priceA" className={styles.label}>
                Price in Country A ($)
              </label>
              <input
                type="number"
                id="priceA"
                name="priceA"
                value={inputs.priceA}
                onChange={handleChange}
                placeholder="e.g. 5.00"
                step="0.01"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="exchangeRate" className={styles.label}>
                Exchange Rate (B per A)
              </label>
              <input
                type="number"
                id="exchangeRate"
                name="exchangeRate"
                value={inputs.exchangeRate}
                onChange={handleChange}
                placeholder="e.g. 1.25"
                step="0.0001"
                required
                className={styles.input}
              />
              <small className={styles.note}>
                Units of Currency B per 1 Unit of Currency A
              </small>
            </div>

            <button type="submit" className={styles.submitBtn}>
              <span className={styles.btnText}>Calculate PPP</span>
              <span className={styles.arrow}>→</span>
            </button>

            {result && (
              <div className={styles.resultSection}>
                <h3>PPP Result</h3>
                <p>
                  A good costing <strong>${result.priceA}</strong> in Country A
                  should cost <strong>${result.priceB}</strong> in Country B
                  at an exchange rate of <strong>{result.exchangeRate}</strong>.
                </p>
              </div>
            )}
          </form>
        </div>

        {/* History Cards Section */}
        <section className={styles.historySection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>PPP Calculator History & Global Applications</h2>
              <p className={styles.sectionSubtitle}>
                Explore the evolution and worldwide impact of purchasing power parity calculation tools
              </p>
            </div>
            
            <div className={styles.cardsGrid}>
              {pppCalculatorHistory.map((card) => (
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

export default PurchasingPowerParityCalculator;
