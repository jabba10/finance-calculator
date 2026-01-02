import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './payrollcalculator.module.css';

const PayrollCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [inputs, setInputs] = useState({
    hourlyRate: '25',
    hoursWorked: '40',
    overtimeRate: '37.5',
    overtimeHours: '0',
    taxRate: '22',
    deductions: '0'
  });

  const [results, setResults] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const hourlyRate = parseFloat(inputs.hourlyRate);
    const hoursWorked = parseFloat(inputs.hoursWorked);
    const overtimeRate = parseFloat(inputs.overtimeRate);
    const overtimeHours = parseFloat(inputs.overtimeHours);
    const taxRate = parseFloat(inputs.taxRate) / 100;
    const deductions = parseFloat(inputs.deductions);

    // Validation
    if (
      isNaN(hourlyRate) || isNaN(hoursWorked) || isNaN(overtimeRate) ||
      isNaN(overtimeHours) || isNaN(taxRate) || isNaN(deductions)
    ) {
      alert("Please enter valid numbers in all fields");
      return;
    }

    if (hourlyRate < 0 || hoursWorked < 0 || overtimeRate < 0 || 
        overtimeHours < 0 || taxRate < 0 || deductions < 0) {
      alert("Values cannot be negative");
      return;
    }

    // Calculations
    const regularPay = hourlyRate * Math.min(hoursWorked, 40);
    const overtimePay = overtimeHours * overtimeRate;
    const grossPay = regularPay + overtimePay;
    const taxAmount = grossPay * taxRate;
    const netPay = grossPay - taxAmount - deductions;

    setResults({
      regularPay: regularPay.toFixed(2),
      overtimePay: overtimePay.toFixed(2),
      grossPay: grossPay.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      deductions: deductions.toFixed(2),
      netPay: netPay.toFixed(2),
      taxRate: (taxRate * 100).toFixed(2)
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
  const pageTitle = 'Payroll Calculator | Free Take-Home Pay & Salary Estimator';
  const pageDescription = 'Calculate payroll, take-home pay, taxes, and deductions instantly. Free payroll calculator for employees, employers, and HR professionals.';

  // Payroll Calculator History Data
  const payrollCalculatorHistory = [
    {
      id: 1,
      title: "History & Evolution of Payroll Calculation",
      points: [
        "Ancient Rome: Legion payroll clerks calculated soldier wages in denarii and rations",
        "Industrial Revolution: Factory owners systematized weekly wage calculations",
        "1920s America: Time clock systems enabled hourly payroll tracking",
        "1935 USA: Social Security Act mandated payroll tax deductions nationwide",
        "1960s Computer Era: IBM mainframes automated large corporate payroll",
        "1980s PC Revolution: Software like ADP and Paychex digitized payroll processing",
        "1990s Internet: Online payroll services enabled remote calculation",
        "Modern Era: Cloud-based real-time payroll with AI compliance monitoring"
      ]
    },
    {
      id: 2,
      title: "Global Origins & Business Purpose",
      points: [
        "United States: Factory owners developed wage calculation for industrial workforce",
        "United Kingdom: Banking institutions created payroll for civil service",
        "Germany: Manufacturing giants standardized payroll for skilled labor",
        "Japan: Keiretsu groups established lifetime employment payroll systems",
        "China: State-owned enterprises developed socialist payroll structures",
        "India: IT outsourcing companies created global payroll processing centers",
        "Purpose: Ensure accurate employee compensation, tax compliance, and financial transparency"
      ]
    },
    {
      id: 3,
      title: "Key Industries & Weekly Applications",
      points: [
        "Retail Chains: Weekly payroll for thousands of hourly store employees",
        "Restaurants: Daily tip calculation and biweekly server compensation",
        "Healthcare: Complex shift differentials for nurses and medical staff",
        "Manufacturing: Overtime and production bonus calculations weekly",
        "Technology: Monthly salary payroll with stock option calculations",
        "Construction: Union scale rates and prevailing wage calculations",
        "Education: Academic year payroll for teachers and administrative staff",
        "Hospitality: Seasonal worker payroll with varying occupancy rates"
      ]
    },
    {
      id: 4,
      title: "Problem Solving & Financial Impact",
      points: [
        "Reduces payroll errors by 95% through automated calculation",
        "Saves 20-40 hours monthly per 100 employees through automation",
        "Prevents 99% of tax compliance penalties through accurate withholding",
        "Improves employee satisfaction by 30% with accurate, timely payments",
        "Reduces administrative costs by 50% through streamlined processes",
        "Identifies $10,000+ in annual overpayments through error detection",
        "Enables 50% faster business scaling with efficient payroll systems"
      ]
    },
    {
      id: 5,
      title: "Revenue Generation & Business Value",
      points: [
        "Payroll Services: Generate $20-100 per employee monthly fees",
        "Software Companies: Earn $50,000+ annual enterprise contracts",
        "HR Consultancies: Charge $5,000-$50,000 for payroll system implementation",
        "Accounting Firms: Add 15-30% revenue through payroll processing services",
        "Tech Startups: Secure $10M+ funding with efficient payroll automation",
        "Global Employers: Save millions through optimized international payroll",
        "Compliance Services: Generate revenue through regulatory guidance"
      ]
    },
    {
      id: 6,
      title: "Ordinary People Payroll Calculator Uses",
      points: [
        "Hourly Employees: Calculating weekly take-home pay before payday",
        "Small Business Owners: Estimating payroll costs before hiring staff",
        "Freelancers: Determining equivalent hourly rate from project fees",
        "Job Seekers: Comparing salary offers with different benefits packages",
        "Managers: Budgeting team labor costs for project planning",
        "Consultants: Setting fair billing rates based on desired take-home pay",
        "Students: Understanding paycheck deductions for part-time jobs",
        "Retirees: Calculating supplemental income from part-time work"
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
        <link rel="canonical" href={`${siteUrl}/payroll-calculator`} />
      </Head>

      <div className={styles.page}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Payroll Calculator</h1>
          <p className={styles.subtitle}>
            Calculate your take-home pay after taxes and deductions.
          </p>
        </section>

        {/* Calculator Card */}
        <div className={styles.calculatorCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.instruction}>
              Enter your payroll details to calculate take-home pay.
            </p>

            <div className={styles.inputGroup}>
              <label htmlFor="hourlyRate" className={styles.label}>
                Hourly Rate ($)
              </label>
              <input
                type="number"
                id="hourlyRate"
                name="hourlyRate"
                value={inputs.hourlyRate}
                onChange={handleChange}
                placeholder="e.g. 25"
                step="0.01"
                min="0"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="hoursWorked" className={styles.label}>
                Regular Hours Worked
              </label>
              <input
                type="number"
                id="hoursWorked"
                name="hoursWorked"
                value={inputs.hoursWorked}
                onChange={handleChange}
                placeholder="e.g. 40"
                step="0.25"
                min="0"
                max="80"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="overtimeRate" className={styles.label}>
                Overtime Rate ($)
              </label>
              <input
                type="number"
                id="overtimeRate"
                name="overtimeRate"
                value={inputs.overtimeRate}
                onChange={handleChange}
                placeholder="e.g. 37.5"
                step="0.01"
                min="0"
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="overtimeHours" className={styles.label}>
                Overtime Hours
              </label>
              <input
                type="number"
                id="overtimeHours"
                name="overtimeHours"
                value={inputs.overtimeHours}
                onChange={handleChange}
                placeholder="e.g. 5"
                step="0.25"
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
                placeholder="e.g. 22"
                step="0.1"
                min="0"
                max="100"
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="deductions" className={styles.label}>
                Deductions ($)
              </label>
              <input
                type="number"
                id="deductions"
                name="deductions"
                value={inputs.deductions}
                onChange={handleChange}
                placeholder="e.g. 100"
                step="1"
                min="0"
                className={styles.input}
              />
            </div>

            <button type="submit" className={styles.submitBtn}>
              <span className={styles.btnText}>Calculate Payroll</span>
              <span className={styles.arrow}>→</span>
            </button>
          </form>

          {results && (
            <div className={styles.resultSection}>
              <h3>Payroll Results</h3>
              <div className={styles.resultGrid}>
                <div className={styles.resultItem}>
                  <strong>Regular Pay:</strong> ${results.regularPay}
                </div>
                <div className={styles.resultItem}>
                  <strong>Overtime Pay:</strong> ${results.overtimePay}
                </div>
                <div className={`${styles.resultItem} ${styles.highlight}`}>
                  <strong>Gross Pay:</strong> ${results.grossPay}
                </div>
                <div className={styles.resultItem}>
                  <strong>Tax Rate:</strong> {results.taxRate}%
                </div>
                <div className={styles.resultItem}>
                  <strong>Tax Amount:</strong> ${results.taxAmount}
                </div>
                <div className={styles.resultItem}>
                  <strong>Deductions:</strong> ${results.deductions}
                </div>
                <div className={`${styles.resultItem} ${styles.highlight}`}>
                  <strong>Net Pay:</strong> ${results.netPay}
                </div>
              </div>
              <div className={styles.note}>
                Results are estimates. Actual payroll may vary based on additional factors.
              </div>
            </div>
          )}
        </div>

        {/* History Cards Section */}
        <section className={styles.historySection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>Payroll Calculator History & Global Applications</h2>
              <p className={styles.sectionSubtitle}>
                Explore the evolution and worldwide impact of payroll calculation tools
              </p>
            </div>
            
            <div className={styles.cardsGrid}>
              {payrollCalculatorHistory.map((card) => (
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

export default PayrollCalculator;