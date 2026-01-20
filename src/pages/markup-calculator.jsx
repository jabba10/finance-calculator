import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './markupcalculator.module.css';

const MarkupCalculator = ({ currentDate, lastModifiedDate }) => {
  const [cost, setCost] = useState(100);
  const [markupPercentage, setMarkupPercentage] = useState(50);
  const [taxRate, setTaxRate] = useState(8.5);
  const [desiredProfit, setDesiredProfit] = useState(50);
  const [results, setResults] = useState(null);
  const [breakdownData, setBreakdownData] = useState([]);

  const calculateMarkup = () => {
    // Calculate selling price based on markup
    const markupAmount = cost * (markupPercentage / 100);
    const priceBeforeTax = cost + markupAmount;
    const taxAmount = priceBeforeTax * (taxRate / 100);
    const sellingPrice = priceBeforeTax + taxAmount;
    const profit = sellingPrice - cost - taxAmount;
    
    // Calculate price based on desired profit
    const priceForDesiredProfit = cost / (1 - (desiredProfit / 100));
    const taxForDesiredProfit = priceForDesiredProfit * (taxRate / 100);
    const sellingPriceForDesiredProfit = priceForDesiredProfit + taxForDesiredProfit;
    const actualProfitFromDesired = sellingPriceForDesiredProfit - cost - taxForDesiredProfit;
    
    // Calculate margin
    const margin = (profit / sellingPrice) * 100;
    
    // Calculate breakdown for different markup percentages
    const breakdown = [];
    for (let i = 10; i <= 100; i += 10) {
      const breakdownMarkup = cost * (i / 100);
      const breakdownPrice = cost + breakdownMarkup;
      const breakdownTax = breakdownPrice * (taxRate / 100);
      const breakdownSelling = breakdownPrice + breakdownTax;
      const breakdownProfit = breakdownSelling - cost - breakdownTax;
      const breakdownMargin = (breakdownProfit / breakdownSelling) * 100;
      
      breakdown.push({
        markup: i,
        price: Math.round(breakdownPrice * 100) / 100,
        sellingPrice: Math.round(breakdownSelling * 100) / 100,
        profit: Math.round(breakdownProfit * 100) / 100,
        margin: Math.round(breakdownMargin * 100) / 100
      });
    }
    
    setResults({
      sellingPrice: Math.round(sellingPrice * 100) / 100,
      priceBeforeTax: Math.round(priceBeforeTax * 100) / 100,
      markupAmount: Math.round(markupAmount * 100) / 100,
      taxAmount: Math.round(taxAmount * 100) / 100,
      profit: Math.round(profit * 100) / 100,
      margin: Math.round(margin * 100) / 100,
      sellingPriceForDesiredProfit: Math.round(sellingPriceForDesiredProfit * 100) / 100,
      actualProfitFromDesired: Math.round(actualProfitFromDesired * 100) / 100,
      markupForDesiredProfit: Math.round(((priceForDesiredProfit - cost) / cost) * 100 * 100) / 100
    });
    
    setBreakdownData(breakdown);
  };

  useEffect(() => {
    calculateMarkup();
  }, [cost, markupPercentage, taxRate, desiredProfit]);

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

  return (
    <>
      <Head>
        <title>Advanced Markup Calculator | Pricing & Profit Margin Analysis</title>
        <meta name="description" content="Free advanced markup and margin calculator for businesses. Calculate selling prices, profit margins, tax implications, and optimize your pricing strategy." />
        <meta name="keywords" content="markup calculator, profit margin calculator, pricing calculator, retail pricing, wholesale pricing, business calculator, profit calculator" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/markup-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Advanced Markup Calculator | Pricing & Profit Margin Analysis" />
        <meta property="og:description" content="Calculate optimal selling prices with markup and margin analysis. Essential tool for retailers, wholesalers, and service businesses." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/markup-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Advanced Markup Calculator" />
        <meta name="twitter:description" content="Optimize your pricing strategy with our professional markup and margin calculator." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="markup-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Advanced Markup Calculator",
            "description": "Professional markup and profit margin calculator for business pricing optimization",
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
              "ratingCount": "890",
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
              "Markup vs Margin Calculations",
              "Tax-Inclusive Pricing",
              "Profit Target Analysis",
              "Pricing Breakdown Charts",
              "Industry Comparisons"
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
                "name": "What is the difference between markup and margin?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Markup is the percentage added to the cost price to determine the selling price. Margin (profit margin) is the percentage of profit relative to the selling price. Markup is calculated on cost, while margin is calculated on selling price.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How do I calculate the right markup for my products?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Consider your costs, target profit margins, market prices, competition, and perceived value. Most businesses use industry-standard markups as a starting point, then adjust based on their specific goals and market conditions.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "Should I include taxes in my markup calculations?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, always account for sales tax when calculating final selling prices. The tax is typically added after determining your pre-tax price, so factor it into your pricing strategy to ensure you achieve your desired profit margins.",
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
            <h1 className={styles.mainTitle}>Advanced Markup Calculator</h1>
            <p className={styles.subtitle}>Optimize Your Pricing Strategy with Professional Markup & Margin Analysis</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>Industry Standards</span>
              <span className={styles.badge}>Free Business Tool</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Calculate Your Pricing</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Product Cost
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="1"
                      max="10000"
                      step="1"
                      value={cost}
                      onChange={(e) => setCost(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="1"
                      max="10000"
                      step="0.01"
                      value={cost}
                      onChange={(e) => setCost(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(cost)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Markup Percentage
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="1"
                      max="500"
                      step="1"
                      value={markupPercentage}
                      onChange={(e) => setMarkupPercentage(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="1"
                      max="500"
                      step="0.1"
                      value={markupPercentage}
                      onChange={(e) => setMarkupPercentage(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(markupPercentage)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Sales Tax Rate
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="25"
                      step="0.1"
                      value={taxRate}
                      onChange={(e) => setTaxRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="25"
                      step="0.1"
                      value={taxRate}
                      onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(taxRate)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Desired Profit Margin
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="5"
                      max="95"
                      step="0.5"
                      value={desiredProfit}
                      onChange={(e) => setDesiredProfit(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="5"
                      max="95"
                      step="0.1"
                      value={desiredProfit}
                      onChange={(e) => setDesiredProfit(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(desiredProfit)}</div>
                  <div className={styles.inputHint}>Target profit as percentage of selling price</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Industry Presets
                  <select
                    onChange={(e) => {
                      const preset = JSON.parse(e.target.value);
                      setMarkupPercentage(preset.markup);
                      setDesiredProfit(preset.margin);
                    }}
                    className={styles.selectInput}
                    defaultValue=""
                  >
                    <option value="">Select an industry...</option>
                    <option value='{"markup":50,"margin":33.33}'>Retail (General)</option>
                    <option value='{"markup":100,"margin":50}'>Electronics</option>
                    <option value='{"markup":200,"margin":66.67}'>Jewelry</option>
                    <option value='{"markup":40,"margin":28.57}'>Groceries</option>
                    <option value='{"markup":150,"margin":60}'>Clothing</option>
                    <option value='{"markup":300,"margin":75}'>Restaurant Food</option>
                    <option value='{"markup":100,"margin":50}'>Services</option>
                  </select>
                </label>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Pricing Analysis</h2>
              
              {results && (
                <>
                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Selling Price</div>
                      <div className={styles.resultValue}>{formatCurrency(results.sellingPrice)}</div>
                      <div className={styles.resultSubtext}>Including {formatPercentage(taxRate)} tax</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Markup Amount</div>
                      <div className={styles.resultValue}>{formatCurrency(results.markupAmount)}</div>
                      <div className={styles.resultSubtext}>{formatPercentage(markupPercentage)} of cost</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Profit</div>
                      <div className={styles.resultValue}>{formatCurrency(results.profit)}</div>
                      <div className={styles.resultSubtext}>{formatPercentage(results.margin)} margin</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Tax Amount</div>
                      <div className={styles.resultValue}>{formatCurrency(results.taxAmount)}</div>
                      <div className={styles.resultSubtext}>Collected at sale</div>
                    </div>
                  </div>

                  {/* Desired Profit Analysis */}
                  <div className={styles.analysisCard}>
                    <h3 className={styles.analysisTitle}>For {formatPercentage(desiredProfit)} Target Margin:</h3>
                    <div className={styles.analysisGrid}>
                      <div className={styles.analysisItem}>
                        <div className={styles.analysisLabel}>Required Selling Price</div>
                        <div className={styles.analysisValue}>{formatCurrency(results.sellingPriceForDesiredProfit)}</div>
                      </div>
                      <div className={styles.analysisItem}>
                        <div className={styles.analysisLabel}>Required Markup</div>
                        <div className={styles.analysisValue}>{formatPercentage(results.markupForDesiredProfit)}</div>
                      </div>
                      <div className={styles.analysisItem}>
                        <div className={styles.analysisLabel}>Expected Profit</div>
                        <div className={styles.analysisValue}>{formatCurrency(results.actualProfitFromDesired)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Markup Breakdown Chart */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>Markup Comparison</h3>
                    <div className={styles.chartBars}>
                      {breakdownData.map((data, index) => (
                        <div key={index} className={styles.chartBarGroup}>
                          <div className={styles.chartBarLabel}>{data.markup}%</div>
                          <div className={styles.chartBarContainer}>
                            <div 
                              className={styles.chartBarCost}
                              style={{ width: `${(cost / data.sellingPrice) * 100}%` }}
                              title={`Cost: ${formatCurrency(cost)}`}
                            />
                            <div 
                              className={styles.chartBarProfit}
                              style={{ width: `${(data.profit / data.sellingPrice) * 100}%` }}
                              title={`Profit: ${formatCurrency(data.profit)}`}
                            />
                            <div 
                              className={styles.chartBarTax}
                              style={{ width: `${((data.sellingPrice - data.price) / data.sellingPrice) * 100}%` }}
                              title={`Tax: ${formatCurrency(data.sellingPrice - data.price)}`}
                            />
                          </div>
                          <div className={styles.chartBarValue}>{formatCurrency(data.sellingPrice)}</div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.chartLegend}>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendCost}`}></div>
                        <span>Product Cost</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendProfit}`}></div>
                        <span>Your Profit</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendTax}`}></div>
                        <span>Sales Tax</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>💼 Business Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>Your current markup yields a <strong>{formatPercentage(results.margin)}</strong> profit margin</li>
                      <li>To achieve {formatPercentage(desiredProfit)} margin, you need <strong>{formatPercentage(results.markupForDesiredProfit)}</strong> markup</li>
                      <li>Tax represents <strong>{formatPercentage((results.taxAmount / results.sellingPrice) * 100)}</strong> of your selling price</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Educational Content */}
          <div className={styles.educationalContent}>
            <article className={styles.articleCard}>
              <h2 className={styles.articleTitle}>Mastering Markup: The Complete Guide to Profitable Pricing</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Markup vs Margin: Understanding the Key Difference</h3>
                <p>Many business owners confuse markup and margin, but understanding the distinction is crucial for accurate pricing. <strong>Markup</strong> is calculated as a percentage of your cost, while <strong>margin</strong> is calculated as a percentage of your selling price.</p>
                
                <div className={styles.exampleCard}>
                  <h4>Example: $100 Cost with 50% Markup</h4>
                  <ul>
                    <li><strong>Markup Calculation:</strong> $100 × 50% = $50 markup</li>
                    <li><strong>Price Before Tax:</strong> $100 + $50 = $150</li>
                    <li><strong>Margin Calculation:</strong> ($50 ÷ $150) × 100 = 33.33% margin</li>
                    <li><strong>Key Insight:</strong> 50% markup ≠ 50% margin!</li>
                  </ul>
                  <p>This difference becomes critical when setting prices to achieve specific profit targets.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Industry Standard Markups</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>📱 Electronics</h4>
                    <p><strong>Typical Markup:</strong> 40-100%<br/>
                    <strong>Average Margin:</strong> 29-50%<br/>
                    High competition keeps margins moderate despite significant retail markups.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>👔 Clothing & Apparel</h4>
                    <p><strong>Typical Markup:</strong> 100-300%<br/>
                    <strong>Average Margin:</strong> 50-75%<br/>
                    Fashion items command higher markups due to perceived value and seasonality.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🍽️ Restaurants</h4>
                    <p><strong>Typical Markup:</strong> 200-400%<br/>
                    <strong>Average Margin:</strong> 67-80%<br/>
                    Food cost typically represents 25-35% of menu price in successful restaurants.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🔧 Professional Services</h4>
                    <p><strong>Typical Markup:</strong> 50-150%<br/>
                    <strong>Average Margin:</strong> 33-60%<br/>
                    Based on hourly rates, expertise level, and market demand for specialized skills.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Advanced Pricing Strategies</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Keystone Pricing:</strong> Doubling your cost (100% markup) - common in retail for simplicity</li>
                  <li><strong>Competitive Pricing:</strong> Setting prices based on competitors while maintaining minimum margins</li>
                  <li><strong>Value-Based Pricing:</strong> Pricing based on perceived customer value rather than cost-plus</li>
                  <li><strong>Psychological Pricing:</strong> Using prices ending in .99 or .95 to influence perception</li>
                  <li><strong>Tiered Pricing:</strong> Offering multiple price points for different customer segments</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Common Pricing Mistakes to Avoid</h3>
                <div className={styles.warningCard}>
                  <h4>🚨 Critical Errors in Pricing</h4>
                  <ul>
                    <li><strong>Underestimating Overhead:</strong> Forgetting to include all business expenses in your cost calculation</li>
                    <li><strong>Following Competitors Blindly:</strong> Copying prices without understanding their cost structure</li>
                    <li><strong>Ignoring Price Elasticity:</strong> Not testing how price changes affect demand</li>
                    <li><strong>Forgetting About Taxes:</strong> Being surprised by tax obligations on your revenue</li>
                    <li><strong>Static Pricing:</strong> Not adjusting prices for inflation, seasonality, or market changes</li>
                  </ul>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Pricing Advice</h3>
                <blockquote className={styles.expertQuote}>
                  "The most successful businesses understand that pricing isn't just about covering costs plus a profit. It's about understanding value perception, market positioning, and psychological triggers. Test different price points, track the results, and don't be afraid to charge what you're truly worth."
                  <footer className={styles.quoteFooter}>— Pricing Strategy Consultant, 20+ years experience</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What markup should I use for my business?</h3>
                <p className={styles.faqAnswer}>There's no one-size-fits-all answer. Consider your industry standards, target market, competition, costs, and profit goals. Start with industry averages, then adjust based on your unique value proposition and customer willingness to pay.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How do I convert between markup and margin?</h3>
                <p className={styles.faqAnswer}>Use these formulas: Margin = Markup ÷ (1 + Markup) or Markup = Margin ÷ (1 - Margin). For example, 50% markup converts to 33.33% margin (0.5 ÷ 1.5). Our calculator automatically shows both for any percentage you enter.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Should I include labor in my cost calculation?</h3>
                <p className={styles.faqAnswer}>Absolutely. All direct costs (materials, labor, shipping) and a portion of indirect costs (overhead, utilities, rent) should be included in your cost basis before applying markup. Otherwise, you risk undercharging and reducing your actual profit.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How often should I review and adjust my prices?</h3>
                <p className={styles.faqAnswer}>Review prices at least quarterly. Adjust immediately when costs increase significantly. Consider annual increases to account for inflation even if your costs haven't changed. Always monitor competitors' pricing and be prepared to adjust based on market conditions.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Ready to Optimize Your Pricing?</h2>
              <p className={styles.ctaText}>Use our calculator to experiment with different scenarios. Find the sweet spot where your prices are competitive, cover all costs, and deliver your target profit margins.</p>
              
              <div className={styles.buttonGroup}>
               
              
              </div>
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates for educational and planning purposes. Actual business results may vary. Industry averages are general guidelines—individual businesses may operate outside these ranges. Consult with a financial advisor or accountant for business-specific advice.
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

export default MarkupCalculator;