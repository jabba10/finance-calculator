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
    const el = ctaButtonRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--x', `${x}px`);
    el.style.setProperty('--y', `${y}px`);
  };

  // SEO Metadata - Enhanced with comprehensive payroll keywords
  const siteUrl = 'https://www.financecalculatorfree.com';
  const pageTitle = 'Free Payroll Calculator 2024 | Take-Home Pay & Salary Estimator';
  const pageDescription = 'Calculate payroll, take-home pay, taxes, and deductions for employees and employers. Free payroll calculator for hourly, salary, and overtime wages.';

  // Comprehensive SEO Keywords Collections for Payroll Calculator
  const singleKeywords = [
    'payroll', 'calculator', 'salary', 'wages', 'hourly', 'overtime', 'taxes', 
    'deductions', 'withholding', 'paycheck', 'earnings', 'income', 'compensation', 
    'gross', 'net', 'take-home', 'paystub', 'employee', 'employer', 'business', 
    'payperiod', 'biweekly', 'semimonthly', 'weekly', 'monthly', 'annual', 
    'rate', 'hours', 'time', 'clock', 'attendance', 'labor', 'work', 'job', 
    'position', 'role', 'department', 'company', 'organization', 'corporation', 
    'llc', 'inc', 'enterprise', 'small', 'medium', 'large', 'startup', 
    'federal', 'state', 'local', 'fica', 'social', 'security', 'medicare', 
    'withholding', 'allowances', 'exemptions', 'dependents', 'filing', 'status',
    'single', 'married', 'jointly', 'separately', 'head', 'household', 'wage',
    'garnishments', 'levies', 'child', 'support', 'alimony', 'maintenance'
  ];

  const twoWordKeywords = [
    'payroll calculator', 'salary calculator', 'wage calculator', 'paycheck calculator', 
    'take home pay', 'net pay', 'gross pay', 'hourly rate', 'overtime pay', 
    'regular pay', 'tax calculator', 'deduction calculator', 'payroll tax', 
    'income tax', 'federal tax', 'state tax', 'local tax', 'fica tax', 
    'social security', 'medicare tax', 'withholding tax', 'payroll processing', 
    'payroll management', 'payroll system', 'payroll software', 'payroll service', 
    'payroll provider', 'payroll company', 'payroll department', 'payroll clerk', 
    'payroll specialist', 'payroll administrator', 'payroll manager', 
    'payroll coordinator', 'payroll analyst', 'payroll accounting', 
    'payroll expenses', 'payroll costs', 'payroll budget', 'payroll forecast', 
    'payroll planning', 'payroll strategy', 'payroll compliance', 'payroll laws', 
    'payroll regulations', 'payroll requirements', 'payroll reporting', 
    'payroll forms', 'w2 form', 'w4 form', '941 form', '940 form', 
    'payroll records', 'payroll history', 'payroll audit', 'payroll review', 
    'payroll verification', 'payroll reconciliation', 'payroll accuracy', 
    'payroll efficiency', 'payroll automation', 'payroll integration', 
    'payroll api', 'payroll export', 'payroll import', 'payroll data', 
    'payroll information', 'payroll security', 'payroll privacy', 
    'employee payroll', 'employer payroll', 'business payroll', 
    'company payroll', 'organization payroll', 'corporate payroll', 
    'small business payroll', 'startup payroll', 'nonprofit payroll', 
    'government payroll', 'federal payroll', 'state payroll', 'local payroll',
    'contractor payroll', 'freelancer payroll', 'gig worker payroll',
    'remote worker payroll', 'international payroll', 'global payroll',
    'multi-state payroll', 'multi-country payroll', 'payroll solutions',
    'payroll tools', 'payroll resources', 'payroll guide', 'payroll help'
  ];

  const longTailKeywords = [
    'free online payroll calculator for small business',
    'hourly wage calculator with overtime and taxes',
    'salary paycheck calculator after tax deductions',
    'take home pay calculator for hourly employees',
    'payroll tax calculator for employers and employees',
    'overtime pay calculator time and a half double time',
    'net pay calculator with federal and state withholding',
    'small business payroll calculator for w2 employees',
    'contractor payroll calculator 1099 independent contractor',
    'restaurant payroll calculator with tips and overtime',
    'construction payroll calculator for union workers',
    'healthcare payroll calculator for nurses and doctors',
    'retail payroll calculator for store employees',
    'manufacturing payroll calculator for factory workers',
    'hospitality payroll calculator for hotel staff',
    'education payroll calculator for teachers and staff',
    'government payroll calculator for public employees',
    'nonprofit payroll calculator for charitable organizations',
    'startup payroll calculator for new businesses',
    'franchise payroll calculator for multiple locations',
    'multi-state payroll calculator for remote workers',
    'international payroll calculator for global employees',
    'executive payroll calculator for c suite compensation',
    'sales payroll calculator with commission and bonuses',
    'bonus payroll calculator for annual performance bonuses',
    'commission payroll calculator for sales representatives',
    'tip payroll calculator for service industry workers',
    'shift differential payroll calculator for night shifts',
    'hazard pay payroll calculator for dangerous work',
    'holiday pay payroll calculator for premium rates',
    'sick pay payroll calculator for paid time off',
    'vacation pay payroll calculator for pto accrual',
    'family leave payroll calculator for fmla',
    'maternity leave payroll calculator for new parents',
    'paternity leave payroll calculator for fathers',
    'military leave payroll calculator for service members',
    'jury duty payroll calculator for court service',
    'severance pay payroll calculator for layoffs',
    'termination pay payroll calculator for final paycheck',
    'retirement payroll calculator for pension payments',
    'disability payroll calculator for workers compensation',
    'unemployment payroll calculator for state benefits',
    'payroll calculator for california with state taxes',
    'payroll calculator for new york with city taxes',
    'payroll calculator for texas with no state income tax',
    'payroll calculator for florida with no state income tax',
    'payroll calculator for illinois with flat tax',
    'payroll calculator for pennsylvania with flat tax',
    'payroll calculator for colorado with flat tax',
    'payroll calculator for michigan with flat tax',
    'payroll calculator for north carolina with flat tax',
    'payroll calculator for indiana with flat tax',
    'payroll calculator for massachusetts with flat tax',
    'payroll calculator for utah with flat tax',
    'payroll calculator for arizona with progressive tax',
    'payroll calculator for georgia with progressive tax',
    'payroll calculator for virginia with progressive tax',
    'payroll calculator for new jersey with progressive tax',
    'payroll calculator for maryland with progressive tax',
    'payroll calculator for minnesota with progressive tax',
    'payroll calculator for wisconsin with progressive tax',
    'payroll calculator for oregon with progressive tax',
    'payroll calculator for iowa with progressive tax',
    'payroll calculator for kentucky with progressive tax',
    'payroll calculator for oklahoma with progressive tax',
    'payroll calculator for missouri with progressive tax',
    'payroll calculator for arkansas with progressive tax',
    'payroll calculator for alabama with progressive tax',
    'payroll calculator for mississippi with progressive tax',
    'payroll calculator for louisiana with progressive tax',
    'payroll calculator for new mexico with progressive tax',
    'payroll calculator for hawaii with progressive tax',
    'payroll calculator for south carolina with progressive tax',
    'payroll calculator for west virginia with progressive tax',
    'payroll calculator for delaware with progressive tax',
    'payroll calculator for connecticut with progressive tax',
    'payroll calculator for rhode island with progressive tax',
    'payroll calculator for vermont with progressive tax',
    'payroll calculator for maine with progressive tax',
    'payroll calculator for new hampshire with no income tax',
    'payroll calculator for alaska with no income tax',
    'payroll calculator for wyoming with no income tax',
    'payroll calculator for south dakota with no income tax',
    'payroll calculator for nevada with no income tax',
    'payroll calculator for washington with no income tax',
    'payroll calculator for tennessee with no income tax',
    'payroll calculator with social security tax calculation',
    'payroll calculator with medicare tax calculation',
    'payroll calculator with federal unemployment tax',
    'payroll calculator with state unemployment tax',
    'payroll calculator with workers compensation insurance',
    'payroll calculator with disability insurance premiums',
    'payroll calculator with health insurance deductions',
    'payroll calculator with dental insurance deductions',
    'payroll calculator with vision insurance deductions',
    'payroll calculator with retirement plan contributions',
    'payroll calculator with 401k deductions and matching',
    'payroll calculator with ira contributions',
    'payroll calculator with hsa contributions',
    'payroll calculator with fsa contributions',
    'payroll calculator with dependent care fsa',
    'payroll calculator with commuter benefits',
    'payroll calculator with union dues',
    'payroll calculator with garnishment calculations',
    'payroll calculator with child support deductions',
    'payroll calculator with alimony payments',
    'payroll calculator with tax levy deductions',
    'payroll calculator for budget planning and forecasting',
    'payroll calculator for cash flow management',
    'payroll calculator for financial reporting',
    'payroll calculator for accounting purposes',
    'payroll calculator for audit preparation',
    'payroll calculator for compliance checking',
    'payroll calculator for tax filing preparation',
    'payroll calculator for w2 form generation',
    'payroll calculator for 1099 form generation',
    'payroll calculator for quarterly tax estimates',
    'payroll calculator for annual tax planning'
  ];

  const allKeywords = [...singleKeywords, ...twoWordKeywords, ...longTailKeywords].join(', ');

  return (
    <>
      <Head>
        {/* Basic Meta */}
        <html lang="en" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={allKeywords} />
        <meta name="author" content="Calci Financial Tools" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        
        {/* Additional Meta Tags */}
        <meta name="subject" content="Payroll Calculator & Salary Estimation" />
        <meta name="classification" content="Payroll, HR, Finance, Calculators, Compensation" />
        <meta name="topic" content="Payroll Calculation and Salary Estimation" />
        <meta name="summary" content="Free online payroll calculator for employees and employers" />
        <meta name="url" content={`${siteUrl}/payroll-calculator`} />
        
        {/* Verification & Ownership */}
        <meta name="google-site-verification" content="your_verification_code" />
        <meta name="msvalidate.01" content="your_bing_verification" />
        
        {/* Location & Business */}
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="United States" />
        <meta name="geo.position" content="39.8283;-98.5795" />
        <meta name="ICBM" content="39.8283, -98.5795" />
        
        {/* Canonical */}
        <link rel="canonical" href={`${siteUrl}/payroll-calculator`} />
        
        {/* Alternate Languages */}
        <link rel="alternate" href={`${siteUrl}/payroll-calculator`} hrefLang="x-default" />
        <link rel="alternate" href={`${siteUrl}/payroll-calculator`} hrefLang="en" />
        <link rel="alternate" href={`${siteUrl}/es/payroll-calculator`} hrefLang="es" />
        
        {/* Preload & Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/payroll-calculator`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={`${siteUrl}/images/payroll-calculator-preview.jpg`} />
        <meta property="og:image:alt" content="Payroll Calculator Interface for Salary Estimation" />
        <meta property="og:site_name" content="Calci Financial Calculators" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:see_also" content={siteUrl} />
        
        {/* Facebook */}
        <meta property="fb:app_id" content="your_facebook_app_id" />
        <meta property="fb:pages" content="your_facebook_page_id" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@calcifinance" />
        <meta name="twitter:creator" content="@calcifinance" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={`${siteUrl}/images/payroll-calculator-preview.jpg`} />
        <meta name="twitter:image:alt" content="Free Payroll Calculator for Employees and Employers" />
        
        {/* Additional Social */}
        <meta name="pinterest" content="nopin" description="Free payroll calculator for salary estimation" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: pageTitle,
            description: pageDescription,
            url: `${siteUrl}/payroll-calculator`,
            mainEntity: {
              '@type': 'SoftwareApplication',
              name: 'Payroll Calculator',
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'Any',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD'
              },
              description: 'Free online payroll calculator for calculating take-home pay, taxes, deductions, and overtime for employees and employers across all industries.',
              featureList: [
                'Take-home pay calculation',
                'Tax withholding estimation',
                'Overtime pay calculation',
                'Multiple deduction support',
                'Industry-specific payroll scenarios'
              ],
              processorRequirements: 'Web browser',
              permission: 'No special permissions required'
            },
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
                { '@type': 'ListItem', position: 2, name: 'Payroll Calculator', item: `${siteUrl}/payroll-calculator` }
              ]
            },
            publisher: {
              '@type': 'Organization',
              name: 'Calci Financial Tools',
              url: siteUrl,
              logo: `${siteUrl}/images/logo.png`,
              sameAs: [
                'https://twitter.com/calcifinance',
                'https://www.linkedin.com/company/calci-finance',
                'https://www.facebook.com/calcifinance'
              ]
            }
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowToTool',
            name: 'Payroll Calculator',
            description: 'A tool for calculating payroll, take-home pay, taxes, and deductions for employees',
            url: `${siteUrl}/payroll-calculator`,
            step: [
              {
                '@type': 'HowToStep',
                name: 'Enter Hourly Rate and Hours',
                text: 'Input your hourly wage rate and regular hours worked per pay period'
              },
              {
                '@type': 'HowToStep',
                name: 'Add Overtime Information',
                text: 'Include any overtime hours and rates for accurate pay calculation'
              },
              {
                '@type': 'HowToStep',
                name: 'Set Tax and Deduction Rates',
                text: 'Enter your estimated tax rate and any additional deductions'
              },
              {
                '@type': 'HowToStep',
                name: 'Calculate Payroll',
                text: 'View your gross pay, net take-home pay, and detailed breakdown'
              }
            ],
            tool: ['Hourly rate calculator', 'Overtime calculator', 'Tax estimator', 'Deduction tracker'],
            about: {
              '@type': 'Thing',
              name: 'Employee Compensation Calculation'
            },
            audience: {
              '@type': 'Audience',
              audienceType: ['Employees', 'Employers', 'HR Professionals', 'Small Business Owners', 'Payroll Administrators']
            }
          })}
        </script>

        {/* Additional FAQ Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'Is this payroll calculator completely free to use?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes, our payroll calculator is 100% free with no hidden costs, registration requirements, or usage limits. Both employees and employers can use it for unlimited payroll calculations.'
                }
              },
              {
                '@type': 'Question',
                name: 'What is the difference between gross pay and net pay?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Gross pay is your total earnings before any deductions, while net pay (take-home pay) is the amount you receive after taxes, insurance, retirement contributions, and other deductions are subtracted.'
                }
              },
              {
                '@type': 'Question',
                name: 'How do I calculate overtime pay?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Overtime is typically paid at 1.5 times your regular hourly rate for hours worked beyond 40 per week. Some states and industries may have different overtime rules and rates.'
                }
              },
              {
                '@type': 'Question',
                name: 'What taxes are typically deducted from payroll?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Common payroll taxes include federal income tax, state income tax (where applicable), Social Security tax (6.2%), Medicare tax (1.45%), and potentially local taxes depending on your location.'
                }
              },
              {
                '@type': 'Question',
                name: 'Can employers use this calculator for multiple employees?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes, employers can use this calculator for multiple employees by performing separate calculations for each employee. For bulk payroll processing, consider dedicated payroll software.'
                }
              },
              {
                '@type': 'Question',
                name: 'How accurate are the payroll calculations?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'This calculator provides reliable estimates based on standard payroll formulas. Actual payroll amounts may vary based on specific tax brackets, additional deductions, and local regulations.'
                }
              },
              {
                '@type': 'Question',
                name: 'What common deductions should I include?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Common deductions include health insurance premiums, retirement contributions (401k, IRA), flexible spending accounts, union dues, garnishments, and other voluntary or required deductions.'
                }
              }
            ]
          })}
        </script>
      </Head>

      {/* Gap above content */}
      <div className={styles.spacerTop}></div>

      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Payroll Calculator</h1>
          <p className={styles.subtitle}>
            Calculate your take-home pay after taxes and deductions.
          </p>
        </section>

        {/* Calculator Section */}
        <section>
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
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
                <span className="taxpro-btn-label">Calculate Payroll</span>
                <span className="taxpro-btn-arrow">→</span>
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
        </section>

        {/* Info Section */}
        <section className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h3>Understanding Your Paycheck</h3>
            <p>
              Your take-home pay is determined by several factors including your hourly rate, hours worked, overtime, taxes, and deductions. This calculator helps you estimate your <strong>net pay</strong> after all these considerations.
            </p>

            <h4>How to Use This Calculator</h4>
            <p>
              Enter your <strong>hourly rate</strong>, <strong>regular hours worked</strong>, and any <strong>overtime</strong> information. Then include your estimated <strong>tax rate</strong> and any <strong>deductions</strong> (like health insurance or retirement contributions) to get an accurate estimate of your take-home pay.
            </p>

            <h4>Key Payroll Concepts</h4>
            <div className={styles.formula}>
              <code>Net Pay = (Regular Pay + Overtime Pay) - Taxes - Deductions</code>
            </div>
            <p>
              Regular pay is calculated up to 40 hours per week (standard full-time work week in the US). Overtime is typically paid at 1.5 times your regular rate for hours worked beyond 40.
            </p>

            <h4>Important Terms</h4>
            <ul className={styles.list}>
              <li><strong>Gross Pay:</strong> Total earnings before deductions</li>
              <li><strong>Net Pay:</strong> Take-home pay after all deductions</li>
              <li><strong>Overtime Pay:</strong> Additional pay for hours worked beyond standard work week</li>
              <li><strong>Tax Withholding:</strong> Estimated taxes deducted from your paycheck</li>
            </ul>

            <h4>Common Deductions</h4>
            <ul className={styles.list}>
              <li><strong>Federal/State Taxes:</strong> Required payroll taxes</li>
              <li><strong>Social Security/Medicare:</strong> FICA contributions</li>
              <li><strong>Health Insurance:</strong> Premium payments</li>
              <li><strong>Retirement:</strong> 401(k) or other retirement contributions</li>
            </ul>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <h2 className={styles.ctaSectionHeading}>
            Free Financial Planning Tools: Budget, Invest & Plan Retirement
          </h2>
          <p className={styles.ctaSectionSubtext}>
            Free Financial Planning Tools – Try Now
          </p>
          <Link href="/suite" passHref legacyBehavior>
            <a
              className={styles.ctaButton}
              ref={ctaButtonRef}
              onMouseMove={handleMouseMove}
            >
              <span className="btn-label">Explore All Calculators</span>
              <span className="btn-icon" aria-hidden="true">→</span>
            </a>
          </Link>
        </section>
      </div>

      {/* Gap below content */}
      <div className={styles.spacerBottom}></div>
    </>
  );
};

export default PayrollCalculator;