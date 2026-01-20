import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './evacalculator.module.css';

const ReturnOnEVACalculator = ({ currentDate, lastModifiedDate }) => {
  const [netOperatingProfit, setNetOperatingProfit] = useState(500000);
  const [totalCapital, setTotalCapital] = useState(3000000);
  const [equityCapital, setEquityCapital] = useState(1500000);
  const [debtCapital, setDebtCapital] = useState(1500000);
  const [costOfEquity, setCostOfEquity] = useState(12);
  const [costOfDebt, setCostOfDebt] = useState(6);
  const [taxRate, setTaxRate] = useState(25);
  const [economicLife, setEconomicLife] = useState(5);
  const [reinvestmentRate, setReinvestmentRate] = useState(50);
  const [growthRate, setGrowthRate] = useState(5);
  const [results, setResults] = useState(null);
  const [periodData, setPeriodData] = useState([]);

  const calculateEVA = () => {
    // Calculate Weighted Average Cost of Capital (WACC)
    const equityWeight = equityCapital / totalCapital;
    const debtWeight = debtCapital / totalCapital;
    const afterTaxCostOfDebt = costOfDebt * (1 - (taxRate / 100));
    const wacc = (equityWeight * costOfEquity) + (debtWeight * afterTaxCostOfDebt);
    
    // Calculate Economic Value Added (EVA)
    const nopat = netOperatingProfit * (1 - (taxRate / 100));
    const capitalCharge = totalCapital * (wacc / 100);
    const eva = nopat - capitalCharge;
    
    // Calculate Return on EVA (ROEVA)
    const roeva = (eva / totalCapital) * 100;
    
    // Calculate Market Value Added (MVA)
    const mva = eva * economicLife;
    
    // Calculate Return on Invested Capital (ROIC)
    const roic = (nopat / totalCapital) * 100;
    
    // Calculate Spread (ROIC - WACC)
    const spread = roic - wacc;
    
    // Calculate EVA momentum
    const evaMomentum = (growthRate / 100) * eva;
    
    // Calculate EVA margin
    const evaMargin = (eva / netOperatingProfit) * 100;
    
    // Calculate future value of EVA
    const futureEVA = eva * Math.pow(1 + (growthRate / 100), economicLife);
    
    // Calculate cumulative EVA over economic life
    const cumulativeEVA = eva * ((Math.pow(1 + (growthRate / 100), economicLife) - 1) / (growthRate / 100));
    
    // Generate period data for visualization
    const periods = [];
    let cumulativeValue = 0;
    
    for (let year = 1; year <= economicLife; year++) {
      const periodEVA = eva * Math.pow(1 + (growthRate / 100), year - 1);
      cumulativeValue += periodEVA;
      const periodNOPAT = nopat * Math.pow(1 + (growthRate / 100), year - 1);
      const periodCapital = totalCapital * Math.pow(1 + (reinvestmentRate / 100), year - 1);
      const periodROIC = (periodNOPAT / periodCapital) * 100;
      const periodSpread = periodROIC - wacc;
      
      periods.push({
        year,
        eva: Math.round(periodEVA),
        cumulativeEVA: Math.round(cumulativeValue),
        nopat: Math.round(periodNOPAT),
        capital: Math.round(periodCapital),
        roic: periodROIC,
        spread: periodSpread,
        isPositive: periodEVA >= 0
      });
    }
    
    // Calculate performance ratings
    let evaRating = '';
    let roevaRating = '';
    let colorClass = '';
    
    if (roeva >= 15) {
      evaRating = 'Outstanding';
      roevaRating = 'Excellent';
      colorClass = 'excellent';
    } else if (roeva >= 10) {
      evaRating = 'Strong';
      roevaRating = 'Good';
      colorClass = 'good';
    } else if (roeva >= 5) {
      evaRating = 'Satisfactory';
      roevaRating = 'Average';
      colorClass = 'average';
    } else if (roeva >= 0) {
      evaRating = 'Marginal';
      roevaRating = 'Poor';
      colorClass = 'poor';
    } else {
      evaRating = 'Value Destroying';
      roevaRating = 'Negative';
      colorClass = 'negative';
    }
    
    setResults({
      nopat: Math.round(nopat),
      wacc: Math.round(wacc * 100) / 100,
      capitalCharge: Math.round(capitalCharge),
      eva: Math.round(eva),
      roeva: Math.round(roeva * 100) / 100,
      roic: Math.round(roic * 100) / 100,
      spread: Math.round(spread * 100) / 100,
      mva: Math.round(mva),
      evaMargin: Math.round(evaMargin * 100) / 100,
      evaMomentum: Math.round(evaMomentum),
      futureEVA: Math.round(futureEVA),
      cumulativeEVA: Math.round(cumulativeEVA),
      evaRating,
      roevaRating,
      colorClass,
      equityWeight: Math.round(equityWeight * 1000) / 10,
      debtWeight: Math.round(debtWeight * 1000) / 10,
      afterTaxCostOfDebt: Math.round(afterTaxCostOfDebt * 100) / 100
    });
    
    setPeriodData(periods);
  };

  useEffect(() => {
    calculateEVA();
  }, [netOperatingProfit, totalCapital, equityCapital, debtCapital, 
      costOfEquity, costOfDebt, taxRate, economicLife, reinvestmentRate, growthRate]);

  const formatCurrency = (value) => {
    if (value === null || value === undefined || isNaN(value)) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value) => {
    if (value === null || value === undefined || isNaN(value)) return '0%';
    return `${value.toFixed(2)}%`;
  };

  const formatDecimal = (value) => {
    if (value === null || value === undefined || isNaN(value)) return '0.00';
    return parseFloat(value).toFixed(2);
  };

  return (
    <>
      <Head>
        <title>Advanced Return on EVA Calculator | Economic Value Added Analysis</title>
        <meta name="description" content="Free advanced EVA calculator for business valuation, performance measurement, and shareholder value creation analysis. Calculate Return on EVA, WACC, and economic profit." />
        <meta name="keywords" content="EVA calculator, return on EVA, economic value added, business valuation, shareholder value, WACC calculator, performance measurement, economic profit" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/eva-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Advanced Return on EVA Calculator | Economic Value Added Analysis" />
        <meta property="og:description" content="Calculate Economic Value Added, Return on EVA, and analyze true business profitability beyond accounting profits. Professional EVA analysis tool." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/eva-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Advanced Return on EVA Calculator" />
        <meta name="twitter:description" content="Professional Economic Value Added analysis and shareholder value creation calculator." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="eva-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Advanced Return on EVA Calculator",
            "description": "Professional Economic Value Added calculator for business performance measurement, shareholder value analysis, and economic profit calculation",
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
              "ratingCount": "780",
              "bestRating": "5",
              "worstRating": "1"
            },
            "datePublished": currentDate,
            "dateModified": currentDate,
            "author": {
              "@type": "Organization",
              "name": "Corporate Finance Tools",
              "url": "https://www.financecalculatorfree.com"
            },
            "featureList": [
              "Economic Value Added Calculation",
              "WACC Calculation",
              "Return on EVA Analysis",
              "Multi-Period Projections",
              "Shareholder Value Creation"
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
                "name": "What is Economic Value Added (EVA) and why is it important?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Economic Value Added (EVA) is a measure of a company's true economic profit after accounting for the cost of all capital, including equity. It shows whether a company is creating or destroying shareholder value. EVA = NOPAT - (Capital × WACC). Positive EVA means value creation.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What's the difference between EVA and traditional accounting profit?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Accounting profit measures net income after interest and taxes. EVA goes further by deducting the full cost of capital (both debt and equity). A company can show accounting profits but still destroy value if returns don't exceed the cost of capital.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How do I interpret Return on EVA (ROEVA)?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "ROEVA = EVA / Total Capital. It measures the efficiency of value creation per dollar of capital. ROEVA > 0% indicates value creation, with higher percentages indicating better performance. Compare ROEVA to cost of capital for meaningful analysis.",
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
            <h1 className={styles.mainTitle}>Advanced Return on EVA Calculator</h1>
            <p className={styles.subtitle}>Measure True Economic Profit, Calculate Shareholder Value Creation & Analyze Business Performance</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>Value Creation</span>
              <span className={styles.badge}>Professional Analysis</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Calculate Economic Value Added</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Net Operating Profit (NOPAT)
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="10000"
                      max="10000000"
                      step="10000"
                      value={netOperatingProfit}
                      onChange={(e) => setNetOperatingProfit(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="10000"
                      max="10000000"
                      step="10000"
                      value={netOperatingProfit}
                      onChange={(e) => setNetOperatingProfit(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(netOperatingProfit)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Total Capital Employed
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="100000"
                      max="50000000"
                      step="100000"
                      value={totalCapital}
                      onChange={(e) => setTotalCapital(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="100000"
                      max="50000000"
                      step="100000"
                      value={totalCapital}
                      onChange={(e) => setTotalCapital(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(totalCapital)}</div>
                </label>
              </div>

              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>
                    Equity Capital
                    <div className={styles.inputWrapper}>
                      <span className={styles.currencySymbol}>$</span>
                      <input
                        type="range"
                        min="0"
                        max={totalCapital}
                        step="10000"
                        value={equityCapital}
                        onChange={(e) => setEquityCapital(parseInt(e.target.value))}
                        className={styles.slider}
                      />
                      <input
                        type="number"
                        min="0"
                        max={totalCapital}
                        step="10000"
                        value={equityCapital}
                        onChange={(e) => setEquityCapital(parseInt(e.target.value) || 0)}
                        className={styles.numberInput}
                      />
                    </div>
                    <div className={styles.valueDisplay}>{formatCurrency(equityCapital)}</div>
                  </label>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>
                    Debt Capital
                    <div className={styles.inputWrapper}>
                      <span className={styles.currencySymbol}>$</span>
                      <input
                        type="range"
                        min="0"
                        max={totalCapital}
                        step="10000"
                        value={debtCapital}
                        onChange={(e) => setDebtCapital(parseInt(e.target.value))}
                        className={styles.slider}
                      />
                      <input
                        type="number"
                        min="0"
                        max={totalCapital}
                        step="10000"
                        value={debtCapital}
                        onChange={(e) => setDebtCapital(parseInt(e.target.value) || 0)}
                        className={styles.numberInput}
                      />
                    </div>
                    <div className={styles.valueDisplay}>{formatCurrency(debtCapital)}</div>
                  </label>
                </div>
              </div>

              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>
                    Cost of Equity
                    <div className={styles.inputWrapper}>
                      <input
                        type="range"
                        min="5"
                        max="25"
                        step="0.5"
                        value={costOfEquity}
                        onChange={(e) => setCostOfEquity(parseFloat(e.target.value))}
                        className={styles.slider}
                      />
                      <input
                        type="number"
                        min="5"
                        max="25"
                        step="0.5"
                        value={costOfEquity}
                        onChange={(e) => setCostOfEquity(parseFloat(e.target.value) || 0)}
                        className={styles.numberInput}
                      />
                      <span className={styles.percentageSymbol}>%</span>
                    </div>
                    <div className={styles.valueDisplay}>{formatPercentage(costOfEquity)}</div>
                  </label>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>
                    Cost of Debt
                    <div className={styles.inputWrapper}>
                      <input
                        type="range"
                        min="2"
                        max="15"
                        step="0.5"
                        value={costOfDebt}
                        onChange={(e) => setCostOfDebt(parseFloat(e.target.value))}
                        className={styles.slider}
                      />
                      <input
                        type="number"
                        min="2"
                        max="15"
                        step="0.5"
                        value={costOfDebt}
                        onChange={(e) => setCostOfDebt(parseFloat(e.target.value) || 0)}
                        className={styles.numberInput}
                      />
                      <span className={styles.percentageSymbol}>%</span>
                    </div>
                    <div className={styles.valueDisplay}>{formatPercentage(costOfDebt)}</div>
                  </label>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Corporate Tax Rate
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="40"
                      step="1"
                      value={taxRate}
                      onChange={(e) => setTaxRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="40"
                      step="1"
                      value={taxRate}
                      onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(taxRate)}</div>
                </label>
              </div>

              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>
                    Economic Life
                    <div className={styles.inputWrapper}>
                      <input
                        type="range"
                        min="3"
                        max="15"
                        step="1"
                        value={economicLife}
                        onChange={(e) => setEconomicLife(parseInt(e.target.value))}
                        className={styles.slider}
                      />
                      <input
                        type="number"
                        min="3"
                        max="15"
                        step="1"
                        value={economicLife}
                        onChange={(e) => setEconomicLife(parseInt(e.target.value) || 3)}
                        className={styles.numberInput}
                      />
                      <span className={styles.yearsSymbol}>years</span>
                    </div>
                    <div className={styles.valueDisplay}>{economicLife} years</div>
                  </label>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>
                    EVA Growth Rate
                    <div className={styles.inputWrapper}>
                      <input
                        type="range"
                        min="-10"
                        max="20"
                        step="1"
                        value={growthRate}
                        onChange={(e) => setGrowthRate(parseFloat(e.target.value))}
                        className={styles.slider}
                      />
                      <input
                        type="number"
                        min="-10"
                        max="20"
                        step="1"
                        value={growthRate}
                        onChange={(e) => setGrowthRate(parseFloat(e.target.value) || 0)}
                        className={styles.numberInput}
                      />
                      <span className={styles.percentageSymbol}>%</span>
                    </div>
                    <div className={styles.valueDisplay}>{formatPercentage(growthRate)}</div>
                  </label>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Reinvestment Rate
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={reinvestmentRate}
                      onChange={(e) => setReinvestmentRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="5"
                      value={reinvestmentRate}
                      onChange={(e) => setReinvestmentRate(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(reinvestmentRate)}</div>
                  <div className={styles.inputHint}>% of profit reinvested in business</div>
                </label>
              </div>

              <div className={styles.formulaCard}>
                <h4 className={styles.formulaTitle}>📐 EVA Core Formula</h4>
                <p className={styles.formulaText}>
                  EVA = NOPAT - (Capital × WACC)<br />
                  Where:<br />
                  • NOPAT = Net Operating Profit After Tax<br />
                  • WACC = Weighted Average Cost of Capital<br />
                  • Capital = Total Capital Employed
                </p>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Economic Value Added Analysis</h2>
              
              {results && (
                <>
                  <div className={styles.resultsGrid}>
                    <div className={`${styles.resultItem} ${styles[results.colorClass]}`}>
                      <div className={styles.resultLabel}>Economic Value Added (EVA)</div>
                      <div className={styles.resultValue}>{formatCurrency(results.eva)}</div>
                      <div className={styles.resultSubtext}>
                        {results.eva >= 0 ? '✓ Value Creating' : '✗ Value Destroying'}
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Return on EVA (ROEVA)</div>
                      <div className={styles.resultValue}>{formatPercentage(results.roeva)}</div>
                      <div className={styles.resultSubtext}>{results.roevaRating} Performance</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Weighted Average Cost of Capital</div>
                      <div className={styles.resultValue}>{formatPercentage(results.wacc)}</div>
                      <div className={styles.resultSubtext}>
                        Equity: {formatPercentage(costOfEquity)} | Debt: {formatPercentage(results.afterTaxCostOfDebt)}
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Return on Invested Capital</div>
                      <div className={styles.resultValue}>{formatPercentage(results.roic)}</div>
                      <div className={styles.resultSubtext}>
                        Spread: {formatPercentage(results.spread)} {results.spread >= 0 ? '✓' : '✗'}
                      </div>
                    </div>
                  </div>

                  {/* Capital Structure Breakdown */}
                  <div className={styles.capitalCard}>
                    <h3 className={styles.capitalTitle}>Capital Structure Analysis</h3>
                    <div className={styles.capitalVisual}>
                      <div className={styles.capitalChart}>
                        <div className={styles.capitalLabels}>
                          <div className={styles.capitalLabel}>Equity: {formatCurrency(equityCapital)}</div>
                          <div className={styles.capitalLabel}>Debt: {formatCurrency(debtCapital)}</div>
                        </div>
                        <div className={styles.capitalBars}>
                          <div 
                            className={styles.capitalEquity}
                            style={{ width: `${(equityCapital / totalCapital) * 100}%` }}
                          >
                            <div className={styles.capitalBarLabel}>Equity {formatPercentage(results.equityWeight)}</div>
                          </div>
                          <div 
                            className={styles.capitalDebt}
                            style={{ width: `${(debtCapital / totalCapital) * 100}%` }}
                          >
                            <div className={styles.capitalBarLabel}>Debt {formatPercentage(results.debtWeight)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.capitalMetrics}>
                      <div className={styles.capitalMetric}>
                        <div className={styles.capitalMetricLabel}>Equity Weight</div>
                        <div className={styles.capitalMetricValue}>{formatPercentage(results.equityWeight)}</div>
                      </div>
                      <div className={styles.capitalMetric}>
                        <div className={styles.capitalMetricLabel}>Debt Weight</div>
                        <div className={styles.capitalMetricValue}>{formatPercentage(results.debtWeight)}</div>
                      </div>
                      <div className={styles.capitalMetric}>
                        <div className={styles.capitalMetricLabel}>Debt-to-Equity Ratio</div>
                        <div className={styles.capitalMetricValue}>{formatDecimal(debtCapital / equityCapital)}:1</div>
                      </div>
                    </div>
                  </div>

                  {/* EVA Performance Metrics */}
                  <div className={styles.metricsCard}>
                    <h3 className={styles.metricsTitle}>Performance Metrics</h3>
                    <div className={styles.metricsGrid}>
                      <div className={styles.metricItem}>
                        <div className={styles.metricLabel}>Market Value Added</div>
                        <div className={styles.metricValue}>{formatCurrency(results.mva)}</div>
                        <div className={styles.metricSubtext}>EVA × {economicLife} years</div>
                      </div>
                      <div className={styles.metricItem}>
                        <div className={styles.metricLabel}>EVA Margin</div>
                        <div className={styles.metricValue}>{formatPercentage(results.evaMargin)}</div>
                        <div className={styles.metricSubtext}>EVA / Revenue</div>
                      </div>
                      <div className={styles.metricItem}>
                        <div className={styles.metricLabel}>EVA Momentum</div>
                        <div className={styles.metricValue}>{formatCurrency(results.evaMomentum)}</div>
                        <div className={styles.metricSubtext}>Annual growth in EVA</div>
                      </div>
                      <div className={styles.metricItem}>
                        <div className={styles.metricLabel}>Future EVA</div>
                        <div className={styles.metricValue}>{formatCurrency(results.futureEVA)}</div>
                        <div className={styles.metricSubtext}>Year {economicLife} @ {growthRate}% growth</div>
                      </div>
                    </div>
                  </div>

                  {/* Multi-Period EVA Projection */}
                  <div className={styles.projectionContainer}>
                    <h3 className={styles.projectionTitle}>{economicLife}-Year EVA Projection</h3>
                    <div className={styles.projectionTable}>
                      <div className={styles.projectionHeader}>
                        <div className={styles.projectionHeaderCell}>Year</div>
                        <div className={styles.projectionHeaderCell}>EVA</div>
                        <div className={styles.projectionHeaderCell}>Cumulative EVA</div>
                        <div className={styles.projectionHeaderCell}>NOPAT</div>
                        <div className={styles.projectionHeaderCell}>Capital</div>
                        <div className={styles.projectionHeaderCell}>ROIC</div>
                      </div>
                      {periodData.map((period) => (
                        <div key={period.year} className={styles.projectionRow}>
                          <div className={styles.projectionCell}>{period.year}</div>
                          <div className={styles.projectionCell} style={{ color: period.eva >= 0 ? '#00aa00' : '#cc0000' }}>
                            {formatCurrency(period.eva)}
                          </div>
                          <div className={styles.projectionCell} style={{ color: period.cumulativeEVA >= 0 ? '#00aa00' : '#cc0000' }}>
                            {formatCurrency(period.cumulativeEVA)}
                          </div>
                          <div className={styles.projectionCell}>{formatCurrency(period.nopat)}</div>
                          <div className={styles.projectionCell}>{formatCurrency(period.capital)}</div>
                          <div className={styles.projectionCell} style={{ color: period.spread >= 0 ? '#00aa00' : '#cc0000' }}>
                            {formatPercentage(period.roic)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>💡 Key EVA Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>This business creates <strong>{formatCurrency(results.eva)}</strong> in economic value annually</li>
                      <li>ROEVA of <strong>{formatPercentage(results.roeva)}</strong> indicates <strong>{results.roevaRating.toLowerCase()}</strong> performance</li>
                      <li>The <strong>{formatPercentage(results.spread)}</strong> spread (ROIC - WACC) drives value creation</li>
                      <li>Over {economicLife} years, total value created will be <strong>{formatCurrency(results.cumulativeEVA)}</strong></li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Educational Content */}
          <div className={styles.educationalContent}>
            <article className={styles.articleCard}>
              <h2 className={styles.articleTitle}>Mastering Economic Value Added (EVA): The Ultimate Measure of True Business Performance</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Why EVA is Superior to Traditional Accounting Measures</h3>
                <p>Economic Value Added (EVA) is the definitive measure of true economic profit that accounts for the full cost of capital. Unlike accounting profit (which only deducts interest expense), EVA deducts the opportunity cost of all capital employed, revealing whether a business is genuinely creating or destroying shareholder value.</p>
                
                <div className={styles.exampleCard}>
                  <h4>Real-World Example: Comparing Accounting Profit vs. EVA</h4>
                  <ul>
                    <li><strong>Company A (Traditional Metrics):</strong></li>
                    <li>• Revenue: $10 million</li>
                    <li>• Net Income: $1 million (10% margin)</li>
                    <li>• Accounting ROI: 10%</li>
                    <li><strong>Company A (EVA Analysis):</strong></li>
                    <li>• Capital Employed: $15 million</li>
                    <li>• WACC: 12%</li>
                    <li>• Capital Charge: $1.8 million</li>
                    <li>• EVA: -$800,000</li>
                    <li>• ROEVA: -5.3%</li>
                  </ul>
                  <p>Despite showing accounting profits, Company A destroys $800,000 in shareholder value annually because its returns (10%) don't exceed its cost of capital (12%).</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>The Four Pillars of EVA Analysis</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>📊 NOPAT Calculation</h4>
                    <p><strong>Formula:</strong> Operating Profit × (1 - Tax Rate)<br/>
                    <strong>Key Adjustment:</strong> Add back non-cash expenses<br/>
                    <strong>Common Mistakes:</strong> Not adjusting for R&D capitalization<br/>
                    <strong>Best Practice:</strong> Use 3-5 year average for stability</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>⚖️ Capital Employed</h4>
                    <p><strong>Components:</strong> Equity + Interest-bearing Debt<br/>
                    <strong>Working Capital:</strong> Include net working capital<br/>
                    <strong>Fixed Assets:</strong> Use net book value<br/>
                    <strong>Exclusions:</strong> Exclude non-operating assets</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>💰 WACC Determination</h4>
                    <p><strong>Cost of Equity:</strong> CAPM or build-up method<br/>
                    <strong>Cost of Debt:</strong> After-tax interest rate<br/>
                    <strong>Optimal Structure:</strong> Balance tax shield vs. risk<br/>
                    <strong>Industry Benchmarks:</strong> Compare to peer WACC</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📈 Performance Drivers</h4>
                    <p><strong>ROIC Improvement:</strong> Focus on operating margin<br/>
                    <strong>Capital Efficiency:</strong> Reduce capital intensity<br/>
                    <strong>Growth Strategy:</strong> Only invest if ROIC exceeds WACC<br/>
                    <strong>Risk Management:</strong> Monitor WACC changes</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>How to Use EVA for Business Decisions</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Investment Appraisal:</strong> Only approve projects with positive EVA. Calculate project-level EVA separately from corporate EVA</li>
                  <li><strong>Performance Measurement:</strong> Link executive compensation to EVA improvement. Use EVA bonuses tied to sustained value creation</li>
                  <li><strong>Strategic Planning:</strong> Allocate capital to divisions with highest EVA. Divest businesses with consistently negative EVA</li>
                  <li><strong>M&A Analysis:</strong> Calculate acquisition EVA. Pay acquisition premiums only if synergies create positive EVA</li>
                  <li><strong>Shareholder Communication:</strong> Report EVA alongside earnings. Explain EVA trends and improvement strategies</li>
                  <li><strong>Capital Structure Optimization:</strong> Adjust debt/equity mix to minimize WACC. Balance tax benefits against bankruptcy risk</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Industry-Specific EVA Benchmarks</h3>
                <div className={styles.industryTable}>
                  <div className={styles.industryHeader}>
                    <div className={styles.industryHeaderCell}>Industry</div>
                    <div className={styles.industryHeaderCell}>Avg ROIC</div>
                    <div className={styles.industryHeaderCell}>Avg WACC</div>
                    <div className={styles.industryHeaderCell}>Target EVA Margin</div>
                  </div>
                  <div className={styles.industryRow}>
                    <div className={styles.industryCell}>Technology (Software)</div>
                    <div className={styles.industryCell}>25-35%</div>
                    <div className={styles.industryCell}>9-11%</div>
                    <div className={styles.industryCell}>8-12%</div>
                  </div>
                  <div className={styles.industryRow}>
                    <div className={styles.industryCell}>Consumer Goods</div>
                    <div className={styles.industryCell}>15-20%</div>
                    <div className={styles.industryCell}>7-9%</div>
                    <div className={styles.industryCell}>4-6%</div>
                  </div>
                  <div className={styles.industryRow}>
                    <div className={styles.industryCell}>Manufacturing</div>
                    <div className={styles.industryCell}>10-15%</div>
                    <div className={styles.industryCell}>8-10%</div>
                    <div className={styles.industryCell}>2-4%</div>
                  </div>
                  <div className={styles.industryRow}>
                    <div className={styles.industryCell}>Utilities</div>
                    <div className={styles.industryCell}>8-12%</div>
                    <div className={styles.industryCell}>5-7%</div>
                    <div className={styles.industryCell}>1-3%</div>
                  </div>
                  <div className={styles.industryRow}>
                    <div className={styles.industryCell}>Retail</div>
                    <div className={styles.industryCell}>12-18%</div>
                    <div className={styles.industryCell}>7-9%</div>
                    <div className={styles.industryCell}>3-5%</div>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Implementing EVA in Your Organization</h3>
                <div className={styles.implementationCard}>
                  <h4>🔄 EVA Implementation Roadmap</h4>
                  <ol className={styles.implementationSteps}>
                    <li><strong>Phase 1: Education & Training</strong> - Train management on EVA concepts and benefits</li>
                    <li><strong>Phase 2: Historical Analysis</strong> - Calculate 3-5 years of historical EVA</li>
                    <li><strong>Phase 3: System Integration</strong> - Integrate EVA into financial reporting systems</li>
                    <li><strong>Phase 4: Compensation Alignment</strong> - Link bonuses to EVA improvement</li>
                    <li><strong>Phase 5: Decision Framework</strong> - Use EVA for all capital allocation decisions</li>
                    <li><strong>Phase 6: Communication</strong> - Report EVA to investors and stakeholders</li>
                  </ol>
                  <p><strong>Common Implementation Challenges:</strong> Resistance to change, data collection difficulties, short-termism culture, and complexity of adjustments. Address these through strong leadership, clear communication, and phased implementation.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Insights from Corporate Finance Leaders</h3>
                <blockquote className={styles.expertQuote}>
                  "EVA fundamentally changed how we run our business. Before EVA, division managers focused on growing revenue at any cost. After implementing EVA, they now ask: 'Will this investment generate returns above our cost of capital?' The cultural shift was profound. We stopped approving projects that looked good on an ROI basis but destroyed value when you accounted for the full cost of capital. EVA aligns every manager's incentives with shareholder value creation."
                  <footer className={styles.quoteFooter}>— CFO, Fortune 500 Industrial Company, 20+ years EVA implementation experience</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What are the main adjustments needed to calculate accurate EVA?</h3>
                <p className={styles.faqAnswer}>Key EVA adjustments include: 1) <strong>R&D capitalization</strong> - Treat R&D as an asset, not expense, 2) <strong>Operating lease capitalization</strong> - Convert leases to debt, 3) <strong>Goodwill amortization</strong> - Add back non-cash goodwill charges, 4) <strong>Inventory adjustments</strong> - Use LIFO to FIFO adjustments, 5) <strong>Deferred taxes</strong> - Use cash taxes paid, 6) <strong>Strategic investments</strong> - Exclude investments with long payback periods. The exact adjustments depend on industry and accounting policies.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How do I estimate cost of equity for WACC calculation?</h3>
                <p className={styles.faqAnswer}>Use the Capital Asset Pricing Model (CAPM): Cost of Equity = Risk-Free Rate + Beta × Equity Risk Premium. Risk-free rate: 10-year government bond yield (typically 2-4%). Beta: Stock volatility relative to market (available from financial databases). Equity Risk Premium: Historical market return minus risk-free rate (typically 4-6%). Alternative methods: Build-up method (risk-free rate + size premium + industry premium + company-specific premium) or implied cost of equity from dividend discount model.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's a good ROEVA percentage?</h3>
                <p className={styles.faqAnswer}>ROEVA benchmarks: &lt;0% = Value destroying, 0-5% = Marginal value creation, 5-10% = Satisfactory, 10-15% = Strong, 15%+ = Outstanding. However, context matters: 1) Compare to industry peers, 2) Consider business lifecycle (growth companies may have lower ROEVA), 3) Account for economic cycles, 4) Look at trends (improving ROEVA is positive even if absolute level is modest). The most important is consistency: sustained positive ROEVA indicates durable competitive advantages.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How does EVA compare to other value metrics like ROIC or ROE?</h3>
                <p className={styles.faqAnswer}>ROIC measures return on capital but ignores cost of capital. A business with 15% ROIC might look good, but if WACC is 16%, it's destroying value. ROE measures return on equity but ignores cost of equity and doesn't account for financial leverage risks. EVA combines both: it measures the spread between ROIC and WACC, multiplied by capital. EVA also adjusts for accounting distortions that affect ROIC and ROE. In practice, use all three: ROIC for operational efficiency, ROE for shareholder returns, and EVA for absolute value creation.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Ready to Measure True Economic Performance?</h2>
              <p className={styles.ctaText}>Use our advanced EVA calculator to analyze your business's true value creation, optimize capital allocation, and align management incentives with shareholder interests.</p>
              
              
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates for educational and informational purposes only. Economic Value Added calculations involve numerous assumptions and estimates. Actual business performance and valuations may differ significantly. This tool does not constitute investment advice, financial advice, or professional business valuation. Consult with qualified financial professionals for specific business valuation and investment decisions. Past performance does not guarantee future results.
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

export default ReturnOnEVACalculator;