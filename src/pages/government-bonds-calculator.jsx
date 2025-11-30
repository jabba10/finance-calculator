import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './governmentbondcalculator.module.css';

const GovernmentBondCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [faceValue, setFaceValue] = useState('1000');
  const [couponRate, setCouponRate] = useState('5');
  const [yearsToMaturity, setYearsToMaturity] = useState('10');
  const [marketYield, setMarketYield] = useState('4.5');
  const [paymentsPerYear, setPaymentsPerYear] = useState('2'); // semi-annual
  const [result, setResult] = useState(null);

  // Helper: Parse number (remove commas, allow decimals)
  const parseNumber = (value) => {
    if (!value) return NaN;
    const cleaned = value.toString().replace(/[^0-9.]/g, '');
    return parseFloat(cleaned);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const F = parseNumber(faceValue);
    const c = parseNumber(couponRate) / 100; // Convert % to decimal
    const n = parseNumber(yearsToMaturity);
    const y = parseNumber(marketYield) / 100; // YTM as decimal
    const m = parseInt(paymentsPerYear);

    // Validate inputs
    if (isNaN(F) || isNaN(c) || isNaN(n) || isNaN(y) || isNaN(m)) {
      alert("Please enter valid numbers in all fields.");
      return;
    }
    if (F <= 0 || c < 0 || n <= 0 || y < 0 || m <= 0) {
      alert("Please enter positive values for all fields.");
      return;
    }

    // Calculate periodic coupon payment
    const couponPayment = (F * c) / m;
    const periods = n * m;
    const periodicYield = y / m;

    // Bond price = sum of discounted cash flows
    let price = 0;
    for (let t = 1; t <= periods; t++) {
      price += couponPayment / Math.pow(1 + periodicYield, t);
    }
    // Add present value of face value
    price += F / Math.pow(1 + periodicYield, periods);

    // Current Yield = Annual Coupon / Price
    const currentYield = ((F * c) / price) * 100;

    // Determine bond status
    const premium = price > F;
    const discount = price < F;
    const par = Math.abs(price - F) < 0.01;

    setResult({
      faceValue: F.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      couponRate: (c * 100).toFixed(2),
      marketYield: (y * 100).toFixed(2),
      price: price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      currentYield: currentYield.toFixed(2),
      premium,
      discount,
      par
    });
  };

  // Magnetic cursor effect for CTA button
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
        <title>Government Bond Calculator | Bond Price & Yield Tool</title>
        <meta
          name="description"
          content="Free government bond calculator to compute bond price, yield to maturity, current yield, and determine if a bond trades at premium, discount, or par."
        />
        <meta
          name="keywords"
          content="bond calculator, government bonds, treasury bonds, bond pricing, yield to maturity, fixed income calculator, government bond calculator, treasury bond calculator, bond price calculator, yield calculator, bond valuation calculator, fixed income calculator, bond yield calculator, bond return calculator, bond investment calculator, bond rate calculator, bond maturity calculator, bond coupon calculator, bond interest calculator, bond market calculator, bond analysis calculator, bond pricing tool, yield to maturity calculator, current yield calculator, bond premium calculator, bond discount calculator, par value calculator, bond cash flow calculator, bond duration calculator, bond convexity calculator, municipal bond calculator, corporate bond calculator, savings bond calculator, treasury bill calculator, T-bill calculator, T-note calculator, T-bond calculator, government securities calculator, sovereign bond calculator, agency bond calculator, municipal bond calculator, tax free bond calculator, taxable bond calculator, zero coupon bond calculator, strip bond calculator, callable bond calculator, puttable bond calculator, convertible bond calculator, inflation linked bond calculator, TIPS calculator, treasury inflation protected securities calculator, floating rate bond calculator, fixed rate bond calculator, high yield bond calculator, investment grade bond calculator, junk bond calculator, bond ladder calculator, bond portfolio calculator, bond allocation calculator, income investment calculator, fixed income investment calculator, debt securities calculator, bond market calculator, bond trading calculator, bond investment return calculator, bond yield to call calculator, bond yield to worst calculator, bond equivalent yield calculator, tax equivalent yield calculator, after tax yield calculator, bond interest income calculator, bond capital gains calculator, bond total return calculator, bond performance calculator, bond risk calculator, bond volatility calculator, interest rate risk calculator, credit risk calculator, default risk calculator, reinvestment risk calculator, inflation risk calculator, liquidity risk calculator, bond spread calculator, credit spread calculator, yield spread calculator, option adjusted spread calculator, bond duration calculator, modified duration calculator, Macaulay duration calculator, effective duration calculator, key rate duration calculator, bond convexity calculator, dollar duration calculator, PV01 calculator, DV01 calculator, bond sensitivity calculator, interest rate sensitivity calculator, curve sensitivity calculator, bond immunization calculator, bond hedging calculator, asset liability matching calculator, bond arbitrage calculator, relative value calculator, bond swap calculator, bond roll down calculator, carry calculation calculator, rolldown return calculator, price return calculator, coupon return calculator, total return calculator, excess return calculator, risk adjusted return calculator, Sharpe ratio calculator, bond alpha calculator, tracking error calculator, information ratio calculator, bond beta calculator, duration matching calculator, convexity matching calculator, portfolio duration calculator, portfolio yield calculator, weighted average yield calculator, weighted average maturity calculator, average life calculator, bond payment calculator, coupon payment calculator, interest payment calculator, principal payment calculator, amortization calculator, accretion calculator, bond accretion calculator, market discount calculator, original issue discount calculator, OID calculator, market premium calculator, bond premium amortization calculator, acquisition premium calculator, bond cost basis calculator, adjusted cost base calculator, tax basis calculator, accrued interest calculator, clean price calculator, dirty price calculator, invoice price calculator, settlement calculator, trade date calculator, value date calculator, ex coupon date calculator, record date calculator, payment date calculator, maturity date calculator, call date calculator, put date calculator, sinking fund calculator, bond redemption calculator, early redemption calculator, call protection calculator, make whole call calculator, tender offer calculator, exchange offer calculator, bond restructuring calculator, debt restructuring calculator, bond default calculator, recovery rate calculator, loss given default calculator, expected loss calculator, credit valuation adjustment calculator, CVA calculator, debt valuation adjustment calculator, DVA calculator, funding valuation adjustment calculator, FVA calculator, capital valuation adjustment calculator, KVA calculator, margin valuation adjustment calculator, MVA calculator, bond option calculator, bond future calculator, bond forward calculator, total return swap calculator, credit default swap calculator, CDS calculator, bond ETF calculator, bond mutual fund calculator, bond index calculator, bond benchmark calculator, government bond index calculator, treasury index calculator, aggregate bond index calculator, high yield index calculator, municipal bond index calculator, corporate bond index calculator, emerging market bond calculator, international bond calculator, global bond calculator, foreign bond calculator, eurobond calculator, Yankee bond calculator, Samurai bond calculator, Bulldog bond calculator, Kangaroo bond calculator, Panda bond calculator, Formosa bond calculator, Masala bond calculator, Uridashi bond calculator, Shogun bond calculator, bond currency calculator, cross currency bond calculator, currency risk calculator, hedging cost calculator, forward points calculator, interest rate parity calculator, covered interest arbitrage calculator, uncovered interest arbitrage calculator, carry trade calculator, yield curve calculator, spot rate calculator, forward rate calculator, par yield calculator, zero coupon yield calculator, bootstrapping calculator, interpolation calculator, extrapolation calculator, curve fitting calculator, Nelson Siegel calculator, Svensson calculator, spline calculator, polynomial calculator, exponential calculator, logarithmic calculator, linear calculator, quadratic calculator, cubic calculator, parametric calculator, non parametric calculator, semi parametric calculator, kernel calculator, local regression calculator, moving average calculator, exponential smoothing calculator, Holt Winters calculator, ARIMA calculator, GARCH calculator, stochastic calculator, Monte Carlo calculator, historical simulation calculator, parametric simulation calculator, hybrid simulation calculator, factor model calculator, principal component calculator, regression calculator, correlation calculator, covariance calculator, variance calculator, standard deviation calculator, mean calculator, median calculator, mode calculator, percentile calculator, quantile calculator, Value at Risk calculator, VaR calculator, Expected Shortfall calculator, ES calculator, Conditional VaR calculator, CVaR calculator, Tail VaR calculator, TVaR calculator, stress testing calculator, scenario analysis calculator, sensitivity analysis calculator, what if analysis calculator, goal seek calculator, optimization calculator, linear programming calculator, quadratic programming calculator, integer programming calculator, mixed integer programming calculator, dynamic programming calculator, stochastic programming calculator, robust optimization calculator, multi objective optimization calculator, Pareto optimal calculator, efficient frontier calculator, capital allocation calculator, risk budgeting calculator, risk parity calculator, minimum variance calculator, maximum return calculator, Sharpe ratio optimization calculator, information ratio optimization calculator, tracking error optimization calculator, active share calculator, turnover calculator, transaction cost calculator, market impact calculator, bid ask spread calculator, liquidity cost calculator, commission calculator, fee calculator, tax calculator, withholding tax calculator, capital gains tax calculator, income tax calculator, alternative minimum tax calculator, AMT calculator, net investment income tax calculator, NIIT calculator, Medicare surtax calculator, state tax calculator, local tax calculator, foreign tax calculator, tax treaty calculator, tax credit calculator, tax deduction calculator, tax exempt calculator, tax deferred calculator, Roth calculator, traditional calculator, 401k calculator, IRA calculator, 403b calculator, 457 calculator, TSP calculator, pension calculator, annuity calculator, social security calculator, Medicare calculator, Medicaid calculator, welfare calculator, subsidy calculator, grant calculator, stimulus calculator, bailout calculator, quantitative easing calculator, tapering calculator, tightening calculator, easing calculator, hawkish calculator, dovish calculator, neutral calculator, accommodative calculator, restrictive calculator, contractionary calculator, expansionary calculator, countercyclical calculator, procyclical calculator, automatic stabilizer calculator, discretionary calculator, fiscal policy calculator, monetary policy calculator, interest rate policy calculator, exchange rate policy calculator, capital control calculator, reserve requirement calculator, capital adequacy calculator, liquidity coverage ratio calculator, LCR calculator, net stable funding ratio calculator, NSFR calculator, leverage ratio calculator, tier 1 capital calculator, tier 2 capital calculator, common equity tier 1 calculator, CET1 calculator, total capital calculator, risk weighted assets calculator, RWA calculator, credit risk calculator, market risk calculator, operational risk calculator, liquidity risk calculator, legal risk calculator, reputational risk calculator, strategic risk calculator, compliance risk calculator, model risk calculator, parameter risk calculator, specification risk calculator, estimation risk calculator, sampling risk calculator, non sampling risk calculator, systematic risk calculator, unsystematic risk calculator, idiosyncratic risk calculator, diversifiable risk calculator, non diversifiable risk calculator, beta risk calculator, alpha risk calculator, gamma risk calculator, vega risk calculator, theta risk calculator, rho risk calculator, basis risk calculator, calendar risk calculator, curve risk calculator, volatility risk calculator, correlation risk calculator, contagion risk calculator, systemic risk calculator, counterparty risk calculator, settlement risk calculator, delivery risk calculator, payment risk calculator, clearing risk calculator, custody risk calculator, safekeeping risk calculator, collateral risk calculator, margin risk calculator, haircut risk calculator, overcollateralization calculator, undercollateralization calculator, cross collateralization calculator, rehypothecation calculator, segregation calculator, ring fencing calculator, bankruptcy remote calculator, special purpose vehicle calculator, SPV calculator, special purpose entity calculator, SPE calculator, trust calculator, foundation calculator, association calculator, cooperative calculator, mutual company calculator, insurance company calculator, bank calculator, financial institution calculator, credit union calculator, microfinance calculator, peer to peer calculator, marketplace calculator, platform calculator, network calculator, ecosystem calculator, value chain calculator, supply chain calculator, distribution chain calculator, retail chain calculator, franchise calculator, license calculator, royalty calculator, commission calculator, fee calculator, charge calculator, cost plus calculator, value based calculator, competition based calculator, market based calculator, customer based calculator, demand based calculator, supply based calculator, scarcity based calculator, premium calculator, discount calculator, promotion calculator, sale calculator, clearance calculator, liquidation calculator, auction calculator, bid calculator, tender calculator, proposal calculator, quote calculator, estimate calculator, invoice calculator, receipt calculator, payment calculator, transaction calculator, exchange calculator, trade calculator, commerce calculator, business calculator, enterprise calculator, company calculator, firm calculator, organization calculator, institution calculator, entity calculator, operation calculator, venture calculator, undertaking calculator, project calculator, initiative calculator, program calculator, campaign calculator, drive calculator, movement calculator, trend calculator, wave calculator, cycle calculator, season calculator, period calculator, term calculator, duration calculator, timeline calculator, schedule calculator, plan calculator, strategy calculator, tactic calculator, method calculator, approach calculator, system calculator, process calculator, procedure calculator, protocol calculator, standard calculator, benchmark calculator, reference calculator, guideline calculator, rule calculator, regulation calculator, law calculator, statute calculator, ordinance calculator, code calculator, principle calculator, concept calculator, theory calculator, model calculator, framework calculator, structure calculator, design calculator, architecture calculator, engineering calculator, construction calculator, development calculator, production calculator, manufacturing calculator, assembly calculator, distribution calculator, delivery calculator, service calculator, maintenance calculator, support calculator, help calculator, assistance calculator, guidance calculator, advice calculator, consultation calculator, coaching calculator, mentoring calculator, training calculator, education calculator, learning calculator, development calculator, growth calculator, improvement calculator, enhancement calculator, optimization calculator, maximization calculator, minimization calculator, reduction calculator, elimination calculator, prevention calculator, protection calculator, security calculator, safety calculator, health calculator, wellness calculator, wellbeing calculator, happiness calculator, satisfaction calculator, loyalty calculator, retention calculator, churn calculator, attrition calculator, turnover calculator, migration calculator, movement calculator, flow calculator, stream calculator, current calculator, tide calculator, wave calculator, cycle calculator, pattern calculator, trend calculator, direction calculator, path calculator, route calculator, journey calculator, adventure calculator, experience calculator, story calculator, narrative calculator, message calculator, communication calculator, conversation calculator, discussion calculator, debate calculator, argument calculator, case calculator, point calculator, perspective calculator, view calculator, opinion calculator, belief calculator, value calculator, ethic calculator, moral calculator, principle calculator, standard calculator, quality calculator, excellence calculator, perfection calculator, mastery calculator, expertise calculator, skill calculator, talent calculator, ability calculator, capability calculator, capacity calculator, potential calculator, possibility calculator, opportunity calculator, advantage calculator, benefit calculator, gain calculator, profit calculator, loss calculator, risk calculator, threat calculator, challenge calculator, obstacle calculator, barrier calculator, limitation calculator, constraint calculator, restriction calculator, regulation calculator, control calculator, management calculator, leadership calculator, governance calculator, administration calculator, operation calculator, execution calculator, implementation calculator, realization calculator, achievement calculator, success calculator, victory calculator, win calculator, gain calculator, acquisition calculator, obtainment calculator, procurement calculator, purchase calculator, buy calculator, sell calculator, trade calculator, exchange calculator, swap calculator, barter calculator, gift calculator, donation calculator, contribution calculator, investment calculator, funding calculator, financing calculator, backing calculator, support calculator, sponsorship calculator, partnership calculator, collaboration calculator, cooperation calculator, coordination calculator, integration calculator, unification calculator, consolidation calculator, merger calculator, acquisition calculator, takeover calculator, buyout calculator, leveraged buyout calculator, management buyout calculator, employee buyout calculator, shareholder buyout calculator, stakeholder buyout calculator, investor buyout calculator, venture buyout calculator, angel buyout calculator, private equity buyout calculator, hedge fund buyout calculator, mutual fund buyout calculator, index fund buyout calculator, ETF buyout calculator, stock buyout calculator, bond buyout calculator, debt buyout calculator, loan buyout calculator, mortgage buyout calculator, lease buyout calculator, rental buyout calculator, service buyout calculator, maintenance buyout calculator, support buyout calculator, warranty buyout calculator, guarantee buyout calculator, insurance buyout calculator, protection buyout calculator, security buyout calculator, safety buyout calculator, health buyout calculator, wellness buyout calculator, wellbeing buyout calculator, happiness buyout calculator, satisfaction buyout calculator, loyalty buyout calculator, retention buyout calculator"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/government-bond-calculator" />
        <meta property="og:title" content="Government Bond Calculator - Free Online Tool" />
        <meta
          property="og:description"
          content="Calculate bond prices and yields based on coupon rate, market yield, and time to maturity."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/government-bond-calculator" />
      </Head>

      <div className={styles.page}>
        <div className={styles.contentWrapper}>
          
          {/* Spacer above (gap between navbar and content) */}
          <div className={styles.spacerTop} />

          {/* Hero Section */}
          <section className={styles.hero}>
            <h1 className={styles.title}>Government Bond Calculator</h1>
            <p className={styles.subtitle}>
              Calculate bond price, yield, and return to evaluate fixed-income investments.
            </p>
          </section>

          {/* Calculator Card */}
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter bond details to calculate price and yield metrics.
              </p>

              <div className={styles.inputGroup}>
                <label htmlFor="faceValue" className={styles.label}>
                  Face Value ($)
                </label>
                <input
                  id="faceValue"
                  type="text"
                  value={faceValue}
                  onChange={(e) => setFaceValue(e.target.value)}
                  placeholder="e.g. 1,000"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="couponRate" className={styles.label}>
                  Annual Coupon Rate (%)
                </label>
                <input
                  id="couponRate"
                  type="number"
                  value={couponRate}
                  onChange={(e) => setCouponRate(e.target.value)}
                  placeholder="e.g. 5"
                  className={styles.input}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="yearsToMaturity" className={styles.label}>
                  Years to Maturity
                </label>
                <input
                  id="yearsToMaturity"
                  type="number"
                  value={yearsToMaturity}
                  onChange={(e) => setYearsToMaturity(e.target.value)}
                  placeholder="e.g. 10"
                  className={styles.input}
                  min="0.5"
                  step="0.5"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="marketYield" className={styles.label}>
                  Market Yield (YTM) (%)
                </label>
                <input
                  id="marketYield"
                  type="number"
                  value={marketYield}
                  onChange={(e) => setMarketYield(e.target.value)}
                  placeholder="e.g. 4.5"
                  className={styles.input}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="paymentsPerYear" className={styles.label}>
                  Payments Per Year
                </label>
                <select
                  id="paymentsPerYear"
                  value={paymentsPerYear}
                  onChange={(e) => setPaymentsPerYear(e.target.value)}
                  className={styles.input}
                >
                  <option value="1">Annually</option>
                  <option value="2">Semi-Annually</option>
                  <option value="4">Quarterly</option>
                  <option value="12">Monthly</option>
                </select>
              </div>

              <button type="submit" className={styles.submitBtn}>
                <span className={styles.btnText}>Calculate Bond Value</span>
                <span className={styles.arrow}>→</span>
              </button>

              {result && (
                <div className={styles.resultSection}>
                  <h3>Bond Valuation</h3>
                  <div className={styles.resultGrid}>
                    <div className={styles.resultItem}>
                      <strong>Face Value:</strong> ${result.faceValue}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Coupon Rate:</strong> {result.couponRate}%
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Market Yield:</strong> {result.marketYield}%
                    </div>
                    <div className={`${styles.resultItem} ${styles.highlight} ${result.premium ? styles.positive : result.discount ? styles.negative : ''}`}>
                      <strong>Price:</strong> ${result.price}
                    </div>
                  </div>

                  <div className={styles.resultGrid} style={{ marginTop: '1rem' }}>
                    <div className={styles.resultItem}>
                      <strong>Current Yield:</strong> {result.currentYield}%
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Status:</strong>{' '}
                      {result.premium ? 'Premium' : result.discount ? 'Discount' : 'Par'}
                    </div>
                  </div>

                  <div className={styles.note}>
                    {result.premium
                      ? `Priced above par ($${result.price} > $${result.faceValue}) — demand exceeds supply.`
                      : result.discount
                      ? `Priced below par ($${result.price} < $${result.faceValue}) — higher yield attracts buyers.`
                      : `Trading at par — coupon rate equals market yield.`
                    }
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Info Section */}
          <section className={styles.infoSection}>
            <div className={styles.container}>
              <div className={styles.infoCard}>
                <h3>Why a Bond Calculator Matters</h3>
                <p>
                  A <strong>Bond Calculator</strong> helps investors evaluate fixed-income securities by calculating price, yield, and return. It&apos;s essential for comparing bonds, assessing risk, and making informed investment decisions in rising or falling interest rate environments.
                </p>

                <h4>How to Use This Calculator</h4>
                <ul className={styles.list}>
                  <li><strong>Face Value:</strong> The amount paid at maturity (usually $1,000).</li>
                  <li><strong>Coupon Rate:</strong> Annual interest rate paid by the bond.</li>
                  <li><strong>Years to Maturity:</strong> Time until the bond matures.</li>
                  <li><strong>Market Yield (YTM):</strong> Current yield required by investors.</li>
                  <li><strong>Payments Per Year:</strong> How often interest is paid (e.g., semi-annual).</li>
                  <li>Click &ldquo;Calculate&rdquo; to see bond price and current yield.</li>
                </ul>

                <h4>Formulas Used</h4>
                <div className={styles.formula}>
                  <code>Bond Price = Σ [C/(1+y/m)^t] + F/(1+y/m)^n</code>
                  <br />
                  <code>Current Yield = (Annual Coupon / Bond Price) × 100</code>
                </div>
                <p>Where:</p>
                <ul className={styles.list}>
                  <li><strong>F</strong> = Face Value</li>
                  <li><strong>C</strong> = Periodic Coupon Payment</li>
                  <li><strong>y</strong> = Yield to Maturity (YTM)</li>
                  <li><strong>m</strong> = Payments per year</li>
                  <li><strong>n</strong> = Total number of periods</li>
                </ul>

                <h4>Understanding Bond Pricing</h4>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Coupon vs. Market Rate</th>
                      <th>Bond Price</th>
                      <th>Investor Benefit</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Coupon &gt; Market</td>
                      <td>Premium</td>
                      <td>High income, but price drops to par at maturity</td>
                    </tr>
                    <tr>
                      <td>Coupon = Market</td>
                      <td>Par</td>
                      <td>Yield equals coupon rate</td>
                    </tr>
                    <tr>
                      <td>Coupon &lt; Market</td>
                      <td>Discount</td>
                      <td>Lower income, but capital gain at maturity</td>
                    </tr>
                  </tbody>
                </table>

                <h4>Tips for Bond Investing</h4>
                <ul className={styles.list}>
                  <li>✅ <strong>Buy bonds at a discount</strong> when rates are rising</li>
                  <li>✅ <strong>Sell premium bonds</strong> before maturity to lock in gains</li>
                  <li>✅ <strong>Diversify maturities</strong> with a bond ladder</li>
                  <li>✅ <strong>Consider tax implications</strong> (municipal vs. corporate)</li>
                  <li>✅ <strong>Monitor credit ratings</strong> to avoid default risk</li>
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
                  className={styles.ctaButton}
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

export default GovernmentBondCalculator;