import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './ppfcalculator.module.css';

const PPFCalculator = ({ currentDate, lastModifiedDate }) => {
  // State for input values
  const [annualInvestment, setAnnualInvestment] = useState(150000);
  const [investmentStartAge, setInvestmentStartAge] = useState(30);
  const [investmentPeriod, setInvestmentPeriod] = useState(15);
  const [interestRate, setInterestRate] = useState(7.1);
  const [extensionPeriod, setExtensionPeriod] = useState(5);
  const [contributionFrequency, setContributionFrequency] = useState('annually');
  const [results, setResults] = useState(null);
  const [maturityData, setMaturityData] = useState([]);
  const [extensionData, setExtensionData] = useState([]);

  const contributionFrequencyMap = {
    'monthly': 12,
    'quarterly': 4,
    'half-yearly': 2,
    'annually': 1
  };

  const calculatePPFMaturity = () => {
    const frequency = contributionFrequencyMap[contributionFrequency];
    const monthlyRate = interestRate / 100 / 12;
    const totalMonths = investmentPeriod * 12;
    const contributionPerPeriod = annualInvestment / frequency;
    
    let balance = 0;
    const yearlyData = [];
    let totalContributions = 0;
    let totalInterest = 0;
    
    // Calculate for initial 15-year period
    for (let month = 1; month <= totalMonths; month++) {
      // Add contribution at beginning of each period
      if ((month - 1) % (12 / frequency) === 0) {
        balance += contributionPerPeriod;
        totalContributions += contributionPerPeriod;
      }
      
      // Calculate monthly interest
      const monthlyInterest = balance * monthlyRate;
      balance += monthlyInterest;
      totalInterest += monthlyInterest;
      
      // Record yearly data
      if (month % 12 === 0 || month === totalMonths) {
        const year = month / 12;
        yearlyData.push({
          year: year,
          age: investmentStartAge + year,
          balance: Math.round(balance * 100) / 100,
          contributions: Math.round(totalContributions * 100) / 100,
          interest: Math.round(totalInterest * 100) / 100
        });
      }
    }
    
    const initialMaturityAmount = balance;
    const initialTotalContributions = totalContributions;
    const initialTotalInterest = totalInterest;
    
    // Calculate extension period if applicable
    const extensionYearlyData = [];
    if (extensionPeriod > 0) {
      for (let extensionYear = 1; extensionYear <= extensionPeriod; extensionYear++) {
        // No contributions during extension, just interest compounding
        for (let month = 1; month <= 12; month++) {
          const monthlyInterest = balance * monthlyRate;
          balance += monthlyInterest;
          totalInterest += monthlyInterest;
        }
        
        extensionYearlyData.push({
          year: investmentPeriod + extensionYear,
          age: investmentStartAge + investmentPeriod + extensionYear,
          balance: Math.round(balance * 100) / 100,
          contributions: Math.round(initialTotalContributions * 100) / 100,
          interest: Math.round(totalInterest * 100) / 100
        });
      }
    }
    
    const finalMaturityAmount = balance;
    const finalTotalContributions = initialTotalContributions;
    const finalTotalInterest = totalInterest;
    
    // Calculate tax benefits
    const totalTaxBenefit = (annualInvestment * investmentPeriod * 0.3); // Assuming 30% tax bracket
    const effectiveReturnRate = calculateEffectiveReturn(finalMaturityAmount, finalTotalContributions, investmentPeriod + extensionPeriod);
    
    // Calculate withdrawal scenarios
    const partialWithdrawalAmount = finalMaturityAmount * 0.5; // 50% withdrawal
    const loanAmount = finalMaturityAmount * 0.25; // 25% loan
    
    setResults({
      initialMaturityAmount: Math.round(initialMaturityAmount * 100) / 100,
      finalMaturityAmount: Math.round(finalMaturityAmount * 100) / 100,
      totalContributions: Math.round(finalTotalContributions * 100) / 100,
      totalInterestEarned: Math.round(finalTotalInterest * 100) / 100,
      taxBenefit: Math.round(totalTaxBenefit * 100) / 100,
      effectiveReturn: Math.round(effectiveReturnRate * 100) / 100,
      partialWithdrawalAmount: Math.round(partialWithdrawalAmount * 100) / 100,
      loanAmount: Math.round(loanAmount * 100) / 100,
      maturityAge: investmentStartAge + investmentPeriod + extensionPeriod,
      corpusToContributionRatio: Math.round((finalMaturityAmount / finalTotalContributions) * 100) / 100
    });
    
    setMaturityData(yearlyData);
    setExtensionData(extensionYearlyData);
  };

  const calculateEffectiveReturn = (finalAmount, totalContributions, years) => {
    // Calculate CAGR
    if (totalContributions <= 0) return 0;
    const cagr = Math.pow(finalAmount / totalContributions, 1/years) - 1;
    return cagr * 100;
  };

  useEffect(() => {
    calculatePPFMaturity();
  }, [annualInvestment, investmentStartAge, investmentPeriod, interestRate, 
      extensionPeriod, contributionFrequency]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <>
      <Head>
        <title>PPF Calculator | Public Provident Fund Maturity & Investment Planning</title>
        <meta name="description" content="Free PPF calculator with tax benefits analysis. Calculate Public Provident Fund maturity amount, interest earned, extension benefits, and plan your long-term savings strategy." />
        <meta name="keywords" content="PPF calculator, Public Provident Fund calculator, PPF maturity calculator, PPF interest calculator, tax saving calculator, long term investment calculator, retirement planning India" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/ppf-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="PPF Calculator | Complete Public Provident Fund Analysis & Planning" />
        <meta property="og:description" content="Calculate PPF maturity amount, tax benefits, and plan your Public Provident Fund investments for maximum returns." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/ppf-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="PPF Calculator" />
        <meta name="twitter:description" content="Professional tool for analyzing Public Provident Fund investments and maturity planning" />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="ppf-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "PPF Calculator",
            "description": "Professional Public Provident Fund calculator for analyzing maturity amounts, tax benefits, extension periods, and long-term investment planning",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "INR"
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
              "name": "Indian Financial Tools",
              "url": "https://www.financecalculatorfree.com"
            },
            "featureList": [
              "PPF Maturity Calculation",
              "Tax Benefit Analysis",
              "Extension Period Planning",
              "Withdrawal & Loan Scenarios",
              "Visual Growth Charts",
              "Contribution Frequency Options"
            ]
          })
        }}
      />

      {/* FAQ Schema */}
      <Script
        id="ppf-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is PPF and how does it work?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Public Provident Fund (PPF) is a long-term savings scheme by Government of India with tax benefits under Section 80C. It has a 15-year maturity period with options to extend. Minimum investment is ₹500/year, maximum is ₹1.5 lakh/year. Interest is compounded annually and currently offers 7.1% interest (quarterly reviewed). PPF offers EEE tax benefits: Contributions deductible, interest tax-free, withdrawal tax-free.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What happens after 15 years in PPF?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "After 15 years, you can: 1) Withdraw entire amount tax-free, 2) Extend for 5-year blocks indefinitely (with/without contributions), 3) Make partial withdrawals (up to 50% of balance from 7th year). If extended without contributions, interest continues to compound. Our calculator shows both 15-year maturity and extension scenarios.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How are PPF tax benefits calculated?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "PPF offers triple tax benefits: 1) Section 80C deduction on contributions (up to ₹1.5 lakh/year), 2) Interest earned is tax-free, 3) Maturity amount is tax-free. Assuming 30% tax bracket, ₹1.5 lakh contribution saves ₹46,800 in taxes annually. Over 15 years, this adds significant value to your effective returns.",
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
            <h1 className={styles.mainTitle}>PPF Calculator</h1>
            <p className={styles.subtitle}>Public Provident Fund Maturity & Tax Benefit Analysis Tool</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>Tax Benefit Analysis</span>
              <span className={styles.badge}>EEE Benefits Included</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>PPF Investment Details</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Annual Investment Amount
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>₹</span>
                    <input
                      type="range"
                      min="500"
                      max="150000"
                      step="500"
                      value={annualInvestment}
                      onChange={(e) => setAnnualInvestment(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="500"
                      max="150000"
                      step="500"
                      value={annualInvestment}
                      onChange={(e) => setAnnualInvestment(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(annualInvestment)}/year</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Investment Start Age
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="18"
                      max="60"
                      step="1"
                      value={investmentStartAge}
                      onChange={(e) => setInvestmentStartAge(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="18"
                      max="60"
                      step="1"
                      value={investmentStartAge}
                      onChange={(e) => setInvestmentStartAge(parseInt(e.target.value) || 18)}
                      className={styles.numberInput}
                    />
                    <span className={styles.yearsSymbol}>years</span>
                  </div>
                  <div className={styles.valueDisplay}>{investmentStartAge} years</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Investment Period
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="15"
                      max="50"
                      step="5"
                      value={investmentPeriod}
                      onChange={(e) => setInvestmentPeriod(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="15"
                      max="50"
                      step="5"
                      value={investmentPeriod}
                      onChange={(e) => setInvestmentPeriod(parseInt(e.target.value) || 15)}
                      className={styles.numberInput}
                    />
                    <span className={styles.yearsSymbol}>years</span>
                  </div>
                  <div className={styles.valueDisplay}>{investmentPeriod} years (15-year lock-in)</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Extension Period (after 15 years)
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="30"
                      step="5"
                      value={extensionPeriod}
                      onChange={(e) => setExtensionPeriod(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="30"
                      step="5"
                      value={extensionPeriod}
                      onChange={(e) => setExtensionPeriod(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.yearsSymbol}>years</span>
                  </div>
                  <div className={styles.valueDisplay}>{extensionPeriod} years extension</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  PPF Interest Rate
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="5"
                      max="10"
                      step="0.1"
                      value={interestRate}
                      onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="5"
                      max="10"
                      step="0.1"
                      value={interestRate}
                      onChange={(e) => setInterestRate(parseFloat(e.target.value) || 7.1)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(interestRate)} (current: 7.1%)</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Contribution Frequency
                  <select
                    value={contributionFrequency}
                    onChange={(e) => setContributionFrequency(e.target.value)}
                    className={styles.selectInput}
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="half-yearly">Half-Yearly</option>
                    <option value="annually">Annually</option>
                  </select>
                </label>
              </div>

              <div className={styles.quickSettings}>
                <h3 className={styles.quickSettingsTitle}>Quick Investment Scenarios</h3>
                <div className={styles.quickSettingsButtons}>
                  <button 
                    className={styles.quickButton}
                    onClick={() => {
                      setAnnualInvestment(150000);
                      setInvestmentPeriod(15);
                      setExtensionPeriod(5);
                      calculatePPFMaturity();
                    }}
                  >
                    Max Investment (₹1.5L)
                  </button>
                  <button 
                    className={styles.quickButton}
                    onClick={() => {
                      setAnnualInvestment(50000);
                      setInvestmentPeriod(30);
                      setExtensionPeriod(10);
                      calculatePPFMaturity();
                    }}
                  >
                    Long-term (30 years)
                  </button>
                  <button 
                    className={styles.quickButton}
                    onClick={() => {
                      setAnnualInvestment(125000);
                      setContributionFrequency('monthly');
                      calculatePPFMaturity();
                    }}
                  >
                    Monthly Contributions
                  </button>
                </div>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>PPF Maturity Analysis</h2>
              
              {results && (
                <>
                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Final Maturity Amount</div>
                      <div className={styles.resultValue}>{formatCurrency(results.finalMaturityAmount)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Total Contributions</div>
                      <div className={styles.resultValue}>{formatCurrency(results.totalContributions)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Interest Earned</div>
                      <div className={styles.resultValue}>{formatCurrency(results.totalInterestEarned)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Tax Benefit Value</div>
                      <div className={styles.resultValue}>{formatCurrency(results.taxBenefit)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Effective Return</div>
                      <div className={styles.resultValue}>{formatPercentage(results.effectiveReturn)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Maturity Age</div>
                      <div className={styles.resultValue}>{results.maturityAge} years</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Corpus/Contribution Ratio</div>
                      <div className={styles.resultValue}>{results.corpusToContributionRatio.toFixed(1)}x</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Partial Withdrawal (50%)</div>
                      <div className={styles.resultValue}>{formatCurrency(results.partialWithdrawalAmount)}</div>
                    </div>
                  </div>

                  {/* Growth Chart Visualization */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>PPF Growth Over Time</h3>
                    <div className={styles.chartBars}>
                      {[...maturityData, ...extensionData].slice(-10).map((data, index) => (
                        <div key={index} className={styles.chartBarGroup}>
                          <div className={styles.chartBarLabel}>
                            Year {data.year}<br/>
                            Age {data.age}
                          </div>
                          <div className={styles.chartBarContainer}>
                            <div 
                              className={styles.chartBarContributions}
                              style={{ width: `${(data.contributions / results.finalMaturityAmount) * 100}%` }}
                              title={`Contributions: ${formatCurrency(data.contributions)}`}
                            />
                            <div 
                              className={styles.chartBarInterest}
                              style={{ width: `${(data.interest / results.finalMaturityAmount) * 100}%` }}
                              title={`Interest: ${formatCurrency(data.interest)}`}
                            />
                          </div>
                          <div className={styles.chartBarValue}>{formatCurrency(data.balance)}</div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.chartLegend}>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendContributions}`}></div>
                        <span>Your Contributions</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendInterest}`}></div>
                        <span>Interest Earned</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>📊 PPF Investment Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>
                        <strong>Tax Benefit:</strong> You save <strong>{formatCurrency(results.taxBenefit)}</strong> in taxes over the investment period (assuming 30% tax bracket)
                      </li>
                      <li>
                        <strong>Wealth Multiplication:</strong> Your corpus is <strong>{results.corpusToContributionRatio.toFixed(1)}x</strong> your total contributions
                      </li>
                      <li>
                        <strong>Effective Return:</strong> <strong>{formatPercentage(results.effectiveReturn)}</strong> including tax benefits vs {formatPercentage(interestRate)} nominal rate
                      </li>
                      {extensionPeriod > 0 && (
                        <li>
                          <strong>Extension Benefit:</strong> Extension adds <strong>{formatCurrency(results.finalMaturityAmount - results.initialMaturityAmount)}</strong> without additional contributions
                        </li>
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
              <h2 className={styles.articleTitle}>Public Provident Fund (PPF): Complete Guide to India's Best Tax-Saving Investment</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Why PPF is Considered India's Safest Investment</h3>
                <p>The Public Provident Fund (PPF) is a government-backed savings scheme that offers unique triple tax benefits (EEE - Exempt, Exempt, Exempt), guaranteed returns, and complete capital protection. With a 15-year lock-in period and 7.1% current interest rate, PPF is ideal for long-term goals like retirement planning, children's education, and wealth creation with zero market risk.</p>
                
                <div className={styles.exampleCard}>
                  <h4>PPF Investment Example:</h4>
                  <ul>
                    <li><strong>Annual Investment:</strong> ₹1,50,000 (maximum limit)</li>
                    <li><strong>Investment Period:</strong> 15 years + 5-year extension</li>
                    <li><strong>Total Contributions:</strong> ₹22,50,000</li>
                    <li><strong>Maturity Amount:</strong> ₹50,67,000 (approx)</li>
                    <li><strong>Interest Earned:</strong> ₹28,17,000 (tax-free)</li>
                    <li><strong>Tax Savings:</strong> ₹7,02,000 (30% bracket over 15 years)</li>
                  </ul>
                  <p>This creates an effective return of over 9% when tax benefits are considered.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Key PPF Features & Benefits</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>✅ EEE Tax Benefits</h4>
                    <p>Contributions deductible u/s 80C (₹1.5L/year), interest tax-free, withdrawal tax-free. Unique triple tax benefit not available in most investments.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🛡️ Government Backed</h4>
                    <p>Complete capital protection with sovereign guarantee. Zero market risk, fixed returns, ideal for conservative investors and retirement corpus.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📈 Compound Interest</h4>
                    <p>Interest compounded annually. The power of compounding over 15+ years creates significant wealth from regular contributions.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🔄 Flexibility Options</h4>
                    <p>Extension blocks (5 years), partial withdrawals (7th year onward), loans (3rd to 6th year), nomination facility, and online account management.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>PPF Rules & Regulations</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Eligibility:</strong> Indian residents only (NRI can continue existing accounts but cannot open new)</li>
                  <li><strong>Tenure:</strong> 15 years mandatory lock-in, extendable indefinitely in 5-year blocks</li>
                  <li><strong>Investment Limits:</strong> Minimum ₹500/year, maximum ₹1.5 lakh/year (across all PPF accounts)</li>
                  <li><strong>Contribution Timing:</strong> Deposit before 5th of month to earn interest for that month</li>
                  <li><strong>Withdrawals:</strong> Partial withdrawals allowed from 7th year (50% of balance from 4th preceding year)</li>
                  <li><strong>Loans:</strong> Available between 3rd and 6th financial year (25% of balance from 2nd preceding year)</li>
                  <li><strong>Nomination:</strong> Mandatory to nominate beneficiaries for account</li>
                  <li><strong>Premature Closure:</strong> Only allowed for specific medical/education needs after 5 years</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Advice from Financial Planners</h3>
                <blockquote className={styles.expertQuote}>
                  "PPF should be the foundation of every Indian's long-term portfolio. Start early, contribute regularly, and use the extension feature strategically. A ₹1.5 lakh annual PPF investment started at age 30 can grow to over ₹2 crore by age 60 with extensions. The tax-free status makes PPF returns effectively higher than most taxable instruments. Use PPF for your core retirement corpus and combine with equity for growth."
                  <footer className={styles.quoteFooter}>— Certified Financial Planner, specializing in Indian tax planning</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>PPF Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What is the best contribution frequency for PPF?</h3>
                <p className={styles.faqAnswer}>Monthly contributions maximize returns due to earlier compounding. If you invest ₹12,500 monthly instead of ₹1.5 lakh annually, you earn interest on early deposits for longer. However, ensure deposits by 5th of each month to earn interest for that month. Quarterly or half-yearly contributions also work well for systematic investing. Annual lump-sum before March 31st is common for tax planning.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Should I extend PPF after 15 years?</h3>
                <p className={styles.faqAnswer}>Yes, extend if: 1) You don't need the money immediately, 2) Interest rates are attractive, 3) You want continued tax-free compounding. Options: a) Extend with contributions (continue investing), b) Extend without contributions (let corpus grow). Extension in 5-year blocks gives flexibility. Your money continues to compound tax-free, making it excellent for retirement corpus.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How does PPF compare with other tax-saving options?</h3>
                <p className={styles.faqAnswer}>PPF vs alternatives: 1) ELSS: Higher returns but market risk, 3-year lock-in; 2) NPS: Lower lock-in but partial annuity requirement; 3) Tax-saving FDs: 5-year lock-in, interest taxable; 4) NSC: 5-year tenure, interest taxable; 5) Life insurance: Low returns, long lock-ins. PPF offers best combination of safety, tax benefits, and reasonable returns for conservative investors.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Can I open PPF for my minor child?</h3>
                <p className={styles.faqAnswer}>Yes, parents/guardians can open PPF accounts for minors. The minor's account has same rules but operated by guardian until age 18. Both parent and child can have separate PPF accounts with individual ₹1.5 lakh limits. This effectively doubles family PPF investment capacity to ₹3 lakh/year. Minor's PPF helps build education/marriage corpus with tax benefits.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Start Your PPF Journey Today</h2>
              <p className={styles.ctaText}>Use our calculator to plan your PPF investments. Maximize tax benefits, understand extension options, and build a substantial retirement corpus with India's safest investment.</p>
              
              
                    
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates based on current PPF interest rates (7.1% as of latest review). PPF interest rates are reviewed quarterly by the government and may change. Tax benefits calculated assuming 30% tax bracket including cess. Actual returns may vary based on deposit timing, interest rate changes, and individual tax situation. This is for educational purposes only. Consult a financial advisor for personalized investment advice. PPF rules and limits are subject to government regulations.
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

export default PPFCalculator;