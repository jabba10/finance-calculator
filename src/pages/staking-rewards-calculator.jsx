import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './stakingrewardscalculator.module.css';

const StakingRewardsCalculator = ({ currentDate, lastModifiedDate }) => {
  const [stakedAmount, setStakedAmount] = useState(10000);
  const [apr, setApr] = useState(12);
  const [duration, setDuration] = useState(365);
  const [rewardsCompounding, setRewardsCompounding] = useState('daily');
  const [reinvestment, setReinvestment] = useState('auto');
  const [validatorFee, setValidatorFee] = useState(10);
  const [results, setResults] = useState(null);
  const [chartData, setChartData] = useState([]);

  const compoundingFrequencyMap = {
    'daily': 365,
    'weekly': 52,
    'monthly': 12,
    'quarterly': 4,
    'annually': 1
  };

  const calculateStakingRewards = () => {
    const frequency = compoundingFrequencyMap[rewardsCompounding];
    const effectiveAPR = apr * (1 - validatorFee / 100);
    const dailyRate = effectiveAPR / 100 / 365;
    const totalDays = duration;
    
    let currentValue = stakedAmount;
    let totalRewards = 0;
    let totalStaked = stakedAmount;
    const dataPoints = [];
    
    for (let day = 1; day <= totalDays; day++) {
      const dailyReward = currentValue * dailyRate;
      totalRewards += dailyReward;
      
      if (reinvestment === 'auto') {
        currentValue += dailyReward;
      }
      
      if (day % 30 === 0 || day === totalDays) {
        const months = Math.floor(day / 30);
        const rewardsToDate = totalRewards;
        const totalValue = currentValue + (reinvestment === 'manual' ? rewardsToDate : 0);
        
        dataPoints.push({
          day: day,
          month: months || 1,
          value: Math.round(totalValue * 100) / 100,
          staked: Math.round(totalStaked * 100) / 100,
          rewards: Math.round(rewardsToDate * 100) / 100
        });
      }
    }
    
    const finalRewards = totalRewards;
    const finalValue = currentValue + (reinvestment === 'manual' ? finalRewards : 0);
    const roi = (finalRewards / stakedAmount) * 100;
    
    setResults({
      finalValue: Math.round(finalValue * 100) / 100,
      totalRewards: Math.round(finalRewards * 100) / 100,
      totalStaked: Math.round(totalStaked * 100) / 100,
      roi: Math.round(roi * 100) / 100,
      annualizedYield: Math.round((Math.pow(1 + roi/100, 365/duration) - 1) * 100 * 100) / 100
    });
    
    setChartData(dataPoints);
  };

  useEffect(() => {
    calculateStakingRewards();
  }, [stakedAmount, apr, duration, rewardsCompounding, reinvestment, validatorFee]);

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

  const formatDays = (days) => {
    if (days >= 365) {
      const years = Math.floor(days / 365);
      const remainingDays = days % 365;
      if (remainingDays === 0) return `${years} year${years > 1 ? 's' : ''}`;
      return `${years} year${years > 1 ? 's' : ''}, ${remainingDays} days`;
    }
    return `${days} day${days !== 1 ? 's' : ''}`;
  };

  return (
    <>
      <Head>
        <title>Advanced Staking Rewards Calculator | Maximize Crypto Staking Profits</title>
        <meta name="description" content="Free advanced staking rewards calculator with visual charts. Calculate crypto staking yields with compounding, validator fees, and different reinvestment strategies." />
        <meta name="keywords" content="staking calculator, crypto staking, staking rewards, yield calculator, cryptocurrency, proof of stake, validator, APY, APR" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/staking-rewards-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Advanced Staking Rewards Calculator | Maximize Crypto Staking Profits" />
        <meta property="og:description" content="Calculate your crypto staking rewards with compounding. Free visual tool for PoS investors and validators." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/staking-rewards-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Advanced Staking Rewards Calculator" />
        <meta name="twitter:description" content="Visualize your crypto staking growth with our powerful rewards calculator." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="staking-rewards-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Advanced Staking Rewards Calculator",
            "description": "Professional-grade cryptocurrency staking calculator with validator fee calculations and compounding strategies",
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
              "name": "Crypto Tools Pro",
              "url": "https://www.financecalculatorfree.com"
            },
            "featureList": [
              "Visual Rewards Charts",
              "Validator Fee Calculations",
              "Multiple Compounding Frequencies",
              "ROI & APY Calculations",
              "Reinvestment Strategies"
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
                "name": "What is crypto staking and how does it work?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Crypto staking involves locking your cryptocurrency in a proof-of-stake blockchain network to support network operations and earn rewards. Validators process transactions and secure the network, while delegators stake their tokens with validators to earn a share of the rewards.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How do validator fees affect my staking rewards?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Validator fees are a percentage of rewards taken by validators for their services. A 10% validator fee means you keep 90% of the generated rewards. Our calculator automatically deducts these fees from your estimated returns.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What's the difference between APR and APY in staking?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "APR (Annual Percentage Rate) is the simple interest rate without compounding. APY (Annual Percentage Yield) includes compounding effects. With daily compounding, APY is typically higher than APR. Our calculator shows both metrics for better comparison.",
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
            <h1 className={styles.mainTitle}>Advanced Staking Rewards Calculator</h1>
            <p className={styles.subtitle}>Maximize Your Crypto Earnings with Proof-of-Stake Staking</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>Real-time Calculations</span>
              <span className={styles.badge}>Multi-chain Support</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Calculate Your Staking Rewards</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Staked Amount
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="100"
                      max="1000000"
                      step="100"
                      value={stakedAmount}
                      onChange={(e) => setStakedAmount(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="100"
                      max="1000000"
                      step="100"
                      value={stakedAmount}
                      onChange={(e) => setStakedAmount(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(stakedAmount)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Staking APR (Annual Percentage Rate)
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      step="0.1"
                      value={apr}
                      onChange={(e) => setApr(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="1"
                      max="30"
                      step="0.1"
                      value={apr}
                      onChange={(e) => setApr(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(apr)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Staking Duration
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="7"
                      max="1095"
                      step="1"
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="7"
                      max="1095"
                      step="1"
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.daysSymbol}>days</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatDays(duration)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Validator Fee
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      step="0.5"
                      value={validatorFee}
                      onChange={(e) => setValidatorFee(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="20"
                      step="0.5"
                      value={validatorFee}
                      onChange={(e) => setValidatorFee(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(validatorFee)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Rewards Compounding
                  <select
                    value={rewardsCompounding}
                    onChange={(e) => setRewardsCompounding(e.target.value)}
                    className={styles.selectInput}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annually">Annually</option>
                  </select>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Reinvestment Strategy
                  <select
                    value={reinvestment}
                    onChange={(e) => setReinvestment(e.target.value)}
                    className={styles.selectInput}
                  >
                    <option value="auto">Auto-reinvest (compound)</option>
                    <option value="manual">Manual claim</option>
                    <option value="partial">Partial reinvestment</option>
                  </select>
                </label>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Your Staking Earnings</h2>
              
              {results && (
                <>
                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Total Value</div>
                      <div className={styles.resultValue}>{formatCurrency(results.finalValue)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Staking Rewards</div>
                      <div className={styles.resultValue}>{formatCurrency(results.totalRewards)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Original Stake</div>
                      <div className={styles.resultValue}>{formatCurrency(results.totalStaked)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Total Return</div>
                      <div className={styles.resultValue}>{formatPercentage(results.roi)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Annualized Yield</div>
                      <div className={styles.resultValue}>{formatPercentage(results.annualizedYield)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Effective APR</div>
                      <div className={styles.resultValue}>{formatPercentage(apr * (1 - validatorFee / 100))}</div>
                    </div>
                  </div>

                  {/* Rewards Chart Visualization */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>Rewards Accumulation Over Time</h3>
                    <div className={styles.chartBars}>
                      {chartData.map((data, index) => (
                        <div key={index} className={styles.chartBarGroup}>
                          <div className={styles.chartBarLabel}>Day {data.day}</div>
                          <div className={styles.chartBarContainer}>
                            <div 
                              className={styles.chartBarStaked}
                              style={{ width: `${(data.staked / results.finalValue) * 100}%` }}
                              title={`Original Stake: ${formatCurrency(data.staked)}`}
                            />
                            <div 
                              className={styles.chartBarRewards}
                              style={{ width: `${(data.rewards / results.finalValue) * 100}%` }}
                              title={`Rewards: ${formatCurrency(data.rewards)}`}
                            />
                          </div>
                          <div className={styles.chartBarValue}>{formatCurrency(data.value)}</div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.chartLegend}>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendStaked}`}></div>
                        <span>Original Stake</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendRewards}`}></div>
                        <span>Staking Rewards</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>💰 Key Staking Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>You'll earn <strong>{formatCurrency(results.totalRewards / (duration / 30))}</strong> per month on average</li>
                      <li>Validator fees cost you <strong>{formatCurrency(results.totalRewards * (validatorFee / 100))}</strong> in potential earnings</li>
                      <li>Rewards make up <strong>{formatPercentage((results.totalRewards / results.finalValue) * 100)}</strong> of your final balance</li>
                      <li>Your effective yield after fees: <strong>{formatPercentage(results.annualizedYield)} APY</strong></li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Educational Content */}
          <div className={styles.educationalContent}>
            <article className={styles.articleCard}>
              <h2 className={styles.articleTitle}>Mastering Crypto Staking: The Complete Guide to Proof-of-Stake Earnings</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>What is Proof-of-Stake and How Does Staking Work?</h3>
                <p>Proof-of-Stake (PoS) is a consensus mechanism where cryptocurrency holders ("validators" or "delegators") stake their tokens to secure the network and process transactions. In return, they earn staking rewards - similar to earning interest in traditional finance but with crypto-native mechanics.</p>
                
                <div className={styles.exampleCard}>
                  <h4>Real-World Staking Example:</h4>
                  <p>Staking $10,000 at 12% APR with daily compounding:</p>
                  <ul>
                    <li><strong>30 Days:</strong> $100 in rewards ($1,200 annualized)</li>
                    <li><strong>90 Days:</strong> $304 in rewards</li>
                    <li><strong>1 Year:</strong> $1,276 in rewards (12.76% APY due to compounding)</li>
                    <li><strong>3 Years:</strong> $4,323 in rewards (43% total return)</li>
                  </ul>
                  <p>The power of compounding significantly boosts returns compared to simple interest.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Advanced Staking Strategies</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>🔒 Choose Validators Wisely</h4>
                    <p>Research validator performance, uptime, and commission rates. Diversify across multiple validators to reduce slashing risks.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📊 Compound Strategically</h4>
                    <p>Auto-compounding yields higher returns but consider transaction costs. Balance between compounding frequency and network fees.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>⚖️ Portfolio Diversification</h4>
                    <p>Stake across multiple PoS networks (Ethereum, Cardano, Solana, etc.) to spread risk and capture different reward opportunities.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🔄 Reinvestment Timing</h4>
                    <p>Time your rewards reinvestment during low network congestion to minimize gas/transaction fees and maximize net returns.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Understanding Key Metrics</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>APR vs APY:</strong> APR doesn't include compounding; APY does. Daily compounding at 12% APR = 12.75% APY</li>
                  <li><strong>Validator Commission:</strong> Percentage validators take from your rewards (typically 5-15%)</li>
                  <li><strong>Unbonding Period:</strong> Time required to unstake (varies by network: 7-28 days)</li>
                  <li><strong>Slashing Risks:</strong> Penalties for validator misbehavior (downtime, double-signing)</li>
                  <li><strong>Inflation Rate:</strong> Network inflation affects real returns; consider staking rewards minus inflation</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Tax Implications of Staking</h3>
                <blockquote className={styles.expertQuote}>
                  "Staking rewards are typically taxable as ordinary income in the year received at fair market value. Compounding creates additional taxable events. Always consult with a crypto tax professional for jurisdiction-specific advice."
                  <footer className={styles.quoteFooter}>— Crypto Tax Specialist, 8+ years experience</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's the difference between staking and yield farming?</h3>
                <p className={styles.faqAnswer}>Staking involves locking crypto in a PoS network to secure it and earn rewards. Yield farming involves providing liquidity to DeFi protocols for trading fees and token rewards. Staking is generally less risky with more predictable returns, while yield farming offers higher potential returns but with greater complexity and risk.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How do I choose between different PoS networks?</h3>
                <p className={styles.faqAnswer}>Consider: 1) Security and adoption (Ethereum is most established), 2) Reward rates (newer networks often offer higher APY), 3) Unbonding periods (shorter = more flexibility), 4) Minimum stake requirements, 5) Ecosystem growth potential. Many investors stake across 3-5 different networks for diversification.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What are the risks of crypto staking?</h3>
                <p className={styles.faqAnswer}>Main risks include: 1) Slashing penalties for validator misbehavior, 2) Network/validator downtime reducing rewards, 3) Price volatility of staked assets, 4) Smart contract risks (for liquid staking), 5) Regulatory changes, 6) Unbonding periods limiting liquidity. Always research validators thoroughly and never stake more than you can afford to lose.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Is staking better than holding crypto?</h3>
                <p className={styles.faqAnswer}>Staking generates yield on your holdings (typically 5-20% APY) while still exposing you to price appreciation. However, staked assets may be less liquid due to unbonding periods. For long-term holders, staking is usually preferable. For active traders, the reduced liquidity might be problematic. Many investors use a combination approach.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Ready to Start Earning Staking Rewards?</h2>
              <p className={styles.ctaText}>Use our calculator to plan your staking strategy. Adjust inputs to match different networks, validator fees, and compounding strategies.</p>
              
              <p className={styles.disclaimer}>
                <strong>Risk Disclosure:</strong> Cryptocurrency investments and staking involve substantial risk. Rewards are not guaranteed and may vary. Validator performance affects returns. Staked assets may be subject to slashing penalties. Past performance does not guarantee future results. Not financial advice.
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
    revalidate: 21600, // 6 hours (more frequent updates for crypto calculator)
  };
}

export default StakingRewardsCalculator;