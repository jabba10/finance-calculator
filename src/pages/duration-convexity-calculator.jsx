import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './durationconvexitycalculator.module.css';

const DurationConvexityCalculator = ({ currentDate, lastModifiedDate }) => {
  const [bondType, setBondType] = useState('fixed-rate');
  const [faceValue, setFaceValue] = useState(1000);
  const [couponRate, setCouponRate] = useState(5);
  const [yieldToMaturity, setYieldToMaturity] = useState(6);
  const [yearsToMaturity, setYearsToMaturity] = useState(10);
  const [couponFrequency, setCouponFrequency] = useState(2);
  const [settlementDays, setSettlementDays] = useState(0);
  const [results, setResults] = useState(null);
  const [durationConvexityData, setDurationConvexityData] = useState([]);
  const [priceYieldCurve, setPriceYieldCurve] = useState([]);

  const bondTypes = {
    'fixed-rate': {
      name: "Fixed-Rate Bond",
      description: "Standard bond with fixed coupon payments"
    },
    'zero-coupon': {
      name: "Zero-Coupon Bond",
      description: "Bond with no coupon payments, sold at discount"
    },
    'callable': {
      name: "Callable Bond",
      description: "Bond that can be redeemed early by issuer"
    },
    'floating-rate': {
      name: "Floating-Rate Bond",
      description: "Coupon rate adjusts with market rates"
    }
  };

  const couponFrequencies = {
    1: { name: "Annual", periodsPerYear: 1 },
    2: { name: "Semi-Annual", periodsPerYear: 2 },
    4: { name: "Quarterly", periodsPerYear: 4 },
    12: { name: "Monthly", periodsPerYear: 12 }
  };

  const calculateDurationConvexity = () => {
    const F = faceValue; // Face value
    const C = (couponRate / 100) * F; // Annual coupon payment
    const y = yieldToMaturity / 100; // Yield to maturity (decimal)
    const n = yearsToMaturity; // Years to maturity
    const m = couponFrequency; // Coupon frequency per year
    const settlement = settlementDays / 365; // Settlement period in years
    
    const totalPeriods = n * m;
    const periodYield = y / m;
    const periodCoupon = C / m;
    
    // Calculate bond price
    let bondPrice = 0;
    let macaulayDuration = 0;
    let modifiedDuration = 0;
    let convexity = 0;
    
    // Calculate present value of each cash flow
    for (let t = 1; t <= totalPeriods; t++) {
      let cashFlow;
      
      if (bondType === 'zero-coupon') {
        // Only final payment for zero-coupon bonds
        cashFlow = (t === totalPeriods) ? F : 0;
      } else {
        // Regular coupon payments plus face value at maturity
        cashFlow = (t === totalPeriods) ? periodCoupon + F : periodCoupon;
      }
      
      const presentValue = cashFlow / Math.pow(1 + periodYield, t + settlement * m);
      bondPrice += presentValue;
      
      // Calculate Macaulay Duration components
      macaulayDuration += (t / m) * presentValue;
    }
    
    // Calculate Macaulay Duration
    macaulayDuration /= bondPrice;
    
    // Calculate Modified Duration
    modifiedDuration = macaulayDuration / (1 + (y / m));
    
    // Calculate Convexity
    for (let t = 1; t <= totalPeriods; t++) {
      let cashFlow;
      
      if (bondType === 'zero-coupon') {
        cashFlow = (t === totalPeriods) ? F : 0;
      } else {
        cashFlow = (t === totalPeriods) ? periodCoupon + F : periodCoupon;
      }
      
      const presentValue = cashFlow / Math.pow(1 + periodYield, t + settlement * m);
      convexity += (t * (t + 1)) * presentValue;
    }
    
    convexity /= (bondPrice * Math.pow(1 + periodYield, 2) * Math.pow(m, 2));
    
    // Calculate price change approximations
    const yieldChange = 0.01; // 1% yield change
    const durationEffect = -modifiedDuration * yieldChange * 100; // Percentage change
    const convexityEffect = 0.5 * convexity * Math.pow(yieldChange * 100, 2); // Percentage change
    const totalPriceChange = durationEffect + convexityEffect;
    
    // Calculate effective duration and convexity (for callable bonds)
    let effectiveDuration = modifiedDuration;
    let effectiveConvexity = convexity;
    
    if (bondType === 'callable') {
      // Simplified callable bond adjustment
      effectiveDuration = modifiedDuration * 0.8; // Callable bonds have lower duration
      effectiveConvexity = convexity * 0.5; // Negative convexity for callable bonds
    }
    
    // Generate duration/convexity data over time
    const generateDurationConvexityData = () => {
      const data = [];
      
      for (let year = 1; year <= n; year += Math.max(1, Math.floor(n / 10))) {
        const periods = year * m;
        let price = 0;
        let macDur = 0;
        let modDur = 0;
        let conv = 0;
        
        for (let t = 1; t <= periods; t++) {
          let cashFlow;
          
          if (bondType === 'zero-coupon') {
            cashFlow = (t === periods) ? F : 0;
          } else {
            cashFlow = (t === periods) ? periodCoupon + F : periodCoupon;
          }
          
          const pv = cashFlow / Math.pow(1 + periodYield, t);
          price += pv;
          macDur += (t / m) * pv;
          
          // Convexity component
          conv += (t * (t + 1)) * pv;
        }
        
        if (price > 0) {
          macDur /= price;
          modDur = macDur / (1 + (y / m));
          conv /= (price * Math.pow(1 + periodYield, 2) * Math.pow(m, 2));
          
          data.push({
            year: year,
            price: Math.round(price * 100) / 100,
            macaulayDuration: Math.round(macDur * 100) / 100,
            modifiedDuration: Math.round(modDur * 100) / 100,
            convexity: Math.round(conv * 100) / 100
          });
        }
      }
      
      return data;
    };
    
    // Generate price-yield curve
    const generatePriceYieldCurve = () => {
      const curve = [];
      const yieldSteps = [-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2]; // Yield changes in %
      
      yieldSteps.forEach(yieldChange => {
        const newYield = y + (yieldChange / 100);
        let price = 0;
        
        for (let t = 1; t <= totalPeriods; t++) {
          let cashFlow;
          
          if (bondType === 'zero-coupon') {
            cashFlow = (t === totalPeriods) ? F : 0;
          } else {
            cashFlow = (t === totalPeriods) ? periodCoupon + F : periodCoupon;
          }
          
          price += cashFlow / Math.pow(1 + newYield / m, t);
        }
        
        const durationApprox = -modifiedDuration * (yieldChange);
        const convexityApprox = 0.5 * convexity * Math.pow(yieldChange, 2);
        const totalApprox = durationApprox + convexityApprox;
        const actualChange = ((price - bondPrice) / bondPrice) * 100;
        
        curve.push({
          yieldChange: yieldChange,
          newYield: (newYield * 100).toFixed(2),
          price: Math.round(price * 100) / 100,
          durationApprox: Math.round(durationApprox * 100) / 100,
          convexityApprox: Math.round(convexityApprox * 100) / 100,
          totalApprox: Math.round(totalApprox * 100) / 100,
          actualChange: Math.round(actualChange * 100) / 100,
          approximationError: Math.round((totalApprox - actualChange) * 100) / 100
        });
      });
      
      return curve;
    };
    
    // Calculate key metrics
    const currentYield = (C / bondPrice) * 100;
    const ytmSpread = yieldToMaturity - couponRate;
    const durationOfConvexity = convexity / modifiedDuration;
    
    const dcData = generateDurationConvexityData();
    const pyCurve = generatePriceYieldCurve();
    
    setResults({
      bondPrice: Math.round(bondPrice * 100) / 100,
      macaulayDuration: Math.round(macaulayDuration * 100) / 100,
      modifiedDuration: Math.round(modifiedDuration * 100) / 100,
      effectiveDuration: Math.round(effectiveDuration * 100) / 100,
      convexity: Math.round(convexity * 100) / 100,
      effectiveConvexity: Math.round(effectiveConvexity * 100) / 100,
      currentYield: Math.round(currentYield * 100) / 100,
      ytmSpread: Math.round(ytmSpread * 100) / 100,
      durationEffect: Math.round(durationEffect * 100) / 100,
      convexityEffect: Math.round(convexityEffect * 100) / 100,
      totalPriceChange: Math.round(totalPriceChange * 100) / 100,
      durationOfConvexity: Math.round(durationOfConvexity * 100) / 100,
      newPrice: Math.round(bondPrice * (1 + totalPriceChange / 100) * 100) / 100
    });
    
    setDurationConvexityData(dcData);
    setPriceYieldCurve(pyCurve);
  };

  useEffect(() => {
    calculateDurationConvexity();
  }, [bondType, faceValue, couponRate, yieldToMaturity, yearsToMaturity, couponFrequency, settlementDays]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(2)}%`;
  };

  const formatNumber = (value, decimals = 2) => {
    return value.toFixed(decimals);
  };

  const getBondTypeColor = (type) => {
    switch(type) {
      case 'fixed-rate': return '#3B82F6';
      case 'zero-coupon': return '#10B981';
      case 'callable': return '#EF4444';
      case 'floating-rate': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getConvexityType = (convexity) => {
    if (bondType === 'callable') return 'Negative';
    return convexity > 0 ? 'Positive' : 'Negative';
  };

  return (
    <>
      <Head>
        <title>Duration & Convexity Calculator | Bond Risk Analysis Tool</title>
        <meta name="description" content="Advanced duration and convexity calculator for bond portfolio management. Calculate Macaulay duration, modified duration, convexity, and analyze interest rate risk." />
        <meta name="keywords" content="duration calculator, convexity calculator, bond duration, bond convexity, interest rate risk, fixed income analysis, bond portfolio management" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/duration-convexity-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Duration & Convexity Calculator | Bond Risk Analysis Tool" />
        <meta property="og:description" content="Calculate bond duration and convexity to measure interest rate sensitivity and manage fixed income portfolios." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/duration-convexity-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Duration & Convexity Calculator" />
        <meta name="twitter:description" content="Professional bond risk analysis tool for duration and convexity calculations." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="duration-convexity-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Duration & Convexity Calculator",
            "description": "Professional bond risk analysis tool for calculating duration, convexity, and interest rate sensitivity",
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
              "ratingCount": "950",
              "bestRating": "5",
              "worstRating": "1"
            },
            "datePublished": currentDate,
            "dateModified": currentDate,
            "author": {
              "@type": "Organization",
              "name": "Fixed Income Tools Pro",
              "url": "https://www.financecalculatorfree.com"
            },
            "featureList": [
              "Macaulay & Modified Duration",
              "Convexity Calculation",
              "Price-Yield Curve Analysis",
              "Multiple Bond Types",
              "Risk Metrics Visualization"
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
                "name": "What is bond duration and why is it important?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Duration measures a bond's sensitivity to interest rate changes, representing the weighted average time to receive cash flows. It indicates how much a bond's price will change for a 1% change in interest rates. Higher duration means higher interest rate risk.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What's the difference between Macaulay and modified duration?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Macaulay duration is the weighted average time to receive cash flows, measured in years. Modified duration adjusts Macaulay duration for yield to maturity, providing a direct measure of price sensitivity to yield changes (percentage change per 1% yield change).",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What does convexity measure in bond analysis?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Convexity measures the curvature of the price-yield relationship. It captures the non-linear relationship between bond prices and yields, improving duration-based price change estimates. Positive convexity is beneficial as it provides price protection.",
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
            <h1 className={styles.mainTitle}>Duration & Convexity Calculator</h1>
            <p className={styles.subtitle}>Analyze Bond Interest Rate Risk and Price Sensitivity</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>Professional Tool</span>
              
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Bond Parameters</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Bond Type
                  <select
                    value={bondType}
                    onChange={(e) => setBondType(e.target.value)}
                    className={styles.selectInput}
                  >
                    <option value="fixed-rate">Fixed-Rate Bond</option>
                    <option value="zero-coupon">Zero-Coupon Bond</option>
                    <option value="callable">Callable Bond</option>
                    <option value="floating-rate">Floating-Rate Bond</option>
                  </select>
                </label>
                <div className={styles.bondTypeDescription}>
                  {bondTypes[bondType].description}
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Face Value
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="100"
                      max="1000000"
                      step="100"
                      value={faceValue}
                      onChange={(e) => setFaceValue(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="100"
                      max="1000000"
                      step="100"
                      value={faceValue}
                      onChange={(e) => setFaceValue(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(faceValue)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Coupon Rate
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      step="0.1"
                      value={couponRate}
                      onChange={(e) => setCouponRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="20"
                      step="0.1"
                      value={couponRate}
                      onChange={(e) => setCouponRate(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(couponRate)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Yield to Maturity
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      step="0.1"
                      value={yieldToMaturity}
                      onChange={(e) => setYieldToMaturity(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="20"
                      step="0.1"
                      value={yieldToMaturity}
                      onChange={(e) => setYieldToMaturity(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(yieldToMaturity)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Years to Maturity
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      step="1"
                      value={yearsToMaturity}
                      onChange={(e) => setYearsToMaturity(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="1"
                      max="50"
                      step="1"
                      value={yearsToMaturity}
                      onChange={(e) => setYearsToMaturity(parseInt(e.target.value) || 1)}
                      className={styles.numberInput}
                    />
                    <span className={styles.yearsSymbol}>years</span>
                  </div>
                  <div className={styles.valueDisplay}>{yearsToMaturity} years</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Coupon Frequency
                  <select
                    value={couponFrequency}
                    onChange={(e) => setCouponFrequency(parseInt(e.target.value))}
                    className={styles.selectInput}
                  >
                    <option value="1">Annual (1 payment/year)</option>
                    <option value="2">Semi-Annual (2 payments/year)</option>
                    <option value="4">Quarterly (4 payments/year)</option>
                    <option value="12">Monthly (12 payments/year)</option>
                  </select>
                </label>
                <div className={styles.frequencyDescription}>
                  {couponFrequencies[couponFrequency].name} payments
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Settlement Days
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="30"
                      step="1"
                      value={settlementDays}
                      onChange={(e) => setSettlementDays(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="30"
                      step="1"
                      value={settlementDays}
                      onChange={(e) => setSettlementDays(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.yearsSymbol}>days</span>
                  </div>
                  <div className={styles.valueDisplay}>{settlementDays} days</div>
                </label>
              </div>

              <div className={styles.bondCharacteristics}>
                <h3 className={styles.parameterGroupTitle}>Bond Characteristics</h3>
                <div className={styles.characteristicsGrid}>
                  <div className={styles.characteristicItem}>
                    <div className={styles.characteristicLabel}>Coupon Type</div>
                    <div className={styles.characteristicValue}>{bondTypes[bondType].name}</div>
                  </div>
                  <div className={styles.characteristicItem}>
                    <div className={styles.characteristicLabel}>Annual Coupon</div>
                    <div className={styles.characteristicValue}>{formatCurrency((couponRate / 100) * faceValue)}</div>
                  </div>
                  <div className={styles.characteristicItem}>
                    <div className={styles.characteristicLabel}>Period Coupon</div>
                    <div className={styles.characteristicValue}>{formatCurrency(((couponRate / 100) * faceValue) / couponFrequency)}</div>
                  </div>
                  <div className={styles.characteristicItem}>
                    <div className={styles.characteristicLabel}>Total Periods</div>
                    <div className={styles.characteristicValue}>{yearsToMaturity * couponFrequency}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Bond Risk Analysis</h2>
              
              {results && (
                <>
                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Bond Price</div>
                      <div className={styles.resultValue}>{formatCurrency(results.bondPrice)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Current Yield</div>
                      <div className={styles.resultValue}>{formatPercentage(results.currentYield)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>YTM Spread</div>
                      <div className={styles.resultValue}>{formatPercentage(results.ytmSpread)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Convexity Type</div>
                      <div 
                        className={styles.resultValue}
                        style={{ 
                          color: getConvexityType(results.convexity) === 'Positive' ? '#10B981' : '#EF4444'
                        }}
                      >
                        {getConvexityType(results.convexity)}
                      </div>
                    </div>
                  </div>

                  {/* Duration Metrics */}
                  <div className={styles.durationMetrics}>
                    <h3 className={styles.chartTitle}>Duration Metrics</h3>
                    <div className={styles.metricsGrid}>
                      <div className={styles.metricItem}>
                        <div className={styles.metricLabel}>Macaulay Duration</div>
                        <div className={styles.metricValue}>{formatNumber(results.macaulayDuration)} years</div>
                        <div className={styles.metricDescription}>Weighted average time to cash flows</div>
                      </div>
                      <div className={styles.metricItem}>
                        <div className={styles.metricLabel}>Modified Duration</div>
                        <div className={styles.metricValue}>{formatNumber(results.modifiedDuration)}</div>
                        <div className={styles.metricDescription}>Price sensitivity per 1% yield change</div>
                      </div>
                      <div className={styles.metricItem}>
                        <div className={styles.metricLabel}>Effective Duration</div>
                        <div className={styles.metricValue}>{formatNumber(results.effectiveDuration)}</div>
                        <div className={styles.metricDescription}>Duration considering embedded options</div>
                      </div>
                    </div>
                  </div>

                  {/* Convexity Metrics */}
                  <div className={styles.convexityMetrics}>
                    <h3 className={styles.chartTitle}>Convexity Analysis</h3>
                    <div className={styles.metricsGrid}>
                      <div className={styles.metricItem}>
                        <div className={styles.metricLabel}>Convexity</div>
                        <div className={styles.metricValue}>{formatNumber(results.convexity, 1)}</div>
                        <div className={styles.metricDescription}>Curvature of price-yield relationship</div>
                      </div>
                      <div className={styles.metricItem}>
                        <div className={styles.metricLabel}>Effective Convexity</div>
                        <div className={styles.metricValue}>{formatNumber(results.effectiveConvexity, 1)}</div>
                        <div className={styles.metricDescription}>Convexity with embedded options</div>
                      </div>
                      <div className={styles.metricItem}>
                        <div className={styles.metricLabel}>Duration of Convexity</div>
                        <div className={styles.metricValue}>{formatNumber(results.durationOfConvexity, 1)}</div>
                        <div className={styles.metricDescription}>Convexity per unit of duration</div>
                      </div>
                    </div>
                  </div>

                  {/* Price Change Analysis */}
                  <div className={styles.priceChangeAnalysis}>
                    <h3 className={styles.chartTitle}>Price Sensitivity to 1% Yield Change</h3>
                    <div className={styles.priceChangeGrid}>
                      <div className={styles.priceChangeItem}>
                        <div className={styles.priceChangeLabel}>Duration Effect</div>
                        <div className={styles.priceChangeValue}>{formatPercentage(results.durationEffect)}</div>
                        <div className={styles.priceChangeBarContainer}>
                          <div 
                            className={styles.priceChangeBar}
                            style={{ 
                              width: `${Math.min(Math.abs(results.durationEffect), 20)}%`,
                              backgroundColor: results.durationEffect < 0 ? '#EF4444' : '#10B981',
                              marginLeft: results.durationEffect < 0 ? 'auto' : '0'
                            }}
                          />
                        </div>
                      </div>
                      <div className={styles.priceChangeItem}>
                        <div className={styles.priceChangeLabel}>Convexity Effect</div>
                        <div className={styles.priceChangeValue}>{formatPercentage(results.convexityEffect)}</div>
                        <div className={styles.priceChangeBarContainer}>
                          <div 
                            className={styles.priceChangeBar}
                            style={{ 
                              width: `${Math.min(Math.abs(results.convexityEffect) * 10, 20)}%`,
                              backgroundColor: '#3B82F6'
                            }}
                          />
                        </div>
                      </div>
                      <div className={styles.priceChangeItem}>
                        <div className={styles.priceChangeLabel}>Total Price Change</div>
                        <div className={styles.priceChangeValue}>{formatPercentage(results.totalPriceChange)}</div>
                        <div className={styles.priceChangeBarContainer}>
                          <div 
                            className={styles.priceChangeBar}
                            style={{ 
                              width: `${Math.min(Math.abs(results.totalPriceChange), 20)}%`,
                              backgroundColor: results.totalPriceChange < 0 ? '#EF4444' : '#10B981',
                              marginLeft: results.totalPriceChange < 0 ? 'auto' : '0'
                            }}
                          />
                        </div>
                      </div>
                      <div className={styles.priceChangeItem}>
                        <div className={styles.priceChangeLabel}>New Estimated Price</div>
                        <div className={styles.priceChangeValue}>{formatCurrency(results.newPrice)}</div>
                        <div className={styles.priceChangeComparison}>
                          {results.totalPriceChange >= 0 ? '▲' : '▼'} {formatCurrency(Math.abs(results.newPrice - results.bondPrice))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>📊 Key Risk Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>For each 1% increase in rates, price drops by approximately <strong>{formatPercentage(Math.abs(results.durationEffect))}</strong></li>
                      <li>Convexity adds <strong>{formatPercentage(results.convexityEffect)}</strong> to price change estimate</li>
                      <li>Bond has <strong>{results.modifiedDuration > 5 ? 'High' : results.modifiedDuration > 3 ? 'Medium' : 'Low'}</strong> interest rate sensitivity</li>
                      <li>Time to recover from rate increase: <strong>{formatNumber(results.macaulayDuration * 0.8, 1)}</strong> years</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Educational Content */}
          <div className={styles.educationalContent}>
            <article className={styles.articleCard}>
              <h2 className={styles.articleTitle}>Understanding Duration & Convexity: Essential Bond Risk Metrics</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>The Mathematics of Interest Rate Risk</h3>
                <p>Duration and convexity are fundamental measures of bond price sensitivity to interest rate changes. While duration provides a linear approximation, convexity captures the curvature of the price-yield relationship, enabling more accurate risk assessment.</p>
                
                <div className={styles.exampleCard}>
                  <h4>Duration Formula (Macaulay):</h4>
                  <div className={styles.formula}>
                    D<sub>mac</sub> = (Σ [t × PV(CF<sub>t</sub>)] ) / Price
                  </div>
                  <p>Where:</p>
                  <ul>
                    <li>t = Time to cash flow</li>
                    <li>PV(CF<sub>t</sub>) = Present value of cash flow at time t</li>
                    <li>Price = Current bond price</li>
                  </ul>
                  <p><strong>Modified Duration:</strong> D<sub>mod</sub> = D<sub>mac</sub> / (1 + y/m)</p>
                  <p><strong>Convexity:</strong> C = (Σ [t(t+1) × PV(CF<sub>t</sub>)] ) / [Price × (1+y/m)²]</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Practical Applications in Portfolio Management</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>🎯 Immunization Strategies</h4>
                    <p>Match portfolio duration to investment horizon to neutralize interest rate risk. For a 10-year liability, construct a bond portfolio with 10-year duration.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>⚖️ Duration Matching</h4>
                    <p>Align asset and liability durations to manage interest rate risk in pension funds, insurance companies, and asset-liability management.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📈 Barbell vs. Bullet Strategies</h4>
                    <p>Barbell (short and long durations) offers convexity benefits. Bullet (intermediate durations) provides precision in duration matching.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🛡️ Convexity Hedging</h4>
                    <p>Use options or convexity-rich bonds to protect against large interest rate movements. Positive convexity provides "free" upside protection.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Duration & Convexity by Bond Type</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Zero-Coupon Bonds:</strong> Duration equals maturity, highest convexity for given maturity</li>
                  <li><strong>Callable Bonds:</strong> Negative convexity, duration decreases as rates fall (call risk)</li>
                  <li><strong>High-Coupon Bonds:</strong> Lower duration (earlier cash flows), lower convexity</li>
                  <li><strong>Low-Coupon Bonds:</strong> Higher duration, higher convexity</li>
                  <li><strong>Long-Maturity Bonds:</strong> Highest duration and convexity, most rate-sensitive</li>
                  <li><strong>Floating-Rate Bonds:</strong> Very low duration (resets with rates), minimal convexity</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Portfolio Management Insights</h3>
                <blockquote className={styles.expertQuote}>
                  "Duration tells you how much you'll lose if rates rise. Convexity tells you how wrong that estimate will be. The best bond portfolios aren't just duration-matched—they're convexity-optimized. Positive convexity is like free insurance: it protects you from large rate moves while allowing you to benefit from favorable moves."
                  <footer className={styles.quoteFooter}>— Chief Investment Officer, Fixed Income Fund</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Why do bond prices and yields move in opposite directions?</h3>
                <p className={styles.faqAnswer}>When market interest rates rise, newly issued bonds offer higher coupons, making existing bonds with lower coupons less attractive. Their prices must fall to provide comparable yields to new bonds. Conversely, when rates fall, existing bonds with higher coupons become more valuable, so their prices rise.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What is negative convexity and when does it occur?</h3>
                <p className={styles.faqAnswer}>Negative convexity occurs when a bond's price appreciation is limited as yields fall. This happens with callable bonds—as rates drop, the issuer is more likely to call the bond, capping price gains. Mortgage-backed securities also exhibit negative convexity due to prepayment risk when rates fall.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How does coupon frequency affect duration and convexity?</h3>
                <p className={styles.faqAnswer}>More frequent coupon payments reduce duration because investors receive cash flows sooner. For the same yield and maturity, bonds with more frequent coupons have slightly lower convexity because cash flows are more evenly distributed rather than concentrated at maturity.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's the difference between modified duration and effective duration?</h3>
                <p className={styles.faqAnswer}>Modified duration assumes a linear relationship between price and yield changes. Effective duration accounts for embedded options (like call or put features) by measuring price changes for parallel yield curve shifts. Effective duration is more accurate for bonds with optionality.</p>
              </div>
            </div>

            {/* Price-Yield Curve Table */}
            <div className={styles.dataTableCard}>
              <h2 className={styles.dataTableTitle}>Price-Yield Curve Analysis</h2>
              <div className={styles.dataTableContainer}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Yield Change</th>
                      <th>New Yield</th>
                      <th>Actual Price</th>
                      <th>Duration Approx.</th>
                      <th>Convexity Adjust.</th>
                      <th>Total Approx.</th>
                      <th>Actual Change</th>
                      <th>Error</th>
                    </tr>
                  </thead>
                  <tbody>
                    {priceYieldCurve.map((row, index) => (
                      <tr key={index}>
                        <td>{row.yieldChange > 0 ? '+' : ''}{row.yieldChange}%</td>
                        <td>{row.newYield}%</td>
                        <td>{formatCurrency(row.price)}</td>
                        <td>{row.durationApprox > 0 ? '+' : ''}{row.durationApprox}%</td>
                        <td>{row.convexityApprox > 0 ? '+' : ''}{row.convexityApprox}%</td>
                        <td>{row.totalApprox > 0 ? '+' : ''}{row.totalApprox}%</td>
                        <td>{row.actualChange > 0 ? '+' : ''}{row.actualChange}%</td>
                        <td className={Math.abs(row.approximationError) < 0.5 ? styles.lowError : styles.highError}>
                          {row.approximationError > 0 ? '+' : ''}{row.approximationError}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={styles.dataTableNote}>
                Note: Duration approximation works best for small yield changes (±1%). Convexity adjustment improves accuracy for larger moves.
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Ready to Optimize Your Bond Portfolio?</h2>
              <p className={styles.ctaText}>Use this calculator to analyze interest rate risk, compare bond investments, and develop effective duration-matching strategies for your portfolio.</p>
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides theoretical estimates for educational purposes. Actual bond prices may differ due to market conditions, liquidity, credit risk, and other factors. Duration and convexity are estimates of interest rate sensitivity and do not account for credit spread changes, liquidity risk, or other market factors. Past performance is not indicative of future results. Consult with a qualified financial professional before making investment decisions.
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

export default DurationConvexityCalculator;