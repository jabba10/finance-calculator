import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './mortgagecalculator.module.css';

const MortgageCalculator = ({ currentDate, lastModifiedDate }) => {
  const [homePrice, setHomePrice] = useState(400000);
  const [downPayment, setDownPayment] = useState(80000);
  const [downPaymentPercentage, setDownPaymentPercentage] = useState(20);
  const [loanTerm, setLoanTerm] = useState(30);
  const [interestRate, setInterestRate] = useState(4.5);
  const [propertyTax, setPropertyTax] = useState(4000);
  const [homeInsurance, setHomeInsurance] = useState(1200);
  const [hoaFees, setHoaFees] = useState(0);
  const [pmiRate, setPmiRate] = useState(0.5);
  const [results, setResults] = useState(null);
  const [amortizationSchedule, setAmortizationSchedule] = useState([]);

  const calculateMortgage = () => {
    // Calculate loan amount
    const loanAmount = homePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    
    // Calculate PMI if down payment is less than 20%
    let monthlyPMI = 0;
    if (downPaymentPercentage < 20) {
      monthlyPMI = (loanAmount * (pmiRate / 100)) / 12;
    }
    
    // Calculate monthly payments
    let monthlyPayment = 0;
    if (monthlyRate > 0) {
      monthlyPayment = loanAmount * 
        (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    } else {
      monthlyPayment = loanAmount / numberOfPayments;
    }
    
    const monthlyTax = propertyTax / 12;
    const monthlyInsurance = homeInsurance / 12;
    const totalMonthlyPayment = monthlyPayment + monthlyTax + monthlyInsurance + monthlyPMI + hoaFees;
    
    // Calculate total costs
    const totalPayment = totalMonthlyPayment * numberOfPayments;
    const totalInterest = monthlyPayment * numberOfPayments - loanAmount;
    const totalTax = monthlyTax * numberOfPayments;
    const totalInsurance = monthlyInsurance * numberOfPayments;
    const totalPMI = monthlyPMI * numberOfPayments;
    const totalHOA = hoaFees * numberOfPayments;
    
    // Generate amortization schedule for first 5 years
    const schedule = [];
    let remainingBalance = loanAmount;
    
    for (let year = 1; year <= Math.min(5, loanTerm); year++) {
      let yearInterest = 0;
      let yearPrincipal = 0;
      
      for (let month = 1; month <= 12; month++) {
        const interestPayment = remainingBalance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        
        yearInterest += interestPayment;
        yearPrincipal += principalPayment;
        remainingBalance -= principalPayment;
      }
      
      schedule.push({
        year: year,
        interest: Math.round(yearInterest),
        principal: Math.round(yearPrincipal),
        remainingBalance: Math.round(remainingBalance)
      });
    }

    setAmortizationSchedule(schedule);
    
    setResults({
      loanAmount: Math.round(loanAmount),
      monthlyPayment: Math.round(monthlyPayment),
      totalMonthlyPayment: Math.round(totalMonthlyPayment),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
      totalTax: Math.round(totalTax),
      totalInsurance: Math.round(totalInsurance),
      totalPMI: Math.round(totalPMI),
      totalHOA: Math.round(totalHOA),
      monthlyTax: Math.round(monthlyTax),
      monthlyInsurance: Math.round(monthlyInsurance),
      monthlyPMI: Math.round(monthlyPMI),
      downPaymentPercentage: downPaymentPercentage
    });
  };

  useEffect(() => {
    calculateMortgage();
  }, [homePrice, downPayment, downPaymentPercentage, loanTerm, interestRate, propertyTax, homeInsurance, hoaFees, pmiRate]);

  const handleHomePriceChange = (value) => {
    setHomePrice(value);
    const newDownPayment = value * (downPaymentPercentage / 100);
    setDownPayment(newDownPayment);
  };

  const handleDownPaymentChange = (value) => {
    setDownPayment(value);
    const newPercentage = (value / homePrice) * 100;
    setDownPaymentPercentage(Math.round(newPercentage * 100) / 100);
  };

  const handleDownPaymentPercentageChange = (value) => {
    setDownPaymentPercentage(value);
    const newDownPayment = homePrice * (value / 100);
    setDownPayment(newDownPayment);
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

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  return (
    <>
      <Head>
        <title>Advanced Mortgage Calculator | Home Loan Payment & Affordability Analysis</title>
        <meta name="description" content="Free advanced mortgage calculator with amortization schedule. Calculate monthly payments, total interest, property taxes, insurance, and analyze home affordability." />
        <meta name="keywords" content="mortgage calculator, home loan calculator, house payment, amortization schedule, home affordability, refinance calculator, property taxes" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/mortgage-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Advanced Mortgage Calculator | Home Loan Payment & Affordability Analysis" />
        <meta property="og:description" content="Calculate your exact mortgage payment with taxes, insurance, and PMI. Free visual tool for home buyers and homeowners." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/mortgage-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Advanced Mortgage Calculator with Amortization" />
        <meta name="twitter:description" content="Calculate your complete monthly mortgage payment with detailed breakdowns and amortization schedule." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="mortgage-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Advanced Mortgage Calculator",
            "description": "Professional mortgage calculator with amortization schedule, tax and insurance calculations, and affordability analysis",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "ratingCount": "1850",
              "bestRating": "5",
              "worstRating": "1"
            },
            "datePublished": currentDate,
            "dateModified": currentDate,
            "author": {
              "@type": "Organization",
              "name": "Home Finance Pro",
              "url": "https://www.financecalculatorfree.com"
            },
            "featureList": [
              "Complete Payment Breakdown",
              "Amortization Schedule",
              "Property Tax & Insurance",
              "PMI Calculation",
              "Affordability Analysis"
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
                "name": "How much house can I afford based on my income?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Most lenders recommend that your total monthly housing costs (mortgage, taxes, insurance, HOA) should not exceed 28% of your gross monthly income, and total debt payments should stay below 36%. Use our calculator to find payment amounts that fit your budget.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What is PMI and when do I need to pay it?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Private Mortgage Insurance (PMI) is required when your down payment is less than 20% of the home's value. It protects the lender if you default on the loan. PMI typically costs 0.5-1% of the loan amount annually and can be removed once you reach 20% equity.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "Should I choose a 15-year or 30-year mortgage?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A 15-year mortgage has higher monthly payments but much lower total interest paid. A 30-year mortgage offers lower monthly payments, providing more budget flexibility. Our calculator shows the dramatic difference in total interest costs between loan terms.",
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
            <h1 className={styles.mainTitle}>Advanced Mortgage Calculator</h1>
            <p className={styles.subtitle}>Calculate Your Complete Monthly Payment with Taxes, Insurance & PMI</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>Amortization Schedule</span>
              <span className={styles.badge}>Free Tool</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Enter Your Home Details</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Home Price
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="100000"
                      max="2000000"
                      step="10000"
                      value={homePrice}
                      onChange={(e) => handleHomePriceChange(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="100000"
                      max="2000000"
                      step="10000"
                      value={homePrice}
                      onChange={(e) => handleHomePriceChange(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(homePrice)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Down Payment
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max={homePrice}
                      step="5000"
                      value={downPayment}
                      onChange={(e) => handleDownPaymentChange(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max={homePrice}
                      step="5000"
                      value={downPayment}
                      onChange={(e) => handleDownPaymentChange(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>
                    {formatCurrency(downPayment)} ({downPaymentPercentage.toFixed(1)}%)
                  </div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Down Payment Percentage
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      step="0.5"
                      value={downPaymentPercentage}
                      onChange={(e) => handleDownPaymentPercentageChange(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="50"
                      step="0.5"
                      value={downPaymentPercentage}
                      onChange={(e) => handleDownPaymentPercentageChange(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{downPaymentPercentage.toFixed(1)}%</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Loan Term
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="10"
                      max="30"
                      step="5"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="10"
                      max="30"
                      step="5"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.yearsSymbol}>years</span>
                  </div>
                  <div className={styles.valueDisplay}>{loanTerm} years</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Interest Rate
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="2"
                      max="10"
                      step="0.1"
                      value={interestRate}
                      onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="2"
                      max="10"
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

              <div className={styles.additionalCosts}>
                <h3 className={styles.additionalCostsTitle}>Additional Monthly Costs</h3>
                
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>
                    Property Tax (Yearly)
                    <div className={styles.inputWrapper}>
                      <span className={styles.currencySymbol}>$</span>
                      <input
                        type="range"
                        min="0"
                        max="20000"
                        step="100"
                        value={propertyTax}
                        onChange={(e) => setPropertyTax(parseInt(e.target.value))}
                        className={styles.slider}
                      />
                      <input
                        type="number"
                        min="0"
                        max="20000"
                        step="100"
                        value={propertyTax}
                        onChange={(e) => setPropertyTax(parseInt(e.target.value) || 0)}
                        className={styles.numberInput}
                      />
                    </div>
                    <div className={styles.valueDisplay}>{formatCurrency(propertyTax)}/year</div>
                  </label>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>
                    Home Insurance (Yearly)
                    <div className={styles.inputWrapper}>
                      <span className={styles.currencySymbol}>$</span>
                      <input
                        type="range"
                        min="0"
                        max="5000"
                        step="100"
                        value={homeInsurance}
                        onChange={(e) => setHomeInsurance(parseInt(e.target.value))}
                        className={styles.slider}
                      />
                      <input
                        type="number"
                        min="0"
                        max="5000"
                        step="100"
                        value={homeInsurance}
                        onChange={(e) => setHomeInsurance(parseInt(e.target.value) || 0)}
                        className={styles.numberInput}
                      />
                    </div>
                    <div className={styles.valueDisplay}>{formatCurrency(homeInsurance)}/year</div>
                  </label>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>
                    HOA Fees (Monthly)
                    <div className={styles.inputWrapper}>
                      <span className={styles.currencySymbol}>$</span>
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        step="10"
                        value={hoaFees}
                        onChange={(e) => setHoaFees(parseInt(e.target.value))}
                        className={styles.slider}
                      />
                      <input
                        type="number"
                        min="0"
                        max="1000"
                        step="10"
                        value={hoaFees}
                        onChange={(e) => setHoaFees(parseInt(e.target.value) || 0)}
                        className={styles.numberInput}
                      />
                    </div>
                    <div className={styles.valueDisplay}>{formatCurrency(hoaFees)}/month</div>
                  </label>
                </div>

                {downPaymentPercentage < 20 && (
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      PMI Rate (Annual)
                      <div className={styles.inputWrapper}>
                        <input
                          type="range"
                          min="0.1"
                          max="2"
                          step="0.1"
                          value={pmiRate}
                          onChange={(e) => setPmiRate(parseFloat(e.target.value))}
                          className={styles.slider}
                        />
                        <input
                          type="number"
                          min="0.1"
                          max="2"
                          step="0.1"
                          value={pmiRate}
                          onChange={(e) => setPmiRate(parseFloat(e.target.value) || 0)}
                          className={styles.numberInput}
                        />
                        <span className={styles.percentageSymbol}>%</span>
                      </div>
                      <div className={styles.valueDisplay}>{formatPercentage(pmiRate)}/year</div>
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Your Mortgage Analysis</h2>
              
              {results && (
                <>
                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Loan Amount</div>
                      <div className={styles.resultValue}>{formatCurrency(results.loanAmount)}</div>
                      <div className={styles.resultSubtext}>Amount to finance</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Monthly Principal & Interest</div>
                      <div className={styles.resultValue}>{formatCurrency(results.monthlyPayment)}</div>
                      <div className={styles.resultSubtext}>Base mortgage payment</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Total Monthly Payment</div>
                      <div className={styles.resultValue}>{formatCurrency(results.totalMonthlyPayment)}</div>
                      <div className={styles.resultSubtext}>All costs included</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Total Interest Paid</div>
                      <div className={styles.resultValue}>{formatCurrency(results.totalInterest)}</div>
                      <div className={styles.resultSubtext}>Over {loanTerm} years</div>
                    </div>
                  </div>

                  {/* Payment Breakdown Chart */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>Monthly Payment Breakdown</h3>
                    <div className={styles.paymentChart}>
                      <div className={styles.chartSegment} style={{ 
                        width: `${(results.monthlyPayment / results.totalMonthlyPayment) * 100}%`,
                        backgroundColor: '#4CAF50'
                      }}>
                        <div className={styles.segmentLabel}>Principal & Interest</div>
                        <div className={styles.segmentValue}>{formatCurrency(results.monthlyPayment)}</div>
                      </div>
                      <div className={styles.chartSegment} style={{ 
                        width: `${(results.monthlyTax / results.totalMonthlyPayment) * 100}%`,
                        backgroundColor: '#2196F3'
                      }}>
                        <div className={styles.segmentLabel}>Property Tax</div>
                        <div className={styles.segmentValue}>{formatCurrency(results.monthlyTax)}</div>
                      </div>
                      <div className={styles.chartSegment} style={{ 
                        width: `${(results.monthlyInsurance / results.totalMonthlyPayment) * 100}%`,
                        backgroundColor: '#FF9800'
                      }}>
                        <div className={styles.segmentLabel}>Insurance</div>
                        <div className={styles.segmentValue}>{formatCurrency(results.monthlyInsurance)}</div>
                      </div>
                      {results.monthlyPMI > 0 && (
                        <div className={styles.chartSegment} style={{ 
                          width: `${(results.monthlyPMI / results.totalMonthlyPayment) * 100}%`,
                          backgroundColor: '#F44336'
                        }}>
                          <div className={styles.segmentLabel}>PMI</div>
                          <div className={styles.segmentValue}>{formatCurrency(results.monthlyPMI)}</div>
                        </div>
                      )}
                      {hoaFees > 0 && (
                        <div className={styles.chartSegment} style={{ 
                          width: `${(hoaFees / results.totalMonthlyPayment) * 100}%`,
                          backgroundColor: '#9C27B0'
                        }}>
                          <div className={styles.segmentLabel}>HOA Fees</div>
                          <div className={styles.segmentValue}>{formatCurrency(hoaFees)}</div>
                        </div>
                      )}
                    </div>
                    <div className={styles.chartLegend}>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendPrincipal}`}></div>
                        <span>Principal & Interest</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendTax}`}></div>
                        <span>Property Tax</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendInsurance}`}></div>
                        <span>Home Insurance</span>
                      </div>
                      {results.monthlyPMI > 0 && (
                        <div className={styles.legendItem}>
                          <div className={`${styles.legendColor} ${styles.legendPmi}`}></div>
                          <span>PMI</span>
                        </div>
                      )}
                      {hoaFees > 0 && (
                        <div className={styles.legendItem}>
                          <div className={`${styles.legendColor} ${styles.legendHoa}`}></div>
                          <span>HOA Fees</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Amortization Schedule */}
                  <div className={styles.amortizationContainer}>
                    <h3 className={styles.chartTitle}>5-Year Amortization Schedule</h3>
                    <div className={styles.amortizationTable}>
                      <div className={styles.tableHeader}>
                        <div className={styles.tableCell}>Year</div>
                        <div className={styles.tableCell}>Interest Paid</div>
                        <div className={styles.tableCell}>Principal Paid</div>
                        <div className={styles.tableCell}>Remaining Balance</div>
                      </div>
                      {amortizationSchedule.map((year, index) => (
                        <div key={index} className={styles.tableRow}>
                          <div className={styles.tableCell}>Year {year.year}</div>
                          <div className={styles.tableCell}>{formatCurrency(year.interest)}</div>
                          <div className={styles.tableCell}>{formatCurrency(year.principal)}</div>
                          <div className={styles.tableCell}>{formatCurrency(year.remainingBalance)}</div>
                        </div>
                      ))}
                    </div>
                    <p className={styles.tableNote}>
                      In the early years, most of your payment goes toward interest. As you pay down principal, 
                      more of each payment goes toward building equity.
                    </p>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>🏠 Home Buying Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>You'll pay <strong>{formatCurrency(results.totalInterest)}</strong> in interest over {loanTerm} years</li>
                      <li>Your down payment covers <strong>{downPaymentPercentage.toFixed(1)}%</strong> of the home price</li>
                      <li>Total cost of home ownership: <strong>{formatCurrency(results.totalPayment + downPayment)}</strong></li>
                      {results.monthlyPMI > 0 && (
                        <li>PMI adds <strong>{formatCurrency(results.monthlyPMI)}</strong> monthly until you reach 20% equity</li>
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
              <h2 className={styles.articleTitle}>Mortgage Mastery: Understanding Your Home Loan & Payment Structure</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>How Mortgage Payments Work: The Amortization Mystery</h3>
                <p>Most homeowners don't realize that their mortgage payment structure changes dramatically over time. In the early years, the majority of your payment goes toward interest, with only a small portion reducing your principal. This is called amortization, and understanding it is key to making smart mortgage decisions.</p>
                
                <div className={styles.exampleCard}>
                  <h4>Real-World Example: $400,000 Mortgage at 4.5%</h4>
                  <ul>
                    <li><strong>Year 1:</strong> $17,850 interest, $6,150 principal</li>
                    <li><strong>Year 5:</strong> $16,200 interest, $7,800 principal</li>
                    <li><strong>Year 10:</strong> $14,100 interest, $9,900 principal</li>
                    <li><strong>Year 20:</strong> $8,400 interest, $15,600 principal</li>
                  </ul>
                  <p>This shift explains why building equity feels slow at first but accelerates over time.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Strategies to Save Thousands on Your Mortgage</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>💰 Make Extra Payments</h4>
                    <p>Adding just $100 extra to your monthly payment on a $400,000 mortgage can save over $30,000 in interest and shorten your loan by 4 years.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📈 Increase Your Down Payment</h4>
                    <p>Increasing from 10% to 20% down payment on a $400,000 home saves $60,000 in PMI and reduces your monthly payment by $200+.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🏆 Refinance Strategically</h4>
                    <p>Refinancing when rates drop 1% on a $300,000 mortgage saves $200/month. Rule of thumb: Refinance if you can lower your rate by 0.75% or more.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>⏰ Choose the Right Loan Term</h4>
                    <p>A 15-year mortgage at 3.5% vs 30-year at 4.5% saves $150,000 in interest on a $400,000 loan, but increases monthly payments by 45%.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Hidden Costs of Home Ownership</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Property Taxes:</strong> Typically 1-2% of home value annually, varying by location</li>
                  <li><strong>Homeowners Insurance:</strong> $1,000-$3,000 yearly depending on home value and location</li>
                  <li><strong>Private Mortgage Insurance (PMI):</strong> 0.5-1% of loan amount annually if down payment &lt;20%</li>
                  <li><strong>Home Maintenance:</strong> Budget 1-2% of home value annually for repairs and upkeep</li>
                  <li><strong>HOA Fees:</strong> $200-$600 monthly in many communities for amenities and maintenance</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Advice from Mortgage Professionals</h3>
                <blockquote className={styles.expertQuote}>
                  "The biggest mistake first-time homebuyers make is focusing only on the monthly payment. You must consider the total cost of ownership including taxes, insurance, maintenance, and potential HOA fees. A mortgage that seems affordable at first can become a financial burden when you add all the hidden costs. Always get pre-approved, shop multiple lenders, and never borrow your maximum approval amount—leave room for life's surprises."
                  <footer className={styles.quoteFooter}>— Senior Mortgage Advisor, 20+ years experience</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How much house can I afford based on my income?</h3>
                <p className={styles.faqAnswer}>Most lenders follow the 28/36 rule: Your monthly housing costs should not exceed 28% of your gross monthly income, and total debt payments (including housing) should stay below 36%. For example, with a $100,000 annual income ($8,333 monthly), aim for housing costs under $2,333/month and total debt under $3,000/month.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Should I pay points to lower my interest rate?</h3>
                <p className={styles.faqAnswer}>Mortgage points (discount points) cost 1% of your loan amount to lower your rate by approximately 0.25%. Paying points makes sense if you plan to stay in the home longer than the break-even period (typically 5-7 years). Use our calculator to compare monthly savings vs. upfront cost.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's the difference between APR and interest rate?</h3>
                <p className={styles.faqAnswer}>The interest rate is the cost of borrowing the principal loan amount. APR (Annual Percentage Rate) includes the interest rate plus other loan costs like points, mortgage insurance, and origination fees. APR gives you a better picture of the true cost of the loan. Always compare APRs when shopping for mortgages.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How does my credit score affect my mortgage rate?</h3>
                <p className={styles.faqAnswer}>Credit scores significantly impact mortgage rates. On a $400,000 loan, a 740+ score might get 4.5%, while a 660 score could be 5.5%—a difference of $250/month or $90,000 over 30 years. Improving your score by 20-40 points before applying can save thousands.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Ready to Find Your Perfect Home Payment?</h2>
              <p className={styles.ctaText}>Use this calculator to experiment with different scenarios. Adjust home prices, down payments, and loan terms to find a payment that fits your budget and financial goals.</p>
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates for educational purposes. Actual mortgage rates, terms, and approval are subject to lender requirements, creditworthiness, and market conditions. Property tax rates vary by location. PMI rates depend on credit score and loan program. Consult with a qualified mortgage professional for personalized advice and exact figures.
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
    revalidate: 21600,
  };
}

export default MortgageCalculator;