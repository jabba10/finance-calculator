import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import Link from 'next/link';
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

  return (
    <>
      <Helmet>
        <title>Staking Rewards Calculator | Estimate Crypto Earnings</title>
        <meta name="description" content="Calculate your crypto staking rewards with daily, monthly, and yearly projections. Supports daily, weekly, monthly, and yearly compounding. Free, responsive, and professional tool." />
        <meta name="keywords" content="staking calculator, crypto staking, APY calculator, compound interest, passive income, DeFi, Ethereum staking" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/stakingrewardscalculator" />
      </Helmet>

      <div className={styles.page}>
        {/* Gap above content */}
        <div className={styles.spacerTop}></div>

        <div className={styles.contentWrapper}>
          {/* Hero */}
          <section className={styles.hero}>
            <h1 className={styles.title}>Staking Rewards Calculator</h1>
            <p className={styles.subtitle}>
              Estimate your crypto staking earnings with daily, monthly, and yearly breakdowns.
            </p>
          </section>

          {/* Calculator Card */}
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
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
                Calculate Staking Rewards
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

          {/* Info Section */}
          <section className={styles.infoSection}>
            <div className={styles.container}>
              <div className={styles.infoCard}>
                <h3>Why Staking Rewards Matter</h3>
                <p>
                  <strong>Staking</strong> allows crypto holders to earn passive income by locking up their tokens to support blockchain operations like validation and security. Unlike traditional savings, staking can offer high yields — but it's important to understand the risks and rewards.
                </p>

                <h4>How to Use This Calculator</h4>
                <p>
                  Enter your <strong>staked amount</strong>, the network’s <strong>APY</strong>, and the <strong>duration</strong> of staking. Choose how often rewards are compounded (daily, monthly, etc.). The calculator shows your total earnings and projected income over time.
                </p>

                <h4>The Staking Reward Formula</h4>
                <div className={styles.formula}>
                  <code>
                    A = P × (1 + r/n)^(nt)
                  </code>
                </div>
                <p>Where:</p>
                <ul className={styles.list}>
                  <li><strong>A</strong> = Final amount</li>
                  <li><strong>P</strong> = Principal (initial stake)</li>
                  <li><strong>r</strong> = Annual interest rate (APY)</li>
                  <li><strong>n</strong> = Number of times compounded per year</li>
                  <li><strong>t</strong> = Time in years</li>
                </ul>
                <p>
                  This compound interest formula helps you project long-term growth of your staked assets.
                </p>

                <h4>APY vs APR</h4>
                <p>
                  <strong>APY (Annual Percentage Yield)</strong> includes compounding — it reflects your actual return. <strong>APR (Annual Percentage Rate)</strong> does not. Always compare staking offers using APY for accuracy.
                </p>

                <h4>Example Use Cases</h4>
                <ul className={styles.list}>
                  <li><strong>Ethereum (ETH):</strong> Stake 32 ETH to become a validator (~3–5% APY)</li>
                  <li><strong>Solana (SOL):</strong> Delegate tokens to earn ~6–8% APY</li>
                  <li><strong>Cardano (ADA):</strong> Stake via wallets like Daedalus for ~3–5% rewards</li>
                </ul>

                <h4>Risks to Consider</h4>
                <ul className={styles.list}>
                  <li><strong>Lock-up periods:</strong> Some networks require assets to be locked</li>
                  <li><strong>Slashing:</strong> Penalties for validator misbehavior</li>
                  <li><strong>Market risk:</strong> Token price may drop despite earning rewards</li>
                  <li><strong>Taxes:</strong> Staking rewards may be taxable as income</li>
                </ul>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className={styles.ctaSection}>
            <h2>Free Financial Planning Tools: Budget, Invest & Plan Retirement</h2>
            <p>Free Financial Planning Tools – Try Now</p>
            {/* ✅ Correct Next.js Link usage — no <a> tag */}
            <Link
              href="/suite"
              className={styles.ctaButton}
              ref={ctaButtonRef}
              onMouseMove={handleMouseMove}
            >
              Explore All Calculators
              <span className={styles.arrow}>→</span>
            </Link>
          </section>
        </div>

        {/* Gap below content */}
        <div className={styles.spacerBottom}></div>
      </div>
    </>
  );
};

export default StakingRewardsCalculator;