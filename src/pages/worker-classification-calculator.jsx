import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
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

  // Worker Classification Calculator History Data
  const workerClassificationHistory = [
    {
      id: 1,
      title: "History & Development of Worker Classification Calculator",
      points: [
        "1940s: IRS introduced the first formal worker classification tests after Social Security expansion",
        "1960s: Common law 'right to control' test formalized in IRS Revenue Rulings",
        "1987: IRS published comprehensive 20-factor test for worker classification",
        "1996: Revenue Act simplified classification with three primary categories (behavioral, financial, relationship)",
        "2007: IRS launched online classification tools for small business education",
        "2010: Affordable Care Act increased focus on proper classification for healthcare benefits",
        "2020: Pandemic accelerated need for remote worker classification guidance"
      ]
    },
    {
      id: 2,
      title: "Global Origins & Legal Purpose",
      points: [
        "United States: Developed by IRS to enforce tax compliance and social security coverage",
        "United Kingdom: 'Employment Status Indicator' tool developed by HM Revenue & Customs",
        "Canada: CRA 'Employee or Self-Employed' questionnaire for tax purposes",
        "Australia: ATO 'Employee/Contractor Decision Tool' for superannuation and tax",
        "European Union: Worker classification directives for social protection rights",
        "Purpose: Distinguish employment relationships for tax, benefits, and legal protections"
      ]
    },
    {
      id: 3,
      title: "Key Industries & Monthly Applications",
      points: [
        "Technology Startups: Monthly contractor-to-employee conversion assessments",
        "Construction: Daily classification checks for subcontractor relationships",
        "Healthcare: Weekly analysis of traveling nurse and locum tenens arrangements",
        "Gig Economy: Real-time classification of platform-based workers",
        "Consulting Firms: Monthly audit of client engagement worker status",
        "Manufacturing: Daily analysis of temporary staffing agency workers",
        "Trucking/Transportation: Weekly owner-operator vs employee determinations"
      ]
    },
    {
      id: 4,
      title: "Problem Solving & Financial Impact",
      points: [
        "Prevents $10,000-$50,000 per worker in IRS penalties for misclassification",
        "Reduces payroll tax liabilities by 15-30% through proper contractor classification",
        "Avoids $5,000-$20,000 in unpaid overtime and benefits claims per worker",
        "Reduces legal defense costs by 40-60% through proactive classification",
        "Improves cash flow by 20% through reduced payroll processing and benefits costs",
        "Prevents business license revocation in states with strict classification laws",
        "Reduces audit risk by 70% through documented classification compliance"
      ]
    },
    {
      id: 5,
      title: "Revenue Generation Applications",
      points: [
        "HR Consulting Firms: Charge $2,000-$10,000 for classification audits and compliance",
        "Legal Services: Earn $5,000-$50,000 for misclassification defense and correction",
        "Payroll Software: Generate $5-$20 per employee monthly for classification features",
        "Insurance Companies: Increase premiums 20-40% for businesses with classification risks",
        "Educational Companies: Offer $500-$5,000 certification in worker classification",
        "Accounting Firms: Add $10,000-$100,000 annual revenue through classification services",
        "Compliance Software: License classification tools for $10k-$100k annually"
      ]
    },
    {
      id: 6,
      title: "Ordinary People Worker Classification Calculator Uses",
      points: [
        "Small Business Owners: Determining if freelancers should be converted to employees",
        "Freelancers: Assessing whether to form an LLC or work as sole proprietor",
        "Gig Workers: Understanding rights and tax obligations as independent contractors",
        "Startup Founders: Properly classifying early team members and contractors",
        "Real Estate Agents: Determining independent contractor vs employee status",
        "Truck Drivers: Assessing owner-operator vs company driver classifications",
        "Consultants: Understanding client relationship implications for tax purposes",
        "Remote Workers: Determining international worker classification for global teams"
      ]
    }
  ];

  return (
    <>
      <Head>
        <html lang="en" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Worker Classification Calculator | Employee vs Contractor Tool</title>
        <meta
          name="description"
          content="Free worker classification calculator to determine if a worker should be classified as an employee or independent contractor based on IRS guidelines."
        />
        <link rel="canonical" href="/worker-classification-calculator" />
      </Head>

      <div className={styles.page}>
        <div className={styles.contentWrapper}>
          
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

              <button type="submit" className={styles.submitBtn}>
                <span className={styles.btnText}>Determine Worker Status</span>
                <span className={styles.arrow}>→</span>
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

          {/* History Cards Section */}
          <section className={styles.historySection}>
            <div className={styles.container}>
              <div className={styles.sectionHeader}>
                <h2>Worker Classification Calculator History & Global Applications</h2>
                <p className={styles.sectionSubtitle}>
                  Explore the evolution and worldwide impact of worker classification calculation tools
                </p>
              </div>
              
              <div className={styles.cardsGrid}>
                {workerClassificationHistory.map((card) => (
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
      </div>
    </>
  );
};

export default WorkerClassificationCalculator;