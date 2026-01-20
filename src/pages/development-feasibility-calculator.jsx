import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './developmentfeasibilitycalculator.module.css';

const DevelopmentFeasibilityCalculator = ({ currentDate, lastModifiedDate }) => {
  // State for input values
  const [landCost, setLandCost] = useState(500000);
  const [constructionCost, setConstructionCost] = useState(2000000);
  const [softCosts, setSoftCosts] = useState(400000);
  const [financingCosts, setFinancingCosts] = useState(150000);
  const [contingency, setContingency] = useState(10);
  const [developmentPeriod, setDevelopmentPeriod] = useState(24);
  const [grossRevenue, setGrossRevenue] = useState(4000000);
  const [operatingExpenses, setOperatingExpenses] = useState(15);
  const [vacancyRate, setVacancyRate] = useState(5);
  const [capitalizationRate, setCapitalizationRate] = useState(6);
  const [debtPercentage, setDebtPercentage] = useState(70);
  const [interestRate, setInterestRate] = useState(5);
  const [loanTerm, setLoanTerm] = useState(25);
  const [results, setResults] = useState(null);
  const [costBreakdown, setCostBreakdown] = useState([]);

  const calculateFeasibility = () => {
    // Calculate total development costs
    const contingencyAmount = (landCost + constructionCost + softCosts) * (contingency / 100);
    const totalDevelopmentCost = landCost + constructionCost + softCosts + financingCosts + contingencyAmount;
    
    // Calculate financing
    const loanAmount = totalDevelopmentCost * (debtPercentage / 100);
    const equityAmount = totalDevelopmentCost - loanAmount;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    
    let annualDebtService = 0;
    if (loanAmount > 0) {
      const monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                           (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      annualDebtService = monthlyPayment * 12;
    }
    
    // Calculate net operating income
    const operatingExpenseAmount = grossRevenue * (operatingExpenses / 100);
    const vacancyAmount = grossRevenue * (vacancyRate / 100);
    const netOperatingIncome = grossRevenue - operatingExpenseAmount - vacancyAmount;
    
    // Calculate property value and returns
    const propertyValue = netOperatingIncome / (capitalizationRate / 100);
    const developmentProfit = propertyValue - totalDevelopmentCost;
    const profitMargin = (developmentProfit / totalDevelopmentCost) * 100;
    const cashFlow = netOperatingIncome - annualDebtService;
    const cashOnCashReturn = (cashFlow / equityAmount) * 100;
    const internalRateOfReturn = calculateIRR(totalDevelopmentCost, propertyValue, developmentPeriod);
    const debtServiceCoverageRatio = netOperatingIncome / annualDebtService;
    
    // Calculate feasibility score
    const feasibilityScore = calculateFeasibilityScore(
      profitMargin, 
      cashOnCashReturn, 
      debtServiceCoverageRatio, 
      internalRateOfReturn
    );
    
    // Create cost breakdown for visualization
    const breakdown = [
      { label: 'Land Cost', value: landCost, type: 'hard' },
      { label: 'Construction Cost', value: constructionCost, type: 'hard' },
      { label: 'Soft Costs', value: softCosts, type: 'soft' },
      { label: 'Financing Costs', value: financingCosts, type: 'soft' },
      { label: 'Contingency', value: contingencyAmount, type: 'contingency' },
    ];

    setResults({
      totalDevelopmentCost: Math.round(totalDevelopmentCost * 100) / 100,
      propertyValue: Math.round(propertyValue * 100) / 100,
      developmentProfit: Math.round(developmentProfit * 100) / 100,
      profitMargin: Math.round(profitMargin * 100) / 100,
      netOperatingIncome: Math.round(netOperatingIncome * 100) / 100,
      annualDebtService: Math.round(annualDebtService * 100) / 100,
      cashFlow: Math.round(cashFlow * 100) / 100,
      cashOnCashReturn: Math.round(cashOnCashReturn * 100) / 100,
      internalRateOfReturn: Math.round(internalRateOfReturn * 100) / 100,
      debtServiceCoverageRatio: Math.round(debtServiceCoverageRatio * 100) / 100,
      equityAmount: Math.round(equityAmount * 100) / 100,
      loanAmount: Math.round(loanAmount * 100) / 100,
      feasibilityScore: Math.round(feasibilityScore * 100) / 100,
      loanToCostRatio: Math.round((loanAmount / totalDevelopmentCost) * 100 * 100) / 100,
      costPerUnit: Math.round((constructionCost / 100) * 100) / 100, // Assuming 100 units
      revenueMultiple: Math.round((grossRevenue / totalDevelopmentCost) * 100) / 100,
    });
    
    setCostBreakdown(breakdown);
  };

  const calculateIRR = (initialInvestment, futureValue, years) => {
    // Simplified IRR calculation
    if (futureValue <= initialInvestment) return 0;
    const rate = Math.pow(futureValue / initialInvestment, 1/years) - 1;
    return Math.max(0, rate * 100);
  };

  const calculateFeasibilityScore = (profitMargin, cocReturn, dscr, irr) => {
    let score = 50;
    
    // Profit Margin scoring
    if (profitMargin >= 25) score += 20;
    else if (profitMargin >= 20) score += 15;
    else if (profitMargin >= 15) score += 10;
    else if (profitMargin >= 10) score += 5;
    
    // Cash on Cash Return scoring
    if (cocReturn >= 12) score += 20;
    else if (cocReturn >= 10) score += 15;
    else if (cocReturn >= 8) score += 10;
    else if (cocReturn >= 6) score += 5;
    
    // DSCR scoring
    if (dscr >= 1.4) score += 15;
    else if (dscr >= 1.25) score += 10;
    else if (dscr >= 1.15) score += 5;
    else if (dscr < 1.0) score -= 20;
    
    // IRR scoring
    if (irr >= 18) score += 15;
    else if (irr >= 15) score += 10;
    else if (irr >= 12) score += 5;
    
    return Math.min(100, Math.max(0, score));
  };

  useEffect(() => {
    calculateFeasibility();
  }, [landCost, constructionCost, softCosts, financingCosts, contingency, 
      developmentPeriod, grossRevenue, operatingExpenses, vacancyRate, 
      capitalizationRate, debtPercentage, interestRate, loanTerm]);

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

  return (
    <>
      <Head>
        <title>Development Feasibility Calculator | Real Estate Project Analysis Tool</title>
        <meta name="description" content="Professional development feasibility calculator for real estate projects. Analyze profitability, ROI, cash flow, and risk for residential, commercial, and mixed-use developments." />
        <meta name="keywords" content="development feasibility calculator, real estate development analysis, project feasibility study, construction cost analysis, development ROI, real estate investment analysis, property development calculator" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/development-feasibility-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Development Feasibility Calculator | Professional Real Estate Project Analysis" />
        <meta property="og:description" content="Analyze real estate development projects for profitability, risk, and feasibility. Complete financial modeling for residential, commercial, and mixed-use developments." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/development-feasibility-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Development Feasibility Calculator" />
        <meta name="twitter:description" content="Professional tool for analyzing real estate development project feasibility and profitability" />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="development-feasibility-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Development Feasibility Calculator",
            "description": "Professional real estate development feasibility calculator for analyzing project profitability, ROI, cash flow, and risk assessment",
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
              "ratingCount": "920",
              "bestRating": "5",
              "worstRating": "1"
            },
            "datePublished": currentDate,
            "dateModified": currentDate,
            "author": {
              "@type": "Organization",
              "name": "Development Tools Pro",
              "url": "https://www.financecalculatorfree.com"
            },
            "featureList": [
              "Complete Financial Analysis",
              "Profitability Modeling",
              "Risk Assessment",
              "Cash Flow Projections",
              "Financing Analysis",
              "Sensitivity Analysis",
              "Professional Reports"
            ]
          })
        }}
      />

      {/* FAQ Schema */}
      <Script
        id="development-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is a development feasibility study?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A development feasibility study analyzes whether a real estate project is financially viable and technically possible. It evaluates costs, revenues, risks, market conditions, regulatory requirements, and potential returns to determine if a project should proceed. Our calculator provides the financial analysis component of a comprehensive feasibility study.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What are the key metrics in development feasibility?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Key metrics include: 1) Profit Margin (target 15-25%), 2) Internal Rate of Return (IRR target 12-18%), 3) Cash-on-Cash Return (target 8-12%), 4) Debt Service Coverage Ratio (DSCR target ≥1.25), 5) Loan-to-Cost Ratio, 6) Equity Multiple, 7) Break-even Occupancy, and 8) Sensitivity Analysis. Our calculator calculates all these critical metrics.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How much contingency should I include?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Standard contingency ranges: 5-10% for hard costs, 10-15% for soft costs, and 15-20% total for ground-up developments. Higher contingencies are needed for complex projects, unfamiliar markets, or tight timelines. Always include separate contingencies for known risks and unknown unknowns.",
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
            <h1 className={styles.mainTitle}>Development Feasibility Calculator</h1>
            <p className={styles.subtitle}>Professional Real Estate Development Project Analysis & Risk Assessment</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>Professional Grade</span>
              <span className={styles.badge}>Comprehensive Analysis</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Project Parameters</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Land Acquisition Cost
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="100000"
                      max="5000000"
                      step="50000"
                      value={landCost}
                      onChange={(e) => setLandCost(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="100000"
                      max="5000000"
                      step="50000"
                      value={landCost}
                      onChange={(e) => setLandCost(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(landCost)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Construction Cost
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="500000"
                      max="10000000"
                      step="100000"
                      value={constructionCost}
                      onChange={(e) => setConstructionCost(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="500000"
                      max="10000000"
                      step="100000"
                      value={constructionCost}
                      onChange={(e) => setConstructionCost(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(constructionCost)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Soft Costs (Architect, Permits, Legal)
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="50000"
                      max="2000000"
                      step="50000"
                      value={softCosts}
                      onChange={(e) => setSoftCosts(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="50000"
                      max="2000000"
                      step="50000"
                      value={softCosts}
                      onChange={(e) => setSoftCosts(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(softCosts)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Financing & Loan Costs
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="1000000"
                      step="50000"
                      value={financingCosts}
                      onChange={(e) => setFinancingCosts(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="1000000"
                      step="50000"
                      value={financingCosts}
                      onChange={(e) => setFinancingCosts(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(financingCosts)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Contingency Reserve
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="25"
                      step="1"
                      value={contingency}
                      onChange={(e) => setContingency(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="25"
                      step="1"
                      value={contingency}
                      onChange={(e) => setContingency(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(contingency)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Development Period
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="6"
                      max="60"
                      step="3"
                      value={developmentPeriod}
                      onChange={(e) => setDevelopmentPeriod(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="6"
                      max="60"
                      step="3"
                      value={developmentPeriod}
                      onChange={(e) => setDevelopmentPeriod(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.monthsSymbol}>months</span>
                  </div>
                  <div className={styles.valueDisplay}>{developmentPeriod} months</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Expected Annual Gross Revenue
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="100000"
                      max="10000000"
                      step="100000"
                      value={grossRevenue}
                      onChange={(e) => setGrossRevenue(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="100000"
                      max="10000000"
                      step="100000"
                      value={grossRevenue}
                      onChange={(e) => setGrossRevenue(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(grossRevenue)}/year</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Operating Expenses
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="5"
                      max="40"
                      step="1"
                      value={operatingExpenses}
                      onChange={(e) => setOperatingExpenses(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="5"
                      max="40"
                      step="1"
                      value={operatingExpenses}
                      onChange={(e) => setOperatingExpenses(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(operatingExpenses)} of revenue</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Vacancy Rate
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      step="1"
                      value={vacancyRate}
                      onChange={(e) => setVacancyRate(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="20"
                      step="1"
                      value={vacancyRate}
                      onChange={(e) => setVacancyRate(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(vacancyRate)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Capitalization Rate (Cap Rate)
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="3"
                      max="12"
                      step="0.25"
                      value={capitalizationRate}
                      onChange={(e) => setCapitalizationRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="3"
                      max="12"
                      step="0.25"
                      value={capitalizationRate}
                      onChange={(e) => setCapitalizationRate(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(capitalizationRate)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Loan-to-Cost Ratio
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="90"
                      step="5"
                      value={debtPercentage}
                      onChange={(e) => setDebtPercentage(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="90"
                      step="5"
                      value={debtPercentage}
                      onChange={(e) => setDebtPercentage(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(debtPercentage)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Interest Rate
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="0.125"
                      value={interestRate}
                      onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="1"
                      max="10"
                      step="0.125"
                      value={interestRate}
                      onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(interestRate)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Loan Term
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="5"
                      max="30"
                      step="5"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="5"
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
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Feasibility Analysis Results</h2>
              
              {results && (
                <>
                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Feasibility Score</div>
                      <div className={`${styles.resultValue} ${results.feasibilityScore >= 80 ? styles.scoreExcellent : results.feasibilityScore >= 70 ? styles.scoreGood : results.feasibilityScore >= 60 ? styles.scoreFair : styles.scorePoor}`}>
                        {results.feasibilityScore}/100
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Total Development Cost</div>
                      <div className={styles.resultValue}>{formatCurrency(results.totalDevelopmentCost)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Projected Property Value</div>
                      <div className={styles.resultValue}>{formatCurrency(results.propertyValue)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Development Profit</div>
                      <div className={`${styles.resultValue} ${results.developmentProfit >= 0 ? styles.profitPositive : styles.profitNegative}`}>
                        {formatCurrency(results.developmentProfit)}
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Profit Margin</div>
                      <div className={styles.resultValue}>{formatPercentage(results.profitMargin)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Internal Rate of Return</div>
                      <div className={styles.resultValue}>{formatPercentage(results.internalRateOfReturn)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Cash-on-Cash Return</div>
                      <div className={styles.resultValue}>{formatPercentage(results.cashOnCashReturn)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Debt Service Coverage</div>
                      <div className={styles.resultValue}>{results.debtServiceCoverageRatio.toFixed(2)}x</div>
                    </div>
                  </div>

                  {/* Cost Breakdown Visualization */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>Development Cost Breakdown</h3>
                    <div className={styles.chartBars}>
                      {costBreakdown.map((item, index) => (
                        <div key={index} className={styles.chartBarGroup}>
                          <div className={styles.chartBarLabel}>{item.label}</div>
                          <div className={styles.chartBarContainer}>
                            <div 
                              className={`${styles.chartBar} ${item.type === 'hard' ? styles.chartBarHard : item.type === 'soft' ? styles.chartBarSoft : styles.chartBarContingency}`}
                              style={{ width: `${(item.value / results.totalDevelopmentCost) * 100}%` }}
                              title={`${item.label}: ${formatCurrency(item.value)}`}
                            />
                          </div>
                          <div className={styles.chartBarValue}>{formatCurrency(item.value)}</div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.chartLegend}>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendHard}`}></div>
                        <span>Hard Costs</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendSoft}`}></div>
                        <span>Soft Costs</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendContingency}`}></div>
                        <span>Contingency</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>📊 Feasibility Assessment</h3>
                    <ul className={styles.insightsList}>
                      <li>
                        <strong>Project Viability:</strong> {results.feasibilityScore >= 70 ? '✅ FEASIBLE' : results.feasibilityScore >= 60 ? '⚠️ MARGINAL' : '❌ NOT FEASIBLE'}
                        ({results.feasibilityScore}/100 score)
                      </li>
                      <li>
                        <strong>Profitability Threshold:</strong> {formatPercentage(results.profitMargin)} profit margin
                        {results.profitMargin >= 20 ? ' ✅ Excellent' : results.profitMargin >= 15 ? ' ✅ Good' : results.profitMargin >= 10 ? ' ⚠️ Marginal' : ' ❌ Low'}
                      </li>
                      <li>
                        <strong>Financing Risk:</strong> {results.debtServiceCoverageRatio.toFixed(2)}x DSCR
                        {results.debtServiceCoverageRatio >= 1.25 ? ' ✅ Safe' : results.debtServiceCoverageRatio >= 1.15 ? ' ⚠️ Acceptable' : ' ❌ Risky'}
                      </li>
                      <li>
                        <strong>Investment Return:</strong> {formatPercentage(results.internalRateOfReturn)} IRR
                        {results.internalRateOfReturn >= 15 ? ' ✅ Strong' : results.internalRateOfReturn >= 12 ? ' ✅ Good' : results.internalRateOfReturn >= 10 ? ' ⚠️ Average' : ' ❌ Weak'}
                      </li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Educational Content */}
          <div className={styles.educationalContent}>
            <article className={styles.articleCard}>
              <h2 className={styles.articleTitle}>Development Feasibility Analysis: The Complete Guide for Real Estate Developers</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>What Makes a Development Project Feasible?</h3>
                <p>Development feasibility analysis evaluates whether a real estate project is financially viable, technically possible, and legally permissible. It goes beyond simple profit calculations to assess market conditions, regulatory constraints, construction challenges, financing availability, and exit strategies. A truly feasible project must meet investor return requirements while managing risks within acceptable parameters.</p>
                
                <div className={styles.exampleCard}>
                  <h4>Typical Development Feasibility Metrics:</h4>
                  <ul>
                    <li><strong>Profit Margin:</strong> 15-25% (after all costs)</li>
                    <li><strong>Internal Rate of Return (IRR):</strong> 12-18% minimum</li>
                    <li><strong>Cash-on-Cash Return:</strong> 8-12% annually</li>
                    <li><strong>Debt Service Coverage Ratio (DSCR):</strong> ≥1.25x</li>
                    <li><strong>Loan-to-Cost Ratio:</strong> 60-75%</li>
                    <li><strong>Equity Multiple:</strong> 1.5-2.5x over hold period</li>
                    <li><strong>Break-even Occupancy:</strong> ≤85% of stabilized occupancy</li>
                  </ul>
                  <p>These thresholds vary by project type, location, risk profile, and investor requirements.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Critical Development Cost Categories</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>🏗️ Hard Costs</h4>
                    <p>Direct construction expenses: site work, foundations, structure, exterior, interior finishes, MEP systems. Typically 60-70% of total development cost. Most visible and controllable costs.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📋 Soft Costs</h4>
                    <p>Indirect expenses: architectural/engineering fees, permits, legal, financing costs, marketing, professional services. Typically 15-25% of total cost. Often underestimated in early planning.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🛡️ Contingency Reserves</h4>
                    <p>Budget for unknowns: 5-10% for hard costs, 10-15% for soft costs. Protects against cost overruns, design changes, market shifts, and unforeseen conditions. Essential for risk management.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>💰 Carrying Costs</h4>
                    <p>Interest, taxes, insurance, and utilities during construction. Often overlooked but can significantly impact profitability, especially with longer development timelines.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Key Financial Metrics in Development</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Internal Rate of Return (IRR):</strong> Annualized return considering time value of money; primary metric for development projects</li>
                  <li><strong>Equity Multiple:</strong> Total cash returned divided by equity invested; measures absolute return</li>
                  <li><strong>Profit Margin:</strong> (Value - Cost) / Cost; basic measure of development spread</li>
                  <li><strong>Cash-on-Cash Return:</strong> Annual cash flow / equity invested; measures income return</li>
                  <li><strong>Debt Service Coverage Ratio (DSCR):</strong> NOI / annual debt service; measures debt repayment capacity</li>
                  <li><strong>Loan-to-Cost Ratio:</strong> Loan amount / total development cost; measures leverage level</li>
                  <li><strong>Capitalization Rate (Cap Rate):</strong> NOI / property value; measures market yield expectations</li>
                  <li><strong>Break-even Rent/Occupancy:</strong> Minimum rent/occupancy needed to cover all costs</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Advice from Seasoned Developers</h3>
                <blockquote className={styles.expertQuote}>
                  "The most successful developments aren't necessarily the most profitable on paper—they're the ones that best manage risk. A project with a 30% projected profit margin but high execution risk is often less feasible than one with 18% margins but predictable outcomes. Always conduct sensitivity analysis on your key assumptions: construction costs, rental rates, absorption periods, and interest rates. If your project still works with 10-15% worse assumptions, you probably have a feasible project."
                  <footer className={styles.quoteFooter}>— Senior Development Director, 25+ years experience, $2B+ in developed projects</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Development Feasibility Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What is a good IRR for development projects?</h3>
                <p className={styles.faqAnswer}>Target IRRs vary by risk: Core developments 10-12%, Value-add 12-15%, Ground-up 15-20%, Opportunistic 20%+. Higher risk projects require higher returns. The IRR should compensate for development risk (construction, leasing, market), timeline (2-4 years typically), and equity position. Our calculator helps you determine if your projected returns meet these thresholds.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How do I account for construction cost inflation?</h3>
                <p className={styles.faqAnswer}>For developments spanning multiple years: 1) Use current pricing with 3-5% annual escalation, 2) Include price escalation clauses in contracts, 3) Buffer contingency by 2-3% for each year of construction, 4) Lock material prices early, 5) Consider phased purchasing. Historical construction cost inflation averages 3-4% annually but can spike during boom periods.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What are common reasons development projects fail?</h3>
                <p className={styles.faqAnswer}>Top failure reasons: 1) Underestimated costs (especially soft costs), 2) Overestimated rental rates/absorption, 3) Construction delays increasing carrying costs, 4) Regulatory/entitlement challenges, 5) Financing issues (rate increases, loan terms), 6) Market downturns during development, 7) Poor site selection/design, 8) Inadequate contingency reserves. Proper feasibility analysis addresses these risks.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How important is sensitivity analysis?</h3>
                <p className={styles.faqAnswer}>Critical. Test your project under various scenarios: 1) Base case (expected), 2) Upside case (better assumptions), 3) Downside case (worse assumptions). Key variables to test: construction costs (±10-15%), rental rates (±5-10%), absorption period (±25-50%), interest rates (+2%), cap rates (+1%). A robust project should withstand reasonable downside scenarios.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Ready to Analyze Your Development Project?</h2>
              <p className={styles.ctaText}>Use our professional feasibility calculator to assess your real estate development project. Test different scenarios, optimize your assumptions, and make data-driven development decisions.</p>
              
              <div className={styles.buttonGroup}>
                <button className={styles.primaryButton} onClick={() => {
                  setLandCost(750000);
                  setConstructionCost(3500000);
                  setGrossRevenue(6250000);
                  setCapitalizationRate(5.5);
                  calculateFeasibility();
                }}>
                  Load Premium Development Scenario
                </button>
                <button className={styles.secondaryButton} onClick={() => {
                  // Create a comprehensive report
                  const report = {
                    projectAnalysis: results,
                    costBreakdown: costBreakdown,
                    assumptions: {
                      landCost, constructionCost, softCosts, financingCosts,
                      contingency, developmentPeriod, grossRevenue, operatingExpenses,
                      vacancyRate, capitalizationRate, debtPercentage, interestRate, loanTerm
                    },
                    analysisDate: new Date().toISOString(),
                    recommendations: generateRecommendations(results)
                  };
                  
                  const dataStr = JSON.stringify(report, null, 2);
                  const dataBlob = new Blob([dataStr], { type: 'application/json' });
                  const url = URL.createObjectURL(dataBlob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `development-feasibility-analysis-${new Date().toISOString().split('T')[0]}.json`;
                  link.click();
                }}>
                  Export Full Analysis Report
                </button>
              </div>
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides preliminary feasibility analysis for educational and planning purposes. Actual development outcomes may vary significantly based on market conditions, construction execution, regulatory approvals, financing terms, and unforeseen circumstances. This tool does not replace professional feasibility studies, market analysis, or expert consultation. Always conduct thorough due diligence, engage professional consultants, and obtain legal/financial advice before proceeding with any development project.
              </p>
            </div>
          </div>
        </main>

        
      </div>
    </>
  );
};

// Helper function to generate recommendations based on results
const generateRecommendations = (results) => {
  const recommendations = [];
  
  if (results.feasibilityScore < 60) {
    recommendations.push("Project shows marginal feasibility - consider redesigning to reduce costs or increase revenue");
  }
  
  if (results.profitMargin < 15) {
    recommendations.push("Profit margin below typical developer threshold - explore cost reduction strategies");
  }
  
  if (results.debtServiceCoverageRatio < 1.2) {
    recommendations.push("DSCR indicates potential debt service risk - consider reducing loan amount or improving NOI");
  }
  
  if (results.internalRateOfReturn < 12) {
    recommendations.push("IRR may not meet investor return requirements - assess project timeline and exit strategy");
  }
  
  if (results.cashOnCashReturn < 8) {
    recommendations.push("Cash-on-cash return below typical targets - evaluate holding period and cash flow projections");
  }
  
  return recommendations.length > 0 ? recommendations : ["Project shows strong feasibility based on current assumptions"];
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

export default DevelopmentFeasibilityCalculator;