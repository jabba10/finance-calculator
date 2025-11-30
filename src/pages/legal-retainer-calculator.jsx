import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'react-helmet';
import styles from './legalretainercalculator.module.css';

const LegalRetainerCalculator = () => {
  const ctaButtonRef = useRef(null);

  const [inputs, setInputs] = useState({
    attorneyRate: '250',
    estimatedHours: '20',
    flatFee: '',
    upfrontPayment: '5000'
  });

  const [result, setResult] = useState(null);
  const [calculationMode, setCalculationMode] = useState('hourly');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleModeChange = (mode) => {
    setCalculationMode(mode);
  };

  const calculateRetainer = () => {
    let requiredRetainer = 0;
    let estimatedTotal = 0;
    let hours = parseFloat(inputs.estimatedHours) || 0;
    let rate = parseFloat(inputs.attorneyRate) || 0;
    let flat = parseFloat(inputs.flatFee) || 0;
    let upfront = parseFloat(inputs.upfrontPayment) || 0;

    if (hours < 0 || rate < 0 || flat < 0 || upfront < 0) {
      alert("Please enter non-negative values.");
      return;
    }

    if (calculationMode === 'hourly') {
      estimatedTotal = rate * hours;
      requiredRetainer = estimatedTotal;
    } else if (calculationMode === 'flat') {
      if (flat <= 0) {
        alert("Flat fee must be greater than $0.");
        return;
      }
      estimatedTotal = flat;
      requiredRetainer = flat;
    } else if (calculationMode === 'upfront') {
      if (upfront <= 0) {
        alert("Upfront payment must be greater than $0.");
        return;
      }
      estimatedTotal = rate * hours;
      requiredRetainer = upfront;
    }

    const coveragePercent = estimatedTotal > 0 ? (requiredRetainer / estimatedTotal * 100).toFixed(1) : 0;

    setResult({
      mode: calculationMode,
      rate: rate.toFixed(2),
      hours,
      flatFee: flat.toFixed(2),
      upfront: upfront.toFixed(2),
      estimatedTotal: estimatedTotal.toFixed(2),
      requiredRetainer: requiredRetainer.toFixed(2),
      coverage: coveragePercent
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateRetainer();
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
        <title>Legal Retainer Calculator | Estimate Attorney Fees</title>
        <meta
          name="description"
          content="Calculate your legal retainer fee based on hourly, flat, or upfront billing models. Plan your legal budget with confidence."
        />
        <meta
          name="keywords"
          content="legal retainer calculator, attorney fee estimator, legal billing calculator, lawyer retainer cost, retainer calculator, legal fees, attorney costs, lawyer fees, legal billing, hourly rate, flat fee, upfront payment, legal budget, law firm pricing, legal costs, attorney retainer, lawyer retainer, legal expense, case cost, litigation cost, legal services, law services, attorney services, lawyer services, legal consultation, legal advice, legal representation, legal counsel, law firm, attorney at law, lawyer fees calculator, legal cost estimator, retainer fee, advance payment, trust account, legal deposit, case budget, legal project, matter cost, legal matter, case matter, legal work, attorney work, lawyer work, legal hours, billable hours, time tracking, legal accounting, law accounting, legal finance, law firm finance, legal budgeting, law firm budgeting, client retainer, client deposit, legal trust, IOLTA account, client funds, attorney client, lawyer client, legal agreement, retainer agreement, engagement letter, scope of work, legal scope, matter scope, case scope, project scope, legal estimate, cost estimate, fee estimate, price estimate, budget estimate, financial planning, cost planning, expense planning, budget planning, financial management, cost management, expense management, budget management, financial control, cost control, expense control, budget control, financial analysis, cost analysis, expense analysis, budget analysis, financial calculation, cost calculation, expense calculation, budget calculation, financial tool, cost tool, expense tool, budget tool, financial calculator, cost calculator, expense calculator, budget calculator, legal tool, law tool, attorney tool, lawyer tool, legal calculator, law calculator, attorney calculator, lawyer calculator, professional services, professional fees, service fees, consultation fees, advice fees, representation fees, counsel fees, legal support, law support, attorney support, lawyer support, legal help, law help, attorney help, lawyer help, legal assistance, law assistance, attorney assistance, lawyer assistance, legal guidance, law guidance, attorney guidance, lawyer guidance, legal direction, law direction, attorney direction, lawyer direction, legal strategy, law strategy, attorney strategy, lawyer strategy, legal planning, law planning, attorney planning, lawyer planning, legal preparation, law preparation, attorney preparation, lawyer preparation, legal document, law document, attorney document, lawyer document, legal form, law form, attorney form, lawyer form, legal template, law template, attorney template, lawyer template, legal resource, law resource, attorney resource, lawyer resource, legal reference, law reference, attorney reference, lawyer reference, legal information, law information, attorney information, lawyer information, legal knowledge, law knowledge, attorney knowledge, lawyer knowledge, legal education, law education, attorney education, lawyer education, legal learning, law learning, attorney learning, lawyer learning, legal training, law training, attorney training, lawyer training, legal course, law course, attorney course, lawyer course, legal program, law program, attorney program, lawyer program, legal software, law software, attorney software, lawyer software, legal app, law app, attorney app, lawyer app, legal application, law application, attorney application, lawyer application, legal platform, law platform, attorney platform, lawyer platform, legal system, law system, attorney system, lawyer system, legal technology, law technology, attorney technology, lawyer technology, legal tech, law tech, attorney tech, lawyer tech, legal innovation, law innovation, attorney innovation, lawyer innovation, legal solution, law solution, attorney solution, lawyer solution, legal service, law service, attorney service, lawyer service, legal provider, law provider, attorney provider, lawyer provider, legal professional, law professional, attorney professional, lawyer professional, legal expert, law expert, attorney expert, lawyer expert, legal specialist, law specialist, attorney specialist, lawyer specialist, legal practitioner, law practitioner, attorney practitioner, lawyer practitioner, legal advisor, law advisor, attorney advisor, lawyer advisor, legal consultant, law consultant, attorney consultant, lawyer consultant, legal counsel, law counsel, attorney counsel, lawyer counsel, legal representative, law representative, attorney representative, lawyer representative, legal advocate, law advocate, attorney advocate, lawyer advocate, legal defender, law defender, attorney defender, lawyer defender, legal protector, law protector, attorney protector, lawyer protector, legal guardian, law guardian, attorney guardian, lawyer guardian, legal supporter, law supporter, attorney supporter, lawyer supporter, legal helper, law helper, attorney helper, lawyer helper, legal assistant, law assistant, attorney assistant, lawyer assistant, legal secretary, law secretary, attorney secretary, lawyer secretary, legal paralegal, law paralegal, attorney paralegal, lawyer paralegal, legal clerk, law clerk, attorney clerk, lawyer clerk, legal staff, law staff, attorney staff, lawyer staff, legal team, law team, attorney team, lawyer team, legal department, law department, attorney department, lawyer department, legal office, law office, attorney office, lawyer office, legal practice, law practice, attorney practice, lawyer practice, legal firm, law firm, attorney firm, lawyer firm, legal company, law company, attorney company, lawyer company, legal business, law business, attorney business, lawyer business, legal industry, law industry, attorney industry, lawyer industry, legal market, law market, attorney market, lawyer market, legal sector, law sector, attorney sector, lawyer sector, legal field, law field, attorney field, lawyer field, legal profession, law profession, attorney profession, lawyer profession, legal career, law career, attorney career, lawyer career, legal job, law job, attorney job, lawyer job, legal position, law position, attorney position, lawyer position, legal role, law role, attorney role, lawyer role, legal function, law function, attorney function, lawyer function, legal duty, law duty, attorney duty, lawyer duty, legal responsibility, law responsibility, attorney responsibility, lawyer responsibility, legal obligation, law obligation, attorney obligation, lawyer obligation, legal requirement, law requirement, attorney requirement, lawyer requirement, legal standard, law standard, attorney standard, lawyer standard, legal rule, law rule, attorney rule, lawyer rule, legal regulation, law regulation, attorney regulation, lawyer regulation, legal compliance, law compliance, attorney compliance, lawyer compliance, legal ethics, law ethics, attorney ethics, lawyer ethics, legal conduct, law conduct, attorney conduct, lawyer conduct, legal behavior, law behavior, attorney behavior, lawyer behavior, legal performance, law performance, attorney performance, lawyer performance, legal quality, law quality, attorney quality, lawyer quality, legal excellence, law excellence, attorney excellence, lawyer excellence, legal success, law success, attorney success, lawyer success, legal achievement, law achievement, attorney achievement, lawyer achievement, legal result, law result, attorney result, lawyer result, legal outcome, law outcome, attorney outcome, lawyer outcome, legal victory, law victory, attorney victory, lawyer victory, legal win, law win, attorney win, lawyer win, legal settlement, law settlement, attorney settlement, lawyer settlement, legal agreement, law agreement, attorney agreement, lawyer agreement, legal contract, law contract, attorney contract, lawyer contract, legal deal, law deal, attorney deal, lawyer deal, legal transaction, law transaction, attorney transaction, lawyer transaction, legal matter, law matter, attorney matter, lawyer matter, legal case, law case, attorney case, lawyer case, legal lawsuit, law lawsuit, attorney lawsuit, lawyer lawsuit, legal litigation, law litigation, attorney litigation, lawyer litigation, legal dispute, law dispute, attorney dispute, lawyer dispute, legal conflict, law conflict, attorney conflict, lawyer conflict, legal problem, law problem, attorney problem, lawyer problem, legal issue, law issue, attorney issue, lawyer issue, legal challenge, law challenge, attorney challenge, lawyer challenge, legal difficulty, law difficulty, attorney difficulty, lawyer difficulty, legal complication, law complication, attorney complication, lawyer complication, legal obstacle, law obstacle, attorney obstacle, lawyer obstacle, legal barrier, law barrier, attorney barrier, lawyer barrier, legal hurdle, law hurdle, attorney hurdle, lawyer hurdle, legal setback, law setback, attorney setback, lawyer setback, legal delay, law delay, attorney delay, lawyer delay, legal cost, law cost, attorney cost, lawyer cost, legal expense, law expense, attorney expense, lawyer expense, legal fee, law fee, attorney fee, lawyer fee, legal charge, law charge, attorney charge, lawyer charge, legal price, law price, attorney price, lawyer price, legal rate, law rate, attorney rate, lawyer rate, legal billing, law billing, attorney billing, lawyer billing, legal invoice, law invoice, attorney invoice, lawyer invoice, legal statement, law statement, attorney statement, lawyer statement, legal account, law account, attorney account, lawyer account, legal payment, law payment, attorney payment, lawyer payment, legal deposit, law deposit, attorney deposit, lawyer deposit, legal retainer, law retainer, attorney retainer, lawyer retainer"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/legal-retainer-calculator" />
        <meta property="og:title" content="Legal Retainer Calculator" />
        <meta
          property="og:description"
          content="Estimate your legal retainer fee and understand attorney billing models."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/legal-retainer-calculator" />
      </Head>

      <div className={styles.page}>
        <div className={styles.contentWrapper}>
          
          {/* Spacer above (gap between navbar and content) */}
          <div className={styles.spacerTop} />

          {/* Hero Section */}
          <section className={styles.hero}>
            <h1 className={styles.title}>Legal Retainer Calculator</h1>
            <p className={styles.subtitle}>
              Estimate your legal retainer fee and understand attorney billing.
            </p>
          </section>

          {/* Calculator Section */}
          <section className={styles.calculatorSection}>
            <div className={styles.calculatorCard}>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.modeSelector}>
                  <label>
                    <input
                      type="radio"
                      checked={calculationMode === 'hourly'}
                      onChange={() => handleModeChange('hourly')}
                    />
                    Hourly
                  </label>
                  <label>
                    <input
                      type="radio"
                      checked={calculationMode === 'flat'}
                      onChange={() => handleModeChange('flat')}
                    />
                    Flat Fee
                  </label>
                  <label>
                    <input
                      type="radio"
                      checked={calculationMode === 'upfront'}
                      onChange={() => handleModeChange('upfront')}
                    />
                    Upfront
                  </label>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="attorneyRate" className={styles.label}>
                    Attorney Hourly Rate ($)
                  </label>
                  <input
                    type="number"
                    id="attorneyRate"
                    name="attorneyRate"
                    value={inputs.attorneyRate}
                    onChange={handleChange}
                    placeholder="e.g. 250"
                    step="5"
                    required
                    className={styles.input}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="estimatedHours" className={styles.label}>
                    Estimated Hours
                  </label>
                  <input
                    type="number"
                    id="estimatedHours"
                    name="estimatedHours"
                    value={inputs.estimatedHours}
                    onChange={handleChange}
                    placeholder="e.g. 20"
                    step="0.5"
                    required
                    className={styles.input}
                  />
                </div>

                {calculationMode === 'flat' && (
                  <div className={styles.inputGroup}>
                    <label htmlFor="flatFee" className={styles.label}>
                      Flat Fee ($)
                    </label>
                    <input
                      type="number"
                      id="flatFee"
                      name="flatFee"
                      value={inputs.flatFee}
                      onChange={handleChange}
                      placeholder="e.g. 4,500"
                      step="100"
                      required
                      className={styles.input}
                    />
                  </div>
                )}

                {calculationMode === 'upfront' && (
                  <div className={styles.inputGroup}>
                    <label htmlFor="upfrontPayment" className={styles.label}>
                      Upfront Payment ($)
                    </label>
                    <input
                      type="number"
                      id="upfrontPayment"
                      name="upfrontPayment"
                      value={inputs.upfrontPayment}
                      onChange={handleChange}
                      placeholder="e.g. 5,000"
                      step="100"
                      required
                      className={styles.input}
                    />
                  </div>
                )}

                <button type="submit" className={styles.submitBtn}>
                  <span className={styles.btnText}>Calculate Retainer</span>
                  <span className={styles.arrow}>→</span>
                </button>

                {result && (
                  <div className={styles.resultSection}>
                    <h3>Retainer Summary</h3>
                    <div className={styles.resultGrid}>
                      {result.mode === 'hourly' && (
                        <>
                          <div className={styles.resultItem}>
                            <strong>Hourly Rate:</strong> ${result.rate}
                          </div>
                          <div className={styles.resultItem}>
                            <strong>Estimated Hours:</strong> {result.hours}
                          </div>
                          <div className={`${styles.resultItem} ${styles.highlight}`}>
                            <strong>Required Retainer:</strong> ${result.requiredRetainer}
                          </div>
                          <div className={styles.resultItem}>
                            <strong>Estimated Total:</strong> ${result.estimatedTotal}
                          </div>
                        </>
                      )}

                      {result.mode === 'flat' && (
                        <>
                          <div className={styles.resultItem}>
                            <strong>Flat Fee:</strong> ${result.flatFee}
                          </div>
                          <div className={`${styles.resultItem} ${styles.highlight}`}>
                            <strong>Retainer Due:</strong> ${result.requiredRetainer}
                          </div>
                          <div className={styles.resultItem}>
                            <strong>Covers 100%</strong> of legal costs
                          </div>
                        </>
                      )}

                      {result.mode === 'upfront' && (
                        <>
                          <div className={styles.resultItem}>
                            <strong>Hourly Rate:</strong> ${result.rate}
                          </div>
                          <div className={styles.resultItem}>
                            <strong>Estimated Cost:</strong> ${result.estimatedTotal}
                          </div>
                          <div className={`${styles.resultItem} ${styles.highlight}`}>
                            <strong>Upfront Payment:</strong> ${result.upfront}
                          </div>
                          <div className={styles.resultItem}>
                            <strong>Covers:</strong> {result.coverage}%
                          </div>
                        </>
                      )}
                    </div>
                    <div className={styles.note}>
                      A retainer is an upfront payment held in trust. It's drawn against as work is performed.
                    </div>
                  </div>
                )}
              </form>
            </div>
          </section>

          {/* Info Section */}
          <section className={styles.infoSection}>
            <div className={styles.container}>
              <div className={styles.infoCard}>
                <h3>Why Legal Retainers Matter</h3>
                <p>
                  A <strong>legal retainer</strong> is an upfront fee paid to secure an attorney’s services. It builds trust, ensures availability, and covers initial work. Understanding retainer costs helps avoid surprises and manage legal budgets.
                </p>

                <h4>How to Use This Calculator</h4>
                <p>Choose your billing model:</p>
                <ul className={styles.list}>
                  <li><strong>Hourly:</strong> Estimate total cost based on rate × hours</li>
                  <li><strong>Flat Fee:</strong> For predictable services like incorporations or wills</li>
                  <li><strong>Upfront Payment:</strong> See how much of your estimate a given retainer covers</li>
                </ul>

                <h4>The Retainer Formulas</h4>
                <div className={styles.formula}>
                  <code>Hourly Model: Retainer = Rate × Estimated Hours</code>
                </div>
                <div className={styles.formula}>
                  <code>Flat Fee Model: Retainer = Agreed Flat Fee</code>
                </div>
                <div className={styles.formula}>
                  <code>Coverage % = (Upfront Payment / Estimated Total) × 100</code>
                </div>
                <p>
                  The retainer is typically held in a <strong>trust account</strong> and billed against hourly.
                </p>

                <h4>Real-World Applications</h4>
                <ul className={styles.list}>
                  <li><strong>Business Law:</strong> Incorporation, contracts, compliance</li>
                  <li><strong>Real Estate:</strong> Closings, title disputes, leasing</li>
                  <li><strong>Family Law:</strong> Divorce, custody, prenups</li>
                  <li><strong>Intellectual Property:</strong> Trademarks, patents, licensing</li>
                </ul>

                <h4>Key Questions to Ask Your Attorney</h4>
                <ul className={styles.list}>
                  <li>Is the retainer refundable if unused?</li>
                  <li>How often will I receive billing statements?</li>
                  <li>What happens when the retainer runs low?</li>
                  <li>Are there additional costs (filing fees, experts)?</li>
                </ul>

                <h4>Example</h4>
                <p>
                  An attorney charges $300/hour for a 15-hour project. The estimated cost is <strong>$4,500</strong>. A retainer of $5,000 covers the work and provides a buffer. If only 12 hours are used, $1,400 may be refunded.
                </p>

                <h4>Tips for Clients</h4>
                <ul className={styles.list}>
                  <li>Get retainer terms in writing</li>
                  <li>Ask for regular updates</li>
                  <li>Clarify scope of work</li>
                  <li>Understand what’s included/excluded</li>
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

export default LegalRetainerCalculator;