import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'react-helmet';
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

  return (
    <>
      {/* SEO Meta Tags */}
      <Head>
        <title>Occupancy Cost Calculator | Commercial & Residential Space Tool</title>
        <meta
          name="description"
          content="Free occupancy cost calculator to determine total monthly and annual expenses for commercial or residential space including rent, utilities, taxes, and insurance."
        />
        <meta
          name="keywords"
          content="occupancy cost calculator, rent calculator, commercial lease, office space cost, property expense tool, occupancy cost, cost calculator, business calculator, commercial real estate, lease calculator, office cost, retail space cost, property cost, space calculator, rent cost, utilities calculator, maintenance cost, insurance cost, property tax, commercial property, business space, office rent, retail rent, industrial space, lease cost, tenant cost, operating cost, facility cost, building cost, space expense, occupancy expense, commercial lease calculator, office space calculator, retail space calculator, industrial property calculator, business expense calculator, property management, lease agreement, commercial rent, office lease, retail lease, triple net lease, NNN lease, gross lease, net lease, CAM charges, common area maintenance, property insurance, building maintenance, utility costs, commercial utilities, space planning, business planning, startup costs, small business, entrepreneurship, commercial brokerage, real estate investment, property investment, building ownership, tenant improvement, lease negotiation, space utilization, cost per square foot, square footage cost, commercial mortgage, property operating expense, building operating cost, facility management, property budget, expense tracking, cost analysis, financial planning, business budget, occupancy rate, vacancy cost, lost rent, property vacancy, lease expiration, renewal cost, relocation cost, moving expense, new location, business expansion, branch office, retail store, restaurant space, warehouse cost, distribution center, manufacturing space, flex space, coworking space, shared office, sublease cost, sublet calculator, assignment cost, lease takeover, commercial sublease, office sublet, retail sublease, space sharing, cost sharing, expense allocation, cost distribution, prorated cost, monthly expense, annual expense, budget calculator, financial calculator, money tool, finance tool, business tool, real estate tool, property tool, lease tool, tenant tool, landlord tool, investor tool, broker tool, agent tool, commercial agent, leasing agent, property manager, facility manager, business owner, startup founder, entrepreneur calculator, small business calculator, retail business, restaurant owner, warehouse operator, manufacturer space, industrial tenant, office tenant, retail tenant, commercial tenant, residential tenant, apartment cost, rental property, investment property, real estate calculator, property calculator, building calculator, space cost calculator, occupancy calculator, cost per month, annual occupancy cost, monthly occupancy cost, total occupancy cost, full occupancy cost, true occupancy cost, actual occupancy cost, effective rent, net effective rent, gross rent, net rent, base rent, additional rent, pass-through costs, operating expenses, property expenses, building expenses, facility expenses, space expenses, occupancy expenses, tenant expenses, leasehold expenses, possession cost, use cost, utilization cost, space occupancy, building occupancy, property occupancy, commercial occupancy, residential occupancy, mixed-use cost, multi-tenant cost, single-tenant cost, stand-alone building, shopping center, mall space, strip mall, office building, office park, business park, industrial park, warehouse space, storage cost, fulfillment center, data center, medical office, dental office, veterinary space, salon space, spa cost, gym space, fitness center, restaurant space, bar cost, cafe space, retail storefront, showroom space, automotive space, service center, repair shop, manufacturing plant, production space, assembly space, clean room, laboratory space, research facility, educational space, school cost, university space, government space, municipal building, public space, private space, leased space, owned space, rented space, subleased space, temporary space, pop-up space, short-term lease, long-term lease, lease term, rental agreement, tenancy cost, occupancy agreement, space rental, property rental, building rental, facility rental, office rental, retail rental, industrial rental, commercial rental, residential rental, apartment rental, house rental, condo cost, townhouse cost, duplex cost, multi-family cost, mixed-use rental, commercial residential, live-work space, home office, business home, remote work space, coworking cost, shared space, flexible office, serviced office, executive suite, virtual office, meeting room, conference space, event space, storage space, parking cost, vehicle storage, equipment storage, inventory space, showroom cost, display space, sales floor, back office, front office, reception area, workspace cost, employee space, staff area, production area, workshop space, studio cost, creative space, artist space, maker space, incubation space, startup space, accelerator cost, innovation center, tech space, office cost calculator, retail cost calculator, industrial cost calculator, commercial cost calculator, residential cost calculator, space cost tool, occupancy tool, lease calculator tool, rent calculator tool, property expense calculator, building cost calculator, facility cost calculator, business space calculator, commercial space calculator, office expense calculator, retail expense calculator, industrial expense calculator, warehouse cost calculator, storage cost calculator, manufacturing cost calculator, production space calculator, restaurant cost calculator, retail store calculator, small business space calculator, startup space calculator, entrepreneur space calculator, home business calculator, remote work calculator, coworking calculator, shared office calculator, flexible space calculator, temporary space calculator, pop-up calculator, short-term lease calculator, long-term lease calculator, lease comparison calculator, space comparison tool, cost comparison calculator, rent comparison tool, lease negotiation tool, tenant calculator, landlord calculator, investor calculator, broker calculator, agent calculator, property manager calculator, facility manager calculator, business owner calculator, startup calculator, retail calculator, restaurant calculator, warehouse calculator, industrial calculator, office calculator, commercial calculator, residential calculator, real estate calculator, property calculator, building calculator, space calculator, occupancy calculator, cost calculator, expense calculator, budget calculator, financial calculator, planning calculator, analysis tool, comparison tool, negotiation tool, decision tool, business tool, finance tool, real estate tool, property tool, lease tool, rent tool, tenant tool, landlord tool, investor tool, broker tool, agent tool, manager tool, owner tool, entrepreneur tool, startup tool, small business tool, retail tool, restaurant tool, industrial tool, office tool, commercial tool, residential tool"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/occupancy-cost-calculator" />
        <meta property="og:title" content="Occupancy Cost Calculator - Total Space Expense Tool" />
        <meta
          property="og:description"
          content="Calculate your full occupancy costs including rent, utilities, maintenance, insurance, and property tax."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/occupancy-cost-calculator" />
      </Head>

      <div className={styles.page}>
        <div className={styles.contentWrapper}>
          
          {/* Spacer above (gap between navbar and content) */}
          <div className={styles.spacerTop} />

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

              <button type="submit" className={styles.ctaButton}>
                <span className={styles.btnText}>Calculate Total Cost</span>
                <span className={styles.btnArrow}>→</span>
              </button>

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
                  <div className={styles.resultNote}>
                    This total includes rent, utilities, maintenance, insurance, and prorated property tax.
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Info Section */}
          <section className={styles.infoSection}>
            <div className={styles.container}>
              <div className={styles.infoCard}>
                <h3>Why Occupancy Cost Matters</h3>
                <p>
                  <strong>Occupancy Cost</strong> is the total expense of occupying a space — not just rent. Many businesses and tenants overlook hidden costs like maintenance, insurance, and taxes, leading to budget overruns.
                </p>

                <h4>How to Use This Calculator</h4>
                <p>
                  Enter your <strong>monthly rent</strong>, <strong>utilities</strong>, <strong>monthly maintenance</strong>, and the <strong>annual insurance</strong> and <strong>property tax</strong>. The calculator automatically prorates yearly costs to monthly and gives you a complete picture of your true occupancy expense.
                </p>

                <h4>The Occupancy Cost Formula</h4>
                <div className={styles.formula}>
                  <code>Total Monthly Cost = Rent + Utilities + Maintenance + (Insurance / 12) + (Property Tax / 12)</code>
                </div>
                <p>
                  This helps you compare lease options fairly, budget accurately, and negotiate better terms with landlords.
                </p>

                <h4>Example Use Cases</h4>
                <ul className={styles.list}>
                  <li><strong>Small Business:</strong> Compare two retail spaces with different rent but varying utility costs.</li>
                  <li><strong>Office Lease:</strong> Factor in maintenance and insurance when evaluating a commercial lease.</li>
                  <li><strong>Home Office:</strong> Calculate true cost for tax deductions or remote work planning.</li>
                </ul>

                <h4>Tips for Reducing Occupancy Costs</h4>
                <ul className={styles.list}>
                  <li>✅ <strong>Negotiate tenant improvements</strong> — ask landlord to cover upgrades</li>
                  <li>✅ <strong>Bundle services</strong> — combine internet, phone, security for discounts</li>
                  <li>✅ <strong>Energy efficiency</strong> — LED lighting, smart thermostats reduce utilities</li>
                  <li>✅ <strong>Review insurance annually</strong> — avoid over-insuring</li>
                  <li>✅ <strong>Challenge property tax assessments</strong> — especially after market shifts</li>
                </ul>

                <h4>Commercial Leasing Terms to Know</h4>
                <ul className={styles.list}>
                  <li><strong>Gross Lease:</strong> Landlord pays most operating expenses</li>
                  <li><strong>Net Lease:</strong> Tenant pays some or all additional costs</li>
                  <li><strong>Triple Net (NNN):</strong> Tenant pays property tax, insurance, and maintenance</li>
                  <li><strong>Common Area Maintenance (CAM):</strong> Fees for shared spaces</li>
                  <li><strong>Escalation Clause:</strong> Rent increases over time</li>
                </ul>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className={styles.ctaSection}>
            <div className={styles.ctaSectionInner}>
              <h2>Free Financial Planning Tools: Budget, Invest & Plan Retirement</h2>
              <p>Free Financial Planning Tools – Try Now</p>
              <Link href="/suite" legacyBehavior>
                <a
                  className={styles.ctaButtonLink}
                  ref={ctaButtonRef}
                  onMouseMove={handleMouseMove}
                >
                  <span className={styles.btnText}>Explore All Calculators</span>
                  <span className={styles.arrow}>→</span>
                </a>
              </Link>
            </div>
          </section>

          {/* Footer Spacer */}
          <div className={styles.footerSpacer} />
        </div>
      </div>
    </>
  );
};

export default OccupancyCostCalculator;