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
          content="worker classification, employee vs contractor, IRS form SS-8, freelancer classification, employment law tool"
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