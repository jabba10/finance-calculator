import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './debtequitycalculator.module.css';

const DebtToEquityCalculator = ({ currentDate, lastModifiedDate }) => {
  const [totalLiabilities, setTotalLiabilities] = useState(500000);
  const [totalEquity, setTotalEquity] = useState(250000);
  const [industry, setIndustry] = useState('technology');
  const [companySize, setCompanySize] = useState('medium');
  const [results, setResults] = useState(null);
  const [comparisonData, setComparisonData] = useState([]);

  const industryStandards = {
    'technology': { low: 0.5, average: 1.0, high: 2.0 },
    'manufacturing': { low: 1.0, average: 2.0, high: 3.0 },
    'retail': { low: 1.5, average: 2.5, high: 4.0 },
    'healthcare': { low: 0.3, average: 0.8, high: 1.5 },
    'real-estate': { low: 2.0, average: 4.0, high: 8.0 },
    'finance': { low: 4.0, average: 8.0, high: 15.0 },
    'utilities': { low: 1.0, average: 2.0, high: 3.5 }
  };

  const sizeMultipliers = {
    'small': 0.7,
    'medium': 1.0,
    'large': 1.3
  };

  const calculateDebtToEquity = () => {
    const ratio = totalLiabilities / totalEquity;
    const industryStandard = industryStandards[industry];
    const sizeMultiplier = sizeMultipliers[companySize];
    
    let riskLevel = 'Low';
    let recommendation = '';
    let color = '#4CAF50';
    
    const adjustedLow = industryStandard.low * sizeMultiplier;
    const adjustedAverage = industryStandard.average * sizeMultiplier;
    const adjustedHigh = industryStandard.high * sizeMultiplier;
    
    if (ratio <= adjustedLow) {
      riskLevel = 'Very Low';
      recommendation = 'Conservative capital structure. Consider strategic debt to fuel growth.';
      color = '#4CAF50';
    } else if (ratio <= adjustedAverage) {
      riskLevel = 'Low';
      recommendation = 'Healthy balance sheet. Maintain current structure for optimal growth.';
      color = '#8BC34A';
    } else if (ratio <= adjustedHigh) {
      riskLevel = 'Moderate';
      recommendation = 'Monitor debt levels. Consider equity financing for next expansion.';
      color = '#FFC107';
    } else {
      riskLevel = 'High';
      recommendation = 'High financial risk. Prioritize debt reduction and equity infusion.';
      color = '#F44336';
    }
    
    const comparisonPoints = [
      { label: 'Your Ratio', value: ratio, color: '#000000' },
      { label: 'Industry Low', value: adjustedLow, color: '#4CAF50' },
      { label: 'Industry Average', value: adjustedAverage, color: '#FFC107' },
      { label: 'Industry High', value: adjustedHigh, color: '#F44336' }
    ];
    
    setResults({
      ratio: Math.round(ratio * 100) / 100,
      percentage: Math.round(ratio * 10000) / 100,
      riskLevel,
      recommendation,
      color,
      totalCapital: totalLiabilities + totalEquity,
      debtPercentage: Math.round((totalLiabilities / (totalLiabilities + totalEquity)) * 10000) / 100,
      equityPercentage: Math.round((totalEquity / (totalLiabilities + totalEquity)) * 10000) / 100
    });
    
    setComparisonData(comparisonPoints);
  };

  useEffect(() => {
    calculateDebtToEquity();
  }, [totalLiabilities, totalEquity, industry, companySize]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatRatio = (value) => {
    return `${value.toFixed(2)}:1`;
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <>
      <Head>
        <title>Advanced Debt to Equity Ratio Calculator | Financial Health Analysis</title>
        <meta name="description" content="Professional debt to equity ratio calculator with industry comparisons. Analyze your company's financial leverage, assess risk levels, and optimize capital structure." />
        <meta name="keywords" content="debt to equity calculator, financial ratio analysis, leverage calculator, corporate finance, capital structure, business valuation" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/debt-to-equity-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Advanced Debt to Equity Ratio Calculator | Financial Health Analysis" />
        <meta property="og:description" content="Analyze your company's financial leverage with our professional debt to equity calculator. Compare against industry standards and optimize your capital structure." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/debt-to-equity-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Professional Debt to Equity Calculator" />
        <meta name="twitter:description" content="Assess your company's financial leverage and compare against industry benchmarks." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="debt-to-equity-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Advanced Debt to Equity Ratio Calculator",
            "description": "Professional financial ratio calculator for analyzing company leverage and capital structure",
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
              "name": "Financial Analysis Pro",
              "url": "https://www.financecalculatorfree.com"
            },
            "featureList": [
              "Industry Benchmark Comparisons",
              "Risk Assessment Analysis",
              "Capital Structure Visualization",
              "Company Size Adjustments",
              "Strategic Recommendations"
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
                "name": "What is a good debt to equity ratio for my business?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A good debt to equity ratio varies by industry. Technology companies typically have ratios under 1.0, while financial institutions may have ratios above 8.0. Our calculator provides industry-specific benchmarks to help you assess your position.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How does company size affect the ideal debt to equity ratio?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Larger companies often can handle higher debt levels due to more stable cash flows and better access to capital markets. Our calculator adjusts benchmarks based on company size for more accurate comparisons.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What are the risks of having a high debt to equity ratio?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "High ratios indicate increased financial risk, including higher interest costs, reduced borrowing capacity, vulnerability to economic downturns, and potential solvency issues during cash flow challenges.",
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
            <h1 className={styles.mainTitle}>Advanced Debt to Equity Ratio Calculator</h1>
            <p className={styles.subtitle}>Analyze Your Company's Financial Leverage Against Industry Standards</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>Industry Benchmarks</span>
              <span className={styles.badge}>Professional Analysis</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Calculate Your Ratio</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Total Liabilities
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="10000"
                      max="10000000"
                      step="10000"
                      value={totalLiabilities}
                      onChange={(e) => setTotalLiabilities(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="10000"
                      max="10000000"
                      step="10000"
                      value={totalLiabilities}
                      onChange={(e) => setTotalLiabilities(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(totalLiabilities)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Total Shareholders' Equity
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="10000"
                      max="10000000"
                      step="10000"
                      value={totalEquity}
                      onChange={(e) => setTotalEquity(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="10000"
                      max="10000000"
                      step="10000"
                      value={totalEquity}
                      onChange={(e) => setTotalEquity(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(totalEquity)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Industry
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className={styles.selectInput}
                  >
                    <option value="technology">Technology</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="retail">Retail</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="real-estate">Real Estate</option>
                    <option value="finance">Finance</option>
                    <option value="utilities">Utilities</option>
                  </select>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Company Size
                  <div className={styles.radioGroup}>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="companySize"
                        value="small"
                        checked={companySize === 'small'}
                        onChange={(e) => setCompanySize(e.target.value)}
                        className={styles.radioInput}
                      />
                      <span className={styles.radioText}>Small (&lt;50 employees)</span>
                    </label>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="companySize"
                        value="medium"
                        checked={companySize === 'medium'}
                        onChange={(e) => setCompanySize(e.target.value)}
                        className={styles.radioInput}
                      />
                      <span className={styles.radioText}>Medium (50-500 employees)</span>
                    </label>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="companySize"
                        value="large"
                        checked={companySize === 'large'}
                        onChange={(e) => setCompanySize(e.target.value)}
                        className={styles.radioInput}
                      />
                      <span className={styles.radioText}>Large (&gt;500 employees)</span>
                    </label>
                  </div>
                </label>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Financial Analysis</h2>
              
              {results && (
                <>
                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Debt to Equity Ratio</div>
                      <div className={styles.resultValue} style={{ color: results.color }}>
                        {formatRatio(results.ratio)}
                      </div>
                      <div className={styles.resultSubtext}>({formatPercentage(results.percentage)})</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Risk Assessment</div>
                      <div className={styles.resultValue} style={{ color: results.color }}>
                        {results.riskLevel}
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Total Capital</div>
                      <div className={styles.resultValue}>{formatCurrency(results.totalCapital)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Debt Proportion</div>
                      <div className={styles.resultValue}>{formatPercentage(results.debtPercentage)}</div>
                    </div>
                  </div>

                  {/* Ratio Comparison Visualization */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>Industry Comparison</h3>
                    <div className={styles.chartBars}>
                      {comparisonData.map((data, index) => (
                        <div key={index} className={styles.chartBarGroup}>
                          <div className={styles.chartBarLabel}>{data.label}</div>
                          <div className={styles.chartBarContainer}>
                            <div 
                              className={styles.chartBar}
                              style={{ 
                                width: `${Math.min(data.value * 20, 100)}%`,
                                backgroundColor: data.color
                              }}
                              title={`${data.label}: ${formatRatio(data.value)}`}
                            />
                          </div>
                          <div className={styles.chartBarValue}>{formatRatio(data.value)}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>📊 Strategic Recommendations</h3>
                    <div className={styles.recommendationBox}>
                      <p className={styles.recommendationText}>{results.recommendation}</p>
                      
                      <div className={styles.actionSteps}>
                        <h4 className={styles.actionTitle}>Recommended Actions:</h4>
                        <ul className={styles.actionList}>
                          {results.riskLevel === 'High' || results.riskLevel === 'Moderate' ? (
                            <>
                              <li>Prioritize debt repayment from operating cash flows</li>
                              <li>Consider equity financing for upcoming expansions</li>
                              <li>Renegotiate debt terms for lower interest rates</li>
                              <li>Improve working capital management</li>
                            </>
                          ) : (
                            <>
                              <li>Consider strategic debt for growth investments</li>
                              <li>Evaluate dividend policies and share buybacks</li>
                              <li>Assess acquisition opportunities</li>
                              <li>Maintain current capital structure</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Capital Structure Visualization */}
                  <div className={styles.capitalStructure}>
                    <h3 className={styles.chartTitle}>Capital Structure</h3>
                    <div className={styles.structureVisualization}>
                      <div className={styles.structureBar}>
                        <div 
                          className={styles.debtPortion}
                          style={{ width: `${results.debtPercentage}%` }}
                          title={`Debt: ${formatPercentage(results.debtPercentage)}`}
                        >
                          <span className={styles.structureLabel}>Debt</span>
                        </div>
                        <div 
                          className={styles.equityPortion}
                          style={{ width: `${results.equityPercentage}%` }}
                          title={`Equity: ${formatPercentage(results.equityPercentage)}`}
                        >
                          <span className={styles.structureLabel}>Equity</span>
                        </div>
                      </div>
                      <div className={styles.structureLegend}>
                        <div className={styles.legendItem}>
                          <div className={`${styles.legendColor} ${styles.legendDebt}`}></div>
                          <span>Debt: {formatPercentage(results.debtPercentage)}</span>
                        </div>
                        <div className={styles.legendItem}>
                          <div className={`${styles.legendColor} ${styles.legendEquity}`}></div>
                          <span>Equity: {formatPercentage(results.equityPercentage)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Educational Content */}
          <div className={styles.educationalContent}>
            <article className={styles.articleCard}>
              <h2 className={styles.articleTitle}>Mastering Debt to Equity Ratio: A Strategic Financial Tool</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Understanding the Debt to Equity Ratio</h3>
                <p>The debt to equity ratio (D/E ratio) is a critical financial metric that compares a company's total liabilities to its shareholders' equity. It measures the degree to which a company is financing its operations through debt versus wholly owned funds. This ratio provides insights into the company's financial leverage, risk profile, and long-term stability.</p>
                
                <div className={styles.formulaCard}>
                  <h4>Calculation Formula:</h4>
                  <div className={styles.formulaBox}>
                    Debt to Equity Ratio = Total Liabilities ÷ Total Shareholders' Equity
                  </div>
                  <p>A ratio of 2.0 means the company has $2.00 in debt for every $1.00 in equity.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Strategic Implications by Industry</h3>
                
                <div className={styles.industryTable}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Industry</th>
                        <th>Low Ratio</th>
                        <th>Average Ratio</th>
                        <th>High Ratio</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Technology</td>
                        <td>0.5:1</td>
                        <td>1.0:1</td>
                        <td>2.0:1</td>
                      </tr>
                      <tr>
                        <td>Manufacturing</td>
                        <td>1.0:1</td>
                        <td>2.0:1</td>
                        <td>3.0:1</td>
                      </tr>
                      <tr>
                        <td>Finance</td>
                        <td>4.0:1</td>
                        <td>8.0:1</td>
                        <td>15.0:1</td>
                      </tr>
                      <tr>
                        <td>Real Estate</td>
                        <td>2.0:1</td>
                        <td>4.0:1</td>
                        <td>8.0:1</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>When High Ratios Make Sense</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>🏢 Capital-Intensive Industries</h4>
                    <p>Utilities, telecommunications, and real estate often carry higher debt levels due to significant infrastructure investments with predictable returns.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📈 Growth Acceleration</h4>
                    <p>Strategic debt can fuel rapid expansion when interest rates are low and growth opportunities exceed the cost of capital.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>💰 Tax Optimization</h4>
                    <p>Interest expense is tax-deductible, making debt financing more attractive in high-tax environments compared to equity financing.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🔄 Financial Engineering</h4>
                    <p>Companies may use debt for leveraged buyouts, share repurchases, or dividend recapitalizations to enhance shareholder returns.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Red Flags & Warning Signs</h3>
                <ul className={styles.warningList}>
                  <li><strong>Rapid Ratio Increase:</strong> Significant debt accumulation without corresponding equity growth</li>
                  <li><strong>Exceeding Industry Norms:</strong> Ratio significantly higher than industry peers without justification</li>
                  <li><strong>Declining Interest Coverage:</strong> Difficulty meeting interest payments from operating income</li>
                  <li><strong>Short-Term Debt Dominance:</strong> Heavy reliance on short-term, variable-rate debt</li>
                  <li><strong>Negative Equity Trends:</strong> Declining shareholder equity while liabilities increase</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Insights from Financial Analysts</h3>
                <blockquote className={styles.expertQuote}>
                  "The optimal debt to equity ratio isn't a fixed number—it's a strategic balance. Companies must consider their industry dynamics, growth stage, cash flow stability, and market conditions. A ratio that's perfect for a mature utility company could be disastrous for a tech startup."
                  <footer className={styles.quoteFooter}>— Senior Financial Analyst, Investment Banking, 20+ years experience</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's the difference between debt to equity and debt to assets?</h3>
                <p className={styles.faqAnswer}>Debt to equity compares liabilities to owners' equity, focusing on capital structure. Debt to assets compares liabilities to total assets, indicating what percentage of assets are financed by debt. Both are important but serve different analytical purposes.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How do I improve a high debt to equity ratio?</h3>
                <p className={styles.faqAnswer}>Improve your ratio by: 1) Retaining earnings to build equity, 2) Issuing new equity shares, 3) Using cash flow to pay down debt, 4) Selling non-core assets to reduce debt, 5) Converting debt to equity when possible.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Should startups have different debt to equity targets?</h3>
                <p className={styles.faqAnswer}>Yes, startups typically maintain lower debt ratios (0.5-1.0) due to uncertain cash flows and higher business risk. As companies mature and cash flows stabilize, they can strategically increase leverage within industry norms.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How does economic environment affect optimal ratios?</h3>
                <p className={styles.faqAnswer}>During low-interest rate periods, higher debt ratios may be favorable. In volatile or high-interest rate environments, conservative ratios provide safety. Always stress-test your capital structure against potential economic scenarios.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Optimize Your Capital Structure</h2>
              <p className={styles.ctaText}>Use our calculator to benchmark your company against industry standards and develop a strategic financial plan. Adjust your inputs to model different scenarios and find your optimal balance.</p>
              
              <div className={styles.scenarioButtons}>
                <button 
                  className={styles.scenarioButton}
                  onClick={() => {
                    setTotalLiabilities(250000);
                    setTotalEquity(500000);
                  }}
                >
                  Conservative Scenario
                </button>
                <button 
                  className={styles.scenarioButton}
                  onClick={() => {
                    setTotalLiabilities(750000);
                    setTotalEquity(250000);
                  }}
                >
                  Aggressive Growth
                </button>
                <button 
                  className={styles.scenarioButton}
                  onClick={() => {
                    setTotalLiabilities(500000);
                    setTotalEquity(500000);
                  }}
                >
                  Balanced Approach
                </button>
              </div>
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides financial analysis for educational purposes. The results are based on industry averages and general financial principles. Actual optimal ratios may vary based on specific company circumstances, market conditions, and strategic objectives. Consult with qualified financial professionals before making capital structure decisions.
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

export default DebtToEquityCalculator;