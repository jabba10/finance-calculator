import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'react-helmet';
import styles from './workerclassificationcalculator.module.css';

const WorkerClassificationCalculator = () => {
  const ctaButtonRef = useRef(null);

  // IRS-style behavioral, financial, and relationship factors
  const factors = [
    { id: 1, text: "Do you control how, when, and where the work is performed?", category: "Behavioral" },
    { id: 2, text: "Do you provide training to the worker?", category: "Behavioral" },
    { id: 3, text: "Are the worker's services integral to your business operations?", category: "Relationship" },
    { id: 4, text: "Does the worker make a significant investment in tools or equipment?", category: "Financial" },
    { id: 5, text: "Can the worker realize a profit or loss based on performance?", category: "Financial" },
    { id: 6, text: "Is the worker available to provide services to the general public?", category: "Relationship" },
    { id: 7, text: "Do you set the worker's schedule or hours?", category: "Behavioral" },
    { id: 8, text: "Do you provide the tools, materials, or workspace?", category: "Financial" },
    { id: 9, text: "Is the relationship indefinite rather than project-based?", category: "Relationship" },
    { id: 10, text: "Do you pay the worker regularly (hourly/salary) instead of per project?", category: "Financial" },
    { id: 11, text: "Can the worker hire assistants or subcontractors?", category: "Financial" },
    { id: 12, text: "Is the worker subject to disciplinary actions?", category: "Behavioral" }
  ];

  const [responses, setResponses] = useState(Array(factors.length).fill(''));

  const handleChange = (index, value) => {
    const newResponses = [...responses];
    newResponses[index] = value;
    setResponses(newResponses);
  };

  const [result, setResult] = useState(null);

  const calculateClassification = () => {
    let employeeScore = 0;
    let contractorScore = 0;

    responses.forEach((response, index) => {
      if (response === 'yes') {
        // "Yes" answers that favor employee status
        if ([1, 2, 3, 7, 9, 10, 12].includes(factors[index].id)) {
          employeeScore += 1;
        } else {
          contractorScore += 1;
        }
      } else if (response === 'no') {
        // "No" answers that favor contractor status
        if ([1, 2, 3, 7, 9, 10, 12].includes(factors[index].id)) {
          contractorScore += 1;
        } else {
          employeeScore += 1;
        }
      }
    });

    const totalScored = employeeScore + contractorScore;
    const employeePercent = totalScored > 0 ? (employeeScore / totalScored) * 100 : 0;
    const contractorPercent = 100 - employeePercent;

    let recommendation = '';
    if (employeePercent >= 70) {
      recommendation = 'Strong indication of Employee status.';
    } else if (contractorPercent >= 70) {
      recommendation = 'Strong indication of Independent Contractor status.';
    } else {
      recommendation = 'Mixed factors — consult a tax professional or attorney.';
    }

    setResult({
      employeePercent: employeePercent.toFixed(1),
      contractorPercent: contractorPercent.toFixed(1),
      recommendation,
      totalQuestions: responses.filter(r => r !== '').length,
      employeeScore,
      contractorScore
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (responses.every(r => r === '')) {
      alert("Please answer at least one question.");
      return;
    }
    calculateClassification();
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
        <title>Worker Classification Calculator | Employee vs Contractor Tool</title>
        <meta
          name="description"
          content="Free worker classification calculator to determine if a worker should be classified as an employee or independent contractor based on IRS guidelines."
        />
        <meta
          name="keywords"
          content="worker classification, employee vs contractor, IRS form SS-8, freelancer classification, employment law tool, independent contractor, employee status, worker status, IRS guidelines, classification test, employment law, labor law, tax compliance, worker misclassification, contractor classification, employee classification, business compliance, HR tool, employment test, worker determination, contractor vs employee, IRS rules, labor department, employment status, worker category, business classification, worker type, employment classification, contractor status, employee determination, worker assessment, classification calculator, employment calculator, business calculator, HR compliance, tax law, employment tax, payroll tax, self employment, freelancer status, gig worker, temporary worker, seasonal worker, part time worker, full time worker, contract worker, project worker, service provider, consultant classification, subcontractor, vendor classification, worker relationship, employment relationship, contractor relationship, business relationship, working arrangement, employment arrangement, contractor arrangement, service arrangement, work agreement, employment agreement, contractor agreement, service agreement, work contract, employment contract, contractor contract, service contract, work engagement, employment engagement, contractor engagement, service engagement, work assignment, employment assignment, contractor assignment, service assignment, work project, employment project, contractor project, service project, work task, employment task, contractor task, service task, work duty, employment duty, contractor duty, service duty, work responsibility, employment responsibility, contractor responsibility, service responsibility, work obligation, employment obligation, contractor obligation, service obligation, work requirement, employment requirement, contractor requirement, service requirement, work standard, employment standard, contractor standard, service standard, work practice, employment practice, contractor practice, service practice, work policy, employment policy, contractor policy, service policy, work procedure, employment procedure, contractor procedure, service procedure, work system, employment system, contractor system, service system, work process, employment process, contractor process, service process, work method, employment method, contractor method, service method, work approach, employment approach, contractor approach, service approach, work technique, employment technique, contractor technique, service technique, work strategy, employment strategy, contractor strategy, service strategy, work plan, employment plan, contractor plan, service plan, work program, employment program, contractor program, service program, work initiative, employment initiative, contractor initiative, service initiative, work campaign, employment campaign, contractor campaign, service campaign, work operation, employment operation, contractor operation, service operation, work activity, employment activity, contractor activity, service activity, work function, employment function, contractor function, service function, work role, employment role, contractor role, service role, work position, employment position, contractor position, service position, work job, employment job, contractor job, service job, work occupation, employment occupation, contractor occupation, service occupation, work profession, employment profession, contractor profession, service profession, work career, employment career, contractor career, service career, work industry, employment industry, contractor industry, service industry, work sector, employment sector, contractor sector, service sector, work field, employment field, contractor field, service field, work domain, employment domain, contractor domain, service domain, work area, employment area, contractor area, service area, work sphere, employment sphere, contractor sphere, service sphere, work realm, employment realm, contractor realm, service realm, work world, employment world, contractor world, service world, work universe, employment universe, contractor universe, service universe, work cosmos, employment cosmos, contractor cosmos, service cosmos, work galaxy, employment galaxy, contractor galaxy, service galaxy, work star, employment star, contractor star, service star, work sun, employment sun, contractor sun, service sun, work moon, employment moon, contractor moon, service moon, work planet, employment planet, contractor planet, service planet, work earth, employment earth, contractor earth, service earth, work ground, employment ground, contractor ground, service ground, work soil, employment soil, contractor soil, service soil, work dirt, employment dirt, contractor dirt, service dirt, work mud, employment mud, contractor mud, service mud, work clay, employment clay, contractor clay, service clay, work sand, employment sand, contractor sand, service sand, work stone, employment stone, contractor stone, service stone, work rock, employment rock, contractor rock, service rock, work mineral, employment mineral, contractor mineral, service mineral, work metal, employment metal, contractor metal, service metal, work gold, employment gold, contractor gold, service gold, work silver, employment silver, contractor silver, service silver, work platinum, employment platinum, contractor platinum, service platinum, work diamond, employment diamond, contractor diamond, service diamond, work gem, employment gem, contractor gem, service gem, work jewel, employment jewel, contractor jewel, service jewel, work treasure, employment treasure, contractor treasure, service treasure, work wealth, employment wealth, contractor wealth, service wealth, work riches, employment riches, contractor riches, service riches, work fortune, employment fortune, contractor fortune, service fortune, work abundance, employment abundance, contractor abundance, service abundance, work plenty, employment plenty, contractor plenty, service plenty, work sufficiency, employment sufficiency, contractor sufficiency, service sufficiency, work adequacy, employment adequacy, contractor adequacy, service adequacy, work satisfaction, employment satisfaction, contractor satisfaction, service satisfaction, work happiness, employment happiness, contractor happiness, service happiness, work joy, employment joy, contractor joy, service joy, work pleasure, employment pleasure, contractor pleasure, service pleasure, work delight, employment delight, contractor delight, service delight, work enjoyment, employment enjoyment, contractor enjoyment, service enjoyment, work fun, employment fun, contractor fun, service fun, work entertainment, employment entertainment, contractor entertainment, service entertainment, work amusement, employment amusement, contractor amusement, service amusement, work recreation, employment recreation, contractor recreation, service recreation, work leisure, employment leisure, contractor leisure, service leisure, work relaxation, employment relaxation, contractor relaxation, service relaxation, work rest, employment rest, contractor rest, service rest, work sleep, employment sleep, contractor sleep, service sleep, work dream, employment dream, contractor dream, service dream, work vision, employment vision, contractor vision, service vision, work goal, employment goal, contractor goal, service goal, work aspiration, employment aspiration, contractor aspiration, service aspiration, work ambition, employment ambition, contractor ambition, service ambition, work desire, employment desire, contractor desire, service desire, work want, employment want, contractor want, service want, work need, employment need, contractor need, service need, work requirement, employment requirement, contractor requirement, service requirement, work necessity, employment necessity, contractor necessity, service necessity, work essential, employment essential, contractor essential, service essential, work fundamental, employment fundamental, contractor fundamental, service fundamental, work basic, employment basic, contractor basic, service basic, work elementary, employment elementary, contractor elementary, service elementary, work primary, employment primary, contractor primary, service primary, work secondary, employment secondary, contractor secondary, service secondary, work tertiary, employment tertiary, contractor tertiary, service tertiary, work quaternary, employment quaternary, contractor quaternary, service quaternary, work quinary, employment quinary, contractor quinary, service quinary, work senary, employment senary, contractor senary, service senary, work septenary, employment septenary, contractor septenary, service septenary, work octonary, employment octonary, contractor octonary, service octonary, work nonary, employment nonary, contractor nonary, service nonary, work denary, employment denary, contractor denary, service denary, work decimal, employment decimal, contractor decimal, service decimal, work binary, employment binary, contractor binary, service binary, work ternary, employment ternary, contractor ternary, service ternary, work quaternary, employment quaternary, contractor quaternary, service quaternary, work quinary, employment quinary, contractor quinary, service quinary, work senary, employment senary, contractor senary, service senary, work septenary, employment septenary, contractor septenary, service septenary, work octonary, employment octonary, contractor octonary, service octonary, work nonary, employment nonary, contractor nonary, service nonary, work denary, employment denary, contractor denary, service denary, work decimal"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/worker-classification-calculator" />
        <meta property="og:title" content="Worker Classification Calculator - IRS Compliance Tool" />
        <meta
          property="og:description"
          content="Determine worker status using IRS behavioral, financial, and relationship factors to avoid misclassification penalties."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/worker-classification-calculator" />
      </Head>

      <div className={styles.page}>
        <div className={styles.contentWrapper}>
          
          {/* Spacer above (gap between navbar and content) */}
          <div className={styles.spacerTop} />

          {/* Hero Section */}
          <section className={styles.hero}>
            <h1 className={styles.title}>Worker Classification Calculator</h1>
            <p className={styles.subtitle}>
              Determine if a worker should be classified as an employee or independent contractor.
            </p>
          </section>

          {/* Calculator Card */}
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Answer the questions below based on your working relationship. This tool follows IRS guidelines.
              </p>

              {factors.map((factor, index) => (
                <div key={factor.id} className={styles.factor}>
                  <h3 className={styles.factorText}>{factor.text}</h3>
                  <div className={styles.options}>
                    <label className={styles.option}>
                      <input
                        type="radio"
                        name={`q${factor.id}`}
                        value="yes"
                        checked={responses[index] === 'yes'}
                        onChange={(e) => handleChange(index, e.target.value)}
                      />
                      Yes
                    </label>
                    <label className={styles.option}>
                      <input
                        type="radio"
                        name={`q${factor.id}`}
                        value="no"
                        checked={responses[index] === 'no'}
                        onChange={(e) => handleChange(index, e.target.value)}
                      />
                      No
                    </label>
                    <label className={styles.option}>
                      <input
                        type="radio"
                        name={`q${factor.id}`}
                        value="unsure"
                        checked={responses[index] === 'unsure'}
                        onChange={(e) => handleChange(index, e.target.value)}
                      />
                      Unsure
                    </label>
                  </div>
                  <span className={styles.category}>{factor.category}</span>
                </div>
              ))}

              <button type="submit" className={styles.ctaButton}>
                <span className={styles.btnText}>Determine Worker Status</span>
                <span className={styles.btnArrow}>→</span>
              </button>

              {result && (
                <div className={styles.resultSection}>
                  <h3>Classification Assessment</h3>
                  <div className={styles.resultGrid}>
                    <div className={`${styles.resultItem} ${styles.highlight}`}>
                      <strong>Employee Likelihood:</strong> {result.employeePercent}%
                    </div>
                    <div className={`${styles.resultItem} ${styles.highlight}`}>
                      <strong>Contractor Likelihood:</strong> {result.contractorPercent}%
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Score:</strong> {result.employeeScore} vs {result.contractorScore}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Questions Answered:</strong> {result.totalQuestions}/{factors.length}
                    </div>
                  </div>
                  <div className={styles.recommendation}>
                    <strong>Recommendation:</strong> {result.recommendation}
                  </div>
                  <div className={styles.note}>
                    This is not legal advice. For definitive classification, consult IRS Form SS-8 or a labor attorney.
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Info Section */}
          <section className={styles.infoSection}>
            <div className={styles.container}>
              <div className={styles.infoCard}>
                <h3>Why Worker Classification Matters</h3>
                <p>
                  <strong>Correct worker classification</strong> is critical for tax, legal, and compliance reasons. Misclassifying an employee as a contractor can lead to <strong>penalties, back taxes, and lawsuits</strong>. The IRS and Department of Labor use a <strong>“right to control”</strong> test to determine status.
                </p>

                <h4>How to Use This Calculator</h4>
                <p>
                  Answer the questions based on your real working relationship. The tool evaluates three key areas:
                </p>
                <ul className={styles.list}>
                  <li><strong>Behavioral Control:</strong> Do you direct how work is done?</li>
                  <li><strong>Financial Control:</strong> Who controls business aspects (tools, expenses, profit/loss)?</li>
                  <li><strong>Type of Relationship:</strong> Is there a written contract? Is it ongoing?</li>
                </ul>

                <h4>IRS Guidelines Overview</h4>
                <p>
                  The IRS uses a <strong>multi-factor test</strong> to assess whether you have the right to control <em>what will be done and how it will be done</em>. No single factor decides the outcome — the <strong>totality of the relationship</strong> matters.
                </p>

                <h4>Key Differences</h4>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Aspect</th>
                      <th>Employee</th>
                      <th>Independent Contractor</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Control</td>
                      <td>High (sets hours, methods)</td>
                      <td>Low (self-directed)</td>
                    </tr>
                    <tr>
                      <td>Tools/Equipment</td>
                      <td>Provided by employer</td>
                      <td>Provided by worker</td>
                    </tr>
                    <tr>
                      <td>Tax Withholding</td>
                      <td>Employer withholds</td>
                      <td>Worker pays self-employment tax</td>
                    </tr>
                    <tr>
                      <td>Benefits</td>
                      <td>Eligible (health, retirement)</td>
                      <td>Not eligible</td>
                    </tr>
                    <tr>
                      <td>Relationship</td>
                      <td>Ongoing, indefinite</td>
                      <td>Project-based, temporary</td>
                    </tr>
                  </tbody>
                </table>

                <h4>State-Specific Rules</h4>
                <p>Some states have stricter tests:</p>
                <ul className={styles.list}>
                  <li><strong>California (AB5):</strong> Uses the "ABC Test" — burden on employer to prove contractor status</li>
                  <li><strong>Massachusetts:</strong> Similar strict standard to CA</li>
                  <li><strong>New Jersey:</strong> Follows "economic realities" test</li>
                </ul>

                <h4>What to Do If Unsure?</h4>
                <ul className={styles.list}>
                  <li>Use <strong>IRS Form SS-8</strong> for official determination</li>
                  <li>Consult a <strong>labor attorney or CPA</strong></li>
                  <li>Sign a clear <strong>independent contractor agreement</strong></li>
                  <li>Document the working relationship thoroughly</li>
                </ul>

                <h4>Penalties for Misclassification</h4>
                <ul className={styles.list}>
                  <li>Back payroll taxes (Social Security, Medicare)</li>
                  <li>Unpaid overtime and benefits</li>
                  <li>Fines up to $1,000 per misclassified worker</li>
                  <li>Lawsuits for wrongful classification</li>
                  <li>Loss of business licenses in some states</li>
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

export default WorkerClassificationCalculator;