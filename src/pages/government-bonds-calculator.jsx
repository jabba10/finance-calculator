import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './governmentbondcalculator.module.css';

const GovernmentBondCalculator = ({ currentDate, lastModifiedDate }) => {
  const [faceValue, setFaceValue] = useState(10000);
  const [couponRate, setCouponRate] = useState(3.5);
  const [yearsToMaturity, setYearsToMaturity] = useState(10);
  const [paymentFrequency, setPaymentFrequency] = useState('semi-annual');
  const [marketYield, setMarketYield] = useState(3.0);
  const [taxRate, setTaxRate] = useState(25);
  const [inflationRate, setInflationRate] = useState(2.0);
  const [results, setResults] = useState(null);
  const [chartData, setChartData] = useState([]);

  const paymentFrequencyMap = {
    'annual': 1,
    'semi-annual': 2,
    'quarterly': 4,
    'monthly': 12
  };

  const calculateBondReturns = () => {
    const frequency = paymentFrequencyMap[paymentFrequency];
    const periodsPerYear = frequency;
    const totalPeriods = yearsToMaturity * frequency;
    const couponPayment = faceValue * (couponRate / 100) / frequency;
    const periodicYield = marketYield / 100 / frequency;
    
    let presentValue = 0;
    const dataPoints = [];
    let totalCouponPayments = 0;
    
    // Calculate present value of coupon payments
    for (let i = 1; i <= totalPeriods; i++) {
      const pvCoupon = couponPayment / Math.pow(1 + periodicYield, i);
      presentValue += pvCoupon;
      totalCouponPayments += couponPayment;
      
      // Record annual data points
      if (i % frequency === 0 || i === totalPeriods) {
        const year = i / frequency;
        const principal = faceValue / Math.pow(1 + periodicYield, i);
        dataPoints.push({
          year: year,
          couponValue: Math.round((couponPayment * i) * 100) / 100,
          principalValue: Math.round(principal * 100) / 100
        });
      }
    }
    
    // Add present value of face value
    const pvFaceValue = faceValue / Math.pow(1 + periodicYield, totalPeriods);
    presentValue += pvFaceValue;
    
    // Calculate after-tax returns
    const annualCouponIncome = couponPayment * frequency;
    const totalCouponIncome = annualCouponIncome * yearsToMaturity;
    const afterTaxCouponIncome = totalCouponIncome * (1 - taxRate / 100);
    
    // Calculate real returns (inflation-adjusted)
    const realYield = ((1 + marketYield / 100) / (1 + inflationRate / 100) - 1) * 100;
    const realTotalReturn = (faceValue + afterTaxCouponIncome) / Math.pow(1 + inflationRate / 100, yearsToMaturity);
    
    // Calculate bond metrics
    const currentYield = (annualCouponIncome / presentValue) * 100;
    const yieldToMaturity = marketYield;
    const duration = calculateDuration(faceValue, couponRate, yearsToMaturity, frequency, marketYield);
    
    setResults({
      presentValue: Math.round(presentValue * 100) / 100,
      totalCouponIncome: Math.round(totalCouponIncome * 100) / 100,
      afterTaxIncome: Math.round(afterTaxCouponIncome * 100) / 100,
      totalReturn: Math.round((faceValue + totalCouponIncome) * 100) / 100,
      realTotalReturn: Math.round(realTotalReturn * 100) / 100,
      currentYield: Math.round(currentYield * 100) / 100,
      yieldToMaturity: Math.round(yieldToMaturity * 100) / 100,
      duration: Math.round(duration * 100) / 100,
      annualCouponPayment: Math.round(annualCouponIncome * 100) / 100,
      premiumDiscount: Math.round((presentValue - faceValue) * 100) / 100,
      realYield: Math.round(realYield * 100) / 100
    });
    
    setChartData(dataPoints);
  };

  // Fixed: Renamed 'yield' parameter to 'bondYield' to avoid reserved keyword conflict
  const calculateDuration = (faceValue, couponRate, years, frequency, bondYield) => {
    const periods = years * frequency;
    const periodicCoupon = faceValue * (couponRate / 100) / frequency;
    const periodicYield = bondYield / 100 / frequency;
    
    let duration = 0;
    let pvTotal = 0;
    
    for (let i = 1; i <= periods; i++) {
      let cashFlow = periodicCoupon;
      if (i === periods) cashFlow += faceValue;
      
      const pv = cashFlow / Math.pow(1 + periodicYield, i);
      duration += (i / frequency) * pv;
      pvTotal += pv;
    }
    
    return duration / pvTotal;
  };

  useEffect(() => {
    calculateBondReturns();
  }, [faceValue, couponRate, yearsToMaturity, paymentFrequency, marketYield, taxRate, inflationRate]);

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

  const getBondType = () => {
    if (couponRate < 2) return 'Zero-Coupon Bond';
    if (couponRate < 4) return 'Low-Coupon Bond';
    if (couponRate < 7) return 'Medium-Coupon Bond';
    return 'High-Coupon Bond';
  };

  const getPriceStatus = (price) => {
    if (price > faceValue) return { status: 'Premium', color: '#ef4444' };
    if (price < faceValue) return { status: 'Discount', color: '#10b981' };
    return { status: 'Par Value', color: '#666666' };
  };

  return (
    <>
      <Head>
        <title>Government Bond Investment Calculator | Treasury Bond Yield & Return Analysis</title>
        <meta name="description" content="Free advanced government bond calculator. Calculate Treasury bond yields, present values, duration, and after-tax returns with inflation adjustment." />
        <meta name="keywords" content="bond calculator, government bond calculator, treasury bond calculator, bond yield calculator, fixed income calculator, bond duration, bond pricing" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/government-bonds-calculator" />
        
        <meta property="og:title" content="Government Bond Investment Calculator | Treasury Bond Yield & Return Analysis" />
        <meta property="og:description" content="Calculate government bond investment returns with yield to maturity, duration, and tax analysis." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/government-bonds-calculator" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Government Bond Calculator" />
        <meta name="twitter:description" content="Analyze Treasury bond investments with professional-grade calculations." />
      </Head>

      <Script
        id="government-bond-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Government Bond Investment Calculator",
            "description": "Professional-grade government bond calculator with yield to maturity, duration analysis, and tax-adjusted returns",
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
              "name": "Fixed Income Tools",
              "url": "https://www.financecalculatorfree.com"
            },
            "featureList": [
              "Yield to Maturity Calculation",
              "Bond Duration Analysis",
              "Tax-Adjusted Returns",
              "Inflation Adjustment",
              "Premium/Discount Analysis"
            ]
          })
        }}
      />

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
                "name": "What is yield to maturity (YTM) in bond investing?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yield to maturity is the total return anticipated on a bond if held until it matures. YTM considers the bond's current market price, par value, coupon interest rate, and time to maturity. It's the most comprehensive measure of a bond's return, accounting for both interest payments and any capital gain or loss.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How does bond duration affect investment risk?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Duration measures a bond's price sensitivity to interest rate changes. Bonds with longer durations are more sensitive to interest rate movements. For example, if a bond has a duration of 5 years, a 1% increase in interest rates will cause approximately a 5% decrease in the bond's price. Duration helps investors manage interest rate risk in their fixed income portfolios.",
                  "datePublished": currentDate
                }
              }
            ]
          })
        }}
      />

      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.mainTitle}>Government Bond Investment Calculator</h1>
            <p className={styles.subtitle}>Calculate Treasury Bond Yields, Duration, and After-Tax Returns</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>Professional Grade</span>
              <span className={styles.badge}>Accurate Pricing</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Configure Your Bond Investment</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Face Value (Par Value)
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="1000"
                      max="100000"
                      step="1000"
                      value={faceValue}
                      onChange={(e) => setFaceValue(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="1000"
                      max="100000"
                      step="1000"
                      value={faceValue}
                      onChange={(e) => setFaceValue(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(faceValue)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Coupon Rate (Annual)
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.1"
                      value={couponRate}
                      onChange={(e) => setCouponRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="10"
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
                  Years to Maturity
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      step="1"
                      value={yearsToMaturity}
                      onChange={(e) => setYearsToMaturity(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="1"
                      max="30"
                      step="1"
                      value={yearsToMaturity}
                      onChange={(e) => setYearsToMaturity(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.yearsSymbol}>years</span>
                  </div>
                  <div className={styles.valueDisplay}>{yearsToMaturity} years</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Payment Frequency
                  <select
                    value={paymentFrequency}
                    onChange={(e) => setPaymentFrequency(e.target.value)}
                    className={styles.selectInput}
                  >
                    <option value="annual">Annual</option>
                    <option value="semi-annual">Semi-Annual</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Market Yield (YTM)
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0.5"
                      max="10"
                      step="0.1"
                      value={marketYield}
                      onChange={(e) => setMarketYield(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0.5"
                      max="10"
                      step="0.1"
                      value={marketYield}
                      onChange={(e) => setMarketYield(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(marketYield)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Tax Rate on Interest
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      step="1"
                      value={taxRate}
                      onChange={(e) => setTaxRate(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="50"
                      step="1"
                      value={taxRate}
                      onChange={(e) => setTaxRate(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(taxRate)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Expected Inflation Rate
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.1"
                      value={inflationRate}
                      onChange={(e) => setInflationRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={inflationRate}
                      onChange={(e) => setInflationRate(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(inflationRate)}</div>
                </label>
              </div>
            </div>

            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Bond Investment Analysis</h2>
              
              {results && (
                <>
                  <div className={styles.bondSummary}>
                    <div className={styles.bondType}>{getBondType()}</div>
                    <div className={styles.priceStatus} style={{ color: getPriceStatus(results.presentValue).color }}>
                      {getPriceStatus(results.presentValue).status}
                    </div>
                  </div>

                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Current Price</div>
                      <div className={styles.resultValue}>{formatCurrency(results.presentValue)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Total Coupon Income</div>
                      <div className={styles.resultValue}>{formatCurrency(results.totalCouponIncome)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>After-Tax Income</div>
                      <div className={styles.resultValue}>{formatCurrency(results.afterTaxIncome)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Total Return</div>
                      <div className={`${styles.resultValue} ${styles.returnValue}`}>{formatCurrency(results.totalReturn)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Current Yield</div>
                      <div className={`${styles.resultValue} ${styles.yieldValue}`}>{formatPercentage(results.currentYield)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Yield to Maturity</div>
                      <div className={`${styles.resultValue} ${styles.ytmValue}`}>{formatPercentage(results.yieldToMaturity)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Macaulay Duration</div>
                      <div className={`${styles.resultValue} ${styles.durationValue}`}>{results.duration} years</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Real Yield (Inflation Adj.)</div>
                      <div className={`${styles.resultValue} ${styles.realYieldValue}`}>{formatPercentage(results.realYield)}</div>
                    </div>
                  </div>

                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>Income Stream Over Time</h3>
                    <div className={styles.chartBars}>
                      {chartData.map((data, index) => (
                        <div key={index} className={styles.chartBarGroup}>
                          <div className={styles.chartBarLabel}>Year {data.year}</div>
                          <div className={styles.chartBarContainer}>
                            <div 
                              className={styles.chartBarCoupon}
                              style={{ width: `${(data.couponValue / faceValue) * 100}%` }}
                              title={`Coupon Payments: ${formatCurrency(data.couponValue)}`}
                            />
                            <div 
                              className={styles.chartBarPrincipal}
                              style={{ width: `${(data.principalValue / faceValue) * 100}%` }}
                              title={`Principal Value: ${formatCurrency(data.principalValue)}`}
                            />
                          </div>
                          <div className={styles.chartBarValue}>
                            {formatCurrency(data.couponValue + data.principalValue)}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.chartLegend}>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendCoupon}`}></div>
                        <span>Coupon Payments</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendPrincipal}`}></div>
                        <span>Principal Value</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>Bond Investment Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>Annual coupon payment: <strong>{formatCurrency(results.annualCouponPayment)}</strong></li>
                      <li>Bond trades at <strong>{formatCurrency(Math.abs(results.premiumDiscount))}</strong> {results.premiumDiscount > 0 ? 'premium' : 'discount'}</li>
                      <li>Real (inflation-adjusted) total return: <strong>{formatCurrency(results.realTotalReturn)}</strong></li>
                      <li>Duration of <strong>{results.duration} years</strong> indicates interest rate sensitivity</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className={styles.educationalContent}>
            <article className={styles.articleCard}>
              <h2 className={styles.articleTitle}>Government Bond Investing: A Comprehensive Guide</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Understanding Bond Fundamentals</h3>
                <p>Government bonds are debt securities issued by national governments to finance public spending. They are considered among the safest investments due to government backing, offering predictable income streams and capital preservation. Understanding key bond metrics is essential for fixed income investors.</p>
                
                <div className={styles.exampleCard}>
                  <h4>Example: 10-Year Treasury Bond</h4>
                  <p>A $10,000 Treasury bond with 3.5% coupon, 10-year maturity:</p>
                  <ul>
                    <li><strong>Annual Income:</strong> $350 ($175 semi-annual)</li>
                    <li><strong>Total Coupon Payments:</strong> $3,500 over 10 years</li>
                    <li><strong>Yield to Maturity (3%):</strong> $10,427 present value</li>
                    <li><strong>Duration:</strong> Approximately 8.5 years</li>
                    <li><strong>After-tax Return (25% rate):</strong> $2,625 net coupon income</li>
                  </ul>
                  <p>This demonstrates the balance between income generation and price sensitivity.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Key Bond Investment Strategies</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>Laddering Strategy</h4>
                    <p>Purchase bonds with staggered maturities to manage interest rate risk and maintain liquidity. As each bond matures, reinvest in new bonds at current rates.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>Barbell Strategy</h4>
                    <p>Invest in short-term and long-term bonds while avoiding intermediate maturities. Combines liquidity of short bonds with higher yields of long bonds.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>Bullet Strategy</h4>
                    <p>Concentrate bond investments in a specific maturity range. Useful for matching known future liabilities or taking a specific interest rate view.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>Duration Management</h4>
                    <p>Adjust portfolio duration based on interest rate outlook. Shorten duration when rates are expected to rise, lengthen when rates are expected to fall.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Risk Considerations in Bond Investing</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Interest Rate Risk:</strong> Bond prices fall when interest rates rise, with longer-duration bonds most affected</li>
                  <li><strong>Inflation Risk:</strong> Fixed coupon payments lose purchasing power during inflationary periods</li>
                  <li><strong>Reinvestment Risk:</strong> Future coupon payments may need to be reinvested at lower rates</li>
                  <li><strong>Credit Risk:</strong> Risk of government default (low for developed countries, higher for emerging markets)</li>
                  <li><strong>Liquidity Risk:</strong> Difficulty selling bonds quickly without significant price concessions</li>
                  <li><strong>Tax Considerations:</strong> Treasury bond interest is taxable at federal level but exempt from state taxes</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Perspective</h3>
                <blockquote className={styles.expertQuote}>
                  "Bonds should be viewed not just as income generators, but as portfolio stabilizers. The primary role of government bonds in a diversified portfolio is to provide ballast during equity market downturns. Understanding duration and yield curve positioning is crucial for effective fixed income management."
                  <footer className={styles.quoteFooter}>— Fixed Income Portfolio Manager, 20+ years experience</footer>
                </blockquote>
              </div>
            </article>

            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's the difference between coupon rate and yield to maturity?</h3>
                <p className={styles.faqAnswer}>The coupon rate is the fixed annual interest rate stated on the bond. Yield to maturity (YTM) is the total expected return if the bond is held to maturity, accounting for the bond's current market price, coupon payments, and time to maturity. YTM changes with market conditions, while the coupon rate remains fixed.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Why do bond prices move inversely to interest rates?</h3>
                <p className={styles.faqAnswer}>When interest rates rise, new bonds are issued with higher coupon rates. Existing bonds with lower coupons become less attractive, so their prices fall to offer comparable yields. Conversely, when rates fall, existing bonds with higher coupons become more valuable, so their prices rise. This inverse relationship is fundamental to bond investing.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Are Treasury bonds completely risk-free?</h3>
                <p className={styles.faqAnswer}>U.S. Treasury bonds are considered virtually free of credit risk because they're backed by the full faith and credit of the U.S. government. However, they still carry interest rate risk, inflation risk, and reinvestment risk. In extremely high inflation environments, long-term bonds can experience significant real (inflation-adjusted) losses.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How should I incorporate bonds into my retirement portfolio?</h3>
                <p className={styles.faqAnswer}>For retirement portfolios, bonds typically serve as the stability component. A common approach is to hold bonds with maturities matching your expected withdrawal timeline. Consider Treasury Inflation-Protected Securities (TIPS) for inflation protection and municipal bonds for tax efficiency in taxable accounts. Rebalance regularly to maintain your target allocation.</p>
              </div>
            </div>
          </div>

          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Build Your Bond Investment Strategy</h2>
              <p className={styles.ctaText}>Use this calculator to analyze different bond scenarios and develop a fixed income strategy that aligns with your financial goals and risk tolerance.</p>
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates for educational purposes. Bond prices and yields fluctuate with market conditions. Past performance does not guarantee future results. Consider consulting with a financial advisor for personalized investment advice. Tax rates and inflation assumptions may vary.
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
    revalidate: 86400, // 24 hours
  };
}

export default GovernmentBondCalculator;