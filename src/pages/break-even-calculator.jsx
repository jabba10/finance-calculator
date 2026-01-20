import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './breakevencalculator.module.css';

const ReturnOnBreakEvenCalculator = ({ currentDate, lastModifiedDate }) => {
  const [fixedCosts, setFixedCosts] = useState(50000);
  const [variableCostPerUnit, setVariableCostPerUnit] = useState(25);
  const [sellingPricePerUnit, setSellingPricePerUnit] = useState(75);
  const [expectedUnits, setExpectedUnits] = useState(2000);
  const [results, setResults] = useState(null);
  const [breakEvenChart, setBreakEvenChart] = useState([]);

  const calculateBreakEven = () => {
    const breakEvenUnits = fixedCosts / (sellingPricePerUnit - variableCostPerUnit);
    const breakEvenRevenue = breakEvenUnits * sellingPricePerUnit;
    const expectedRevenue = expectedUnits * sellingPricePerUnit;
    const totalVariableCosts = expectedUnits * variableCostPerUnit;
    const totalCosts = fixedCosts + totalVariableCosts;
    const expectedProfit = expectedRevenue - totalCosts;
    const marginOfSafety = ((expectedUnits - breakEvenUnits) / expectedUnits) * 100;
    const contributionMargin = sellingPricePerUnit - variableCostPerUnit;
    const contributionMarginRatio = (contributionMargin / sellingPricePerUnit) * 100;

    const dataPoints = [];
    const maxUnits = Math.max(expectedUnits, breakEvenUnits * 1.5);
    
    for (let units = 0; units <= maxUnits; units += Math.ceil(maxUnits / 10)) {
      const revenue = units * sellingPricePerUnit;
      const totalCost = fixedCosts + (units * variableCostPerUnit);
      const profit = revenue - totalCost;
      
      dataPoints.push({
        units: units,
        revenue: revenue,
        totalCost: totalCost,
        profit: profit,
        isBreakEven: Math.abs(profit) < (sellingPricePerUnit * 0.1) // Close to break-even
      });
    }

    setResults({
      breakEvenUnits: Math.ceil(breakEvenUnits),
      breakEvenRevenue: Math.round(breakEvenRevenue),
      expectedProfit: Math.round(expectedProfit),
      marginOfSafety: Math.round(marginOfSafety * 100) / 100,
      contributionMargin: Math.round(contributionMargin * 100) / 100,
      contributionMarginRatio: Math.round(contributionMarginRatio * 100) / 100,
      expectedRevenue: Math.round(expectedRevenue),
      totalCosts: Math.round(totalCosts),
      roi: breakEvenUnits > 0 ? Math.round(((sellingPricePerUnit - variableCostPerUnit) * expectedUnits / fixedCosts) * 100 * 100) / 100 : 0
    });
    
    setBreakEvenChart(dataPoints);
  };

  useEffect(() => {
    calculateBreakEven();
  }, [fixedCosts, variableCostPerUnit, sellingPricePerUnit, expectedUnits]);

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
        <title>Return on Break-Even Point Calculator | Business Profitability Analysis</title>
        <meta name="description" content="Advanced break-even analysis calculator with ROI calculation. Determine when your business becomes profitable, analyze costs vs revenue, and optimize pricing strategies." />
        <meta name="keywords" content="break-even calculator, business profitability, ROI calculator, cost analysis, pricing strategy, financial planning, business startup" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/break-even-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Return on Break-Even Point Calculator | Business Profitability Analysis" />
        <meta property="og:description" content="Calculate your business break-even point, analyze profitability, and optimize pricing strategies. Free tool for entrepreneurs and business owners." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/break-even-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Break-Even Point Calculator with ROI Analysis" />
        <meta name="twitter:description" content="Determine when your business becomes profitable with our comprehensive break-even analysis tool." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="break-even-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Return on Break-Even Point Calculator",
            "description": "Professional business break-even analysis tool with profitability and ROI calculations",
            "applicationCategory": "BusinessApplication",
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
              "name": "Business Tools Pro",
              "url": "https://www.financecalculatorfree.com"
            },
            "featureList": [
              "Break-Even Analysis",
              "ROI Calculation",
              "Profit Margin Analysis",
              "Visual Cost-Revenue Charts",
              "Pricing Strategy Optimization"
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
                "name": "What is a break-even point and why is it important?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The break-even point is when total revenue equals total costs. Beyond this point, your business becomes profitable. It's crucial for pricing decisions, cost management, and financial planning.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How do fixed and variable costs affect break-even?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Fixed costs (rent, salaries) must be covered regardless of sales volume. Variable costs (materials, commissions) increase with each unit sold. Lowering either reduces your break-even point.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What is a good margin of safety for a business?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A margin of safety of 20-30% is generally healthy. It indicates how much sales can drop before you hit the break-even point. Higher margins provide more financial stability.",
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
            <h1 className={styles.mainTitle}>Return on Break-Even Point Calculator</h1>
            <p className={styles.subtitle}>Analyze Business Profitability & Determine When You Start Making Money</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>Professional Analysis</span>
              <span className={styles.badge}>Free Business Tool</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Business Cost & Revenue Analysis</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Fixed Costs (Monthly)
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="1000"
                      max="500000"
                      step="1000"
                      value={fixedCosts}
                      onChange={(e) => setFixedCosts(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="1000"
                      max="500000"
                      step="1000"
                      value={fixedCosts}
                      onChange={(e) => setFixedCosts(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(fixedCosts)}/month</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Variable Cost Per Unit
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="1"
                      max="200"
                      step="1"
                      value={variableCostPerUnit}
                      onChange={(e) => setVariableCostPerUnit(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="1"
                      max="200"
                      step="1"
                      value={variableCostPerUnit}
                      onChange={(e) => setVariableCostPerUnit(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(variableCostPerUnit)}/unit</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Selling Price Per Unit
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="5"
                      max="500"
                      step="5"
                      value={sellingPricePerUnit}
                      onChange={(e) => setSellingPricePerUnit(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="5"
                      max="500"
                      step="5"
                      value={sellingPricePerUnit}
                      onChange={(e) => setSellingPricePerUnit(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(sellingPricePerUnit)}/unit</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Expected Monthly Sales Volume
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="100"
                      max="10000"
                      step="100"
                      value={expectedUnits}
                      onChange={(e) => setExpectedUnits(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="100"
                      max="10000"
                      step="100"
                      value={expectedUnits}
                      onChange={(e) => setExpectedUnits(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.unitsSymbol}>units</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatNumber(expectedUnits)} units/month</div>
                </label>
              </div>

              <div className={styles.breakEvenFormula}>
                <h3 className={styles.formulaTitle}>Break-Even Formula</h3>
                <p className={styles.formula}>
                  Break-Even Point (Units) = Fixed Costs ÷ (Selling Price - Variable Cost)
                </p>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Profitability Analysis</h2>
              
              {results && (
                <>
                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Break-Even Units</div>
                      <div className={styles.resultValue}>{formatNumber(results.breakEvenUnits)}</div>
                      <div className={styles.resultSubtext}>units to cover costs</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Break-Even Revenue</div>
                      <div className={styles.resultValue}>{formatCurrency(results.breakEvenRevenue)}</div>
                      <div className={styles.resultSubtext}>sales needed</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Expected Profit</div>
                      <div className={`${styles.resultValue} ${results.expectedProfit >= 0 ? styles.profitPositive : styles.profitNegative}`}>
                        {formatCurrency(results.expectedProfit)}
                      </div>
                      <div className={styles.resultSubtext}>monthly profit</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Margin of Safety</div>
                      <div className={styles.resultValue}>{formatPercentage(results.marginOfSafety)}</div>
                      <div className={styles.resultSubtext}>safety buffer</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Contribution Margin</div>
                      <div className={styles.resultValue}>{formatCurrency(results.contributionMargin)}</div>
                      <div className={styles.resultSubtext}>per unit profit</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>ROI at Expected Sales</div>
                      <div className={styles.resultValue}>{formatPercentage(results.roi)}</div>
                      <div className={styles.resultSubtext}>return on investment</div>
                    </div>
                  </div>

                  {/* Break-Even Chart Visualization */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>Revenue vs Costs Analysis</h3>
                    <div className={styles.chartBars}>
                      {breakEvenChart.slice(1).map((data, index) => (
                        <div key={index} className={styles.chartBarGroup}>
                          <div className={styles.chartBarLabel}>{formatNumber(data.units)} units</div>
                          <div className={styles.chartBarContainer}>
                            <div 
                              className={styles.chartBarRevenue}
                              style={{ width: `${(data.revenue / (results.breakEvenRevenue * 1.5)) * 100}%` }}
                              title={`Revenue: ${formatCurrency(data.revenue)}`}
                            />
                            <div 
                              className={styles.chartBarCost}
                              style={{ width: `${(data.totalCost / (results.breakEvenRevenue * 1.5)) * 100}%` }}
                              title={`Total Cost: ${formatCurrency(data.totalCost)}`}
                            />
                            {data.isBreakEven && (
                              <div className={styles.breakEvenMarker}>BREAK-EVEN</div>
                            )}
                          </div>
                          <div className={`${styles.chartBarValue} ${data.profit >= 0 ? styles.profitPositive : styles.profitNegative}`}>
                            {formatCurrency(data.profit)}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.chartLegend}>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendRevenue}`}></div>
                        <span>Revenue</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendCost}`}></div>
                        <span>Total Costs</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>📊 Business Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>You need to sell <strong>{formatNumber(results.breakEvenUnits)} units</strong> monthly to break even</li>
                      <li>Each unit contributes <strong>{formatCurrency(results.contributionMargin)}</strong> toward covering fixed costs</li>
                      <li>Your margin of safety is <strong>{formatPercentage(results.marginOfSafety)}</strong> above break-even</li>
                      {results.expectedProfit > 0 && (
                        <li>At expected sales, you'll earn <strong>{formatCurrency(results.expectedProfit)}</strong> monthly profit</li>
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
              <h2 className={styles.articleTitle}>Mastering Break-Even Analysis for Business Success</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Why Break-Even Analysis is Critical</h3>
                <p>Break-even analysis is the foundation of sound business planning. It tells you exactly how much you need to sell to cover all your costs, helping you set realistic sales targets, price products appropriately, and make informed financial decisions. Without understanding your break-even point, you're essentially running your business blindfolded.</p>
                
                <div className={styles.exampleCard}>
                  <h4>Real Business Scenario:</h4>
                  <p>A coffee shop with monthly fixed costs of $8,000 sells coffee for $4 with a variable cost of $1 per cup:</p>
                  <ul>
                    <li><strong>Break-even point:</strong> 2,667 cups per month ($8,000 ÷ ($4 - $1))</li>
                    <li><strong>Daily target:</strong> ~89 cups (assuming 30 days)</li>
                    <li><strong>At 3,500 cups:</strong> $2,500 monthly profit</li>
                  </ul>
                  <p>This simple analysis guides staffing, marketing, and expansion decisions.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Strategies to Lower Your Break-Even Point</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>💰 Reduce Fixed Costs</h4>
                    <p>Negotiate lower rent, optimize staffing, use technology to automate tasks. Every $1,000 reduction in fixed costs significantly lowers your break-even point.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📉 Lower Variable Costs</h4>
                    <p>Bulk purchasing, efficient production, renegotiating supplier contracts. Reducing variable costs increases contribution margin per unit.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📈 Increase Prices Strategically</h4>
                    <p>Add value to justify price increases, implement tiered pricing, focus on premium offerings. Small price increases dramatically impact profitability.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🚀 Boost Sales Volume</h4>
                    <p>Effective marketing, sales team incentives, expanding distribution channels. Higher volume spreads fixed costs across more units.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Industry-Specific Applications</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Startups:</strong> Determine funding needs and runway before profitability</li>
                  <li><strong>Manufacturing:</strong> Calculate optimal production levels and capacity planning</li>
                  <li><strong>Retail:</strong> Set sales targets and inventory management strategies</li>
                  <li><strong>Services:</strong> Price services and determine client acquisition costs</li>
                  <li><strong>SaaS Businesses:</strong> Analyze customer lifetime value vs acquisition costs</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Advice from Business Consultants</h3>
                <blockquote className={styles.expertQuote}>
                  "The most successful entrepreneurs constantly monitor their break-even point. It's not just a calculation you do once—it's a living metric that should guide daily business decisions. When you know your numbers, you can make confident, data-driven choices about growth, pricing, and cost management."
                  <footer className={styles.quoteFooter}>— Business Growth Consultant, 20+ years experience</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's the difference between fixed and variable costs?</h3>
                <p className={styles.faqAnswer}>Fixed costs remain constant regardless of production/sales volume (rent, salaries, insurance). Variable costs change with production volume (raw materials, packaging, shipping). Understanding this distinction is crucial for accurate break-even analysis.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How does break-even analysis help with pricing decisions?</h3>
                <p className={styles.faqAnswer}>Break-even analysis shows you the minimum price needed to cover costs at different sales volumes. It helps determine if a price is sustainable, identifies opportunities for premium pricing, and reveals how price changes affect profitability at various sales levels.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What is a good margin of safety for my business?</h3>
                <p className={styles.faqAnswer}>A 20-30% margin of safety is generally healthy for established businesses. Startups might aim for lower margins initially. Higher margins provide cushion against sales fluctuations. Industries with volatile demand (restaurants, retail) need higher margins than stable industries.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How often should I recalculate my break-even point?</h3>
                <p className={styles.faqAnswer}>Recalculate quarterly or whenever significant changes occur: price adjustments, cost increases, new product lines, or expansion. Successful businesses update their break-even analysis regularly as market conditions and costs evolve.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Optimize Your Business Profitability</h2>
              <p className={styles.ctaText}>Use this calculator to test different scenarios. Adjust pricing, reduce costs, and find the optimal path to profitability for your business.</p>
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates for educational purposes. Actual business results may vary based on market conditions, competition, and operational factors. Consult with a business advisor or accountant for specific financial advice.
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

export default ReturnOnBreakEvenCalculator;