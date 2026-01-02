import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
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

  // Financial Literacy Score Calculator History Data
  const financialLiteracyHistory = [
    {
      id: 1,
      title: "History & Development of Financial Literacy Scoring",
      points: [
        "1990s: OECD first measured financial literacy across member countries",
        "2003: US Jump$tart Coalition created standardized financial literacy tests for youth",
        "2005: FINRA Investor Education Foundation launched national financial capability studies",
        "2008: Global Financial Crisis highlighted need for better financial literacy measurement",
        "2012: PISA added financial literacy assessment for 15-year-olds internationally",
        "2015: World Bank created Global Financial Literacy Excellence Center (GFLEC)",
        "2020: Digital financial literacy tools expanded globally during COVID-19 pandemic"
      ]
    },
    {
      id: 2,
      title: "Country Origins & Educational Purpose",
      points: [
        "United States: Jump$tart Coalition pioneered standardized testing for students",
        "United Kingdom: Financial Conduct Authority developed national financial capability surveys",
        "Australia: ASIC created MoneySmart national financial literacy program",
        "Canada: Financial Consumer Agency established national literacy benchmarks",
        "Japan: Central bank developed financial education standards for all ages",
        "Singapore: Monetary Authority created comprehensive financial literacy framework",
        "Purpose: Measure financial knowledge gaps and design targeted education programs"
      ]
    },
    {
      id: 3,
      title: "Key Industries & Monthly Applications",
      points: [
        "Banking: Monthly customer financial health assessments and product recommendations",
        "Insurance: Continuous risk assessment and policyholder education programs",
        "Education: Semester-based financial literacy curriculum evaluations",
        "Government: Quarterly national financial capability tracking and policy development",
        "FinTech: Real-time financial wellness scoring for personalized app experiences",
        "HR Departments: Employee financial wellness program effectiveness measurement",
        "Nonprofits: Program impact assessment for financial education initiatives"
      ]
    },
    {
      id: 4,
      title: "Problem Solving & Financial Impact",
      points: [
        "Reduces personal debt by 30-50% through improved financial decision-making",
        "Increases retirement savings by 40-60% through better planning and investing",
        "Reduces financial stress by 35-55% through increased confidence and control",
        "Improves credit scores by 50-100 points through better debt management",
        "Increases investment participation by 25-45% through understanding of financial markets",
        "Reduces bank fees and charges by $500-$2,000 annually per household",
        "Prevents $10,000+ in lifetime financial mistakes through early education"
      ]
    },
    {
      id: 5,
      title: "Revenue Generation Applications",
      points: [
        "Financial Institutions: Increase customer lifetime value by 25-40% through better engagement",
        "EdTech Companies: Generate $100-$500 per user for financial literacy courses",
        "Consulting Firms: Charge $50,000-$250,000 for corporate financial wellness programs",
        "Government: Save $1B+ annually in social program costs through improved financial stability",
        "Insurance Companies: Reduce claims by 15-25% through better risk management education",
        "HR Tech: Sell $10-$50 per employee monthly for financial wellness platforms",
        "Publishers: Generate $50M+ annually from financial literacy books and materials"
      ]
    },
    {
      id: 6,
      title: "Ordinary People Financial Literacy Calculator Uses",
      points: [
        "Students: Assessing financial knowledge before entering college or workforce",
        "Young Adults: Evaluating readiness for first credit card, loan, or apartment",
        "Couples: Measuring financial compatibility before marriage or joint accounts",
        "Parents: Testing financial knowledge to better teach children about money",
        "Retirees: Assessing retirement planning knowledge and gap identification",
        "Immigrants: Understanding financial system knowledge in new country",
        "Career Changers: Evaluating financial readiness for income changes or entrepreneurship",
        "Debt Management: Identifying knowledge gaps contributing to financial struggles"
      ]
    }
  ];

  return (
    <>
      <Head>
        <html lang="en" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Financial Literacy Score Calculator | Test Your Knowledge</title>
        <meta name="description" content="Test your financial knowledge with our free financial literacy quiz and get a personalized score and grade." />
        <link rel="canonical" href="/financial-literacy-score-calculator" />
      </Head>

      <div className={styles.page}>
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

            <button type="submit" className={styles.submitBtn}>
              <span className={styles.btnText}>Calculate My Score</span>
              <span className={styles.arrow}>→</span>
            </button>
          </form>

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
        </div>

        {/* History Cards Section */}
        <section className={styles.historySection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>Financial Literacy Score Calculator History & Global Applications</h2>
              <p className={styles.sectionSubtitle}>
                Explore the evolution and worldwide impact of financial literacy assessment tools
              </p>
            </div>
            
            <div className={styles.cardsGrid}>
              {financialLiteracyHistory.map((card) => (
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
              <a
                className={styles.ctaButton}
                ref={ctaButtonRef}
                onMouseMove={handleMouseMove}
              >
                <span className={styles.buttonText}>Explore All Calculators</span>
                <span className={styles.arrow}>→</span>
              </a>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default FinancialLiteracyScoreCalculator;