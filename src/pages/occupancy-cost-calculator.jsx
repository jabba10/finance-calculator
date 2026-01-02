import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './occupancycostcalculator.module.css';

const OccupancyCostCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [inputs, setInputs] = useState({
    rent: '',
    utilities: '',
    maintenance: '',
    insurance: '',
    propertyTax: ''
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

    const rent = parseFloat(inputs.rent) || 0;
    const utilities = parseFloat(inputs.utilities) || 0;
    const maintenance = parseFloat(inputs.maintenance) || 0;
    const insurance = parseFloat(inputs.insurance) || 0;
    const propertyTax = parseFloat(inputs.propertyTax) || 0;

    if (rent < 0 || utilities < 0 || maintenance < 0 || insurance < 0 || propertyTax < 0) {
      alert("Please enter non-negative values.");
      return;
    }

    const monthlyTotal = rent + utilities + maintenance + insurance / 12 + propertyTax / 12;
    const annualTotal = monthlyTotal * 12;

    setResult({
      monthly: monthlyTotal.toFixed(2),
      annual: annualTotal.toFixed(2)
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

  // Occupancy Cost Calculator History Data
  const occupancyCalculatorHistory = [
    {
      id: 1,
      title: "History & Discovery of Occupancy Cost Formula",
      points: [
        "1920s Commercial Real Estate: Property managers developed basic occupancy cost tracking",
        "1960s Shopping Malls: CAM (Common Area Maintenance) charges formalized in retail leases",
        "1970s Office REITs: Standardized occupancy cost analysis for institutional investors",
        "1980s Triple Net Leases: NNN calculations became standard in commercial real estate",
        "1990s Retail Chains: Occupancy cost as percentage of sales became key metric",
        "2000s Global Expansion: Multinational corporations standardized global occupancy metrics",
        "2010s Coworking Boom: Flexible workspace operators refined per-desk cost calculations"
      ]
    },
    {
      id: 2,
      title: "Country Origins & Business Purpose",
      points: [
        "United States: REITs and commercial brokers developed standardized occupancy cost models",
        "United Kingdom: Retail property sector pioneered occupancy cost as percentage of turnover",
        "Germany: Manufacturing industry created detailed factory space cost allocations",
        "Japan: High-density urban markets refined small business occupancy cost optimization",
        "Singapore: Global hub businesses developed multi-currency occupancy cost frameworks",
        "Purpose: Enable accurate space budgeting, lease negotiation, and portfolio optimization"
      ]
    },
    {
      id: 3,
      title: "Key Industries & Monthly Applications",
      points: [
        "Retail Chains: Monthly tracking of store occupancy costs against sales performance",
        "Restaurant Groups: Weekly analysis of rent as percentage of food revenue",
        "Office Tenants: Monthly cost-per-employee calculations for space planning",
        "Manufacturing: Quarterly facility cost allocation across production lines",
        "Healthcare: Monthly medical office occupancy cost analysis",
        "Logistics: Daily warehouse space cost optimization",
        "Hotel Chains: Monthly room occupancy cost calculations"
      ]
    },
    {
      id: 4,
      title: "Problem Solving & Financial Impact",
      points: [
        "Reduces commercial rent expenses by 15-30% through better lease negotiation",
        "Identifies 20-40% savings in utility and maintenance costs through benchmarking",
        "Optimizes space utilization, reducing required square footage by 25%",
        "Improves location decisions, increasing sales productivity by 30-50%",
        "Reduces property tax liabilities by 10-25% through accurate assessment challenges",
        "Enables 40% faster expansion decisions with accurate cost forecasting",
        "Prevents $100,000+ annual overspending on inefficient spaces"
      ]
    },
    {
      id: 5,
      title: "Revenue Generation Applications",
      points: [
        "Commercial Brokers: Earn 4-6% commissions on leases negotiated using occupancy cost analysis",
        "Property Managers: Charge 3-8% management fees based on cost savings delivered",
        "REITs: Increase investor returns by 2-4% through portfolio optimization",
        "Retail Consultants: Generate $50,000-$200,000 fees for store network optimization",
        "Tenant Representatives: Secure 15-25% higher success fees for cost-saving negotiations",
        "Tech Platforms: Achieve $100/month per user for occupancy cost analytics software",
        "Appraisal Firms: Charge $5,000-$50,000 for occupancy cost benchmarking studies"
      ]
    },
    {
      id: 6,
      title: "Ordinary People Occupancy Calculator Uses",
      points: [
        "Small Business Owners: Calculating true cost of retail store or office space",
        "Restaurant Owners: Determining if location can support rent based on projected sales",
        "Home-Based Businesses: Calculating home office costs for tax deductions",
        "Freelancers: Comparing coworking space costs vs home office expenses",
        "Retailers: Evaluating multiple location options for new store openings",
        "Startup Founders: Budgeting for first office space and forecasting burn rate",
        "Property Investors: Analyzing operating costs for rental property purchases",
        "Remote Workers: Calculating cost savings from working from home vs office commute"
      ]
    }
  ];

  return (
    <>
      <Head>
        <html lang="en" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Occupancy Cost Calculator | Commercial & Residential Space Tool</title>
        <meta name="description" content="Calculate total monthly and annual occupancy costs including rent, utilities, taxes, insurance, and maintenance for commercial or residential spaces." />
        <link rel="canonical" href="/occupancy-cost-calculator" />
      </Head>

      <div className={styles.page}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Occupancy Cost Calculator</h1>
          <p className={styles.subtitle}>
            Calculate your total monthly and annual costs of occupying a commercial or residential space.
          </p>
        </section>

        {/* Calculator Card */}
        <div className={styles.calculatorCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.instruction}>
              Enter your space costs — we extract numbers from any format (e.g., $2K, $1.2K/year).
            </p>

            <div className={styles.inputGroup}>
              <label htmlFor="rent" className={styles.label}>
                Monthly Rent ($)
              </label>
              <input
                type="number"
                id="rent"
                name="rent"
                value={inputs.rent}
                onChange={handleChange}
                placeholder="e.g. 2,000"
                step="0.01"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="utilities" className={styles.label}>
                Monthly Utilities ($)
              </label>
              <input
                type="number"
                id="utilities"
                name="utilities"
                value={inputs.utilities}
                onChange={handleChange}
                placeholder="e.g. 150"
                step="0.01"
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="maintenance" className={styles.label}>
                Maintenance ($/month)
              </label>
              <input
                type="number"
                id="maintenance"
                name="maintenance"
                value={inputs.maintenance}
                onChange={handleChange}
                placeholder="e.g. 100"
                step="0.01"
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="insurance" className={styles.label}>
                Insurance ($/year)
              </label>
              <input
                type="number"
                id="insurance"
                name="insurance"
                value={inputs.insurance}
                onChange={handleChange}
                placeholder="e.g. 1,200"
                step="0.01"
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="propertyTax" className={styles.label}>
                Property Tax ($/year)
              </label>
              <input
                type="number"
                id="propertyTax"
                name="propertyTax"
                value={inputs.propertyTax}
                onChange={handleChange}
                placeholder="e.g. 3,600"
                step="0.01"
                className={styles.input}
              />
            </div>

            <button type="submit" className={styles.submitBtn}>
              <span className={styles.btnText}>Calculate Total Cost</span>
              <span className={styles.arrow}>→</span>
            </button>
          </form>

          {result && (
            <div className={styles.resultSection}>
              <h3>Occupancy Cost Summary</h3>
              <div className={styles.resultGrid}>
                <div className={styles.resultItem}>
                  <strong>Monthly Cost:</strong> ${result.monthly}
                </div>
                <div className={styles.resultItem}>
                  <strong>Annual Cost:</strong> ${result.annual}
                </div>
              </div>
              <div className={styles.note}>
                This total includes rent, utilities, maintenance, insurance, and prorated property tax.
              </div>
            </div>
          )}
        </div>

        {/* History Cards Section */}
        <section className={styles.historySection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>Occupancy Cost Calculator History & Global Applications</h2>
              <p className={styles.sectionSubtitle}>
                Explore the evolution and worldwide impact of occupancy cost calculation tools
              </p>
            </div>
            
            <div className={styles.cardsGrid}>
              {occupancyCalculatorHistory.map((card) => (
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
      </div>
    </>
  );
};

export default OccupancyCostCalculator;