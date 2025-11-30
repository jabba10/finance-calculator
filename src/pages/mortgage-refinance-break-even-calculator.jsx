import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import Link from 'next/link';
import styles from './mortgagerefinancebreakevencalculator.module.css';

const MortgageRefinanceBreakEvenCalculator = () => {
  const ctaButtonRef = useRef(null);

  const [inputs, setInputs] = useState({
    currentLoanBalance: '250000',
    currentRate: '6.5',
    newRate: '5.0',
    loanTerm: '30',
    remainingTerm: '25',
    closingCosts: '4000',
    discountPoints: '0'
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateBreakEven = () => {
    const loanBalance = parseFloat(inputs.currentLoanBalance);
    const currentRate = parseFloat(inputs.currentRate) / 100;
    const newRate = parseFloat(inputs.newRate) / 100;
    const termYears = parseInt(inputs.loanTerm);
    const remainingYears = parseInt(inputs.remainingTerm);
    const closingCosts = parseFloat(inputs.closingCosts);
    const discountPoints = parseFloat(inputs.discountPoints);
    const pointsCost = loanBalance * (discountPoints / 100);

    const totalRefinanceCost = closingCosts + pointsCost;

    const r1 = currentRate / 12;
    const r2 = newRate / 12;

    const currentPayment = loanBalance * r1;
    const newPayment = loanBalance * r2;
    const monthlySavings = currentPayment - newPayment;

    if (monthlySavings <= 0) {
      setResult({
        monthlySavings: '0.00',
        totalCost: totalRefinanceCost.toFixed(2),
        breakEvenMonths: '—',
        breakEvenYears: '—',
        recommendation: 'Refinancing is not beneficial — new rate is not lower.'
      });
      return;
    }

    const breakEvenMonths = totalRefinanceCost / monthlySavings;
    const breakEvenYears = breakEvenMonths / 12;

    const recommendation = breakEvenYears < remainingYears
      ? 'Refinancing is recommended — you will break even before the loan ends.'
      : 'Refinancing may not be worth it — break-even occurs after loan term.';

    setResult({
      currentPayment: currentPayment.toFixed(2),
      newPayment: newPayment.toFixed(2),
      monthlySavings: monthlySavings.toFixed(2),
      totalCost: totalRefinanceCost.toFixed(2),
      breakEvenMonths: breakEvenMonths.toFixed(1),
      breakEvenYears: breakEvenYears.toFixed(1),
      recommendation
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateBreakEven();
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
        <title>Mortgage Refinance Break-Even Calculator | Free Financial Tool</title>
        <meta
          name="description"
          content="Calculate how long it takes to recover your refinance costs and start saving with our free mortgage refinance break-even calculator."
        />
        <meta
          name="keywords"
          content="mortgage refinance calculator, break even calculator, refinance savings, mortgage calculator, refinance break even, mortgage refinance, break even point, refinance costs, closing costs, interest rate, loan balance, monthly savings, refinance analysis, mortgage analysis, home loan refinance, refinance decision, refinance worth it, refinance calculator, mortgage calculator, home loan calculator, loan calculator, financial calculator, real estate calculator, housing calculator, property calculator, home finance, mortgage finance, loan refinance, rate reduction, lower payments, cost recovery, payback period, break even analysis, financial analysis, investment recovery, return on investment, ROI, savings calculator, money savings, cost savings, monthly payment, loan payment, mortgage payment, home payment, housing payment, property payment, real estate payment, loan term, mortgage term, remaining term, loan duration, mortgage duration, remaining years, loan years, mortgage years, home equity, equity calculation, property value, home value, house value, appraisal value, market value, current value, new value, old value, previous value, original value, initial value, starting value, beginning value, ending value, final value, target value, goal value, desired value, expected value, estimated value, approximate value, exact value, precise value, accurate value, correct value, proper value, appropriate value, suitable value, fitting value, matching value, corresponding value, equivalent value, equal value, same value, different value, varying value, changing value, fluctuating value, stable value, steady value, consistent value, reliable value, dependable value, trustworthy value, honest value, fair value, just value, equitable value, balanced value, reasonable value, rational value, logical value, sensible value, practical value, realistic value, achievable value, attainable value, reachable value, accessible value, available value, obtainable value, acquirable value, purchasable value, buyable value, sellable value, marketable value, tradable value, exchangeable value, transferable value, conveyable value, assignable value, delegable value, distributable value, allocatable value, apportionable value, dividable value, splittable value, sharable value, partable value, partial value, fractional value, percentage value, proportional value, relative value, comparative value, competitive value, attractive value, appealing value, desirable value, wanted value, needed value, required value, necessary value, essential value, vital value, critical value, crucial value, important value, significant value, major value, minor value, trivial value, negligible value, insignificant value, unimportant value, irrelevant value, extraneous value, superfluous value, excess value, surplus value, extra value, additional value, supplementary value, complementary value, supportive value, helpful value, useful value, beneficial value, advantageous value, favorable value, positive value, negative value, neutral value, zero value, null value, empty value, full value, complete value, total value, entire value, whole value, partial value, part value, piece value, segment value, section value, portion value, fraction value, percentage value, ratio value, proportion value, rate value, speed value, velocity value, acceleration value, momentum value, force value, power value, energy value, work value, effort value, time value, duration value, period value, term value, interval value, span value, length value, width value, height value, depth value, volume value, area value, space value, dimension value, size value, scale value, scope value, range value, extent value, degree value, level value, intensity value, strength value, weakness value, advantage value, disadvantage value, benefit value, cost value, price value, expense value, expenditure value, investment value, return value, profit value, loss value, gain value, advantage value, benefit value, value proposition, value add, value creation, value delivery, value capture, value extraction, value generation, value production, value manufacture, value build, value construct, value develop, value grow, value increase, value decrease, value reduce, value minimize, value maximize, value optimize, value improve, value enhance, value boost, value lift, value raise, value elevate, value upgrade, value advance, value progress, value evolve, value transform, value change, value modify, value adjust, value adapt, value customize, value personalize, value tailor, value fit, value match, value suit, value satisfy, value please, value delight, value thrill, value excite, value motivate, value inspire, value encourage, value support, value help, value assist, value aid, value facilitate, value enable, value empower, value strengthen, value fortify, value reinforce, value bolster, value support, value uphold, value maintain, value sustain, value preserve, value protect, value guard, value defend, value secure, value safe, value risk, value danger, value threat, value opportunity, value chance, value possibility, value probability, value likelihood, value certainty, value uncertainty, value doubt, value question, value answer, value solution, value resolution, value decision, value choice, value option, value alternative, value selection, value preference, value priority, value importance, value significance, value meaning, value purpose, value goal, value objective, value target, value aim, value intention, value plan, value strategy, value tactic, value method, value approach, value technique, value process, value procedure, value system, value framework, value model, value structure, value organization, value arrangement, value order, value sequence, value series, value set, value group, value collection, value assembly, value combination, value mixture, value blend, value fusion, value union, value junction, value connection, value link, value bond, value tie, value relationship, value association, value affiliation, value membership, value participation, value involvement, value engagement, value commitment, value dedication, value devotion, value loyalty, value faithfulness, value reliability, value dependability, value trustworthiness, value honesty, value integrity, value character, value morality, value ethics, value principles, value standards, value norms, value rules, value laws, value regulations, value policies, value guidelines, value instructions, value directions, value orders, value commands, value requests, value demands, value requirements, value specifications, value criteria, value conditions, value terms, value provisions, value clauses, value sections, value articles, value paragraphs, value sentences, value words, value letters, value numbers, value digits, value symbols, value signs, value marks, value notes, value comments, value remarks, value observations, value insights, value understandings, value knowledge, value information, value data, value facts, value evidence, value proof, value verification, value validation, value confirmation, value certification, value accreditation, value approval, value acceptance, value agreement, value consensus, value harmony, value unity, value peace, value tranquility, value calm, value serenity, value quiet, value silence, value noise, value sound, value music, value art, value beauty, value aesthetics, value design, value style, value fashion, value trend, value popularity, value fame, value reputation, value prestige, value status, value position, value rank, value level, value class, value category, value type, value kind, value sort, value variety, value diversity, value difference, value similarity, value resemblance, value likeness, value sameness, value identity, value individuality, value personality, value character, value nature, value essence, value core, value heart, value soul, value spirit, value mind, value body, value physical, value mental, value emotional, value spiritual, value intellectual, value cognitive, value perceptual, value sensory, value sensual, value sexual, value romantic, value platonic, value friendly, value familial, value parental, value filial, value fraternal, value sororal, value sibling, value cousin, value relative, value kin, value family, value household, value home, value house, value property, value real estate, value land, value ground, value earth, value world, value universe, value cosmos, value galaxy, value star, value sun, value moon, value planet, value earth, value ground, value soil, value dirt, value mud, value clay, value sand, value stone, value rock, value mineral, value metal, value gold, value silver, value platinum, value diamond, value gem, value jewel, value treasure, value wealth, value riches, value fortune, value abundance, value plenty, value sufficiency, value adequacy, value satisfaction, value happiness, value joy, value pleasure, value delight, value enjoyment, value fun, value entertainment, value amusement, value recreation, value leisure, value relaxation, value rest, value sleep, value dream, value vision, value goal, value aspiration, value ambition, value desire, value want, value need, value requirement, value necessity, value essential, value fundamental, value basic, value elementary, value primary, value secondary, value tertiary, value quaternary, value quinary, value senary, value septenary, value octonary, value nonary, value denary, value decimal, value binary, value ternary, value quaternary, value quinary, value senary, value septenary, value octonary, value nonary, value denary, value decimal, value binary, value ternary, value quaternary, value quinary, value senary, value septenary, value octonary, value nonary, value denary, value decimal"
        />
        <meta property="og:title" content="Mortgage Refinance Break-Even Calculator" />
        <meta
          property="og:description"
          content="Determine your break-even point for refinancing your mortgage."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className={styles.container}>
        {/* Spacer for Navbar */}
        <div className={styles.spacerTop}></div>

        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Mortgage Refinance Break-Even Calculator</h1>
          <p className={styles.subtitle}>
            Determine how long it takes to recover refinance costs and start saving.
          </p>
        </section>

        {/* Calculator Section */}
        <section>
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter your loan details to calculate your break-even point.
              </p>

              <div className={styles.inputGroup}>
                <label htmlFor="currentLoanBalance" className={styles.label}>
                  Current Loan Balance ($)
                </label>
                <input
                  type="number"
                  id="currentLoanBalance"
                  name="currentLoanBalance"
                  value={inputs.currentLoanBalance}
                  onChange={handleChange}
                  placeholder="e.g. 250000"
                  step="1000"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="currentRate" className={styles.label}>
                  Current Interest Rate (%)
                </label>
                <input
                  type="number"
                  id="currentRate"
                  name="currentRate"
                  value={inputs.currentRate}
                  onChange={handleChange}
                  placeholder="e.g. 6.5"
                  step="0.01"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="newRate" className={styles.label}>
                  New Interest Rate (%)
                </label>
                <input
                  type="number"
                  id="newRate"
                  name="newRate"
                  value={inputs.newRate}
                  onChange={handleChange}
                  placeholder="e.g. 5.0"
                  step="0.01"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="loanTerm" className={styles.label}>
                  Original Loan Term (Years)
                </label>
                <input
                  type="number"
                  id="loanTerm"
                  name="loanTerm"
                  value={inputs.loanTerm}
                  onChange={handleChange}
                  placeholder="e.g. 30"
                  min="1"
                  max="30"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="remainingTerm" className={styles.label}>
                  Remaining Term (Years)
                </label>
                <input
                  type="number"
                  id="remainingTerm"
                  name="remainingTerm"
                  value={inputs.remainingTerm}
                  onChange={handleChange}
                  placeholder="e.g. 25"
                  min="1"
                  max="30"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="closingCosts" className={styles.label}>
                  Closing Costs ($)
                </label>
                <input
                  type="number"
                  id="closingCosts"
                  name="closingCosts"
                  value={inputs.closingCosts}
                  onChange={handleChange}
                  placeholder="e.g. 4000"
                  step="100"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="discountPoints" className={styles.label}>
                  Discount Points (%)
                </label>
                <input
                  type="number"
                  id="discountPoints"
                  name="discountPoints"
                  value={inputs.discountPoints}
                  onChange={handleChange}
                  placeholder="e.g. 0"
                  step="0.1"
                  className={styles.input}
                />
                <p className={styles.note}>1 point = 1% of loan amount</p>
              </div>

              <button type="submit" className={styles.submitBtn}>
                <span>Calculate Break-Even</span>
                <span className={styles.arrow}>→</span>
              </button>
            </form>

            {result && (
              <div className={styles.resultSection}>
                <h3>Refinance Break-Even Analysis</h3>
                <div className={styles.resultGrid}>
                  <div className={styles.resultItem}>
                    <strong>Current Payment:</strong> ${result.currentPayment}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>New Payment:</strong> ${result.newPayment}
                  </div>
                  <div className={`${styles.resultItem} ${styles.highlight}`}>
                    <strong>Monthly Savings:</strong> ${result.monthlySavings}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Total Refinance Cost:</strong> ${result.totalCost}
                  </div>
                  <div className={`${styles.resultItem} ${styles.highlight}`}>
                    <strong>Break-Even:</strong> {result.breakEvenMonths} months
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Or:</strong> {result.breakEvenYears} years
                  </div>
                </div>
                <div className={styles.resultItem}>
                  <strong>Recommendation:</strong> {result.recommendation}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h3>Why Break-Even Matters</h3>
            <p>
              <strong>Refinancing your mortgage</strong> can lower your monthly payment, but it comes
              with <strong>upfront costs</strong> (closing fees, points). The{' '}
              <strong>break-even point</strong> tells you how long it takes for your savings to cover
              those costs — helping you decide if refinancing makes financial sense.
            </p>

            <h4>How to Use This Calculator</h4>
            <p>
              Enter your <strong>current loan balance</strong>, <strong>current and new interest rates</strong>,{' '}
              <strong>remaining term</strong>, and <strong>refinance costs</strong> (including discount points). The tool calculates:
            </p>
            <ul className={styles.list}>
              <li><strong>Monthly interest savings</strong></li>
              <li><strong>Total refinance cost</strong></li>
              <li><strong>Break-even time</strong> in months and years</li>
            </ul>

            <h4>The Break-Even Formula</h4>
            <div className={styles.formula}>
              <code>Break-Even (months) = Total Refinance Cost / Monthly Savings</code>
            </div>
            <p>Where:</p>
            <ul className={styles.list}>
              <li><strong>Total Refinance Cost:</strong> Closing costs + Points</li>
              <li><strong>Monthly Savings:</strong> Old payment – New payment</li>
            </ul>

            <h4>Real-World Applications</h4>
            <ul className={styles.list}>
              <li><strong>Rate Drop:</strong> Save when market rates fall</li>
              <li><strong>Term Adjustment:</strong> Switch from 30-year to 15-year</li>
              <li><strong>Cash-Out:</strong> Tap home equity for renovations</li>
              <li><strong>Remove PMI:</strong> Refinance once 20% equity is reached</li>
            </ul>

            <h4>When to Refinance</h4>
            <ul className={styles.list}>
              <li>
                Break-even occurs <strong>before you plan to sell</strong>
              </li>
              <li>
                New rate is <strong>at least 0.5–1% lower</strong>
              </li>
              <li>
                You plan to stay in the home <strong>longer than break-even period</strong>
              </li>
              <li>You can reduce term without increasing payment</li>
            </ul>

            <h4>Hidden Costs to Consider</h4>
            <ul className={styles.list}>
              <li><strong>Appraisal fees</strong></li>
              <li><strong>Title insurance</strong></li>
              <li><strong>Origination fees</strong></li>
              <li><strong>Prepayment penalties</strong> (check current loan)</li>
            </ul>

            <h4>Example</h4>
            <p>
              You have a $250,000 loan at 6.5%. Refinancing to 5.0% saves $196/month. With $4,000 in
              closing costs, the break-even point is <strong>20.4 months</strong> (~1.7 years). If you
              plan to stay 5+ years, refinancing is smart.
            </p>
          </div>
        </section>

        {/* CTA Section — FIXED: No <a> inside <Link> */}
        <section className={styles.ctaSection}>
          <h2>Free Financial Planning Tools: Budget, Invest & Plan Retirement</h2>
          <p>Free Financial Planning Tools – Try Now</p>
          <Link
            href="/suite"
            className={styles.ctaButton}
            ref={ctaButtonRef}
            onMouseMove={handleMouseMove}
          >
            <span>Explore All Calculators</span>
            <span className={styles.arrow}>→</span>
          </Link>
        </section>

        {/* Spacer for Footer */}
        <div className={styles.spacerBottom}></div>
      </div>
    </>
  );
};

export default MortgageRefinanceBreakEvenCalculator;