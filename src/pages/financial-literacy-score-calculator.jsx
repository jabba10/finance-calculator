import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'react-helmet';
import styles from './financialliteracyscorecalculator.module.css';

const FinancialLiteracyScoreCalculator = () => {
  const ctaButtonRef = useRef(null);

  const questions = [
    {
      id: 1,
      text: "If you save $100 with a 5% annual interest rate, how much will you have after two years with compound interest?",
      options: ["$105", "$110", "$110.25", "I don't know"],
      correct: 2 // Index of correct answer
    },
    {
      id: 2,
      text: "If inflation is 3% and your savings account earns 2%, what happens to your purchasing power?",
      options: ["Increases", "Decreases", "Stays the same", "I don't know"],
      correct: 1
    },
    {
      id: 3,
      text: "What is diversification in investing?",
      options: [
        "Putting all money in one stock",
        "Spreading investments across different assets",
        "Only investing in real estate",
        "I don't know"
      ],
      correct: 1
    },
    {
      id: 4,
      text: "What does an emergency fund typically cover?",
      options: [
        "Vacation costs",
        "3–6 months of living expenses",
        "Luxury purchases",
        "I don't know"
      ],
      correct: 1
    },
    {
      id: 5,
      text: "Which is generally riskier over the long term?",
      options: ["Stocks", "Savings accounts", "Government bonds", "I don't know"],
      correct: 0
    },
    {
      id: 6,
      text: "What does APR stand for?",
      options: [
        "Annual Payment Rate",
        "Accrued Profit Return",
        "Annual Percentage Rate",
        "I don't know"
      ],
      correct: 2
    },
    {
      id: 7,
      text: "What is a budget?",
      options: [
        "A limit on spending",
        "A plan for income and expenses",
        "A credit card limit",
        "I don't know"
      ],
      correct: 1
    },
    {
      id: 8,
      text: "What is compound interest?",
      options: [
        "Interest earned only on principal",
        "Interest earned on principal and previous interest",
        "Interest that decreases over time",
        "I don't know"
      ],
      correct: 1
    },
    {
      id: 9,
      text: "What is a credit score used for?",
      options: [
        "Measuring investment returns",
        "Determining loan eligibility and interest rates",
        "Tracking bank fees",
        "I don't know"
      ],
      correct: 1
    },
    {
      id: 10,
      text: "What is the main benefit of contributing to a 401(k) or IRA?",
      options: [
        "Immediate cashback",
        "Tax advantages and retirement growth",
        "Free insurance",
        "I don't know"
      ],
      correct: 1
    }
  ];

  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [result, setResult] = useState(null);

  const handleChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = parseInt(value, 10);
    setAnswers(newAnswers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let score = 0;
    answers.forEach((answer, index) => {
      if (answer === questions[index].correct) {
        score++;
      }
    });

    const percentage = (score / questions.length) * 100;
    let grade = '';
    if (percentage >= 90) grade = 'A';
    else if (percentage >= 80) grade = 'B';
    else if (percentage >= 70) grade = 'C';
    else if (percentage >= 60) grade = 'D';
    else grade = 'F';

    setResult({
      score: Math.round(percentage),
      grade,
      correct: score,
      total: questions.length
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

  return (
    <>
      {/* SEO Meta Tags */}
      <Head>
        <title>Financial Literacy Score Calculator | Test Your Knowledge</title>
        <meta
          name="description"
          content="Test your financial knowledge with our free financial literacy quiz and get a personalized score and grade."
        />
        <meta
          name="keywords"
          content="financial literacy test, money quiz, financial knowledge, personal finance assessment, financial education"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/financial-literacy-score-calculator" />
        <meta property="og:title" content="Financial Literacy Score Calculator - Take the Quiz" />
        <meta
          property="og:description"
          content="Answer 10 key questions to assess your financial knowledge and get actionable feedback."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/financial-literacy-score-calculator" />
      </Head>

      <div className={styles.page}>
        <div className={styles.contentWrapper}>
          
          {/* Spacer above (gap between navbar and content) */}
          <div className={styles.spacerTop} />

          {/* Hero Section */}
          <section className={styles.hero}>
            <h1 className={styles.title}>Financial Literacy Score Calculator</h1>
            <p className={styles.subtitle}>
              Test your financial knowledge and get a personalized score in seconds.
            </p>
          </section>

          {/* Calculator Card */}
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Answer 10 key financial questions to assess your financial literacy.
              </p>

              {questions.map((q, index) => (
                <div className={styles.question} key={q.id}>
                  <h3 className={styles.questionText}>{q.text}</h3>
                  <div className={styles.options}>
                    {q.options.map((option, optIndex) => (
                      <label key={optIndex} className={styles.optionLabel}>
                        <input
                          type="radio"
                          name={`q${q.id}`}
                          value={optIndex}
                          checked={answers[index] === optIndex}
                          onChange={(e) => handleChange(index, e.target.value)}
                          required
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <button type="submit" className={styles.ctaButton}>
                <span className={styles.btnText}>Calculate My Score</span>
                <span className={styles.btnArrow}>→</span>
              </button>

              {result && (
                <div className={styles.resultSection}>
                  <h3>Your Financial Literacy Score</h3>
                  <div className={styles.scoreDisplay}>
                    <span className={styles.score}>{result.score}</span>
                    <span className={styles.grade}>Grade: {result.grade}</span>
                  </div>
                  <p className={styles.performance}>
                    You got <strong>{result.correct} out of {result.total}</strong> correct.
                  </p>
                  <div className={styles.feedback}>
                    {result.score >= 80 ? (
                      <p><strong>Excellent!</strong> You have strong financial knowledge. Keep learning and applying it.</p>
                    ) : result.score >= 60 ? (
                      <p><strong>Good effort!</strong> You understand the basics. Focus on compound interest, investing, and budgeting to improve.</p>
                    ) : (
                      <p><strong>Room to grow!</strong> Building financial literacy is one of the best investments you can make. Start with budgeting and emergency funds.</p>
                    )}
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Info Section */}
          <section className={styles.infoSection}>
            <div className={styles.container}>
              <div className={styles.infoCard}>
                <h3>Why Financial Literacy Matters</h3>
                <p>
                  <strong>Financial literacy</strong> is the ability to understand and use financial skills like budgeting, saving, investing, debt management, and retirement planning. Studies show that financially literate individuals are more likely to save, invest, avoid high-cost debt, and retire comfortably.
                </p>

                <h4>How to Use This Calculator</h4>
                <p>
                  Answer 10 multiple-choice questions covering core financial concepts. The tool scores your responses and gives you a <strong>percentage and letter grade</strong> so you can identify knowledge gaps and focus your learning.
                </p>

                <h4>The Financial Literacy Formula</h4>
                <div className={styles.formula}>
                  <code>Score = (Number of Correct Answers / Total Questions) × 100</code>
                </div>
                <p>
                  A score above <strong>80%</strong> indicates strong financial knowledge. Below <strong>60%</strong> means you’d benefit from financial education.
                </p>

                <h4>Key Areas of Financial Literacy</h4>
                <ul className={styles.list}>
                  <li><strong>Budgeting:</strong> Track income and expenses</li>
                  <li><strong>Emergency Fund:</strong> Save 3–6 months of expenses</li>
                  <li><strong>Compound Interest:</strong> Let your money grow over time</li>
                  <li><strong>Investing:</strong> Diversify to reduce risk</li>
                  <li><strong>Debt Management:</strong> Avoid high-interest credit cards</li>
                  <li><strong>Retirement Planning:</strong> Use tax-advantaged accounts</li>
                </ul>

                <h4>Next Steps</h4>
                <ul className={styles.list}>
                  <li>Review incorrect answers and learn the concepts</li>
                  <li>Read personal finance books or blogs</li>
                  <li>Use our free calculators to practice real-world decisions</li>
                  <li>Teach financial skills to children and family</li>
                </ul>

                <h4>Recommended Resources</h4>
                <ul className={styles.list}>
                  <li><strong>"The Psychology of Money"</strong> by Morgan Housel</li>
                  <li><strong>"I Will Teach You To Be Rich"</strong> by Ramit Sethi</li>
                  <li><strong>Khan Academy Personal Finance</strong> (free online courses)</li>
                  <li><strong>NerdWallet & Investopedia</strong> for practical guides</li>
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

export default FinancialLiteracyScoreCalculator;