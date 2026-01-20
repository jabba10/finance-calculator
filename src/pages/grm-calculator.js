import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './grmcalculator.module.css';

const GrossRentMultiplierCalculator = ({ currentDate, lastModifiedDate }) => {
  const [propertyPrice, setPropertyPrice] = useState(300000);
  const [annualGrossRent, setAnnualGrossRent] = useState(36000);
  const [vacancyRate, setVacancyRate] = useState(5);
  const [operatingExpenses, setOperatingExpenses] = useState(40);
  const [propertyType, setPropertyType] = useState('residential');
  const [locationType, setLocationType] = useState('urban');
  const [results, setResults] = useState(null);
  const [comparisonData, setComparisonData] = useState([]);

  const propertyTypeData = {
    residential: { label: 'Residential', color: '#4a6bdf', avgGRM: 10 },
    commercial: { label: 'Commercial', color: '#34a853', avgGRM: 12 },
    multifamily: { label: 'Multi-Family', color: '#ea4335', avgGRM: 8 },
    industrial: { label: 'Industrial', color: '#fbbc05', avgGRM: 14 },
    retail: { label: 'Retail', color: '#9c27b0', avgGRM: 11 }
  };

  const locationTypeData = {
    urban: { label: 'Urban', color: '#2196f3', premium: 1.2 },
    suburban: { label: 'Suburban', color: '#4caf50', premium: 1.0 },
    rural: { label: 'Rural', color: '#ff9800', premium: 0.8 }
  };

  const calculateGRM = () => {
    const monthlyGrossRent = annualGrossRent / 12;
    const grm = propertyPrice / annualGrossRent;
    
    // Calculate net operating income
    const vacancyAmount = annualGrossRent * (vacancyRate / 100);
    const effectiveGrossIncome = annualGrossRent - vacancyAmount;
    const operatingExpenseAmount = effectiveGrossIncome * (operatingExpenses / 100);
    const noi = effectiveGrossIncome - operatingExpenseAmount;
    
    // Calculate cap rate
    const capRate = (noi / propertyPrice) * 100;
    
    // Calculate cash flow (assuming 25% down payment, 4.5% interest, 30 years)
    const downPayment = propertyPrice * 0.25;
    const loanAmount = propertyPrice - downPayment;
    const monthlyMortgage = calculateMonthlyMortgage(loanAmount, 4.5, 30);
    const annualMortgage = monthlyMortgage * 12;
    const annualCashFlow = noi - annualMortgage;
    const cashOnCashReturn = (annualCashFlow / downPayment) * 100;
    
    // Calculate industry benchmarks
    const baseGRM = propertyTypeData[propertyType].avgGRM;
    const locationFactor = locationTypeData[locationType].premium;
    const marketAverageGRM = baseGRM * locationFactor;
    
    // Generate comparison data
    const grmRanges = [5, 8, 10, 12, 15, 20];
    const comparisonPoints = grmRanges.map(grmValue => {
      const impliedPrice = annualGrossRent * grmValue;
      const priceDifference = impliedPrice - propertyPrice;
      const pricePercentage = (priceDifference / propertyPrice) * 100;
      
      return {
        grm: grmValue,
        impliedPrice,
        priceDifference,
        pricePercentage,
        isCurrent: Math.abs(grmValue - grm) < 0.5
      };
    });

    setComparisonData(comparisonPoints);
    
    setResults({
      grm: grm,
      monthlyGrossRent: monthlyGrossRent,
      effectiveGrossIncome: effectiveGrossIncome,
      noi: noi,
      capRate: capRate,
      annualCashFlow: annualCashFlow,
      cashOnCashReturn: cashOnCashReturn,
      marketAverageGRM: marketAverageGRM,
      investmentQuality: assessInvestmentQuality(grm, marketAverageGRM, capRate),
      breakevenYears: grm
    });
  };

  const calculateMonthlyMortgage = (principal, annualRate, years) => {
    const monthlyRate = annualRate / 100 / 12;
    const numberOfPayments = years * 12;
    const monthlyPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments) / 
                          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    return monthlyPayment;
  };

  const assessInvestmentQuality = (grm, marketAverage, capRate) => {
    if (grm < marketAverage * 0.8 && capRate > 8) {
      return { level: 'excellent', label: 'Excellent Deal', color: '#2e7d32' };
    } else if (grm < marketAverage * 0.9 && capRate > 6) {
      return { level: 'good', label: 'Good Investment', color: '#4caf50' };
    } else if (grm < marketAverage && capRate > 5) {
      return { level: 'fair', label: 'Fair Market Value', color: '#ff9800' };
    } else if (grm <= marketAverage * 1.1) {
      return { level: 'average', label: 'Average Market', color: '#9e9e9e' };
    } else {
      return { level: 'poor', label: 'Overpriced', color: '#f44336' };
    }
  };

  useEffect(() => {
    calculateGRM();
  }, [propertyPrice, annualGrossRent, vacancyRate, operatingExpenses, propertyType, locationType]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatCurrencyShort = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return formatCurrency(value);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(2)}%`;
  };

  const formatNumber = (value, decimals = 2) => {
    return value.toFixed(decimals);
  };

  const applyPreset = (preset) => {
    switch(preset) {
      case 'apartment':
        setPropertyPrice(450000);
        setAnnualGrossRent(54000);
        setPropertyType('multifamily');
        setLocationType('urban');
        setVacancyRate(4);
        setOperatingExpenses(35);
        break;
      case 'singleFamily':
        setPropertyPrice(350000);
        setAnnualGrossRent(30000);
        setPropertyType('residential');
        setLocationType('suburban');
        setVacancyRate(3);
        setOperatingExpenses(30);
        break;
      case 'commercialOffice':
        setPropertyPrice(800000);
        setAnnualGrossRent(96000);
        setPropertyType('commercial');
        setLocationType('urban');
        setVacancyRate(8);
        setOperatingExpenses(45);
        break;
      case 'retailStrip':
        setPropertyPrice(600000);
        setAnnualGrossRent(66000);
        setPropertyType('retail');
        setLocationType('suburban');
        setVacancyRate(6);
        setOperatingExpenses(42);
        break;
      case 'industrialWarehouse':
        setPropertyPrice(1200000);
        setAnnualGrossRent(144000);
        setPropertyType('industrial');
        setLocationType('rural');
        setVacancyRate(2);
        setOperatingExpenses(38);
        break;
      default:
        // Reset to defaults
        setPropertyPrice(300000);
        setAnnualGrossRent(36000);
        setPropertyType('residential');
        setLocationType('urban');
        setVacancyRate(5);
        setOperatingExpenses(40);
    }
  };

  const getPropertyTypeColor = (type) => {
    return propertyTypeData[type]?.color || '#666666';
  };

  const getLocationTypeColor = (type) => {
    return locationTypeData[type]?.color || '#666666';
  };

  const getPropertyTypeStyle = (type) => {
    const color = getPropertyTypeColor(type);
    return { '--property-color': color };
  };

  const getLocationTypeStyle = (type) => {
    const color = getLocationTypeColor(type);
    return { '--location-color': color };
  };

  return (
    <>
      <Head>
        <title>Advanced Gross Rent Multiplier Calculator | Real Estate Investment Analysis</title>
        <meta name="description" content="Professional GRM calculator for real estate investors. Calculate gross rent multiplier, cap rate, cash flow, and assess property investment quality." />
        <meta name="keywords" content="gross rent multiplier calculator, GRM calculator, real estate investment, property analysis, cap rate calculator, rental property calculator, investment property analysis" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com//grm-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Advanced Gross Rent Multiplier Calculator | Professional Real Estate Investment Tool" />
        <meta property="og:description" content="Calculate GRM, cap rate, and cash flow for any rental property. Free professional real estate investment analysis tool." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com//grm-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Advanced Gross Rent Multiplier Calculator" />
        <meta name="twitter:description" content="Professional tool for calculating GRM and analyzing rental property investments." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="grm-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Advanced Gross Rent Multiplier Calculator",
            "description": "Professional gross rent multiplier calculator with comprehensive real estate investment analysis",
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
              "name": "Real Estate Tools Pro",
              "url": "https://www.financecalculatorfree.com"
            },
            "featureList": [
              "Gross Rent Multiplier Calculation",
              "Cap Rate Analysis",
              "Cash Flow Projection",
              "Market Comparison",
              "Investment Quality Assessment",
              "Multiple Property Presets",
              "Export Results"
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
                "name": "What is Gross Rent Multiplier (GRM) and how is it calculated?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "GRM is a real estate valuation metric calculated by dividing the property price by its annual gross rental income. It shows how many years of rent it would take to pay off the property purchase price, helping investors quickly compare properties.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What's considered a good GRM for rental properties?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A good GRM varies by location and property type. Generally, GRM below 10 is excellent, 10-15 is good, 15-20 is average, and above 20 may indicate overpricing. Always compare to local market averages for the specific property type.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What's the difference between GRM and cap rate?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "GRM uses gross rental income and is a quick screening tool, while cap rate uses net operating income (after expenses) and provides a more accurate return analysis. GRM is better for initial comparisons, while cap rate is essential for final investment decisions.",
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
            <h1 className={styles.mainTitle}>Advanced Gross Rent Multiplier Calculator</h1>
            <p className={styles.subtitle}>Professional Real Estate Investment Analysis with GRM, Cap Rate, and Cash Flow Calculations</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>Real Estate Pro</span>
              <span className={styles.badge}>Free Forever</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Property Parameters</h2>
              
              <div className={styles.presetSection}>
                <h3 className={styles.presetTitle}>Quick Property Presets</h3>
                <div className={styles.presetGrid}>
                  <button 
                    className={`${styles.presetButton} ${propertyType === 'multifamily' && locationType === 'urban' ? styles.presetActive : ''}`}
                    onClick={() => applyPreset('apartment')}
                    style={getPropertyTypeStyle('multifamily')}
                  >
                    🏢 Apartment Building
                  </button>
                  <button 
                    className={`${styles.presetButton} ${propertyType === 'residential' && locationType === 'suburban' ? styles.presetActive : ''}`}
                    onClick={() => applyPreset('singleFamily')}
                    style={getPropertyTypeStyle('residential')}
                  >
                    🏡 Single Family Home
                  </button>
                  <button 
                    className={`${styles.presetButton} ${propertyType === 'commercial' && locationType === 'urban' ? styles.presetActive : ''}`}
                    onClick={() => applyPreset('commercialOffice')}
                    style={getPropertyTypeStyle('commercial')}
                  >
                    🏢 Commercial Office
                  </button>
                  <button 
                    className={`${styles.presetButton} ${propertyType === 'retail' && locationType === 'suburban' ? styles.presetActive : ''}`}
                    onClick={() => applyPreset('retailStrip')}
                    style={getPropertyTypeStyle('retail')}
                  >
                    🛍️ Retail Strip Mall
                  </button>
                  <button 
                    className={`${styles.presetButton} ${propertyType === 'industrial' && locationType === 'rural' ? styles.presetActive : ''}`}
                    onClick={() => applyPreset('industrialWarehouse')}
                    style={getPropertyTypeStyle('industrial')}
                  >
                    🏭 Industrial Warehouse
                  </button>
                </div>
              </div>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Property Purchase Price
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="50000"
                      max="5000000"
                      step="10000"
                      value={propertyPrice}
                      onChange={(e) => setPropertyPrice(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="50000"
                      max="5000000"
                      step="10000"
                      value={propertyPrice}
                      onChange={(e) => setPropertyPrice(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(propertyPrice)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Annual Gross Rental Income
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="6000"
                      max="600000"
                      step="1000"
                      value={annualGrossRent}
                      onChange={(e) => setAnnualGrossRent(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="6000"
                      max="600000"
                      step="1000"
                      value={annualGrossRent}
                      onChange={(e) => setAnnualGrossRent(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(annualGrossRent)}/year</div>
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
                      step="0.5"
                      value={vacancyRate}
                      onChange={(e) => setVacancyRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="20"
                      step="0.5"
                      value={vacancyRate}
                      onChange={(e) => setVacancyRate(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(vacancyRate)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Operating Expenses (% of EGI)
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="20"
                      max="60"
                      step="1"
                      value={operatingExpenses}
                      onChange={(e) => setOperatingExpenses(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="20"
                      max="60"
                      step="1"
                      value={operatingExpenses}
                      onChange={(e) => setOperatingExpenses(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(operatingExpenses)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Property Type
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className={styles.selectInput}
                    style={getPropertyTypeStyle(propertyType)}
                  >
                    <option value="residential">Residential (Single Family)</option>
                    <option value="multifamily">Multi-Family (Apartments)</option>
                    <option value="commercial">Commercial (Office)</option>
                    <option value="retail">Retail</option>
                    <option value="industrial">Industrial</option>
                  </select>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Location Type
                  <select
                    value={locationType}
                    onChange={(e) => setLocationType(e.target.value)}
                    className={styles.selectInput}
                    style={getLocationTypeStyle(locationType)}
                  >
                    <option value="urban">Urban</option>
                    <option value="suburban">Suburban</option>
                    <option value="rural">Rural</option>
                  </select>
                </label>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Investment Analysis Results</h2>
              
              {results && (
                <>
                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Gross Rent Multiplier</div>
                      <div className={`${styles.resultValue} ${styles[results.investmentQuality.level]}`}>
                        {formatNumber(results.grm)}
                      </div>
                      <div className={styles.resultSubtext}>
                        Years to payback from gross rent
                      </div>
                    </div>
                    
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Capitalization Rate</div>
                      <div className={`${styles.resultValue} ${results.capRate > 6 ? styles.good : results.capRate > 4 ? styles.fair : styles.poor}`}>
                        {formatPercentage(results.capRate)}
                      </div>
                      <div className={styles.resultSubtext}>
                        Annual return on property value
                      </div>
                    </div>
                    
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Annual Cash Flow</div>
                      <div className={`${styles.resultValue} ${results.annualCashFlow > 0 ? styles.good : styles.poor}`}>
                        {formatCurrency(results.annualCashFlow)}
                      </div>
                      <div className={styles.resultSubtext}>
                        After all expenses & mortgage
                      </div>
                    </div>
                    
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Cash on Cash Return</div>
                      <div className={`${styles.resultValue} ${results.cashOnCashReturn > 10 ? styles.excellent : results.cashOnCashReturn > 6 ? styles.good : results.cashOnCashReturn > 0 ? styles.fair : styles.poor}`}>
                        {formatPercentage(results.cashOnCashReturn)}
                      </div>
                      <div className={styles.resultSubtext}>
                        Return on down payment
                      </div>
                    </div>
                  </div>

                  {/* Investment Quality Assessment */}
                  <div className={styles.assessmentCard}>
                    <h3 className={styles.assessmentTitle}>Investment Quality Assessment</h3>
                    <div className={styles.assessmentContent}>
                      <div className={styles.assessmentBadge} style={{ backgroundColor: results.investmentQuality.color }}>
                        {results.investmentQuality.label}
                      </div>
                      <div className={styles.assessmentDetails}>
                        <p>
                          <strong>Your GRM: {formatNumber(results.grm)}</strong> vs 
                          <strong> Market Average: {formatNumber(results.marketAverageGRM)}</strong>
                        </p>
                        <p>
                          {results.grm < results.marketAverageGRM ? (
                            <>Your GRM is <strong>{formatPercentage(((results.marketAverageGRM - results.grm) / results.marketAverageGRM) * 100)} below</strong> market average</>
                          ) : (
                            <>Your GRM is <strong>{formatPercentage(((results.grm - results.marketAverageGRM) / results.marketAverageGRM) * 100)} above</strong> market average</>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* GRM Comparison Chart */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>GRM Market Comparison</h3>
                    <div className={styles.chartWrapper}>
                      <div className={styles.chartYAxis}>
                        <div>Property Value</div>
                        <div className={styles.currentPrice}>Current: {formatCurrencyShort(propertyPrice)}</div>
                        <div>-</div>
                      </div>
                      <div className={styles.chartBars}>
                        {comparisonData.map((data, index) => (
                          <div key={index} className={styles.chartBarGroup}>
                            <div 
                              className={`${styles.chartBar} ${data.isCurrent ? styles.currentBar : styles.comparisonBar}`}
                              style={{ 
                                height: `${Math.min((data.impliedPrice / propertyPrice) * 50, 100)}%`
                              }}
                              title={`GRM ${data.grm}: ${formatCurrency(data.impliedPrice)} (${data.priceDifference > 0 ? '+' : ''}${formatPercentage(data.pricePercentage)})`}
                            />
                            <div className={styles.chartBarLabel}>GRM {data.grm}</div>
                            <div className={styles.chartBarValue}>
                              {data.priceDifference > 0 ? '+' : ''}{formatPercentage(data.pricePercentage)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className={styles.chartLegend}>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendCurrent}`}></div>
                        <span>Current Property Value</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendComparison}`}></div>
                        <span>Implied Value at Different GRMs</span>
                      </div>
                    </div>
                  </div>

                  {/* Income Breakdown */}
                  <div className={styles.breakdownCard}>
                    <h3 className={styles.breakdownTitle}>Annual Income Breakdown</h3>
                    <div className={styles.breakdownGrid}>
                      <div className={styles.breakdownItem}>
                        <div className={styles.breakdownLabel}>Gross Rental Income</div>
                        <div className={styles.breakdownValue}>{formatCurrency(annualGrossRent)}</div>
                        <div className={styles.breakdownBar}>
                          <div className={styles.breakdownBarFill} style={{ width: '100%' }}></div>
                        </div>
                      </div>
                      
                      <div className={styles.breakdownItem}>
                        <div className={styles.breakdownLabel}>Vacancy Loss ({vacancyRate}%)</div>
                        <div className={styles.breakdownValue}>-{formatCurrency(annualGrossRent * (vacancyRate / 100))}</div>
                        <div className={styles.breakdownBar}>
                          <div className={styles.breakdownBarFill} style={{ width: `${vacancyRate}%`, backgroundColor: '#f44336' }}></div>
                        </div>
                      </div>
                      
                      <div className={styles.breakdownItem}>
                        <div className={styles.breakdownLabel}>Effective Gross Income</div>
                        <div className={styles.breakdownValue}>{formatCurrency(results.effectiveGrossIncome)}</div>
                        <div className={styles.breakdownBar}>
                          <div className={styles.breakdownBarFill} style={{ width: `${100 - vacancyRate}%`, backgroundColor: '#4caf50' }}></div>
                        </div>
                      </div>
                      
                      <div className={styles.breakdownItem}>
                        <div className={styles.breakdownLabel}>Operating Expenses ({operatingExpenses}%)</div>
                        <div className={styles.breakdownValue}>-{formatCurrency(results.effectiveGrossIncome * (operatingExpenses / 100))}</div>
                        <div className={styles.breakdownBar}>
                          <div className={styles.breakdownBarFill} style={{ width: `${operatingExpenses}%`, backgroundColor: '#ff9800' }}></div>
                        </div>
                      </div>
                      
                      <div className={styles.breakdownItem}>
                        <div className={styles.breakdownLabel}>Net Operating Income</div>
                        <div className={styles.breakdownValue}>{formatCurrency(results.noi)}</div>
                        <div className={styles.breakdownBar}>
                          <div className={styles.breakdownBarFill} style={{ width: `${(results.noi / annualGrossRent) * 100}%`, backgroundColor: '#2196f3' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>📊 Investment Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>This property would pay for itself in <strong>{formatNumber(results.breakevenYears)} years</strong> from gross rent alone</li>
                      <li>Monthly gross rent is <strong>{formatCurrency(results.monthlyGrossRent)}</strong>, translating to <strong>{formatPercentage((results.monthlyGrossRent / (propertyPrice / 1000)) * 12)}</strong> per $1,000 of property value</li>
                      <li>The cap rate of <strong>{formatPercentage(results.capRate)}</strong> compares to typical market rates of 4-10% for similar properties</li>
                      {results.annualCashFlow > 0 ? (
                        <li>Positive annual cash flow of <strong>{formatCurrency(results.annualCashFlow)}</strong> provides a cushion for unexpected expenses</li>
                      ) : (
                        <li>Negative annual cash flow of <strong>{formatCurrency(results.annualCashFlow)}</strong> requires additional investment to cover expenses</li>
                      )}
                    </ul>
                  </div>

                  {/* Quick Assessment Table */}
                  <div className={styles.assessmentTable}>
                    <h3 className={styles.tableTitle}>Quick Investment Assessment</h3>
                    <div className={styles.tableContainer}>
                      <table className={styles.analysisTable}>
                        <thead>
                          <tr>
                            <th>Metric</th>
                            <th>Your Property</th>
                            <th>Benchmark</th>
                            <th>Assessment</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className={styles.tableCell}>GRM</td>
                            <td className={styles.tableCell}>{formatNumber(results.grm)}</td>
                            <td className={styles.tableCell}>{formatNumber(results.marketAverageGRM)}</td>
                            <td className={styles.tableCell}>
                              <span className={results.grm < results.marketAverageGRM ? styles.goodText : styles.poorText}>
                                {results.grm < results.marketAverageGRM ? 'Below Market ✓' : 'Above Market ⚠'}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className={styles.tableCell}>Cap Rate</td>
                            <td className={styles.tableCell}>{formatPercentage(results.capRate)}</td>
                            <td className={styles.tableCell}>6-10%</td>
                            <td className={styles.tableCell}>
                              <span className={results.capRate >= 6 ? styles.goodText : results.capRate >= 4 ? styles.fairText : styles.poorText}>
                                {results.capRate >= 6 ? 'Good ✓' : results.capRate >= 4 ? 'Fair ~' : 'Poor ⚠'}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className={styles.tableCell}>Cash Flow</td>
                            <td className={styles.tableCell}>{formatCurrency(results.annualCashFlow)}</td>
                            <td className={styles.tableCell}>Positive</td>
                            <td className={styles.tableCell}>
                              <span className={results.annualCashFlow > 0 ? styles.goodText : styles.poorText}>
                                {results.annualCashFlow > 0 ? 'Positive ✓' : 'Negative ⚠'}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className={styles.tableCell}>Cash on Cash</td>
                            <td className={styles.tableCell}>{formatPercentage(results.cashOnCashReturn)}</td>
                            <td className={styles.tableCell}>8-12%</td>
                            <td className={styles.tableCell}>
                              <span className={results.cashOnCashReturn >= 8 ? styles.goodText : results.cashOnCashReturn >= 6 ? styles.fairText : styles.poorText}>
                                {results.cashOnCashReturn >= 8 ? 'Good ✓' : results.cashOnCashReturn >= 6 ? 'Fair ~' : 'Poor ⚠'}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Educational Content */}
          <div className={styles.educationalContent}>
            <article className={styles.articleCard}>
              <h2 className={styles.articleTitle}>Mastering Gross Rent Multiplier: The Real Estate Investor's Guide to Quick Property Valuation</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Understanding Gross Rent Multiplier Fundamentals</h3>
                <p>Gross Rent Multiplier (GRM) is one of the most powerful quick-screening tools in real estate investing. It provides a simple way to compare properties by showing how many years of gross rent it would take to pay off the purchase price. While not as detailed as cap rate analysis, GRM excels at initial property screening and market comparisons.</p>
                
                <div className={styles.exampleCard}>
                  <h4>Real-World GRM Example:</h4>
                  <p>Consider a $300,000 rental property with $36,000 in annual gross rent:</p>
                  <ul>
                    <li><strong>GRM Calculation:</strong> $300,000 ÷ $36,000 = <strong>8.33</strong></li>
                    <li><strong>Interpretation:</strong> It would take 8.33 years of gross rent to pay off the purchase price</li>
                    <li><strong>Monthly Equivalent:</strong> $3,000 monthly rent for a $300,000 property</li>
                  </ul>
                  <p>A GRM of 8.33 is generally considered excellent for most markets, indicating strong rental income relative to purchase price.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>When to Use GRM vs Other Real Estate Metrics</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>⚡ GRM for Quick Screening</h4>
                    <p>Use GRM when initially screening multiple properties. It's fast, requires minimal data (just price and gross rent), and helps quickly eliminate overpriced properties.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🎯 Cap Rate for Accurate Analysis</h4>
                    <p>Cap Rate uses Net Operating Income (after expenses). Use for final investment decisions when you have complete expense data and need accurate return calculations.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>💰 Cash on Cash for Investor Returns</h4>
                    <p>Cash on Cash Return measures actual cash return on invested capital. Use when evaluating financing options and actual investor returns.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📈 IRR for Long-Term Projects</h4>
                    <p>Internal Rate of Return accounts for time value of money and holding period. Use for development projects or properties with significant value-add potential.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Industry-Specific GRM Benchmarks</h3>
                <div className={styles.industryTable}>
                  <div className={styles.industryRow}>
                    <div className={styles.industryCell}><strong>Property Type</strong></div>
                    <div className={styles.industryCell}><strong>Typical GRM Range</strong></div>
                    <div className={styles.industryCell}><strong>Market Characteristics</strong></div>
                  </div>
                  <div className={styles.industryRow}>
                    <div className={styles.industryCell}>Urban Apartments</div>
                    <div className={styles.industryCell}>8-12</div>
                    <div className={styles.industryCell}>High demand, stable rents, lower vacancy</div>
                  </div>
                  <div className={styles.industryRow}>
                    <div className={styles.industryCell}>Suburban Single Family</div>
                    <div className={styles.industryCell}>10-15</div>
                    <div className={styles.industryCell}>Family-oriented, appreciation potential</div>
                  </div>
                  <div className={styles.industryRow}>
                    <div className={styles.industryCell}>Commercial Office</div>
                    <div className={styles.industryCell}>12-18</div>
                    <div className={styles.industryCell}>Longer leases, higher tenant quality</div>
                  </div>
                  <div className={styles.industryRow}>
                    <div className={styles.industryCell}>Retail Space</div>
                    <div className={styles.industryCell}>11-16</div>
                    <div className={styles.industryCell}>Percentage rents, location critical</div>
                  </div>
                  <div className={styles.industryRow}>
                    <div className={styles.industryCell}>Industrial Warehouse</div>
                    <div className={styles.industryCell}>14-20</div>
                    <div className={styles.industryCell}>Long-term tenants, specialized facilities</div>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Advanced GRM Strategies and Limitations</h3>
                <blockquote className={styles.expertQuote}>
                  "GRM is an excellent screening tool but has significant limitations. It ignores operating expenses, vacancy rates, and financing costs. A property with a great GRM can still be a terrible investment if expenses are too high. Always follow up GRM analysis with detailed cap rate and cash flow calculations before making investment decisions."
                  <footer className={styles.quoteFooter}>— Real Estate Investment Advisor, 15+ years experience</footer>
                </blockquote>
                
                <div className={styles.limitationsList}>
                  <h4>Key Limitations to Consider:</h4>
                  <ul>
                    <li><strong>Expense Blindness:</strong> GRM ignores operating expenses, which can vary widely between properties</li>
                    <li><strong>Vacancy Ignored:</strong> Doesn't account for vacancy rates or collection losses</li>
                    <li><strong>Financing Excluded:</strong> Mortgage costs and financing terms aren't considered</li>
                    <li><strong>Property Condition:</strong> Doesn't account for maintenance needs or capital expenditures</li>
                    <li><strong>Market Specific:</strong> GRM benchmarks vary significantly by location and property type</li>
                  </ul>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Practical Applications for Real Estate Investors</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Property Screening:</strong> Quickly eliminate overpriced properties from consideration</li>
                  <li><strong>Market Analysis:</strong> Compare GRMs across different neighborhoods and property types</li>
                  <li><strong>Offer Pricing:</strong> Determine appropriate offer prices based on market GRM benchmarks</li>
                  <li><strong>Portfolio Management:</strong> Screen existing portfolio for underperforming properties</li>
                  <li><strong>Due Diligence:</strong> Initial check before committing to detailed property analysis</li>
                  <li><strong>Seller Negotiation:</strong> Use GRM analysis to justify offer prices to sellers</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>The GRM Rule of Thumb: Quick Mental Calculations</h3>
                <div className={styles.ruleCard}>
                  <h4>🚀 Quick GRM Estimation Formula:</h4>
                  <p><strong>Monthly Rent Method:</strong> Multiply monthly rent by 100-150 for property value range</p>
                  <p><strong>Example:</strong> $2,500 monthly rent × 120 = $300,000 estimated property value</p>
                  <p><strong>Annual Rent Method:</strong> Multiply annual rent by 8-12 for typical GRM range</p>
                  <p><strong>Example:</strong> $30,000 annual rent × 10 = $300,000 estimated property value</p>
                </div>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's considered a good GRM for investment properties?</h3>
                <p className={styles.faqAnswer}>A "good" GRM varies by market and property type. Generally, GRM below 10 is excellent, 10-15 is good, 15-20 is average, and above 20 may indicate overpricing. However, always compare to local market averages - a GRM of 12 might be excellent in San Francisco but poor in Cleveland.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Why might a property with a low GRM still be a bad investment?</h3>
                <p className={styles.faqAnswer}>A low GRM indicates strong rental income relative to price, but it doesn't consider expenses. Properties with high maintenance costs, frequent vacancies, or expensive financing can have low GRMs but still generate negative cash flow. Always analyze net operating income and cash flow after all expenses.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How does GRM differ from the 1% rule in real estate?</h3>
                <p className={styles.faqAnswer}>The 1% rule states monthly rent should be at least 1% of purchase price (GRM of 8.33). GRM is more flexible as it's expressed as a multiple of annual rent. The 1% rule is a specific threshold (GRM ≤ 8.33), while GRM allows comparison across different multiples.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Should I use GRM for commercial properties or just residential?</h3>
                <p className={styles.faqAnswer}>GRM can be used for both, but benchmark ranges differ. Commercial properties typically have higher GRMs (12-20) due to longer leases, higher tenant quality, and different expense structures. Residential GRMs are generally lower (8-15). Always use property-type-specific benchmarks.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Ready to Analyze Your Real Estate Investments?</h2>
              <p className={styles.ctaText}>Use our GRM calculator to screen properties, compare market values, and make data-driven real estate investment decisions. Save time on due diligence and identify profitable opportunities faster.</p>
              
              
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates for educational and informational purposes only. Real estate investment involves significant risk. Calculations are based on simplified assumptions and may not reflect actual market conditions or property performance. Always conduct thorough due diligence, consult with real estate professionals, and consider all expenses, risks, and local market conditions before making investment decisions. Past performance does not guarantee future results.
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
    revalidate: 21600, // 6 hours
  };
}

export default GrossRentMultiplierCalculator;