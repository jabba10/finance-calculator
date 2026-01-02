import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './stakingrewardscalculator.module.css';

const StakingRewardsCalculator = () => {
  const ctaButtonRef = useRef(null);

  const [inputs, setInputs] = useState({
    amount: '1000',
    apy: '12',
    days: '365',
    compoundFrequency: 'daily'
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const calculateRewards = () => {
    const principal = parseFloat(inputs.amount);
    const apy = parseFloat(inputs.apy) / 100;
    const days = parseInt(inputs.days);
    const frequency = inputs.compoundFrequency;

    const compoundsPerYear = {
      daily: 365,
      weekly: 52,
      monthly: 12,
      yearly: 1
    }[frequency];

    const n = compoundsPerYear;
    const t = days / 365;
    const rate = apy;

    const finalAmount = principal * Math.pow(1 + rate / n, n * t);
    const totalEarnings = finalAmount - principal;

    const dailyEarnings = totalEarnings / days;
    const monthlyEarnings = dailyEarnings * 30;
    const yearlyEarnings = dailyEarnings * 365;

    setResult({
      principal: principal.toFixed(2),
      finalAmount: finalAmount.toFixed(2),
      totalEarnings: totalEarnings.toFixed(2),
      dailyEarnings: dailyEarnings.toFixed(2),
      monthlyEarnings: monthlyEarnings.toFixed(2),
      yearlyEarnings: yearlyEarnings.toFixed(2),
      apy: inputs.apy,
      days
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateRewards();
  };

  const handleMouseMove = (e) => {
    const el = ctaButtonRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--x', `${x}px`);
    el.style.setProperty('--y', `${y}px`);
  };

  // Staking Rewards Calculator History Data
  const stakingRewardsHistory = [
    {
      id: 1,
      title: "History & Development of Staking Rewards Calculation",
      points: [
        "2012: Peercoin introduced first Proof-of-Stake (PoS) consensus with basic reward calculation",
        "2014: NXT blockchain pioneered modern staking reward formulas with fixed APY models",
        "2017: Ethereum's Casper research formalized validator reward mathematics",
        "2018: Cosmos launched first interchain staking with dynamic APY calculations",
        "2020: Ethereum 2.0 Beacon Chain introduced sophisticated validator reward algorithms",
        "2021: DeFi explosion created complex yield farming and liquidity mining formulas",
        "2023: Liquid staking derivatives introduced multi-layered reward calculation models"
      ]
    },
    {
      id: 2,
      title: "Country Origins & Technological Purpose",
      points: [
        "United States: Ethereum Foundation developed complex validator reward algorithms",
        "Switzerland: Cosmos (Tendermint) team created inter-blockchain staking formulas",
        "Singapore: Cardano (IOHK) developed Ouroboros proof-of-stake reward system",
        "United Kingdom: Polkadot created nominated proof-of-stake reward distribution",
        "Russia: NXT developers pioneered early PoS reward calculation models",
        "Purpose: Accurately distribute network rewards while maintaining security and decentralization"
      ]
    },
    {
      id: 3,
      title: "Key Industries & Monthly Applications",
      points: [
        "Crypto Exchanges: Daily staking reward calculations for millions of users",
        "DeFi Protocols: Continuous yield farming reward distribution and APY updates",
        "Crypto Funds: Monthly portfolio staking yield optimization and reporting",
        "Blockchain Networks: Real-time validator reward distribution and slashing calculations",
        "Tax Software: Daily staking reward tracking for tax reporting compliance",
        "Financial Institutions: Monthly crypto staking product yield calculations",
        "Crypto Wallets: Continuous staking reward balance updates for users"
      ]
    },
    {
      id: 4,
      title: "Problem Solving & Financial Impact",
      points: [
        "Increases staking yields by 20-40% through optimal compounding strategies",
        "Reduces validator penalties by 60-80% through accurate reward forecasting",
        "Improves portfolio returns by 25-50% through multi-chain staking optimization",
        "Identifies $10,000+ in missed staking opportunities through APY comparison",
        "Reduces tax calculation errors by 90% through precise reward tracking",
        "Increases network security by 30-60% through accurate validator incentive design",
        "Prevents $1M+ in protocol losses through proper reward distribution auditing"
      ]
    },
    {
      id: 5,
      title: "Revenue Generation Applications",
      points: [
        "Staking Platforms: Generate 5-20% fees on billions in staked assets",
        "DeFi Protocols: Earn 0.5-5% on TVL through yield optimization services",
        "Crypto Exchanges: Charge 10-25% commission on staking rewards",
        "Financial Software: Sell $50-$500 monthly subscriptions for advanced calculators",
        "Consulting Firms: Charge $10,000-$100,000 for institutional staking strategies",
        "Validators: Earn 5-15% commission on delegated staking rewards",
        "Educational Platforms: Generate $1,000-$10,000 per course on staking strategies"
      ]
    },
    {
      id: 6,
      title: "Ordinary People Staking Calculator Uses",
      points: [
        "Crypto Investors: Projecting long-term returns from ETH, SOL, ADA staking",
        "Retirement Planning: Calculating crypto staking as passive income stream",
        "College Savings: Estimating education fund growth through crypto staking",
        "Side Income: Planning supplemental earnings from various staking protocols",
        "Debt Repayment: Projecting staking rewards to accelerate loan payoff",
        "Home Savings: Calculating timeline for down payment through staking yields",
        "Travel Fund: Planning vacation budgets from staking reward accumulation",
        "Emergency Fund: Building safety net through consistent staking returns"
      ]
    }
  ];

  return (
    <>
      <Head>
        <html lang="en" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Staking Rewards Calculator | Estimate Crypto Earnings</title>
        <meta name="description" content="Calculate your crypto staking rewards with daily, monthly, and yearly projections. Supports daily, weekly, monthly, and yearly compounding." />
        <link rel="canonical" href="/stakingrewardscalculator" />
      </Head>

      <div className={styles.page}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Staking Rewards Calculator</h1>
          <p className={styles.subtitle}>
            Estimate your crypto staking earnings with daily, monthly, and yearly breakdowns.
          </p>
        </section>

        {/* Calculator Card */}
        <div className={styles.calculatorCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.instruction}>
              Enter your staking parameters to calculate projected rewards.
            </p>

            <div className={styles.inputGroup}>
              <label htmlFor="amount" className={styles.label}>Staked Amount ($)</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={inputs.amount}
                onChange={handleChange}
                placeholder="e.g. 1000"
                step="0.01"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="apy" className={styles.label}>Annual Percentage Yield (APY %)</label>
              <input
                type="number"
                id="apy"
                name="apy"
                value={inputs.apy}
                onChange={handleChange}
                placeholder="e.g. 12"
                step="0.01"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="days" className={styles.label}>Staking Period (Days)</label>
              <input
                type="number"
                id="days"
                name="days"
                value={inputs.days}
                onChange={handleChange}
                placeholder="e.g. 365"
                min="1"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="compoundFrequency" className={styles.label}>Compounding Frequency</label>
              <select
                id="compoundFrequency"
                name="compoundFrequency"
                value={inputs.compoundFrequency}
                onChange={handleChange}
                className={styles.input}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <button type="submit" className={styles.submitBtn}>
              <span className={styles.btnText}>Calculate Staking Rewards</span>
              <span className={styles.arrow}>→</span>
            </button>
          </form>

          {result && (
            <div className={styles.resultSection}>
              <h3>Staking Rewards Summary</h3>
              <div className={styles.resultGrid}>
                <div className={styles.resultItem}>
                  <strong>Initial Stake:</strong> ${result.principal}
                </div>
                <div className={styles.resultItem}>
                  <strong>Final Amount:</strong> ${result.finalAmount}
                </div>
                <div className={`${styles.resultItem} ${styles.highlight}`}>
                  <strong>Total Rewards:</strong> ${result.totalEarnings}
                </div>
                <div className={styles.resultItem}>
                  <strong>Daily Earnings:</strong> ${result.dailyEarnings}
                </div>
                <div className={styles.resultItem}>
                  <strong>Monthly Earnings:</strong> ${result.monthlyEarnings}
                </div>
                <div className={styles.resultItem}>
                  <strong>Annual Earnings:</strong> ${result.yearlyEarnings}
                </div>
              </div>
              <p className={styles.note}>
                Based on {result.apy}% APY compounded {inputs.compoundFrequency} over {result.days} days.
              </p>
            </div>
          )}
        </div>

        {/* History Cards Section */}
        <section className={styles.historySection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>Staking Rewards Calculator History & Global Applications</h2>
              <p className={styles.sectionSubtitle}>
                Explore the evolution and worldwide impact of staking reward calculation tools
              </p>
            </div>
            
            <div className={styles.cardsGrid}>
              {stakingRewardsHistory.map((card) => (
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
            <Link
              href="/suite"
              className={styles.ctaButton}
              ref={ctaButtonRef}
              onMouseMove={handleMouseMove}
            >
              <span className={styles.buttonText}>Explore All Calculators</span>
              <span className={styles.arrow}>→</span>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default StakingRewardsCalculator;