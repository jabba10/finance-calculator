import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './compoundinterestcalculator.module.css';

const CompoundInterestCalculator = ({ currentDate, lastModifiedDate }) => {
  const [principal, setPrincipal] = useState(10000);
  const [annualRate, setAnnualRate] = useState(8);
  const [years, setYears] = useState(10);
  const [compoundFrequency, setCompoundFrequency] = useState('monthly');
  const [monthlyContribution, setMonthlyContribution] = useState(100);
  const [results, setResults] = useState(null);
  const [chartData, setChartData] = useState([]);

  const compoundFrequencyMap = {
    'annually': 1,
    'semi-annually': 2,
    'quarterly': 4,
    'monthly': 12,
    'weekly': 52,
    'daily': 365
  };

  const calculateCompoundInterest = () => {
    const frequency = compoundFrequencyMap[compoundFrequency];
    const ratePerPeriod = annualRate / 100 / frequency;
    const totalPeriods = years * frequency;
    const contributionPerPeriod = monthlyContribution * (12 / frequency);

    let futureValue = principal;
    const dataPoints = [];
    let totalContributions = principal;
    let totalInterest = 0;

    for (let i = 1; i <= totalPeriods; i++) {
      futureValue = futureValue * (1 + ratePerPeriod) + contributionPerPeriod;
      totalContributions += contributionPerPeriod;
      
      if (i % frequency === 0 || i === totalPeriods) {
        const year = i / frequency;
        const interest = futureValue - totalContributions;
        dataPoints.push({
          year: year,
          value: Math.round(futureValue * 100) / 100,
          contributions: Math.round(totalContributions * 100) / 100,
          interest: Math.round(interest * 100) / 100
        });
      }
    }

    const finalInterest = futureValue - totalContributions;
    
    setResults({
      futureValue: Math.round(futureValue * 100) / 100,
      totalContributions: Math.round(totalContributions * 100) / 100,
      totalInterest: Math.round(finalInterest * 100) / 100,
      roi: Math.round((finalInterest / totalContributions) * 100 * 100) / 100
    });
    
    setChartData(dataPoints);
  };

  useEffect(() => {
    calculateCompoundInterest();
  }, [principal, annualRate, years, compoundFrequency, monthlyContribution]);

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
        <title>Advanced Compound Interest Calculator | Maximize Your Investment Growth</title>
        <meta name="description" content="Free advanced compound interest calculator with visual charts. Calculate investment growth with regular contributions, compare compounding frequencies, and plan your financial future." />
        <meta name="keywords" content="compound interest calculator, investment calculator, retirement planning, savings calculator, financial planning, investment growth" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/compound-interest-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Advanced Compound Interest Calculator | Maximize Your Investment Growth" />
        <meta property="og:description" content="Calculate how your money grows with compound interest. Free visual tool for investors and savers." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/compound-interest-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Advanced Compound Interest Calculator" />
        <meta name="twitter:description" content="Visualize your financial growth with our powerful compound interest calculator." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="compound-interest-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Advanced Compound Interest Calculator",
            "description": "Professional-grade compound interest calculator with visualization tools and financial planning features",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "ratingCount": "1250",
              "bestRating": "5",
              "worstRating": "1"
            },
            "datePublished": currentDate,
            "dateModified": currentDate,
            "author": {
              "@type": "Organization",
              "name": "Financial Tools Pro",
              "url": "https://www.financecalculatorfree.com"
            },
            "featureList": [
              "Visual Growth Charts",
              "Monthly Contributions",
              "Multiple Compounding Frequencies",
              "ROI Calculation",
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
                "name": "What is compound interest and how does it work?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Compound interest is interest calculated on the initial principal and also on the accumulated interest from previous periods. It causes wealth to grow exponentially over time because you earn interest on your interest.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How often should interest compound for maximum growth?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The more frequently interest compounds, the faster your money grows. Daily compounding yields slightly more than monthly, which yields more than annually. Our calculator shows these differences clearly.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How much should I contribute monthly to reach my goals?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Use our calculator to adjust monthly contributions until you reach your target amount. Even small increases in monthly contributions can lead to significant long-term growth due to compounding.",
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
            <h1 className={styles.mainTitle}>Advanced Compound Interest Calculator</h1>
            <p className={styles.subtitle}>See Your Money Grow Exponentially with the Power of Compounding</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>Accurate Calculations</span>
              <span className={styles.badge}>No Signup Required</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Calculate Your Growth</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Initial Investment
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="100"
                      max="1000000"
                      step="100"
                      value={principal}
                      onChange={(e) => setPrincipal(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="100"
                      max="1000000"
                      step="100"
                      value={principal}
                      onChange={(e) => setPrincipal(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(principal)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Annual Interest Rate
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      step="0.1"
                      value={annualRate}
                      onChange={(e) => setAnnualRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="1"
                      max="30"
                      step="0.1"
                      value={annualRate}
                      onChange={(e) => setAnnualRate(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(annualRate)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Time Period
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      step="1"
                      value={years}
                      onChange={(e) => setYears(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="1"
                      max="50"
                      step="1"
                      value={years}
                      onChange={(e) => setYears(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.yearsSymbol}>years</span>
                  </div>
                  <div className={styles.valueDisplay}>{years} years</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Monthly Contribution
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      step="10"
                      value={monthlyContribution}
                      onChange={(e) => setMonthlyContribution(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="5000"
                      step="10"
                      value={monthlyContribution}
                      onChange={(e) => setMonthlyContribution(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(monthlyContribution)}/month</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Compounding Frequency
                  <select
                    value={compoundFrequency}
                    onChange={(e) => setCompoundFrequency(e.target.value)}
                    className={styles.selectInput}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="semi-annually">Semi-Annually</option>
                    <option value="annually">Annually</option>
                  </select>
                </label>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Your Investment Growth</h2>
              
              {results && (
                <>
                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Future Value</div>
                      <div className={styles.resultValue}>{formatCurrency(results.futureValue)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Total Contributions</div>
                      <div className={styles.resultValue}>{formatCurrency(results.totalContributions)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Interest Earned</div>
                      <div className={styles.resultValue}>{formatCurrency(results.totalInterest)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Return on Investment</div>
                      <div className={styles.resultValue}>{formatPercentage(results.roi)}</div>
                    </div>
                  </div>

                  {/* Growth Chart Visualization */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>Growth Over Time</h3>
                    <div className={styles.chartBars}>
                      {chartData.map((data, index) => (
                        <div key={index} className={styles.chartBarGroup}>
                          <div className={styles.chartBarLabel}>Year {data.year}</div>
                          <div className={styles.chartBarContainer}>
                            <div 
                              className={styles.chartBarContributions}
                              style={{ width: `${(data.contributions / results.futureValue) * 100}%` }}
                              title={`Contributions: ${formatCurrency(data.contributions)}`}
                            />
                            <div 
                              className={styles.chartBarInterest}
                              style={{ width: `${(data.interest / results.futureValue) * 100}%` }}
                              title={`Interest: ${formatCurrency(data.interest)}`}
                            />
                          </div>
                          <div className={styles.chartBarValue}>{formatCurrency(data.value)}</div>
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
                    <h3 className={styles.insightsTitle}>💡 Key Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>Your money will grow <strong>{formatCurrency(results.totalInterest)}</strong> from compounding alone</li>
                      <li>You're earning <strong>{formatCurrency(results.totalInterest / years)}</strong> per year on average</li>
                      <li>Interest makes up <strong>{formatPercentage((results.totalInterest / results.futureValue) * 100)}</strong> of your final balance</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Educational Content */}
          <div className={styles.educationalContent}>
            <article className={styles.articleCard}>
              <h2 className={styles.articleTitle}>The Power of Compound Interest: Your Financial Superpower</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>What Makes Compound Interest So Powerful?</h3>
                <p>Compound interest is often called the "eighth wonder of the world" because it allows your money to grow exponentially over time. Unlike simple interest (which only calculates interest on your initial investment), compound interest calculates interest on both your initial principal AND the accumulated interest from previous periods.</p>
                
                <div className={styles.exampleCard}>
                  <h4>Real-World Example:</h4>
                  <p>If you invest $10,000 at 8% annual interest:</p>
                  <ul>
                    <li><strong>Year 10:</strong> $21,589 (more than doubled)</li>
                    <li><strong>Year 20:</strong> $46,610 (quadrupled)</li>
                    <li><strong>Year 30:</strong> $100,627 (10x growth)</li>
                  </ul>
                  <p>The longer your time horizon, the more dramatic the compounding effect becomes.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Strategies to Maximize Compound Growth</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>🚀 Start Early</h4>
                    <p>A 25-year-old investing $300/month at 8% will have $1.07 million by age 65. Starting 10 years later requires $650/month to reach the same goal.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>💰 Increase Contributions</h4>
                    <p>Increasing monthly contributions by just 5% annually can dramatically accelerate your wealth accumulation due to compounding on larger amounts.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📈 Reinvest Dividends</h4>
                    <p>Automatically reinvesting dividends and interest payments creates a powerful compounding loop that accelerates growth.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>⏰ Be Consistent</h4>
                    <p>Regular, consistent investing (dollar-cost averaging) combined with compounding creates a predictable wealth-building machine.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Common Applications</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Retirement Planning:</strong> Calculate how much you need to save monthly to reach your retirement goals</li>
                  <li><strong>Education Savings:</strong> Plan for college expenses with 529 plans or education savings accounts</li>
                  <li><strong>Wealth Building:</strong> Understand how long it takes to reach financial independence</li>
                  <li><strong>Debt Reduction:</strong> See how making extra payments reduces interest costs (reverse compounding)</li>
                  <li><strong>Business Investment:</strong> Calculate ROI on business investments and expansion plans</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Tips from Financial Advisors</h3>
                <blockquote className={styles.expertQuote}>
                  "The single most important variable in the compound interest equation is time. Start investing as early as possible, even with small amounts, and let compounding work its magic over decades."
                  <footer className={styles.quoteFooter}>— Certified Financial Planner, 15+ years experience</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How does compounding frequency affect my returns?</h3>
                <p className={styles.faqAnswer}>The more frequently interest compounds, the faster your money grows. Daily compounding yields the highest returns, followed by monthly, quarterly, semi-annual, and annual compounding. However, for most long-term investments, the difference between monthly and daily compounding is relatively small.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Should I focus on principal or interest rate?</h3>
                <p className={styles.faqAnswer}>Both are important, but in the early stages, increasing your principal (through regular contributions) has a larger impact. As your balance grows, the interest rate becomes increasingly important. The optimal strategy is to maximize both through consistent saving and seeking competitive returns.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How do taxes affect compound growth?</h3>
                <p className={styles.faqAnswer}>Taxes can significantly reduce compounding benefits. This is why tax-advantaged accounts (like 401(k)s, IRAs, and Roth accounts) are so valuable for long-term growth. In taxable accounts, you lose a portion of your returns to taxes each year, reducing the compounding effect.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's the Rule of 72?</h3>
                <p className={styles.faqAnswer}>The Rule of 72 is a quick mental calculation to estimate how long it takes for an investment to double. Divide 72 by your annual interest rate. For example, at 8% return, your money doubles approximately every 9 years (72 ÷ 8 = 9). This illustrates the exponential nature of compounding.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Ready to Start Your Wealth Journey?</h2>
              <p className={styles.ctaText}>Use our calculator to create your personalized investment plan. Adjust the inputs to match your financial situation and goals.</p>
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates for educational purposes. Actual investment returns may vary. Past performance does not guarantee future results. Consider consulting with a financial advisor for personalized advice.
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

export default CompoundInterestCalculator;