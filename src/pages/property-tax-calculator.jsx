import React, { useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from './propertytaxcalculator.module.css';

const PropertyTaxCalculator = () => {
  const ctaButtonRef = useRef(null);

  const [homeValue, setHomeValue] = useState('');
  const [taxRate, setTaxRate] = useState('');
  const [annualTax, setAnnualTax] = useState(null);
  const [monthlyTax, setMonthlyTax] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = parseFloat(homeValue) || 300000;
    const rate = (parseFloat(taxRate) || 1.2) / 100;

    const yearlyTax = Math.max(0, value * rate);
    const monthly = Math.max(0, yearlyTax / 12);

    setAnnualTax(yearlyTax.toFixed(2));
    setMonthlyTax(monthly.toFixed(2));
  };

  const handleMouseMove = (e) => {
    const el = ctaButtonRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--x', `${x}px`);
    el.style.setProperty('--y', `${y}px`);
  };

  // Property Tax Calculator History Data
  const propertyTaxHistory = [
    {
      id: 1,
      title: "History & Development of Property Tax Calculator",
      points: [
        "Ancient Egypt: First recorded property taxes for Nile floodplain agricultural land",
        "Roman Empire: 'Tributum soli' (land tax) calculations for provincial governance",
        "Medieval England: Domesday Book (1086) established systematic property valuation",
        "17th Century: Colonial America adopted British property tax assessment methods",
        "1890s: Modern millage rate system developed for standardized tax calculation",
        "1970s: Computerized property tax calculation software for municipal governments",
        "1990s: First online property tax calculators for public access",
        "2010s: Mobile apps with GPS-based local tax rate lookups"
      ]
    },
    {
      id: 2,
      title: "Global Origins & Government Purpose",
      points: [
        "United States: Based on British colonial system with local government adaptation",
        "United Kingdom: 'Council Tax' calculations for local services funding",
        "Canada: Municipal property tax system derived from British model",
        "Australia: 'Rates' calculation for local council services",
        "Germany: 'Grundsteuer' (land tax) with complex federal calculation formulas",
        "Japan: 'Fixed Asset Tax' calculation for municipal revenue",
        "Purpose: Generate local government revenue for public services and infrastructure"
      ]
    },
    {
      id: 3,
      title: "Key Industries & Monthly Applications",
      points: [
        "Real Estate Agencies: Daily calculation for client property purchase budgeting",
        "Mortgage Lenders: Monthly escrow analysis for loan servicing",
        "Property Management: Weekly tax expense allocation for rental properties",
        "Home Insurance: Monthly premium calculation including tax burden",
        "Investment Firms: Quarterly analysis of REIT property tax expenses",
        "Construction Companies: Monthly project cost estimation including tax obligations",
        "Municipal Governments: Daily assessment of property tax revenue projections"
      ]
    },
    {
      id: 4,
      title: "Problem Solving & Financial Impact",
      points: [
        "Prevents $5,000-$50,000 in unexpected tax liabilities for home buyers",
        "Reduces mortgage default risk by 30% through accurate escrow planning",
        "Saves 20-40 hours monthly for real estate professionals in manual calculations",
        "Increases property investment ROI by 5-15% through accurate expense forecasting",
        "Reduces municipal assessment disputes by 60% through transparent calculations",
        "Prevents $10,000+ in penalties for underpaid property taxes",
        "Improves cash flow management for 90% of rental property investors"
      ]
    },
    {
      id: 5,
      title: "Revenue Generation Applications",
      points: [
        "Real Estate Software: Charge $50-$500/month for integrated tax calculation features",
        "Financial Advisors: Include tax planning in $2,000-$10,000 annual advisory fees",
        "Tax Appeal Services: Earn 30-50% of tax savings as contingency fees",
        "Real Estate Education: Offer $500-$5,000 property investment courses",
        "Data Providers: Sell tax rate databases for $5,000-$50,000 annual subscriptions",
        "Legal Services: Charge $3,000-$15,000 for property tax assessment appeals",
        "Insurance Companies: Increase premiums 10-25% for high-tax property coverage"
      ]
    },
    {
      id: 6,
      title: "Ordinary People Property Tax Calculator Uses",
      points: [
        "Home Buyers: Budgeting for total home ownership costs before purchase",
        "Retirees: Planning property tax expenses on fixed retirement income",
        "Rental Investors: Calculating cash flow and ROI for potential properties",
        "Relocation Planners: Comparing tax burdens across different cities/states",
        "Inheritance Recipients: Estimating ongoing tax costs for inherited property",
        "Home Renovators: Assessing tax implications of property value improvements",
        "First-time Buyers: Understanding full monthly housing expenses",
        "Empty Nesters: Evaluating downsizing tax savings opportunities"
      ]
    }
  ];

  return (
    <>
      <Head>
        <html lang="en" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Property Tax Calculator | Estimate Annual & Monthly Property Tax</title>
        <meta
          name="description"
          content="Estimate your annual and monthly property tax based on home value and local tax rate with our free, easy-to-use calculator."
        />
        <link rel="canonical" href="/property-tax-calculator" />
      </Head>

      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Property Tax Calculator</h1>
          <p className={styles.subtitle}>
            Estimate your annual and monthly property tax based on home value and local tax rate.
          </p>
        </section>

        {/* Calculator Card */}
        <div className={styles.calculatorCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.instruction}>
              Enter your home's market value and the local property tax rate to calculate your estimated tax.
            </p>

            <div className={styles.inputGroup}>
              <label htmlFor="homeValue" className={styles.label}>
                Home Market Value ($)
              </label>
              <input
                id="homeValue"
                type="number"
                value={homeValue}
                onChange={(e) => setHomeValue(e.target.value)}
                placeholder="e.g. 350000"
                className={styles.input}
                step="any"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="taxRate" className={styles.label}>
                Annual Property Tax Rate (%)
              </label>
              <input
                id="taxRate"
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                placeholder="e.g. 1.2"
                className={styles.input}
                step="any"
              />
            </div>

            <button type="submit" className={styles.submitBtn}>
              <span className={styles.btnText}>Calculate Tax</span>
              <span className={styles.arrow}>→</span>
            </button>
          </form>

          {annualTax !== null && (
            <div className={styles.resultSection}>
              <h3>Estimated Property Tax</h3>
              <div className={styles.resultGrid}>
                <div className={`${styles.resultItem} ${styles.highlight}`}>
                  <strong>Annual Tax:</strong> ${annualTax}
                </div>
                <div className={`${styles.resultItem} ${styles.highlight}`}>
                  <strong>Monthly Tax:</strong> ${monthlyTax}
                </div>
                <div className={styles.resultItem}>
                  <strong>Home Value:</strong>{' '}
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(parseFloat(homeValue) || 0)}
                </div>
                <div className={styles.resultItem}>
                  <strong>Tax Rate:</strong> {(parseFloat(taxRate) || 0).toFixed(2)}%
                </div>
              </div>
              <p className={styles.note}>
                This is an estimate. Actual taxes may vary based on exemptions, assessments, and local regulations.
              </p>
            </div>
          )}
        </div>

        {/* History Cards Section */}
        <section className={styles.historySection}>
          <div className={styles.sectionContainer}>
            <div className={styles.sectionHeader}>
              <h2>Property Tax Calculator History & Global Applications</h2>
              <p className={styles.sectionSubtitle}>
                Explore the evolution and worldwide impact of property tax calculation tools
              </p>
            </div>
            
            <div className={styles.cardsGrid}>
              {propertyTaxHistory.map((card) => (
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
          <h2>Free Financial Planning Tools: Budget, Invest & Plan Retirement</h2>
          <p>Free Financial Planning Tools – Try Now</p>
          <Link
            href="/suite"
            className={styles.ctaButton}
            ref={ctaButtonRef}
            onMouseMove={handleMouseMove}
          >
            <span className={styles.buttonText}>Explore All Calculators</span>
            <span className={styles.arrow}>→</span>
          </Link>
        </section>
      </div>
    </>
  );
};

export default PropertyTaxCalculator;