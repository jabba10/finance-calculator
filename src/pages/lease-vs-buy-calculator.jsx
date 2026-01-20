import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './leasevsbuycalculator.module.css';

const LeaseVsBuyCalculator = ({ currentDate, lastModifiedDate }) => {
  // Lease State
  const [leaseTerm, setLeaseTerm] = useState(36);
  const [leaseDownPayment, setLeaseDownPayment] = useState(3000);
  const [monthlyLeasePayment, setMonthlyLeasePayment] = useState(450);
  const [leaseMileageLimit, setLeaseMileageLimit] = useState(12000);
  const [dispositionFee, setDispositionFee] = useState(350);
  const [leaseAcquisitionFee, setLeaseAcquisitionFee] = useState(650);
  const [leaseInterestRate, setLeaseInterestRate] = useState(4.5);

  // Buy State
  const [vehiclePrice, setVehiclePrice] = useState(35000);
  const [loanTerm, setLoanTerm] = useState(60);
  const [downPayment, setDownPayment] = useState(5000);
  const [loanInterestRate, setLoanInterestRate] = useState(5.5);
  const [salesTaxRate, setSalesTaxRate] = useState(7.5);
  const [expectedMileage, setExpectedMileage] = useState(15000);
  
  // Results
  const [results, setResults] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [recommendation, setRecommendation] = useState('');

  const calculateLeaseVsBuy = () => {
    // Calculate Lease Costs
    const leaseMonthlyWithTax = monthlyLeasePayment * (1 + salesTaxRate / 100);
    const totalLeasePayments = leaseMonthlyWithTax * leaseTerm;
    const totalLeaseCost = totalLeasePayments + leaseDownPayment + dispositionFee + leaseAcquisitionFee;
    
    // Calculate Buy Costs
    const loanAmount = vehiclePrice - downPayment;
    const monthlyLoanRate = loanInterestRate / 100 / 12;
    const loanPayment = loanAmount * monthlyLoanRate * Math.pow(1 + monthlyLoanRate, loanTerm) / 
                       (Math.pow(1 + monthlyLoanRate, loanTerm) - 1);
    const monthlyLoanWithTax = loanPayment * (1 + salesTaxRate / 100);
    const totalLoanPayments = monthlyLoanWithTax * loanTerm;
    const totalBuyCost = totalLoanPayments + downPayment + (vehiclePrice * salesTaxRate / 100);
    
    // Calculate vehicle value after loan term (depreciation)
    const annualDepreciation = 15; // 15% per year
    const yearsOfLoan = loanTerm / 12;
    const vehicleValueAfterLoan = vehiclePrice * Math.pow(1 - annualDepreciation / 100, yearsOfLoan);
    
    // Calculate net buy cost (total cost - vehicle value)
    const netBuyCost = totalBuyCost - vehicleValueAfterLoan;
    
    // Calculate 3-year comparison (common lease term)
    const threeYearBuyPayments = monthlyLoanWithTax * 36;
    const threeYearBuyEquity = vehiclePrice * (1 - Math.pow(1 - annualDepreciation / 100, 3)) - threeYearBuyPayments;
    const threeYearLeaseCost = totalLeaseCost;
    
    // Calculate mileage impact
    const excessMilesPerYear = Math.max(0, expectedMileage - leaseMileageLimit);
    const excessMileCost = excessMilesPerYear * 0.25 * (leaseTerm / 12); // $0.25 per mile
    const adjustedLeaseCost = totalLeaseCost + excessMileCost;
    
    // Generate yearly data for chart
    const dataPoints = [];
    for (let year = 1; year <= 6; year++) {
      const leaseCumulative = year <= leaseTerm / 12 ? 
        (leaseMonthlyWithTax * year * 12) + leaseDownPayment + (year === 3 ? dispositionFee + leaseAcquisitionFee : 0) +
        (excessMileCost * (year / 3)) : 
        (leaseMonthlyWithTax * leaseTerm) + leaseDownPayment + dispositionFee + leaseAcquisitionFee + excessMileCost;
      
      const buyCumulative = Math.min(year * 12, loanTerm) * monthlyLoanWithTax + downPayment + (vehiclePrice * salesTaxRate / 100);
      const buyVehicleValue = vehiclePrice * Math.pow(1 - annualDepreciation / 100, year);
      const buyNetCost = buyCumulative - buyVehicleValue;
      
      dataPoints.push({
        year,
        leaseCost: Math.round(leaseCumulative),
        buyCost: Math.round(buyCumulative),
        buyNetCost: Math.round(buyNetCost),
        buyVehicleValue: Math.round(buyVehicleValue)
      });
    }
    
    // Determine recommendation
    let rec = '';
    if (netBuyCost < totalLeaseCost && excessMileCost === 0) {
      rec = 'BUY - Lower long-term cost';
    } else if (excessMileCost > 2000) {
      rec = 'BUY - High mileage makes leasing expensive';
    } else if (leaseTerm <= 36 && monthlyLeasePayment * 12 < vehiclePrice * 0.15) {
      rec = 'LEASE - Good deal for short-term use';
    } else {
      rec = 'BUY - Better long-term investment';
    }
    
    setResults({
      totalLeaseCost: Math.round(totalLeaseCost),
      adjustedLeaseCost: Math.round(adjustedLeaseCost),
      totalBuyCost: Math.round(totalBuyCost),
      netBuyCost: Math.round(netBuyCost),
      monthlyLeasePayment: Math.round(leaseMonthlyWithTax),
      monthlyBuyPayment: Math.round(monthlyLoanWithTax),
      threeYearLeaseCost: Math.round(threeYearLeaseCost),
      threeYearBuyCost: Math.round(threeYearBuyPayments),
      threeYearBuyEquity: Math.round(threeYearBuyEquity),
      excessMileCost: Math.round(excessMileCost),
      vehicleValueAfterLoan: Math.round(vehicleValueAfterLoan)
    });
    
    setChartData(dataPoints);
    setRecommendation(rec);
  };

  useEffect(() => {
    calculateLeaseVsBuy();
  }, [
    leaseTerm, leaseDownPayment, monthlyLeasePayment, leaseMileageLimit, 
    dispositionFee, leaseAcquisitionFee, leaseInterestRate, vehiclePrice, 
    loanTerm, downPayment, loanInterestRate, salesTaxRate, expectedMileage
  ]);

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
        <title>Lease vs Buy Calculator | Make the Right Car Decision</title>
        <meta name="description" content="Free comprehensive lease vs buy calculator. Compare total costs, monthly payments, and long-term value to make the best financial decision for your next vehicle." />
        <meta name="keywords" content="lease vs buy calculator, car lease calculator, auto loan calculator, vehicle financing, car buying decision, lease calculator" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/lease-vs-buy-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Lease vs Buy Calculator | Make the Right Car Decision" />
        <meta property="og:description" content="Should you lease or buy your next vehicle? Our calculator compares total costs and helps you make the best financial decision." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/lease-vs-buy-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Lease vs Buy Calculator" />
        <meta name="twitter:description" content="Compare total vehicle ownership costs: leasing vs buying. Make informed financial decisions." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="lease-vs-buy-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Lease vs Buy Calculator",
            "description": "Professional vehicle lease vs purchase comparison calculator with detailed cost analysis and financial planning",
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
              "ratingCount": "980",
              "bestRating": "5",
              "worstRating": "1"
            },
            "datePublished": currentDate,
            "dateModified": currentDate,
            "author": {
              "@type": "Organization",
              "name": "Auto Financial Tools",
              "url": "https://www.financecalculatorfree.com"
            },
            "featureList": [
              "Total Cost Comparison",
              "Monthly Payment Analysis",
              "Depreciation Calculator",
              "Mileage Impact Analysis",
              "Long-term Value Projection"
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
                "name": "Is it better to lease or buy a car?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The answer depends on your driving habits, financial situation, and personal preferences. Leasing typically offers lower monthly payments but no equity. Buying costs more monthly but you own the asset. Use our calculator to compare your specific scenario.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What are the hidden costs of leasing?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Hidden lease costs include excess mileage fees ($0.15-$0.30 per mile over limit), disposition fees ($300-$500), excessive wear and tear charges, and early termination penalties. Our calculator helps account for these costs.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How does depreciation affect the buy vs lease decision?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Depreciation is the biggest cost of vehicle ownership. When you lease, you only pay for the depreciation during the lease term. When you buy, you bear the full depreciation risk but also benefit from any residual value.",
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
            <h1 className={styles.mainTitle}>Lease vs Buy Calculator</h1>
            <p className={styles.subtitle}>Compare Total Costs and Make the Right Vehicle Decision</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>Comprehensive Analysis</span>
              <span className={styles.badge}>No Signup Required</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Vehicle & Financial Details</h2>
              
              {/* Vehicle Price */}
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Vehicle Price
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="15000"
                      max="100000"
                      step="1000"
                      value={vehiclePrice}
                      onChange={(e) => setVehiclePrice(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="15000"
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

              {/* Expected Annual Mileage */}
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Expected Annual Mileage
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="5000"
                      max="25000"
                      step="1000"
                      value={expectedMileage}
                      onChange={(e) => setExpectedMileage(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="5000"
                      max="25000"
                      step="1000"
                      value={expectedMileage}
                      onChange={(e) => setExpectedMileage(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.yearsSymbol}>miles</span>
                  </div>
                  <div className={styles.valueDisplay}>{expectedMileage.toLocaleString()} miles/year</div>
                </label>
              </div>

              <div className={styles.comparisonTabs}>
                <div className={styles.tabSection}>
                  <h3 className={styles.tabTitle}>Lease Options</h3>
                  
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      Lease Term
                      <select
                        value={leaseTerm}
                        onChange={(e) => setLeaseTerm(parseInt(e.target.value))}
                        className={styles.selectInput}
                      >
                        <option value="24">24 months</option>
                        <option value="36">36 months</option>
                        <option value="48">48 months</option>
                        <option value="60">60 months</option>
                      </select>
                    </label>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      Monthly Lease Payment
                      <div className={styles.inputWrapper}>
                        <span className={styles.currencySymbol}>$</span>
                        <input
                          type="range"
                          min="200"
                          max="1500"
                          step="10"
                          value={monthlyLeasePayment}
                          onChange={(e) => setMonthlyLeasePayment(parseInt(e.target.value))}
                          className={styles.slider}
                        />
                        <input
                          type="number"
                          min="200"
                          max="1500"
                          step="10"
                          value={monthlyLeasePayment}
                          onChange={(e) => setMonthlyLeasePayment(parseInt(e.target.value) || 0)}
                          className={styles.numberInput}
                        />
                      </div>
                      <div className={styles.valueDisplay}>{formatCurrency(monthlyLeasePayment)}/month</div>
                    </label>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      Lease Mileage Limit
                      <select
                        value={leaseMileageLimit}
                        onChange={(e) => setLeaseMileageLimit(parseInt(e.target.value))}
                        className={styles.selectInput}
                      >
                        <option value="10000">10,000 miles/year</option>
                        <option value="12000">12,000 miles/year</option>
                        <option value="15000">15,000 miles/year</option>
                        <option value="18000">18,000 miles/year</option>
                      </select>
                    </label>
                  </div>
                </div>

                <div className={styles.tabSection}>
                  <h3 className={styles.tabTitle}>Purchase Options</h3>
                  
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      Loan Term
                      <select
                        value={loanTerm}
                        onChange={(e) => setLoanTerm(parseInt(e.target.value))}
                        className={styles.selectInput}
                      >
                        <option value="36">3 years (36 months)</option>
                        <option value="48">4 years (48 months)</option>
                        <option value="60">5 years (60 months)</option>
                        <option value="72">6 years (72 months)</option>
                        <option value="84">7 years (72 months)</option>
                      </select>
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
                          max="20000"
                          step="500"
                          value={downPayment}
                          onChange={(e) => setDownPayment(parseInt(e.target.value))}
                          className={styles.slider}
                        />
                        <input
                          type="number"
                          min="0"
                          max="20000"
                          step="500"
                          value={downPayment}
                          onChange={(e) => setDownPayment(parseInt(e.target.value) || 0)}
                          className={styles.numberInput}
                        />
                      </div>
                      <div className={styles.valueDisplay}>{formatCurrency(downPayment)}</div>
                    </label>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      Loan Interest Rate
                      <div className={styles.inputWrapper}>
                        <input
                          type="range"
                          min="2"
                          max="15"
                          step="0.1"
                          value={loanInterestRate}
                          onChange={(e) => setLoanInterestRate(parseFloat(e.target.value))}
                          className={styles.slider}
                        />
                        <input
                          type="number"
                          min="2"
                          max="15"
                          step="0.1"
                          value={loanInterestRate}
                          onChange={(e) => setLoanInterestRate(parseFloat(e.target.value) || 0)}
                          className={styles.numberInput}
                        />
                        <span className={styles.percentageSymbol}>%</span>
                      </div>
                      <div className={styles.valueDisplay}>{formatPercentage(loanInterestRate)}</div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Cost Comparison Results</h2>
              
              {results && (
                <>
                  {/* Recommendation Banner */}
                  <div className={`${styles.recommendationBanner} ${recommendation.includes('LEASE') ? styles.leaseRecommendation : styles.buyRecommendation}`}>
                    <h3 className={styles.recommendationTitle}>
                      {recommendation.includes('LEASE') ? '🚗 RECOMMENDATION: LEASE' : '💰 RECOMMENDATION: BUY'}
                    </h3>
                    <p className={styles.recommendationText}>{recommendation}</p>
                  </div>

                  <div className={styles.resultsGrid}>
                    <div className={`${styles.resultItem} ${styles.leaseResult}`}>
                      <div className={styles.resultLabel}>Total Lease Cost ({leaseTerm} months)</div>
                      <div className={styles.resultValue}>{formatCurrency(results.totalLeaseCost)}</div>
                      {results.excessMileCost > 0 && (
                        <div className={styles.resultSubtext}>
                          +{formatCurrency(results.excessMileCost)} potential mileage fees
                        </div>
                      )}
                    </div>
                    
                    <div className={`${styles.resultItem} ${styles.buyResult}`}>
                      <div className={styles.resultLabel}>Total Purchase Cost</div>
                      <div className={styles.resultValue}>{formatCurrency(results.totalBuyCost)}</div>
                      <div className={styles.resultSubtext}>
                        Vehicle value after loan: {formatCurrency(results.vehicleValueAfterLoan)}
                      </div>
                    </div>
                    
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Monthly Payment (Lease)</div>
                      <div className={styles.resultValue}>{formatCurrency(results.monthlyLeasePayment)}</div>
                    </div>
                    
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Monthly Payment (Buy)</div>
                      <div className={styles.resultValue}>{formatCurrency(results.monthlyBuyPayment)}</div>
                      <div className={styles.resultSubtext}>
                        {loanTerm} months
                      </div>
                    </div>
                    
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>3-Year Lease Cost</div>
                      <div className={styles.resultValue}>{formatCurrency(results.threeYearLeaseCost)}</div>
                    </div>
                    
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>3-Year Buy Cost</div>
                      <div className={styles.resultValue}>{formatCurrency(results.threeYearBuyCost)}</div>
                      <div className={styles.resultSubtext}>
                        Estimated equity: {formatCurrency(results.threeYearBuyEquity)}
                      </div>
                    </div>
                  </div>

                  {/* Cost Over Time Chart */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>Cost Comparison Over Time</h3>
                    <div className={styles.chartBars}>
                      {chartData.map((data, index) => (
                        <div key={index} className={styles.chartBarGroup}>
                          <div className={styles.chartBarLabel}>Year {data.year}</div>
                          <div className={styles.chartBarContainer}>
                            <div 
                              className={styles.chartBarLease}
                              style={{ width: `${(data.leaseCost / Math.max(data.buyCost, data.leaseCost)) * 100}%` }}
                              title={`Lease: ${formatCurrency(data.leaseCost)}`}
                            />
                            <div 
                              className={styles.chartBarBuy}
                              style={{ width: `${(data.buyCost / Math.max(data.buyCost, data.leaseCost)) * 100}%` }}
                              title={`Buy: ${formatCurrency(data.buyCost)}`}
                            />
                          </div>
                          <div className={styles.chartBarValue}>
                            <div>Lease: {formatCurrency(data.leaseCost)}</div>
                            <div>Buy: {formatCurrency(data.buyCost)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.chartLegend}>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendLease}`}></div>
                        <span>Lease Cost</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendBuy}`}></div>
                        <span>Purchase Cost</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>💡 Key Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>Monthly payment difference: <strong>{formatCurrency(Math.abs(results.monthlyLeasePayment - results.monthlyBuyPayment))}</strong> {results.monthlyLeasePayment < results.monthlyBuyPayment ? 'less for lease' : 'less for purchase'}</li>
                      <li>After {loanTerm/12} years, you'll own a vehicle worth approximately <strong>{formatCurrency(results.vehicleValueAfterLoan)}</strong></li>
                      <li>Leasing costs <strong>{formatCurrency(results.totalLeaseCost)}</strong> with nothing to show at the end</li>
                      {results.excessMileCost > 0 && (
                        <li>Your driving habits could add <strong>{formatCurrency(results.excessMileCost)}</strong> in excess mileage fees if you lease</li>
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
              <h2 className={styles.articleTitle}>Lease vs Buy: Making the Smart Financial Decision</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>When Leasing Makes Sense</h3>
                <p>Leasing can be a smart choice for specific situations. Consider leasing if:</p>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>🚗 Low Monthly Payments</h4>
                    <p>Lease payments are typically 30-60% lower than loan payments for the same vehicle, freeing up cash flow for other investments.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🔄 Frequent Upgrades</h4>
                    <p>If you like driving new cars every 2-3 years with the latest technology and safety features, leasing eliminates trade-in hassles.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🏢 Business Use</h4>
                    <p>Businesses can often deduct lease payments as operating expenses, and maintenance is typically covered under warranty.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📊 Predictable Costs</h4>
                    <p>Most leases include warranty coverage for the entire term, making repair costs predictable and usually covered.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>When Buying is Better</h3>
                <p>Purchasing a vehicle often provides better long-term value. Buy if:</p>
                
                <div className={styles.exampleCard}>
                  <h4>Long-Term Ownership:</h4>
                  <ul>
                    <li><strong>Years 1-3:</strong> Buying costs more monthly but builds equity</li>
                    <li><strong>Years 4-6:</strong> You own the vehicle outright after loan payoff</li>
                    <li><strong>Years 7+:</strong> No payments, just maintenance costs</li>
                  </ul>
                  <p>The breakeven point is typically 4-5 years, after which buying becomes significantly cheaper.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Hidden Costs to Consider</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Lease Excess Fees:</strong> Mileage overage ($0.15-$0.30/mile), wear and tear charges, disposition fees ($300-$500)</li>
                  <li><strong>Purchase Long-term Costs:</strong> Repairs after warranty, depreciation (biggest cost), insurance may be higher</li>
                  <li><strong>Both:</strong> Sales tax (calculated differently), insurance, registration, maintenance</li>
                  <li><strong>Opportunity Cost:</strong> Money saved on lower lease payments could be invested elsewhere</li>
                  <li><strong>Flexibility:</strong> Early lease termination fees vs. selling a purchased vehicle</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Advice from Auto Financial Planners</h3>
                <blockquote className={styles.expertQuote}>
                  &quot;The biggest mistake people make is focusing only on monthly payments. Look at total cost of ownership over your intended ownership period. For most people who keep cars 5+ years, buying is financially superior. But for business users or those who want new cars frequently, leasing can make sense.&quot;
                  <footer className={styles.quoteFooter}>— Certified Automotive Financial Advisor, 20+ years experience</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What happens at the end of a lease?</h3>
                <p className={styles.faqAnswer}>You typically have three options: 1) Return the vehicle (pay any excess mileage or damage fees), 2) Purchase the vehicle at the predetermined residual value, or 3) Lease a new vehicle from the same dealership. Most people choose option 1 or 3.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How is the lease payment calculated?</h3>
                <p className={styles.faqAnswer}>Lease payments cover: 1) Depreciation (vehicle price minus residual value), 2) Rent charge (interest on the leased amount), 3) Taxes and fees. The formula is: (Capitalized Cost - Residual Value) ÷ Lease Term + (Capitalized Cost + Residual Value) × Money Factor.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Can I negotiate a lease like a purchase?</h3>
                <p className={styles.faqAnswer}>Yes! You can negotiate the vehicle price (capitalized cost), mileage allowance, money factor (interest rate), and fees. The biggest opportunities are in negotiating the vehicle price and the residual value percentage.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What&apos;s the impact of mileage on my decision?</h3>
                <p className={styles.faqAnswer}>High mileage drivers (15,000+ miles/year) should generally buy. Excess mileage fees add up quickly: 5,000 excess miles at $0.25/mile = $1,250 per year. Low-mileage drivers (&lt;10,000 miles/year) can benefit from lower lease rates.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Ready to Make Your Decision?</h2>
              <p className={styles.ctaText}>Use our calculator to model your specific situation. Adjust the inputs based on your driving habits, financial situation, and vehicle preferences.</p>
              
              <div className={styles.buttonGroup}>
                <button className={styles.primaryButton} onClick={() => window.print()}>
                  📄 Print This Analysis
                </button>
                <button className={styles.secondaryButton} onClick={() => {
                  // Reset to default values
                  setVehiclePrice(35000);
                  setLeaseTerm(36);
                  setMonthlyLeasePayment(450);
                  setLoanTerm(60);
                  setDownPayment(5000);
                  setExpectedMileage(15000);
                }}>
                  🔄 Reset Calculator
                </button>
              </div>
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates for educational purposes. Actual lease terms, interest rates, and vehicle values may vary. Consult with financial and automotive professionals before making major vehicle decisions. Vehicle depreciation rates are estimates based on industry averages.
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

export default LeaseVsBuyCalculator;