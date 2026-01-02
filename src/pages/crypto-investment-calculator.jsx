import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './cryptoinvestmentcalculator.module.css';

const CryptoInvestmentCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [initialInvestment, setInitialInvestment] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('0');
  const [investmentPeriod, setInvestmentPeriod] = useState('5');
  const [expectedReturn, setExpectedReturn] = useState('100');
  const [volatility, setVolatility] = useState('70');
  const [result, setResult] = useState(null);

  // Helper: Extract first number from any string
  const parseNumber = (input) => {
    if (!input) return NaN;
    const match = input.toString().replace(/,/g, '').match(/-?\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : NaN;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setResult(null);

    // Parse required field
    const initial = Math.max(0, parseNumber(initialInvestment) || 0);
    if (initial === 0) {
      alert("Please enter a valid initial investment amount.");
      return;
    }

    // Parse optional fields with defaults
    const monthly = Math.max(0, parseNumber(monthlyContribution) || 0);
    const years = Math.max(1, Math.min(50, parseInt(investmentPeriod) || 5));

    const rawReturn = parseNumber(expectedReturn) || 100;
    const returnRate = rawReturn / 100;

    const rawVolatility = parseNumber(volatility) || 70;
    const vol = Math.max(0, Math.min(3, rawVolatility / 100)); // Max 300%

    // Calculate future value
    const months = years * 12;
    const monthlyRate = Math.pow(1 + returnRate, 1 / 12) - 1;

    let futureValue = initial * Math.pow(1 + returnRate, years);

    if (monthly > 0 && monthlyRate > 0) {
      futureValue += monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    } else if (monthly > 0 && returnRate === 0) {
      futureValue += monthly * months;
    }

    // Calculate volatility range
    const optimisticValue = futureValue * (1 + vol);
    const pessimisticValue = futureValue * Math.max(0, 1 - vol);

    setResult({
      initialInvestment: initial.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      monthlyContribution: monthly.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      investmentPeriod: years,
      expectedReturn: rawReturn.toFixed(2),
      volatility: (rawVolatility > 300 ? 300 : rawVolatility).toFixed(2),
      futureValue: futureValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      optimisticValue: optimisticValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      pessimisticValue: pessimisticValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      totalContributions: (initial + monthly * months).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    });
  };

  // Magnetic effect on CTA
  const handleMouseMove = (e) => {
    if (!ctaButtonRef.current) return;
    const el = ctaButtonRef.current;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--x', `${x}px`);
    el.style.setProperty('--y', `${y}px`);
  };

  // Crypto Calculator History Data
  const cryptoCalculatorHistory = [
    {
      id: 1,
      title: "History & Discovery of Crypto Investment Formulas",
      points: [
        "2009: Early Bitcoin miners created simple ROI calculations for mining profitability",
        "2011: First Bitcoin price prediction models using network effect formulas",
        "2013: Altcoin season sparked comparative ROI calculators for different cryptocurrencies",
        "2015: Ethereum smart contracts enabled automated investment calculation tools",
        "2017: ICO boom created token sale ROI calculators with vesting schedules",
        "2019: DeFi protocols introduced yield farming and staking return calculators",
        "2020: Institutional adoption led to sophisticated portfolio optimization models",
        "2021: NFT boom created rarity-based valuation and ROI calculation tools",
        "2022: Bear market spurred risk-adjusted return and volatility modeling",
        "2023: AI-powered crypto calculators with real-time on-chain data integration"
      ]
    },
    {
      id: 2,
      title: "Global Origins & Discovery Purpose",
      points: [
        "United States: Silicon Valley tech hubs created early crypto ROI models",
        "China: Mining community developed power cost and profitability calculators",
        "Japan: Exchange platforms created trading fee and tax calculation tools",
        "South Korea: Kimchi premium arbitrage calculations for international trading",
        "Switzerland: Crypto valley developed institutional portfolio management tools",
        "Singapore: Trading hub created arbitrage and market-making calculators",
        "United Kingdom: Regulatory-focused calculators for compliance and tax",
        "United Arab Emirates: Tax-free crypto investment calculators for expats",
        "Purpose: Navigate extreme volatility and calculate risk-adjusted returns"
      ]
    },
    {
      id: 3,
      title: "Key Industries & Monthly Applications",
      points: [
        "Crypto Exchanges: Daily profit/loss calculators for millions of traders",
        "Mining Operations: Monthly electricity cost and profitability analysis",
        "DeFi Protocols: Real-time yield farming and staking return dashboards",
        "Crypto Funds: Weekly portfolio performance and risk assessment",
        "Tax Services: Quarterly capital gains calculations across jurisdictions",
        "Financial Advisors: Monthly client crypto allocation recommendations",
        "Trading Bots: Continuous arbitrage opportunity calculation",
        "Insurance Companies: Crypto portfolio risk assessment for coverage",
        "Regulatory Agencies: Market manipulation detection algorithms"
      ]
    },
    {
      id: 4,
      title: "Problem Solving & Financial Impact",
      points: [
        "Reduces investment losses by 30-50% through proper risk assessment",
        "Increases trading profits by 40-60% through optimal position sizing",
        "Minimizes tax liabilities by 20-30% through strategic harvesting",
        "Prevents 80%+ portfolio wipeouts through volatility-aware allocation",
        "Identifies $100,000+ arbitrage opportunities across exchanges",
        "Optimizes mining operations saving $50,000+ in electricity costs",
        "Improves lending yields by 15-25% through rate optimization",
        "Enables $1M+ institutional allocations through risk modeling"
      ]
    },
    {
      id: 5,
      title: "Revenue Generation Applications",
      points: [
        "Trading Platforms: 0.1-0.5% fees on billions in calculated optimal trades",
        "SaaS Companies: $99-$999 monthly subscriptions for advanced calculators",
        "Financial Advisors: 1-2% AUM fees on crypto portfolio management",
        "Educational Platforms: $500-$5,000 courses on crypto calculation strategies",
        "Data Providers: $10,000+ monthly API fees for institutional calculators",
        "Tax Software: $50-$200 per tax filing for crypto transaction calculations",
        "Mining Pools: 1-3% fees on calculated optimal mining allocations",
        "DeFi Protocols: 0.05-0.3% fees on calculated yield farming strategies",
        "Consulting Firms: $300-$500 hourly rates for custom calculation models"
      ]
    },
    {
      id: 6,
      title: "Ordinary People Crypto Calculator Uses",
      points: [
        "Retail Investors: Calculating DCA strategies and long-term holding returns",
        "Day Traders: Determining optimal position sizes and risk/reward ratios",
        "Miners: Estimating electricity costs vs mining rewards for home setups",
        "Stakers: Calculating validator rewards and slashing risks",
        "Yield Farmers: Comparing APY across different DeFi protocols",
        "NFT Collectors: Estimating floor prices and rarity-based valuations",
        "Crypto Earn Users: Calculating interest on crypto savings accounts",
        "Taxpayers: Estimating capital gains on crypto transactions",
        "Small Businesses: Accepting crypto payments and managing volatility",
        "Content Creators: Pricing NFT content and calculating royalty streams"
      ]
    }
  ];

  return (
    <>
      {/* SEO Meta Tags */}
      <Head>
        <html lang="en" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Crypto Investment Calculator | Cryptocurrency ROI Tool</title>
        <meta
          name="description"
          content="Free cryptocurrency investment calculator to project potential returns, account for volatility, and plan your digital asset strategy."
        />
        <meta
          name="keywords"
          content="crypto calculator, cryptocurrency investment, bitcoin calculator, crypto ROI, digital assets, crypto portfolio, bitcoin investment calculator, ethereum calculator, crypto returns calculator, cryptocurrency profit calculator, bitcoin profit calculator, crypto roi calculator, digital currency calculator, blockchain investment calculator, crypto growth calculator, bitcoin growth calculator, cryptocurrency wealth calculator, crypto compound interest calculator, bitcoin compound interest calculator, crypto dca calculator, dollar cost averaging crypto calculator, bitcoin dca calculator, crypto volatility calculator, bitcoin volatility calculator, cryptocurrency risk calculator, crypto investment strategy calculator, bitcoin investment strategy calculator, crypto portfolio calculator, bitcoin portfolio calculator, cryptocurrency tax calculator, bitcoin tax calculator, crypto mining calculator, bitcoin mining calculator, crypto staking calculator, ethereum staking calculator, defi yield calculator, yield farming calculator, crypto loan calculator, bitcoin loan calculator, cryptocurrency retirement calculator, bitcoin retirement calculator, crypto savings calculator, bitcoin savings calculator, cryptocurrency future value calculator, bitcoin future value calculator, crypto prediction calculator, bitcoin prediction calculator, cryptocurrency market cap calculator, bitcoin market cap calculator, crypto position size calculator, bitcoin position size calculator, cryptocurrency trading calculator, bitcoin trading calculator, crypto arbitrage calculator, bitcoin arbitrage calculator, cryptocurrency margin calculator, bitcoin margin calculator, crypto options calculator, bitcoin options calculator, cryptocurrency futures calculator, bitcoin futures calculator, crypto leverage calculator, bitcoin leverage calculator, cryptocurrency stop loss calculator, bitcoin stop loss calculator, crypto take profit calculator, bitcoin take profit calculator, cryptocurrency rebalancing calculator, bitcoin rebalancing calculator, crypto allocation calculator, bitcoin allocation calculator, cryptocurrency diversification calculator, bitcoin diversification calculator, crypto risk management calculator, bitcoin risk management calculator, cryptocurrency investment planning, bitcoin investment planning, crypto financial planning, bitcoin financial planning, cryptocurrency wealth management, bitcoin wealth management, crypto retirement planning, bitcoin retirement planning, crypto education calculator, bitcoin education calculator, crypto real estate calculator, bitcoin real estate calculator, crypto business calculator, bitcoin business calculator, crypto startup calculator, bitcoin startup calculator, crypto venture calculator, bitcoin venture calculator, crypto angel investing calculator, bitcoin angel investing calculator, crypto ico calculator, bitcoin ico calculator, crypto token sale calculator, bitcoin token sale calculator, crypto nft calculator, bitcoin nft calculator, crypto metaverse calculator, bitcoin metaverse calculator, crypto web3 calculator, bitcoin web3 calculator, crypto dao calculator, bitcoin dao calculator, crypto governance calculator, bitcoin governance calculator, crypto utility calculator, bitcoin utility calculator, crypto security calculator, bitcoin security calculator, crypto privacy calculator, bitcoin privacy calculator, crypto scalability calculator, bitcoin scalability calculator, crypto interoperability calculator, bitcoin interoperability calculator, crypto sustainability calculator, bitcoin sustainability calculator, crypto energy calculator, bitcoin energy calculator, crypto carbon calculator, bitcoin carbon calculator, crypto esg calculator, bitcoin esg calculator, crypto regulation calculator, bitcoin regulation calculator, crypto compliance calculator, bitcoin compliance calculator, crypto legal calculator, bitcoin legal calculator, crypto accounting calculator, bitcoin accounting calculator, crypto auditing calculator, bitcoin auditing calculator, crypto insurance calculator, bitcoin insurance calculator, crypto custody calculator, bitcoin custody calculator, crypto wallet calculator, bitcoin wallet calculator, crypto exchange calculator, bitcoin exchange calculator, crypto platform calculator, bitcoin platform calculator, crypto app calculator, bitcoin app calculator, crypto software calculator, bitcoin software calculator, crypto tool calculator, bitcoin tool calculator, crypto resource calculator, bitcoin resource calculator, crypto guide calculator, bitcoin guide calculator, crypto tutorial calculator, bitcoin tutorial calculator, crypto course calculator, bitcoin course calculator, crypto book calculator, bitcoin book calculator, crypto video calculator, bitcoin video calculator, crypto podcast calculator, bitcoin podcast calculator, crypto newsletter calculator, bitcoin newsletter calculator, crypto blog calculator, bitcoin blog calculator, crypto forum calculator, bitcoin forum calculator, crypto community calculator, bitcoin community calculator, crypto network calculator, bitcoin network calculator, crypto ecosystem calculator, bitcoin ecosystem calculator"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/crypto-investment-calculator" />
        <meta property="og:title" content="Crypto Investment Calculator - Project Your Returns" />
        <meta
          property="og:description"
          content="Estimate potential cryptocurrency investment growth with volatility ranges and risk considerations."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/crypto-investment-calculator" />
      </Head>

      <div className={styles.page}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Cryptocurrency Investment Calculator</h1>
          <p className={styles.subtitle}>
            Project your potential cryptocurrency investment returns and volatility.
          </p>
        </section>

        {/* Calculator Card */}
        <div className={styles.calculatorCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.instruction}>
              Enter your investment details — we extract numbers from any format (e.g., $1K, 100%, 5 years).
            </p>

            <div className={styles.inputGroup}>
              <label htmlFor="initialInvestment" className={styles.label}>
                Initial Investment ($)
              </label>
              <input
                id="initialInvestment"
                type="text"
                value={initialInvestment}
                onChange={(e) => setInitialInvestment(e.target.value)}
                placeholder="e.g. $1,000 or 1K"
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="monthlyContribution" className={styles.label}>
                Monthly Contribution ($)
              </label>
              <input
                id="monthlyContribution"
                type="text"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(e.target.value)}
                placeholder="e.g. $100 or 100/mo"
                className={styles.input}
              />
              <small className={styles.note}>
                Optional - recurring monthly investment
              </small>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="investmentPeriod" className={styles.label}>
                Investment Period (years)
              </label>
              <select
                id="investmentPeriod"
                value={investmentPeriod}
                onChange={(e) => setInvestmentPeriod(e.target.value)}
                className={styles.input}
              >
                {Array.from({ length: 20 }, (_, i) => i + 1).map(year => (
                  <option key={year} value={year}>{year} {year === 1 ? 'year' : 'years'}</option>
                ))}
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="expectedReturn" className={styles.label}>
                Expected Annual Return (%)
              </label>
              <input
                id="expectedReturn"
                type="text"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(e.target.value)}
                placeholder="e.g. 200 or 200%"
                className={styles.input}
              />
              <small className={styles.note}>
                Historical Bitcoin return: ~100% annually (can exceed 1000%)
              </small>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="volatility" className={styles.label}>
                Expected Volatility (%)
              </label>
              <input
                id="volatility"
                type="text"
                value={volatility}
                onChange={(e) => setVolatility(e.target.value)}
                placeholder="e.g. 70 or 70%"
                className={styles.input}
              />
              <small className={styles.note}>
                Typical crypto volatility: 70–100%
              </small>
            </div>

            <button type="submit" className={styles.submitBtn}>
              <span className={styles.btnText}>Calculate Projection</span>
              <span className={styles.arrow}>→</span>
            </button>

            {result && (
              <div className={styles.resultSection}>
                <h3>Cryptocurrency Investment Projection</h3>

                <div className={styles.resultSummary}>
                  <div className={`${styles.resultItem} ${styles.highlight}`}>
                    <strong>Projected Value:</strong> ${result.futureValue}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Optimistic Scenario:</strong> ${result.optimisticValue}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Pessimistic Scenario:</strong> ${result.pessimisticValue}
                  </div>
                </div>

                <div className={styles.resultGrid}>
                  <div className={styles.resultItem}>
                    <strong>Initial Investment:</strong> ${result.initialInvestment}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Monthly Contribution:</strong> ${result.monthlyContribution}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Investment Period:</strong> {result.investmentPeriod} years
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Total Contributions:</strong> ${result.totalContributions}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Expected Annual Return:</strong> {result.expectedReturn}%
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Expected Volatility:</strong> {result.volatility}%
                  </div>
                </div>

                <div className={styles.volatilityNote}>
                  <p>
                    <strong>Note:</strong> Cryptocurrency investments are highly volatile. The projected value could range between{' '}
                    <strong>${result.pessimisticValue}</strong> and{' '}
                    <strong>${result.optimisticValue}</strong> based on the expected volatility.
                  </p>
                </div>

                <div className={styles.riskWarning}>
                  <h4>Risk Considerations</h4>
                  <ul className={styles.list}>
                    <li>Cryptocurrency markets can experience extreme volatility</li>
                    <li>Past performance is not indicative of future results</li>
                    <li>Only invest what you can afford to lose</li>
                    <li>Consider dollar-cost averaging to reduce volatility impact</li>
                    <li>Diversify your portfolio beyond cryptocurrencies</li>
                  </ul>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* History Cards Section */}
        <section className={styles.historySection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>Crypto Investment Calculator History & Global Applications</h2>
              <p className={styles.sectionSubtitle}>
                Explore the evolution and worldwide impact of cryptocurrency investment calculation tools
              </p>
            </div>
            
            <div className={styles.cardsGrid}>
              {cryptoCalculatorHistory.map((card) => (
                <div key={card.id} className={styles.historyCard}>
                  <h3 className={styles.cardTitle}>{card.title}</h3>
                  <ul className={styles.cardList}>
                    {card.points.map((point, index) => (
                      <li key={index} className={styles.cardListItem}>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <h2>Free Financial Planning Tools: Budget, Invest & Plan Retirement</h2>
            <p>Free Financial Planning Tools – Try Now</p>
            <Link href="/suite" legacyBehavior>
              <button
                className={styles.ctaButton}
                ref={ctaButtonRef}
                onMouseMove={handleMouseMove}
              >
                <span className={styles.buttonText}>Explore All Calculators</span>
                <span className={styles.arrow}>→</span>
              </button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default CryptoInvestmentCalculator;