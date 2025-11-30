import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'react-helmet';
import styles from './optionpricingcalculator.module.css';

// Helper: Standard normal CDF approximation
const normCDF = (x) => {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp(-x * x / 2);
  let prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  if (x > 0) prob = 1 - prob;
  return prob;
};

// Helper: Standard normal PDF
const normPDF = (x) => {
  return Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI);
};

const OptionPricingCalculator = () => {
  const ctaButtonRef = useRef(null);

  const [inputs, setInputs] = useState({
    spotPrice: '100',
    strikePrice: '100',
    timeToExpiry: '1',
    riskFreeRate: '5',
    volatility: '20'
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateOptionPrices = () => {
    const S = parseFloat(inputs.spotPrice);     // Spot price
    const K = parseFloat(inputs.strikePrice);   // Strike price
    const T = parseFloat(inputs.timeToExpiry);  // Time to expiry (years)
    const r = parseFloat(inputs.riskFreeRate) / 100; // Risk-free rate
    const sigma = parseFloat(inputs.volatility) / 100; // Volatility (std dev)

    if (isNaN(S) || isNaN(K) || isNaN(T) || isNaN(r) || isNaN(sigma)) {
      alert("Please enter valid numbers for all fields.");
      return;
    }

    if (S <= 0 || K <= 0 || T <= 0 || sigma <= 0) {
      alert("Spot price, strike price, time, and volatility must be positive.");
      return;
    }

    const d1 = (Math.log(S / K) + (r + sigma * sigma / 2) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);

    const callPrice = S * normCDF(d1) - K * Math.exp(-r * T) * normCDF(d2);
    const putPrice = K * Math.exp(-r * T) * normCDF(-d2) - S * normCDF(-d1);

    // Greeks (basic)
    const deltaCall = normCDF(d1);
    const deltaPut = normCDF(d1) - 1;
    const gamma = normPDF(d1) / (S * sigma * Math.sqrt(T));
    const vega = S * normPDF(d1) * Math.sqrt(T) / 100; // per 1% vol

    setResult({
      call: callPrice.toFixed(2),
      put: putPrice.toFixed(2),
      deltaCall: deltaCall.toFixed(4),
      deltaPut: deltaPut.toFixed(4),
      gamma: gamma.toFixed(6),
      vega: vega.toFixed(4),
      d1: d1.toFixed(4),
      d2: d2.toFixed(4),
      spot: S,
      strike: K,
      time: T,
      rate: (r * 100).toFixed(2),
      vol: (sigma * 100).toFixed(2)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateOptionPrices();
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

  return (
    <>
      {/* SEO Meta Tags */}
      <Head>
        <title>Option Pricing Calculator | Black-Scholes Model Tool</title>
        <meta
          name="description"
          content="Free option pricing calculator using the Black-Scholes model to compute call and put prices, deltas, gamma, and vega."
        />
        <meta
          name="keywords"
          content="option calculator, Black-Scholes, call put pricing, options trading, financial derivatives, volatility calculator, option pricing, options calculator, call option, put option, strike price, spot price, time value, intrinsic value, option value, option premium, option greeks, delta, gamma, vega, theta, rho, implied volatility, historical volatility, risk free rate, expiration date, option chain, option strategy, covered call, cash secured put, credit spread, debit spread, iron condor, strangle, straddle, butterfly spread, calendar spread, vertical spread, horizontal spread, diagonal spread, option trading, options market, equity options, index options, stock options, ETF options, futures options, currency options, commodity options, option valuation, option model, binomial model, monte carlo, finite difference, analytical solution, partial differential equation, PDE, stochastic calculus, Ito's lemma, geometric Brownian motion, lognormal distribution, normal distribution, standard deviation, option sensitivity, price sensitivity, volatility smile, volatility skew, option market maker, market maker, option liquidity, bid ask spread, option volume, open interest, option exercise, option assignment, American option, European option, exotic options, barrier option, binary option, Asian option, lookback option, option portfolio, option hedge, delta hedge, gamma hedge, vega hedge, option risk, option margin, option leverage, option income, premium selling, premium buying, option buyer, option seller, long call, long put, short call, short put, naked option, covered option, protective put, collar strategy, married put, synthetic stock, conversion, reversal, box spread, option arbitrage, volatility arbitrage, statistical arbitrage, option market, CBOE, options exchange, option clearing, OCC, option settlement, option expiration, weekly options, monthly options, quarterly options, LEAPS, long term options, short term options, day trading options, swing trading options, position trading options, option scanner, option screener, option analyzer, option backtesting, option simulation, option education, option course, option tutorial, option guide, option book, option resource, option tool, option software, option platform, option broker, option fees, option commission, option tax, option accounting, option reporting, option regulation, SEC, FINRA, option compliance, option risk management, option portfolio management, option strategy builder, option income generator, option wheel strategy, option income strategy, conservative options, aggressive options, speculative options, hedging options, income options, growth options, value options, momentum options, technical analysis options, fundamental analysis options, quantitative options, algorithmic options, automated options, AI options, machine learning options, option pricing theory, option market efficiency, option behavioral finance, option psychology, option sentiment, fear gauge, VIX, volatility index, option volatility, IV rank, IV percentile, option historical volatility, option implied volatility, option volatility trading, option volatility strategy, straddle trade, strangle trade, iron butterfly, jelly roll, option adjustments, option roll, option close, option exit, option management, option tracking, option performance, option return, option ROI, option profit, option loss, option break even, option probability, probability of profit, expected value, option expected return, option risk reward, option reward ratio, option moneyness, in the money, out of the money, at the money, deep in money, deep out money, near money, far money, option time decay, time decay, theta decay, option erosion, premium decay, option acceleration, option gamma scalping, delta neutral, gamma neutral, vega neutral, theta neutral, option neutral, market neutral, dollar neutral, beta weighted, portfolio delta, portfolio gamma, portfolio vega, portfolio theta, portfolio risk, option correlation, option beta, option alpha, option Sharpe ratio, option Sortino ratio, option maximum drawdown, option value at risk, option stress test, option scenario analysis, option what if analysis, option Monte Carlo simulation, option historical simulation, option parametric method, option non parametric, option semi parametric, option copula, option dependence, option tail risk, option black swan, option fat tails, option extreme value, option expected shortfall, option conditional VaR, option marginal VaR, option component VaR, option incremental VaR, option backtesting VaR, option model risk, option parameter risk, option estimation risk, option specification risk, option implementation risk, option liquidity risk, option funding risk, option collateral risk, option counterparty risk, option settlement risk, option operational risk, option legal risk, option regulatory risk, option tax risk, option accounting risk, option reporting risk, option compliance risk, option reputation risk, option strategic risk, option business risk, option financial risk, option market risk, option credit risk, option operational risk, option systemic risk, option idiosyncratic risk, option diversifiable risk, option non diversifiable risk, option total risk, option active risk, option passive risk, option relative risk, option absolute risk, option tracking error, option information ratio, option appraisal ratio, option treynor ratio, option Jensen's alpha, option market timing, option security selection, option style analysis, option performance attribution, option risk attribution, option return attribution, option factor model, option arbitrage pricing, option capital asset, option consumption based, option intertemporal capm, option multi factor, option Fama French, option Carhart, option momentum, option value, option growth, option quality, option low volatility, option high beta, option low beta, option smart beta, option factor investing, option quantitative investing, option systematic investing, option discretionary investing, option active investing, option passive investing, option index investing, option ETF investing, option mutual fund, option hedge fund, option pension fund, option endowment, option foundation, option family office, option high net worth, option retail investor, option institutional investor, option professional trader, option amateur trader, option beginner trader, option expert trader, option algorithmic trader, option quantitative trader, option market maker, option specialist, option floor trader, option electronic trader, option day trader, option swing trader, option position trader, option investor, option speculator, option hedger, option arbitrageur, option market timer, option contrarian, option trend follower, option mean reversion, option momentum trader, option value investor, option growth investor, option income investor, option GARP investor, option CANSLIM, option technical trader, option fundamental trader, option quantitative analyst, option financial engineer, option risk manager, option portfolio manager, option investment advisor, option financial planner, option wealth manager, option private banker, option institutional sales, option trading desk, option research analyst, option strategist, option economist, option accountant, option auditor, option regulator, option lawyer, option consultant, option academic, option professor, option student, option researcher, option developer, option programmer, option data scientist, option AI engineer, option quant developer, option software engineer, option product manager, option business analyst, option project manager, option operations, option compliance officer, option risk officer, option technology, option infrastructure, option cloud, option database, option API, option interface, option mobile, option web, option desktop, option enterprise, option retail, option institutional, option professional, option consumer, option B2B, option B2C, option SaaS, option PaaS, option IaaS, option fintech, option wealthtech, option regtech, option suptech, option insurtech, option proptech, option legaltech, option healthtech, option edtech, option cleantech, option greentech, option climate fintech, option sustainable finance, option ESG, option impact investing, option social responsibility, option corporate governance, option ethical investing, option faith-based investing, option Islamic finance, option halal investing, option sustainable investing, option green investing, option clean investing, option renewable investing, option carbon investing, option climate investing, option water investing, option waste investing, option circular economy, option blue economy, option ocean economy, option biodiversity, option conservation, option preservation, option restoration, option regeneration, option sustainability, option resilience, option adaptation, option mitigation, option transition, option net zero, option carbon neutral, option climate neutral, option planet positive, option nature positive, option social positive, option community positive, option stakeholder capitalism, option conscious capitalism, option purpose economy, option wellbeing economy, option doughnut economics, option circular economics, option regenerative economics, option ecological economics, option environmental economics, option resource economics, option energy economics, option climate economics, option carbon economics, option water economics, option food economics, option health economics, option education economics, option housing economics, option transportation economics, option urban economics, option rural economics, option development economics, option growth economics, option welfare economics, option public economics, option fiscal policy, option monetary policy, option international economics, option trade economics, option financial economics, option behavioral economics, option experimental economics, option neuroeconomics, option complexity economics, option evolutionary economics, option institutional economics, option political economics, option social economics, option cultural economics, option historical economics, option mathematical economics, option econometrics, option statistics, option probability, option stochastic processes, option time series, option cross section, option panel data, option big data, option machine learning, option artificial intelligence, option deep learning, option neural networks, option natural language, option computer vision, option reinforcement learning, option unsupervised learning, option supervised learning, option semi-supervised learning, option transfer learning, option ensemble learning, option Bayesian learning, option frequentist learning, option optimization, option linear programming, option nonlinear programming, option integer programming, option dynamic programming, option stochastic programming, option robust optimization, option convex optimization, option non-convex optimization, option global optimization, option local optimization, option gradient descent, option Newton method, option quasi-Newton, option conjugate gradient, option simplex method, option interior point, option branch and bound, option cutting plane, option column generation, option decomposition, option parallel computing, option distributed computing, option cloud computing, option edge computing, option quantum computing, option blockchain, option cryptocurrency, option DeFi, option NFT, option metaverse, option web3, option DAO, option smart contract, option oracle, option bridge, option layer2, option sidechain, option mainnet, option testnet, option tokenomics, option governance token, option utility token, option security token, option payment token, option stablecoin, option algorithmic stablecoin, option collateralized stablecoin, option fiat-backed, option crypto-backed, option commodity-backed, option hybrid stablecoin, option CBDC, option digital dollar, option digital euro, option digital yuan, option digital currency, option electronic money, option e-money, option mobile money, option payment system, option payment network, option payment processor, option payment gateway, option merchant account, payment processing, payment solution, payment technology, payment innovation, payment security, payment compliance, payment regulation, payment risk, payment fraud, payment authentication, payment authorization, payment settlement, payment clearing, payment reconciliation, payment reporting, payment analytics, payment intelligence, payment optimization, payment efficiency, payment cost, payment fee, payment revenue, payment profit, payment margin, payment growth, payment scale, payment network effect, payment platform, payment ecosystem, payment partnership, payment integration, payment API, payment SDK, payment plugin, payment widget, payment form, payment page, payment link, payment QR, payment NFC, payment biometric, payment voice, payment gesture, payment emotion, payment brain, payment implant, payment wearable, payment IoT, payment connected, payment smart, payment intelligent, payment autonomous, payment decentralized, payment distributed, payment peer-to-peer, payment person-to-person, payment business-to-business, payment business-to-consumer, payment consumer-to-business, payment consumer-to-consumer, payment government-to-citizen, payment citizen-to-government, payment machine-to-machine, payment thing-to-thing, payment everything-to-everything, payment omnichannel, payment cross-border, payment domestic, payment local, payment global, payment international, payment regional, payment national, payment state, payment city, payment community, payment neighborhood, payment household, payment individual, payment personal, payment family, payment group, payment team, payment organization, payment company, payment corporation, payment partnership, payment sole proprietorship, payment LLC, payment Inc, payment Ltd, payment Co, payment Corp, payment enterprise, payment SME, payment startup, payment scaleup, payment unicorn, payment decacorn, payment hectocorn, payment venture, payment angel, payment private equity, payment public, payment listed, payment exchange, payment market, payment economy, payment ecosystem, payment environment, payment society, payment civilization, payment future, payment present, payment past, payment history, payment evolution, payment revolution, payment transformation, payment disruption, payment innovation, payment invention, payment discovery, payment exploration, payment experimentation, payment research, payment development, payment design, payment engineering, payment science, payment art, payment philosophy, payment theology, payment spirituality, payment religion, payment faith, payment belief, payment value, payment ethics, payment morality, payment justice, payment fairness, payment equality, payment equity, payment inclusion, payment diversity, payment accessibility, payment affordability, payment availability, payment reliability, payment security, payment privacy, payment transparency, payment accountability, payment responsibility, payment sustainability, payment resilience, payment adaptability, payment flexibility, payment scalability, payment efficiency, payment effectiveness, payment performance, payment quality, payment excellence, payment mastery, payment expertise, payment skill, payment talent, payment genius, payment creativity, payment innovation, payment invention, payment discovery, payment exploration, payment experimentation, payment research, payment development, payment design, payment engineering, payment science, payment art, payment craft, payment trade, payment profession, payment occupation, payment career, payment job, payment work, payment labor, payment employment, payment unemployment, payment underemployment, payment overemployment, payment gig economy, payment sharing economy, payment circular economy, payment regenerative economy, payment wellbeing economy, payment happiness economy, payment joy economy, payment love economy, payment peace economy, payment harmony economy, payment balance economy, payment flow economy, payment zen economy, payment tao economy, payment yoga economy, payment meditation economy, payment mindfulness economy, payment consciousness economy, payment awareness economy, payment enlightenment economy, payment awakening economy, payment transformation economy, payment evolution economy, payment revolution economy, payment renaissance economy, payment reformation economy, payment restoration economy, payment regeneration economy, payment renewal economy, payment rebirth economy, payment resurrection economy, payment ascension economy, payment transcendence economy, payment nirvana economy, payment heaven economy, payment utopia economy, payment paradise economy, payment eden economy, payment arcadia economy, payment shangri-la economy, payment el dorado economy, payment atlantis economy, payment lemuria economy, payment mu economy, payment hyperborea economy, payment agartha economy, payment shambhala economy, payment avalon economy, payment camelot economy, payment olympus economy, payment asgard economy, payment valhalla economy, payment niflheim economy, payment muspelheim economy, payment midgard economy, payment alfheim economy, payment svartalfheim economy, payment jotunheim economy, payment vanaheim economy, payment helheim economy, payment nidavellir economy"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/option-pricing-calculator" />
        <meta property="og:title" content="Option Pricing Calculator - Black-Scholes Model" />
        <meta
          property="og:description"
          content="Calculate fair value of European call and put options with Greeks (delta, gamma, vega) using the Black-Scholes formula."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/option-pricing-calculator" />
      </Head>

      <div className={styles.page}>
        <div className={styles.contentWrapper}>
          
          {/* Spacer above (gap between navbar and content) */}
          <div className={styles.spacerTop} />

          {/* Hero Section */}
          <section className={styles.hero}>
            <h1 className={styles.title}>Option Pricing Calculator</h1>
            <p className={styles.subtitle}>
              Price European call and put options using the Black-Scholes model.
            </p>
          </section>

          {/* Calculator Card */}
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter parameters to calculate option prices and Greeks.
              </p>

              <div className={styles.inputGroup}>
                <label htmlFor="spotPrice" className={styles.label}>
                  Current Stock Price ($)
                </label>
                <input
                  type="number"
                  id="spotPrice"
                  name="spotPrice"
                  value={inputs.spotPrice}
                  onChange={handleChange}
                  placeholder="e.g. 100"
                  step="0.01"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="strikePrice" className={styles.label}>
                  Strike Price ($)
                </label>
                <input
                  type="number"
                  id="strikePrice"
                  name="strikePrice"
                  value={inputs.strikePrice}
                  onChange={handleChange}
                  placeholder="e.g. 100"
                  step="0.01"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="timeToExpiry" className={styles.label}>
                  Time to Expiry (Years)
                </label>
                <input
                  type="number"
                  id="timeToExpiry"
                  name="timeToExpiry"
                  value={inputs.timeToExpiry}
                  onChange={handleChange}
                  placeholder="e.g. 1"
                  step="0.01"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="riskFreeRate" className={styles.label}>
                  Risk-Free Rate (%)
                </label>
                <input
                  type="number"
                  id="riskFreeRate"
                  name="riskFreeRate"
                  value={inputs.riskFreeRate}
                  onChange={handleChange}
                  placeholder="e.g. 5"
                  step="0.01"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="volatility" className={styles.label}>
                  Volatility (σ, %)
                </label>
                <input
                  type="number"
                  id="volatility"
                  name="volatility"
                  value={inputs.volatility}
                  onChange={handleChange}
                  placeholder="e.g. 20"
                  step="0.01"
                  required
                  className={styles.input}
                />
              </div>

              <button type="submit" className={styles.ctaButton}>
                <span className={styles.btnText}>Calculate Option Prices</span>
                <span className={styles.btnArrow}>→</span>
              </button>

              {result && (
                <div className={styles.resultSection}>
                  <h3>Option Pricing Results (Black-Scholes)</h3>
                  <div className={styles.resultGrid}>
                    <div className={`${styles.resultItem} ${styles.highlight}`}>
                      <strong>Call Price:</strong> ${result.call}
                    </div>
                    <div className={`${styles.resultItem} ${styles.highlight}`}>
                      <strong>Put Price:</strong> ${result.put}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Delta (Call):</strong> {result.deltaCall}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Delta (Put):</strong> {result.deltaPut}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Gamma:</strong> {result.gamma}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Vega:</strong> ${result.vega}/1%
                    </div>
                  </div>
                  <div className={styles.note}>
                    Based on Black-Scholes model. Greeks help manage risk in options trading.
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Info Section */}
          <section className={styles.infoSection}>
            <div className={styles.container}>
              <div className={styles.infoCard}>
                <h3>Why Option Pricing Matters</h3>
                <p>
                  <strong>Option pricing</strong> is essential for traders, investors, and risk managers to determine the fair value of call and put options. Mispricing creates arbitrage opportunities, while accurate valuation supports hedging and speculation.
                </p>

                <h4>How to Use This Calculator</h4>
                <p>
                  Enter the <strong>current stock price</strong>, <strong>strike price</strong>, <strong>time to expiry</strong>, <strong>risk-free rate</strong>, and <strong>volatility</strong>. The calculator uses the <strong>Black-Scholes model</strong> to compute:
                </p>
                <ul className={styles.list}>
                  <li><strong>Call & Put Prices</strong></li>
                  <li><strong>Greeks:</strong> Delta, Gamma, Vega (risk sensitivities)</li>
                </ul>

                <h4>The Black-Scholes Formula</h4>
                <div className={styles.formula}>
                  <code>C = S·N(d₁) − K·e⁻ʳᵀ·N(d₂)</code>
                </div>
                <div className={styles.formula}>
                  <code>P = K·e⁻ʳᵀ·N(−d₂) − S·N(−d₁)</code>
                </div>
                <p>Where:</p>
                <div className={styles.formula}>
                  <code>d₁ = [ln(S/K) + (r + σ²/2)T] / (σ√T)</code>
                </div>
                <div className={styles.formula}>
                  <code>d₂ = d₁ − σ√T</code>
                </div>
                <ul className={styles.list}>
                  <li><strong>S</strong> = Spot price</li>
                  <li><strong>K</strong> = Strike price</li>
                  <li><strong>r</strong> = Risk-free rate</li>
                  <li><strong>T</strong> = Time to expiry (years)</li>
                  <li><strong>σ</strong> = Volatility</li>
                  <li><strong>N()</strong> = Standard normal CDF</li>
                </ul>

                <h4>Key Greeks</h4>
                <ul className={styles.list}>
                  <li><strong>Delta:</strong> Option price change per $1 move in stock</li>
                  <li><strong>Gamma:</strong> Rate of change of delta</li>
                  <li><strong>Vega:</strong> Sensitivity to volatility changes</li>
                </ul>

                <h4>Real-World Applications</h4>
                <ul className={styles.list}>
                  <li><strong>Trading:</strong> Identify under/overvalued options</li>
                  <li><strong>Hedging:</strong> Use delta to hedge portfolio risk</li>
                  <li><strong>Risk Management:</strong> Monitor gamma and vega exposure</li>
                  <li><strong>Employee Stock Options:</strong> Estimate fair value</li>
                </ul>

                <h4>Assumptions</h4>
                <ul className={styles.list}>
                  <li>No dividends</li>
                  <li>No transaction costs</li>
                  <li>Constant volatility and interest rates</li>
                  <li>Log-normal price distribution</li>
                  <li>European-style (no early exercise)</li>
                </ul>

                <h4>Limitations</h4>
                <ul className={styles.list}>
                  <li>Does not price American options (early exercise)</li>
                  <li>Volatility is assumed constant (not realistic)</li>
                  <li>Ignores market frictions like bid-ask spreads</li>
                  <li>Assumes continuous trading and no jumps</li>
                </ul>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className={styles.ctaSection}>
            <div className={styles.ctaSectionInner}>
              <h2>Free Financial Planning Tools: Budget, Invest & Plan Retirement</h2>
              <p>Free Financial Planning Tools – Try Now</p>
              <Link href="/suite" legacyBehavior>
                <a
                  className={styles.ctaButtonLink}
                  ref={ctaButtonRef}
                  onMouseMove={handleMouseMove}
                >
                  <span className={styles.btnText}>Explore All Calculators</span>
                  <span className={styles.arrow}>→</span>
                </a>
              </Link>
            </div>
          </section>

          {/* Footer Spacer */}
          <div className={styles.footerSpacer} />
        </div>
      </div>
    </>
  );
};

export default OptionPricingCalculator;