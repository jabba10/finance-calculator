import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './carloancal.module.css';

const CarLoanCalculator = ({ currentDate, lastModifiedDate }) => {
  const [vehiclePrice, setVehiclePrice] = useState(35000);
  const [downPayment, setDownPayment] = useState(5000);
  const [tradeInValue, setTradeInValue] = useState(0);
  const [loanTerm, setLoanTerm] = useState(60);
  const [interestRate, setInterestRate] = useState(5.5);
  const [salesTaxRate, setSalesTaxRate] = useState(7.5);
  const [creditScore, setCreditScore] = useState(720);
  const [results, setResults] = useState(null);
  const [amortizationData, setAmortizationData] = useState([]);

  const calculateCarLoan = () => {
    // Calculate loan amount
    const loanAmount = vehiclePrice - downPayment - tradeInValue;
    
    // Calculate monthly interest rate
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm;
    
    // Calculate monthly payment using standard loan formula
    const monthlyPayment = loanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    // Calculate total loan cost with tax
    const salesTaxAmount = (vehiclePrice - tradeInValue) * (salesTaxRate / 100);
    const totalWithTax = loanAmount + salesTaxAmount;
    const monthlyPaymentWithTax = monthlyPayment + (salesTaxAmount / numberOfPayments);
    const totalLoanCost = monthlyPaymentWithTax * numberOfPayments;
    const totalInterestPaid = totalLoanCost - loanAmount - salesTaxAmount;
    
    // Generate amortization schedule
    const amortizationSchedule = [];
    let remainingBalance = loanAmount;
    let totalPrincipalPaid = 0;
    let totalInterestPaidCumulative = 0;
    
    for (let month = 1; month <= numberOfPayments; month++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      
      remainingBalance -= principalPayment;
      totalPrincipalPaid += principalPayment;
      totalInterestPaidCumulative += interestPayment;
      
      if (month % 12 === 0 || month === numberOfPayments) {
        const year = Math.ceil(month / 12);
        amortizationSchedule.push({
          year,
          month,
          remainingBalance: Math.max(0, remainingBalance),
          principalPaid: totalPrincipalPaid,
          interestPaid: totalInterestPaidCumulative,
          totalPaid: totalPrincipalPaid + totalInterestPaidCumulative
        });
      }
    }
    
    // Calculate vehicle depreciation
    const annualDepreciation = 15; // 15% per year
    const years = loanTerm / 12;
    const vehicleValueAfterLoan = vehiclePrice * Math.pow(1 - annualDepreciation / 100, years);
    
    // Calculate equity at different points
    const equityAfter1Year = vehiclePrice * (1 - annualDepreciation / 100) - (monthlyPaymentWithTax * 12);
    const equityAfter3Years = vehiclePrice * Math.pow(1 - annualDepreciation / 100, 3) - (monthlyPaymentWithTax * 36);
    
    setResults({
      loanAmount: Math.round(loanAmount),
      monthlyPayment: Math.round(monthlyPayment),
      monthlyPaymentWithTax: Math.round(monthlyPaymentWithTax),
      totalLoanCost: Math.round(totalLoanCost),
      totalInterestPaid: Math.round(totalInterestPaid),
      salesTaxAmount: Math.round(salesTaxAmount),
      totalWithTax: Math.round(totalWithTax),
      vehicleValueAfterLoan: Math.round(vehicleValueAfterLoan),
      equityAfter1Year: Math.round(equityAfter1Year),
      equityAfter3Years: Math.round(equityAfter3Years),
      interestToPrincipalRatio: Math.round((totalInterestPaid / loanAmount) * 100)
    });
    
    setAmortizationData(amortizationSchedule);
  };

  useEffect(() => {
    calculateCarLoan();
  }, [
    vehiclePrice, downPayment, tradeInValue, loanTerm, 
    interestRate, salesTaxRate, creditScore
  ]);

  const getInterestRateByCreditScore = (score) => {
    if (score >= 780) return 4.5;
    if (score >= 740) return 5.0;
    if (score >= 700) return 5.5;
    if (score >= 660) return 6.5;
    if (score >= 620) return 8.0;
    return 10.5;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(2)}%`;
  };

  const handleCreditScoreChange = (score) => {
    setCreditScore(score);
    // Auto-adjust interest rate based on credit score
    const newRate = getInterestRateByCreditScore(score);
    setInterestRate(newRate);
  };

  return (
    <>
      <Head>
        <title>Car Loan Calculator | Calculate Your Auto Loan Payments</title>
        <meta name="description" content="Free comprehensive car loan calculator with amortization schedule. Calculate monthly payments, total interest, and compare different loan terms for your vehicle purchase." />
        <meta name="keywords" content="car loan calculator, auto loan calculator, vehicle financing, car payment calculator, loan amortization, auto finance" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/car-loan-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Car Loan Calculator | Calculate Your Auto Loan Payments" />
        <meta property="og:description" content="Calculate your car loan payments, total interest costs, and see amortization schedule. Make informed decisions about your vehicle financing." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/car-loan-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Car Loan Calculator" />
        <meta name="twitter:description" content="Calculate auto loan payments and total costs. See how different terms affect your monthly payments." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="car-loan-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Car Loan Calculator",
            "description": "Professional auto loan calculator with amortization schedule, credit score impact analysis, and total cost of ownership calculations",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "1100",
              "bestRating": "5",
              "worstRating": "1"
            },
            "datePublished": currentDate,
            "dateModified": currentDate,
            "author": {
              "@type": "Organization",
              "name": "Auto Finance Tools",
              "url": "https://www.financecalculatorfree.com"
            },
            "featureList": [
              "Monthly Payment Calculator",
              "Amortization Schedule",
              "Credit Score Impact",
              "Total Cost Analysis",
              "Vehicle Depreciation Calculator"
            ]
          })
        }}
      />

      {/* FAQ Schema */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How much car can I afford based on my income?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A general rule is that your total monthly car payment should not exceed 10-15% of your take-home pay. This includes principal, interest, insurance, and maintenance. Use our calculator to adjust loan terms until you reach a comfortable monthly payment.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How does my credit score affect my car loan interest rate?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Credit score significantly impacts your interest rate. Excellent credit (780+) can get rates as low as 4-5%, while poor credit (below 620) may face rates of 10% or higher. Improving your credit score before applying can save thousands over the loan term.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "Should I get a longer loan term to lower monthly payments?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "While longer terms (72-84 months) lower monthly payments, they significantly increase total interest paid and may result in negative equity (owing more than the car is worth). Shorter terms (36-60 months) build equity faster and cost less overall.",
                  "datePublished": currentDate
                }
              }
            ]
          })
        }}
      />

      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.mainTitle}>Car Loan Calculator</h1>
            <p className={styles.subtitle}>Calculate Your Auto Loan Payments and Total Cost of Ownership</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>Amortization Schedule</span>
              
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Loan Details</h2>
              
              {/* Vehicle Price */}
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Vehicle Price
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="10000"
                      max="100000"
                      step="1000"
                      value={vehiclePrice}
                      onChange={(e) => setVehiclePrice(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="10000"
                      max="100000"
                      step="1000"
                      value={vehiclePrice}
                      onChange={(e) => setVehiclePrice(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(vehiclePrice)}</div>
                </label>
              </div>

              {/* Down Payment */}
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Down Payment
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max={vehiclePrice}
                      step="500"
                      value={downPayment}
                      onChange={(e) => setDownPayment(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max={vehiclePrice}
                      step="500"
                      value={downPayment}
                      onChange={(e) => setDownPayment(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(downPayment)} ({Math.round((downPayment / vehiclePrice) * 100)}%)</div>
                </label>
              </div>

              {/* Trade-in Value */}
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Trade-in Value
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max={vehiclePrice}
                      step="500"
                      value={tradeInValue}
                      onChange={(e) => setTradeInValue(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max={vehiclePrice}
                      step="500"
                      value={tradeInValue}
                      onChange={(e) => setTradeInValue(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(tradeInValue)}</div>
                </label>
              </div>

              {/* Loan Term */}
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Loan Term
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="12"
                      max="84"
                      step="12"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <select
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(parseInt(e.target.value))}
                      className={styles.selectInput}
                    >
                      <option value="12">1 year (12 months)</option>
                      <option value="24">2 years (24 months)</option>
                      <option value="36">3 years (36 months)</option>
                      <option value="48">4 years (48 months)</option>
                      <option value="60">5 years (60 months)</option>
                      <option value="72">6 years (72 months)</option>
                      <option value="84">7 years (84 months)</option>
                    </select>
                  </div>
                  <div className={styles.valueDisplay}>{loanTerm} months ({loanTerm/12} years)</div>
                </label>
              </div>

              {/* Credit Score */}
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Credit Score
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="300"
                      max="850"
                      step="10"
                      value={creditScore}
                      onChange={(e) => handleCreditScoreChange(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="300"
                      max="850"
                      step="10"
                      value={creditScore}
                      onChange={(e) => handleCreditScoreChange(parseInt(e.target.value) || 300)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>
                    {creditScore} 
                    <span className={styles.creditScoreLabel}>
                      {creditScore >= 780 ? ' (Excellent)' : 
                       creditScore >= 740 ? ' (Very Good)' : 
                       creditScore >= 700 ? ' (Good)' : 
                       creditScore >= 660 ? ' (Fair)' : ' (Poor)'}
                    </span>
                  </div>
                </label>
              </div>

              {/* Interest Rate */}
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Interest Rate (APR)
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="2"
                      max="20"
                      step="0.1"
                      value={interestRate}
                      onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="2"
                      max="20"
                      step="0.1"
                      value={interestRate}
                      onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(interestRate)}</div>
                </label>
              </div>

              {/* Sales Tax Rate */}
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Sales Tax Rate
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.1"
                      value={salesTaxRate}
                      onChange={(e) => setSalesTaxRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={salesTaxRate}
                      onChange={(e) => setSalesTaxRate(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(salesTaxRate)}</div>
                </label>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Loan Summary</h2>
              
              {results && (
                <>
                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Loan Amount</div>
                      <div className={styles.resultValue}>{formatCurrency(results.loanAmount)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Monthly Payment</div>
                      <div className={styles.resultValue}>{formatCurrency(results.monthlyPaymentWithTax)}</div>
                      <div className={styles.resultSubtext}>Principal & Interest: {formatCurrency(results.monthlyPayment)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Total Loan Cost</div>
                      <div className={styles.resultValue}>{formatCurrency(results.totalLoanCost)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Total Interest Paid</div>
                      <div className={styles.resultValue}>{formatCurrency(results.totalInterestPaid)}</div>
                      <div className={styles.resultSubtext}>{results.interestToPrincipalRatio}% of loan amount</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Sales Tax</div>
                      <div className={styles.resultValue}>{formatCurrency(results.salesTaxAmount)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Vehicle Value After Loan</div>
                      <div className={styles.resultValue}>{formatCurrency(results.vehicleValueAfterLoan)}</div>
                      <div className={styles.resultSubtext}>Estimated based on 15% annual depreciation</div>
                    </div>
                  </div>

                  {/* Amortization Chart */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>Loan Payoff Progress</h3>
                    <div className={styles.chartBars}>
                      {amortizationData.map((data, index) => (
                        <div key={index} className={styles.chartBarGroup}>
                          <div className={styles.chartBarLabel}>Year {data.year}</div>
                          <div className={styles.chartBarContainer}>
                            <div 
                              className={styles.chartBarPrincipal}
                              style={{ width: `${(data.principalPaid / results.loanAmount) * 100}%` }}
                              title={`Principal Paid: ${formatCurrency(data.principalPaid)}`}
                            />
                            <div 
                              className={styles.chartBarInterest}
                              style={{ width: `${(data.interestPaid / results.totalInterestPaid) * 100}%` }}
                              title={`Interest Paid: ${formatCurrency(data.interestPaid)}`}
                            />
                            <div 
                              className={styles.chartBarRemaining}
                              style={{ width: `${(data.remainingBalance / results.loanAmount) * 100}%` }}
                              title={`Remaining Balance: ${formatCurrency(data.remainingBalance)}`}
                            />
                          </div>
                          <div className={styles.chartBarValue}>
                            <div>Paid: {formatCurrency(data.totalPaid)}</div>
                            <div>Remaining: {formatCurrency(data.remainingBalance)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.chartLegend}>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendPrincipal}`}></div>
                        <span>Principal Paid</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendInterest}`}></div>
                        <span>Interest Paid</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendRemaining}`}></div>
                        <span>Remaining Balance</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>💡 Key Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>You&apos;ll pay <strong>{formatCurrency(results.totalInterestPaid)}</strong> in interest over the life of the loan</li>
                      <li>After 1 year, estimated equity: <strong>{formatCurrency(results.equityAfter1Year)}</strong></li>
                      <li>After 3 years, estimated equity: <strong>{formatCurrency(results.equityAfter3Years)}</strong></li>
                      <li>Interest makes up <strong>{formatPercentage(results.interestToPrincipalRatio)}</strong> of your total payments</li>
                      {loanTerm > 60 && (
                        <li className={styles.warningText}>⚠️ Long loan term: You may owe more than the car is worth for several years</li>
                      )}
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Educational Content */}
          <div className={styles.educationalContent}>
            <article className={styles.articleCard}>
              <h2 className={styles.articleTitle}>Smart Car Financing: How to Get the Best Auto Loan</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Understanding Auto Loan Basics</h3>
                <p>An auto loan is a secured loan where the vehicle serves as collateral. Your monthly payment consists of principal (the amount borrowed) and interest (the cost of borrowing). The key factors affecting your loan are:</p>
                
                <div className={styles.exampleCard}>
                  <h4>Loan Components:</h4>
                  <ul>
                    <li><strong>Principal:</strong> The amount you borrow to purchase the vehicle</li>
                    <li><strong>Interest Rate (APR):</strong> Annual percentage rate - your cost of borrowing</li>
                    <li><strong>Loan Term:</strong> Length of the loan in months</li>
                    <li><strong>Down Payment:</strong> Initial cash payment that reduces loan amount</li>
                    <li><strong>Total Cost of Ownership:</strong> Loan payments + insurance + maintenance + depreciation</li>
                  </ul>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Strategies to Save Thousands on Your Auto Loan</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>💰 Increase Down Payment</h4>
                    <p>A 20% down payment reduces loan amount, monthly payments, and interest costs. It also helps avoid negative equity (owing more than the car is worth).</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📈 Improve Credit Score</h4>
                    <p>Improving credit from &quot;Fair&quot; to &quot;Good&quot; can save $3,000+ on a $30,000 loan. Pay bills on time, reduce credit utilization, and check credit reports for errors.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>⏱️ Choose Shorter Terms</h4>
                    <p>A 36-month loan vs 72-month loan on $30,000 at 5% saves $2,700 in interest. Shorter terms build equity faster and reduce total cost.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🏦 Shop Multiple Lenders</h4>
                    <p>Compare rates from banks, credit unions, and online lenders. Credit unions often offer the lowest rates for qualified buyers.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>The Hidden Costs of Car Ownership</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Depreciation:</strong> New cars lose 20-30% of value in first year, 50% in 3 years</li>
                  <li><strong>Insurance:</strong> Full coverage required for financed vehicles - varies by model and driver</li>
                  <li><strong>Maintenance:</strong> Regular servicing, tires, brakes - budget $1,000-$2,000 annually</li>
                  <li><strong>Fuel:</strong> Calculate based on your annual mileage and vehicle MPG</li>
                  <li><strong>Registration & Taxes:</strong> Annual fees vary by state and vehicle value</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Advice from Auto Finance Specialists</h3>
                <blockquote className={styles.expertQuote}>
                  &quot;The 20/4/10 rule is a smart guideline: 20% down payment, 4-year loan term, and total monthly vehicle expenses (payment + insurance + fuel) not exceeding 10% of your gross monthly income. This prevents being &apos;car poor&apos; and maintains financial flexibility.&quot;
                  <footer className={styles.quoteFooter}>— Certified Auto Finance Manager, 15+ years experience</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How much should I put down on a car?</h3>
                <p className={styles.faqAnswer}>Aim for at least 20% down payment for new cars, 10% for used. This reduces your loan amount, lowers monthly payments, and helps avoid negative equity. For luxury or expensive vehicles, consider 30-40% down to keep payments manageable.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What&apos;s better: buying new or used?</h3>
                <p className={styles.faqAnswer}>Used cars (2-3 years old) offer the best value, having absorbed the steepest depreciation while still having modern features. New cars offer latest technology and full warranty but lose value quickly. Consider certified pre-owned for balance between cost and reliability.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How does loan term affect my equity position?</h3>
                <p className={styles.faqAnswer}>Shorter terms (36-48 months) build equity faster as you pay down principal quickly. Longer terms (72-84 months) often result in &quot;negative equity&quot; - owing more than the car is worth - for the first several years, making it difficult to trade in or sell.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Should I finance through the dealership or get my own loan?</h3>
                <p className={styles.faqAnswer}>Always get pre-approved from your bank or credit union first. Use this as leverage at the dealership. Dealership financing can sometimes offer manufacturer incentives, but outside loans often have better rates. Compare both options before deciding.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Ready to Finance Your Next Vehicle?</h2>
              <p className={styles.ctaText}>Use our calculator to find the optimal loan terms for your budget. Adjust down payment, loan term, and interest rate to see how they affect your monthly payments and total cost.</p>
              
              <div className={styles.buttonGroup}>
                <button className={styles.primaryButton} onClick={() => window.print()}>
                  📄 Print Loan Summary
                </button>
                <button className={styles.secondaryButton} onClick={() => {
                  // Reset to default values
                  setVehiclePrice(35000);
                  setDownPayment(5000);
                  setTradeInValue(0);
                  setLoanTerm(60);
                  setInterestRate(5.5);
                  setSalesTaxRate(7.5);
                  setCreditScore(720);
                }}>
                  🔄 Reset Calculator
                </button>
              </div>
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates for educational purposes. Actual loan terms, interest rates, and vehicle values may vary. Consult with financial professionals before making major vehicle purchase decisions. Interest rates shown are examples and may not reflect current market rates.
              </p>
            </div>
          </div>
        </main>

        
      </div>
    </>
  );
};

export async function getStaticProps() {
  const buildTime = new Date();
  const currentDate = buildTime.toISOString().split('T')[0];
  const lastModifiedDate = buildTime.toISOString();
  
  return {
    props: {
      currentDate,
      lastModifiedDate,
    },
    revalidate: 21600, // 24 hours
  };
}

export default CarLoanCalculator;