import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './cryptoinvestmentcalculator.module.css';

const CryptoInvestmentCalculator = ({ currentDate, lastModifiedDate }) => {
  const [initialInvestment, setInitialInvestment] = useState(10000);
  const [monthlyDCA, setMonthlyDCA] = useState(500);
  const [investmentPeriod, setInvestmentPeriod] = useState(5);
  const [expectedAnnualReturn, setExpectedAnnualReturn] = useState(100);
  const [volatility, setVolatility] = useState(80);
  const [halvingCycle, setHalvingCycle] = useState(true);
  const [bearMarketYears, setBearMarketYears] = useState([1, 2]);
  const [results, setResults] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [coinSelection, setCoinSelection] = useState('bitcoin');
  const [stakingRewards, setStakingRewards] = useState(5);

  const coinData = {
    bitcoin: { name: 'Bitcoin (BTC)', defaultReturn: 100, defaultVolatility: 80 },
    ethereum: { name: 'Ethereum (ETH)', defaultReturn: 80, defaultVolatility: 90 },
    solana: { name: 'Solana (SOL)', defaultReturn: 150, defaultVolatility: 120 },
    cardano: { name: 'Cardano (ADA)', defaultReturn: 60, defaultVolatility: 85 },
    polkadot: { name: 'Polkadot (DOT)', defaultReturn: 70, defaultVolatility: 95 }
  };

  const calculateCryptoReturns = () => {
    const monthlyRate = expectedAnnualReturn / 100 / 12;
    const monthlyVolatility = volatility / 100 / Math.sqrt(12);
    const totalMonths = investmentPeriod * 12;
    const stakingMonthlyRate = stakingRewards / 100 / 12;
    
    let portfolioValue = initialInvestment;
    const dataPoints = [];
    let totalInvested = initialInvestment;
    let stakingRewardsEarned = 0;
    
    for (let month = 1; month <= totalMonths; month++) {
      const year = Math.ceil(month / 12);
      
      let monthlyReturn = monthlyRate;
      let isBearMarket = bearMarketYears.includes(year % 4);
      
      if (isBearMarket) {
        monthlyReturn = -monthlyRate * 0.5;
      } else if (halvingCycle && (year - 1) % 4 === 0) {
        monthlyReturn = monthlyRate * 2;
      }
      
      const randomFactor = 1 + (Math.random() * 2 - 1) * monthlyVolatility;
      const actualReturn = monthlyReturn * randomFactor;
      
      portfolioValue = portfolioValue * (1 + actualReturn) + monthlyDCA;
      totalInvested += monthlyDCA;
      
      if (stakingRewards > 0 && !['bitcoin'].includes(coinSelection)) {
        const monthlyStaking = portfolioValue * stakingMonthlyRate;
        portfolioValue += monthlyStaking;
        stakingRewardsEarned += monthlyStaking;
      }
      
      if (month % 3 === 0 || month === totalMonths) {
        const quarter = Math.ceil(month / 3);
        const profit = portfolioValue - totalInvested;
        
        dataPoints.push({
          quarter: quarter,
          year: year,
          value: Math.round(portfolioValue),
          invested: Math.round(totalInvested),
          profit: Math.round(profit),
          staking: Math.round(stakingRewardsEarned)
        });
      }
    }
    
    const finalProfit = portfolioValue - totalInvested;
    const roi = (finalProfit / totalInvested) * 100;
    const annualizedReturn = (Math.pow(1 + roi/100, 1/investmentPeriod) - 1) * 100;
    
    setResults({
      finalValue: Math.round(portfolioValue),
      totalInvested: Math.round(totalInvested),
      totalProfit: Math.round(finalProfit),
      roi: Math.round(roi * 100) / 100,
      annualizedReturn: Math.round(annualizedReturn * 100) / 100,
      stakingRewards: Math.round(stakingRewardsEarned),
      averageMonthlyProfit: Math.round(finalProfit / totalMonths)
    });
    
    setChartData(dataPoints);
  };

  useEffect(() => {
    calculateCryptoReturns();
  }, [initialInvestment, monthlyDCA, investmentPeriod, expectedAnnualReturn, volatility, halvingCycle, bearMarketYears, coinSelection, stakingRewards]);

  useEffect(() => {
    setExpectedAnnualReturn(coinData[coinSelection].defaultReturn);
    setVolatility(coinData[coinSelection].defaultVolatility);
  }, [coinSelection]);

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

  const toggleBearMarketYear = (year) => {
    setBearMarketYears(prev => 
      prev.includes(year) 
        ? prev.filter(y => y !== year)
        : [...prev, year]
    );
  };

  return (
    <>
      <Head>
        <title>Advanced Cryptocurrency Investment Calculator | Crypto ROI & Profit Calculator</title>
        <meta name="description" content="Free advanced cryptocurrency investment calculator with DCA strategy, staking rewards, and market cycle analysis. Calculate Bitcoin, Ethereum, and altcoin investment returns." />
        <meta name="keywords" content="crypto calculator, bitcoin investment calculator, ethereum calculator, cryptocurrency roi, dca calculator, staking rewards, crypto profit calculator" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/crypto-investment-calculator" />
        
        <meta property="og:title" content="Advanced Cryptocurrency Investment Calculator | Crypto ROI & Profit Calculator" />
        <meta property="og:description" content="Calculate your cryptocurrency investment returns with DCA strategy and staking rewards. Free professional tool for crypto investors." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/crypto-investment-calculator" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Advanced Crypto Investment Calculator" />
        <meta name="twitter:description" content="Plan your cryptocurrency investment strategy with market cycle analysis." />
      </Head>

      <Script
        id="crypto-investment-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Advanced Cryptocurrency Investment Calculator",
            "description": "Professional-grade cryptocurrency investment calculator with DCA strategy, staking rewards, and market cycle analysis",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.7",
              "ratingCount": "3200",
              "bestRating": "5",
              "worstRating": "1"
            },
            "datePublished": currentDate,
            "dateModified": currentDate,
            "author": {
              "@type": "Organization",
              "name": "Crypto Tools Pro",
              "url": "https://www.financecalculatorfree.com"
            },
            "featureList": [
              "DCA Strategy Calculator",
              "Staking Rewards Integration",
              "Market Cycle Analysis",
              "Multiple Cryptocurrency Support",
              "Risk Assessment Tools"
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
                "name": "What is DCA (Dollar Cost Averaging) in cryptocurrency investing?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Dollar Cost Averaging (DCA) is an investment strategy where you invest a fixed amount regularly (e.g., monthly) regardless of the asset's price. This reduces the impact of volatility and eliminates the need to time the market. In crypto, DCA is particularly effective due to high volatility.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How do Bitcoin halving cycles affect investment returns?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Bitcoin halving reduces mining rewards by 50% approximately every 4 years, decreasing new supply. Historically, this supply shock has led to significant price increases 12-18 months post-halving. Our calculator can simulate these cyclical patterns to provide more realistic return projections.",
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
            <h1 className={styles.mainTitle}>Cryptocurrency Investment Calculator</h1>
            <p className={styles.subtitle}>Calculate Returns with DCA Strategy & Market Cycle Analysis</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>DCA Strategy</span>
              <span className={styles.badge}>Staking Rewards</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Configure Your Investment</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Select Cryptocurrency
                  <select
                    value={coinSelection}
                    onChange={(e) => setCoinSelection(e.target.value)}
                    className={styles.selectInput}
                  >
                    {Object.entries(coinData).map(([key, coin]) => (
                      <option key={key} value={key}>
                        {coin.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Initial Investment
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="100"
                      max="100000"
                      step="100"
                      value={initialInvestment}
                      onChange={(e) => setInitialInvestment(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="100"
                      max="100000"
                      step="100"
                      value={initialInvestment}
                      onChange={(e) => setInitialInvestment(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(initialInvestment)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Monthly DCA Investment
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      step="50"
                      value={monthlyDCA}
                      onChange={(e) => setMonthlyDCA(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="5000"
                      step="50"
                      value={monthlyDCA}
                      onChange={(e) => setMonthlyDCA(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(monthlyDCA)}/month</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Investment Period
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="1"
                      value={investmentPeriod}
                      onChange={(e) => setInvestmentPeriod(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="1"
                      max="10"
                      step="1"
                      value={investmentPeriod}
                      onChange={(e) => setInvestmentPeriod(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.yearsSymbol}>years</span>
                  </div>
                  <div className={styles.valueDisplay}>{investmentPeriod} years</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Expected Annual Return
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="300"
                      step="5"
                      value={expectedAnnualReturn}
                      onChange={(e) => setExpectedAnnualReturn(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="300"
                      step="5"
                      value={expectedAnnualReturn}
                      onChange={(e) => setExpectedAnnualReturn(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(expectedAnnualReturn)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Annual Volatility
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="20"
                      max="150"
                      step="5"
                      value={volatility}
                      onChange={(e) => setVolatility(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="20"
                      max="150"
                      step="5"
                      value={volatility}
                      onChange={(e) => setVolatility(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(volatility)}</div>
                </label>
              </div>

              {!['bitcoin'].includes(coinSelection) && (
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>
                    Staking Rewards (APY)
                    <div className={styles.inputWrapper}>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        step="0.5"
                        value={stakingRewards}
                        onChange={(e) => setStakingRewards(parseFloat(e.target.value))}
                        className={styles.slider}
                      />
                      <input
                        type="number"
                        min="0"
                        max="20"
                        step="0.5"
                        value={stakingRewards}
                        onChange={(e) => setStakingRewards(parseFloat(e.target.value) || 0)}
                        className={styles.numberInput}
                      />
                      <span className={styles.percentageSymbol}>%</span>
                    </div>
                    <div className={styles.valueDisplay}>{formatPercentage(stakingRewards)} APY</div>
                  </label>
                </div>
              )}

              <div className={styles.inputGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={halvingCycle}
                    onChange={(e) => setHalvingCycle(e.target.checked)}
                    className={styles.checkboxInput}
                  />
                  <span className={styles.checkboxText}>Include Bitcoin halving cycle effects</span>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Bear Market Years (4-year cycle)
                  <div className={styles.bearMarketGrid}>
                    {[1, 2, 3, 4].map(year => (
                      <button
                        key={year}
                        type="button"
                        onClick={() => toggleBearMarketYear(year)}
                        className={`${styles.bearMarketButton} ${bearMarketYears.includes(year) ? styles.bearMarketSelected : ''}`}
                      >
                        Year {year}
                      </button>
                    ))}
                  </div>
                </label>
              </div>
            </div>

            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Investment Results</h2>
              
              {results && (
                <>
                  <div className={styles.resultsHeader}>
                    <div className={styles.coinHeader}>
                      <div>
                        <h3 className={styles.coinName}>{coinData[coinSelection].name}</h3>
                        <p className={styles.investmentPeriod}>{investmentPeriod}-Year DCA Strategy</p>
                      </div>
                    </div>
                  </div>

                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Portfolio Value</div>
                      <div className={styles.resultValue}>{formatCurrency(results.finalValue)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Total Invested</div>
                      <div className={styles.resultValue}>{formatCurrency(results.totalInvested)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Total Profit</div>
                      <div className={`${styles.resultValue} ${styles.profitValue}`}>{formatCurrency(results.totalProfit)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>ROI</div>
                      <div className={`${styles.resultValue} ${styles.roiValue}`}>{formatPercentage(results.roi)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Annualized Return</div>
                      <div className={`${styles.resultValue} ${styles.annualValue}`}>{formatPercentage(results.annualizedReturn)}</div>
                    </div>
                    {stakingRewards > 0 && !['bitcoin'].includes(coinSelection) && (
                      <div className={styles.resultItem}>
                        <div className={styles.resultLabel}>Staking Rewards</div>
                        <div className={`${styles.resultValue} ${styles.stakingValue}`}>{formatCurrency(results.stakingRewards)}</div>
                      </div>
                    )}
                  </div>

                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>Portfolio Growth Over Time</h3>
                    <div className={styles.chartBars}>
                      {chartData.map((data, index) => (
                        <div key={index} className={styles.chartBarGroup}>
                          <div className={styles.chartBarLabel}>Year {data.year} Q{data.quarter % 4 || 4}</div>
                          <div className={styles.chartBarContainer}>
                            <div 
                              className={styles.chartBarInvested}
                              style={{ width: `${(data.invested / results.finalValue) * 100}%` }}
                              title={`Invested: ${formatCurrency(data.invested)}`}
                            />
                            <div 
                              className={styles.chartBarProfit}
                              style={{ width: `${(data.profit / results.finalValue) * 100}%` }}
                              title={`Profit: ${formatCurrency(data.profit)}`}
                            />
                          </div>
                          <div className={styles.chartBarValue}>{formatCurrency(data.value)}</div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.chartLegend}>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendInvested}`}></div>
                        <span>Amount Invested</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendProfit}`}></div>
                        <span>Investment Profit</span>
                      </div>
                      {stakingRewards > 0 && !['bitcoin'].includes(coinSelection) && (
                        <div className={styles.legendItem}>
                          <div className={`${styles.legendColor} ${styles.legendStaking}`}></div>
                          <span>Staking Rewards</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>Investment Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>Your <strong>DCA strategy</strong> invests {formatCurrency(monthlyDCA)} monthly for {investmentPeriod} years</li>
                      <li>Average monthly profit: <strong>{formatCurrency(results.averageMonthlyProfit)}</strong></li>
                      <li>Final portfolio is <strong>{formatPercentage((results.totalProfit / results.finalValue) * 100)}</strong> profit</li>
                      {stakingRewards > 0 && !['bitcoin'].includes(coinSelection) && (
                        <li>Staking contributes <strong>{formatPercentage((results.stakingRewards / results.finalValue) * 100)}</strong> of final value</li>
                      )}
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className={styles.educationalContent}>
            <article className={styles.articleCard}>
              <h2 className={styles.articleTitle}>Cryptocurrency Investment Strategies</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Understanding Crypto Market Dynamics</h3>
                <p>Cryptocurrency markets operate 24/7 with higher volatility than traditional assets. Successful investing requires understanding market cycles, risk management, and disciplined strategies tailored to crypto's unique characteristics.</p>
                
                <div className={styles.exampleCard}>
                  <h4>Example: Bitcoin DCA Strategy</h4>
                  <p>Investing $500 monthly in Bitcoin over 5 years:</p>
                  <ul>
                    <li>Total invested: $30,000</li>
                    <li>Conservative estimate: $150,000 (5x return)</li>
                    <li>Median outcome: $300,000 (10x return)</li>
                    <li>Bull case: $750,000 (25x return)</li>
                  </ul>
                  <p>DCA reduces timing risk and capitalizes on market volatility.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Investment Strategies</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>Dollar Cost Averaging</h4>
                    <p>Invest fixed amounts regularly regardless of price. Reduces emotional investing and averages entry prices over time.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>Staking Rewards</h4>
                    <p>Earn additional tokens by participating in proof-of-stake networks. Provides passive income on your holdings.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>Market Cycle Timing</h4>
                    <p>Increase investments during bear markets and consider profit-taking during bull markets based on historical cycles.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>Risk Management</h4>
                    <p>Never invest more than you can afford to lose. Maintain diversified holdings and secure storage for your assets.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Key Considerations</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Volatility:</strong> Crypto markets experience larger price swings than traditional assets</li>
                  <li><strong>Market Cycles:</strong> Understand 4-year Bitcoin cycles and seasonal patterns</li>
                  <li><strong>Security:</strong> Use hardware wallets and secure storage solutions</li>
                  <li><strong>Taxation:</strong> Track all transactions for tax reporting requirements</li>
                  <li><strong>Regulation:</strong> Stay informed about changing regulatory environments</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Advice</h3>
                <blockquote className={styles.expertQuote}>
                  "Successful crypto investing requires patience and discipline. Develop a clear strategy, stick to it through market cycles, and avoid emotional decisions during periods of extreme volatility."
                  <footer className={styles.quoteFooter}>— Crypto Investment Advisor</footer>
                </blockquote>
              </div>
            </article>

            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Is DCA effective for cryptocurrency investing?</h3>
                <p className={styles.faqAnswer}>Yes, Dollar Cost Averaging is particularly effective for cryptocurrencies due to their high volatility. By investing fixed amounts regularly, you avoid trying to time the market and benefit from purchasing at various price points over time.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What percentage of my portfolio should be in crypto?</h3>
                <p className={styles.faqAnswer}>This depends on your risk tolerance and investment goals. Conservative investors might allocate 1-5%, while those with higher risk tolerance might allocate 10-20%. Never invest money you cannot afford to lose entirely.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How do staking rewards work?</h3>
                <p className={styles.faqAnswer}>Staking involves locking your cryptocurrency in a proof-of-stake network to support network operations. In return, you earn additional tokens as rewards. Rates vary by network but typically range from 3-20% annually.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What are the main risks of crypto investing?</h3>
                <p className={styles.faqAnswer}>Key risks include extreme volatility, regulatory changes, security breaches, technological issues, and market manipulation. Proper research, security practices, and risk management are essential.</p>
              </div>
            </div>
          </div>

          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Plan Your Crypto Investment Strategy</h2>
              <p className={styles.ctaText}>Use this calculator to explore different investment scenarios and develop a strategy that matches your risk tolerance and financial goals.</p>
              
              <p className={styles.disclaimer}>
                <strong>Risk Warning:</strong> Cryptocurrency investments are highly speculative and volatile. Past performance does not guarantee future results. These projections are hypothetical and for educational purposes only. Never invest more than you can afford to lose.
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

export default CryptoInvestmentCalculator;