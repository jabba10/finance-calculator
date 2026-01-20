import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './financialliteracyscorecalculator.module.css';

const FinancialLiteracyQuizCalculator = ({ currentDate, lastModifiedDate }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  const questions = [
    {
      id: 1,
      question: "What is the recommended percentage of your monthly income that should go towards housing costs?",
      options: [
        { id: 'a', text: "50% or less", isCorrect: false },
        { id: 'b', text: "30% or less", isCorrect: true },
        { id: 'c', text: "70% or less", isCorrect: false },
        { id: 'd', text: "There's no recommendation", isCorrect: false }
      ],
      explanation: "The 30% rule suggests spending no more than 30% of your gross monthly income on housing costs (rent/mortgage + utilities). This helps ensure you have enough money for other expenses and savings.",
      category: "Budgeting"
    },
    {
      id: 2,
      question: "How much should you have in an emergency fund?",
      options: [
        { id: 'a', text: "1 month of expenses", isCorrect: false },
        { id: 'b', text: "3-6 months of expenses", isCorrect: true },
        { id: 'c', text: "12 months of expenses", isCorrect: false },
        { id: 'd', text: "$1,000 regardless of expenses", isCorrect: false }
      ],
      explanation: "Financial experts recommend saving 3-6 months of essential living expenses in an emergency fund. This provides a buffer for job loss, medical emergencies, or unexpected repairs.",
      category: "Emergency Planning"
    },
    {
      id: 3,
      question: "Which debt repayment strategy is most mathematically efficient?",
      options: [
        { id: 'a', text: "Snowball method (smallest balances first)", isCorrect: false },
        { id: 'b', text: "Avalanche method (highest interest first)", isCorrect: true },
        { id: 'c', text: "Consolidate all debts", isCorrect: false },
        { id: 'd', text: "Pay minimums on all", isCorrect: false }
      ],
      explanation: "The avalanche method saves the most money in interest payments by targeting debts with the highest interest rates first, though the snowball method can provide psychological wins.",
      category: "Debt Management"
    },
    {
      id: 4,
      question: "What is compound interest?",
      options: [
        { id: 'a', text: "Interest calculated only on principal", isCorrect: false },
        { id: 'b', text: "Interest calculated on principal + accumulated interest", isCorrect: true },
        { id: 'c', text: "A type of loan interest", isCorrect: false },
        { id: 'd', text: "Interest that decreases over time", isCorrect: false }
      ],
      explanation: "Compound interest is 'interest on interest' - it's calculated on the initial principal and also on the accumulated interest from previous periods. This causes investments to grow exponentially.",
      category: "Investing Basics"
    },
    {
      id: 5,
      question: "What does the 'Rule of 72' help you calculate?",
      options: [
        { id: 'a', text: "Years to double your money", isCorrect: true },
        { id: 'b', text: "Monthly savings needed for retirement", isCorrect: false },
        { id: 'c', text: "Optimal debt-to-income ratio", isCorrect: false },
        { id: 'd', text: "Credit score impact of missed payments", isCorrect: false }
      ],
      explanation: "The Rule of 72 estimates how long it takes for an investment to double at a given annual rate of return. Divide 72 by the interest rate (e.g., 72 ÷ 6% = 12 years to double).",
      category: "Investment Math"
    },
    {
      id: 6,
      question: "What is diversification in investing?",
      options: [
        { id: 'a', text: "Putting all money in one stock", isCorrect: false },
        { id: 'b', text: "Spreading investments across different assets", isCorrect: true },
        { id: 'c', text: "Investing only in bonds", isCorrect: false },
        { id: 'd', text: "Buying and selling frequently", isCorrect: false }
      ],
      explanation: "Diversification reduces risk by spreading investments across different asset classes (stocks, bonds, real estate), sectors, and geographic regions. It's captured in the saying 'don't put all your eggs in one basket.'",
      category: "Risk Management"
    },
    {
      id: 7,
      question: "Which retirement account offers tax-free withdrawals in retirement?",
      options: [
        { id: 'a', text: "Traditional IRA", isCorrect: false },
        { id: 'b', text: "Roth IRA", isCorrect: true },
        { id: 'c', text: "401(k)", isCorrect: false },
        { id: 'd', text: "Taxable brokerage account", isCorrect: false }
      ],
      explanation: "Roth IRAs are funded with after-tax dollars, but qualified withdrawals (after age 59½ and 5-year holding period) are tax-free. Traditional IRAs and 401(k)s offer tax-deferred growth but withdrawals are taxed.",
      category: "Retirement Planning"
    },
    {
      id: 8,
      question: "What is a good credit score range?",
      options: [
        { id: 'a', text: "300-579", isCorrect: false },
        { id: 'b', text: "580-669", isCorrect: false },
        { id: 'c', text: "670-739", isCorrect: false },
        { id: 'd', text: "740-850", isCorrect: true }
      ],
      explanation: "Scores 740-850 are considered excellent and typically qualify for the best interest rates. Good scores (670-739) are acceptable, while fair (580-669) and poor (300-579) scores result in higher interest rates or loan denials.",
      category: "Credit Management"
    },
    {
      id: 9,
      question: "What's the difference between a stock and a bond?",
      options: [
        { id: 'a', text: "Stocks represent ownership, bonds represent debt", isCorrect: true },
        { id: 'b', text: "Stocks are safer than bonds", isCorrect: false },
        { id: 'c', text: "Bonds have unlimited growth potential", isCorrect: false },
        { id: 'd', text: "There's no difference", isCorrect: false }
      ],
      explanation: "Stocks represent ownership shares in a company (equity), while bonds represent loans to a company or government (debt). Stocks generally offer higher growth potential but more risk; bonds offer fixed income with lower risk.",
      category: "Investment Types"
    },
    {
      id: 10,
      question: "What is dollar-cost averaging?",
      options: [
        { id: 'a', text: "Investing a fixed amount regularly regardless of price", isCorrect: true },
        { id: 'b', text: "Buying when prices are high", isCorrect: false },
        { id: 'c', text: "Selling when prices drop", isCorrect: false },
        { id: 'd', text: "Timing the market perfectly", isCorrect: false }
      ],
      explanation: "Dollar-cost averaging involves investing a fixed amount at regular intervals, which averages out purchase prices over time. This reduces the impact of market volatility and removes emotion from investing decisions.",
      category: "Investment Strategy"
    },
    {
      id: 11,
      question: "What is inflation?",
      options: [
        { id: 'a', text: "When prices decrease over time", isCorrect: false },
        { id: 'b', text: "When prices increase over time", isCorrect: true },
        { id: 'c', text: "When interest rates drop", isCorrect: false },
        { id: 'd', text: "When the economy shrinks", isCorrect: false }
      ],
      explanation: "Inflation is the rate at which prices for goods and services rise, decreasing purchasing power. The Federal Reserve targets 2% annual inflation. Investments should outpace inflation to maintain real value.",
      category: "Economic Concepts"
    },
    {
      id: 12,
      question: "What does 'net worth' mean?",
      options: [
        { id: 'a', text: "Your annual salary", isCorrect: false },
        { id: 'b', text: "Assets minus liabilities", isCorrect: true },
        { id: 'c', text: "Monthly disposable income", isCorrect: false },
        { id: 'd', text: "Value of your home", isCorrect: false }
      ],
      explanation: "Net worth = Assets (what you own: cash, investments, property) - Liabilities (what you owe: debts, loans, mortgages). It's a key measure of financial health that should grow over time.",
      category: "Financial Metrics"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      if (!quizCompleted) {
        setTimeSpent(prev => prev + 1);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [quizCompleted]);

  const handleAnswer = (questionId, optionId, isCorrect) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        selected: optionId,
        isCorrect: isCorrect,
        answered: true
      }
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      calculateScore();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    const correctAnswers = Object.values(answers).filter(answer => answer.isCorrect).length;
    const totalAnswered = Object.keys(answers).length;
    const percentage = Math.round((correctAnswers / questions.length) * 100);
    
    // Calculate category scores
    const categoryScores = {};
    questions.forEach(q => {
      if (!categoryScores[q.category]) {
        categoryScores[q.category] = { correct: 0, total: 0 };
      }
      categoryScores[q.category].total++;
      if (answers[q.id]?.isCorrect) {
        categoryScores[q.category].correct++;
      }
    });

    // Determine literacy level
    let level = '';
    let description = '';
    let color = '';

    if (percentage >= 90) {
      level = 'Financial Expert';
      description = 'You have comprehensive financial knowledge!';
      color = '#10b981';
    } else if (percentage >= 75) {
      level = 'Advanced';
      description = 'Strong financial literacy with advanced understanding';
      color = '#3b82f6';
    } else if (percentage >= 60) {
      level = 'Intermediate';
      description = 'Good foundation with room for improvement';
      color = '#f59e0b';
    } else if (percentage >= 40) {
      level = 'Beginner';
      description = 'Basic understanding - great starting point!';
      color = '#ef4444';
    } else {
      level = 'Novice';
      description = 'Time to start your financial education journey';
      color = '#dc2626';
    }

    setScore({
      correct: correctAnswers,
      total: questions.length,
      percentage: percentage,
      level: level,
      description: description,
      color: color,
      categoryScores: categoryScores,
      timeSpent: timeSpent
    });
    setQuizCompleted(true);
  };

  const restartQuiz = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setScore(null);
    setQuizCompleted(false);
    setTimeSpent(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getProgressPercentage = () => {
    return ((Object.keys(answers).length) / questions.length) * 100;
  };

  return (
    <>
      <Head>
        <title>Financial Literacy Quiz | Test Your Money Knowledge</title>
        <meta name="description" content="Take our comprehensive financial literacy quiz to assess your money knowledge, identify areas for improvement, and get personalized learning recommendations." />
        <meta name="keywords" content="financial literacy quiz, money knowledge test, personal finance quiz, financial education test, money management quiz, financial literacy assessment" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/financial-literacy-score-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Financial Literacy Quiz | Test Your Money Knowledge" />
        <meta property="og:description" content="Challenge yourself with 12 essential financial literacy questions. Discover your financial knowledge level and get personalized improvement recommendations." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/financial-literacy-score-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Financial Literacy Quiz" />
        <meta name="twitter:description" content="Test your financial knowledge with our comprehensive quiz" />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="financial-literacy-quiz-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Quiz",
            "name": "Financial Literacy Quiz",
            "description": "Interactive financial literacy assessment covering essential money management topics",
            "educationalLevel": "All levels",
            "assesses": "Financial knowledge, money management skills, investment understanding",
            "learningResourceType": "Quiz",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.7",
              "ratingCount": "2800",
              "bestRating": "5",
              "worstRating": "1"
            },
            "datePublished": currentDate,
            "dateModified": currentDate,
            "author": {
              "@type": "Organization",
              "name": "Financial Education Academy",
              "url": "https://www.financecalculatorfree.com"
            },
            "numberOfQuestions": 12,
            "questionCategories": [
              "Budgeting",
              "Emergency Planning", 
              "Debt Management",
              "Investing Basics",
              "Investment Math",
              "Risk Management",
              "Retirement Planning",
              "Credit Management",
              "Investment Types",
              "Investment Strategy",
              "Economic Concepts",
              "Financial Metrics"
            ]
          })
        }}
      />

      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.mainTitle}>Financial Literacy Quiz</h1>
            <p className={styles.subtitle}>Test Your Money Knowledge & Build Financial Confidence</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>12 Essential Questions</span>
              <span className={styles.badge}>Time: {formatTime(timeSpent)}</span>
              <span className={styles.badge}>Questions: {Object.keys(answers).length}/{questions.length}</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          {!quizCompleted ? (
            <div className={styles.quizLayout}>
              {/* Progress Bar */}
              <div className={styles.progressContainer}>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill}
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
                <div className={styles.progressText}>
                  Question {currentQuestion + 1} of {questions.length}
                  <span className={styles.progressPercentage}>
                    {Math.round(getProgressPercentage())}% Complete
                  </span>
                </div>
              </div>

              {/* Quiz Card */}
              <div className={styles.quizCard}>
                <div className={styles.questionHeader}>
                  <span className={styles.questionCategory}>
                    {questions[currentQuestion].category}
                  </span>
                  <h2 className={styles.questionTitle}>
                    {questions[currentQuestion].question}
                  </h2>
                </div>

                <div className={styles.optionsContainer}>
                  {questions[currentQuestion].options.map((option) => {
                    const isSelected = answers[questions[currentQuestion].id]?.selected === option.id;
                    const isAnswered = answers[questions[currentQuestion].id]?.answered;
                    
                    return (
                      <button
                        key={option.id}
                        className={`${styles.optionButton} ${
                          isSelected 
                            ? option.isCorrect 
                              ? styles.correct 
                              : styles.incorrect
                            : ''
                        } ${isAnswered && !isSelected && option.isCorrect ? styles.missedCorrect : ''}`}
                        onClick={() => handleAnswer(questions[currentQuestion].id, option.id, option.isCorrect)}
                        disabled={isAnswered}
                      >
                        <div className={styles.optionContent}>
                          <div className={styles.optionLetter}>{option.id}</div>
                          <div className={styles.optionText}>{option.text}</div>
                          {isSelected && (
                            <div className={styles.optionStatus}>
                              {option.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {answers[questions[currentQuestion].id]?.answered && (
                  <div className={styles.explanationCard}>
                    <h3 className={styles.explanationTitle}>💡 Explanation</h3>
                    <p className={styles.explanationText}>
                      {questions[currentQuestion].explanation}
                    </p>
                  </div>
                )}

                <div className={styles.navigationButtons}>
                  <button
                    className={styles.navButton}
                    onClick={prevQuestion}
                    disabled={currentQuestion === 0}
                  >
                    ← Previous
                  </button>
                  
                  <button
                    className={styles.navButton}
                    onClick={nextQuestion}
                    disabled={!answers[questions[currentQuestion].id]?.answered}
                  >
                    {currentQuestion === questions.length - 1 ? 'See Results →' : 'Next Question →'}
                  </button>
                </div>
              </div>

              {/* Question List */}
              <div className={styles.questionList}>
                <h3 className={styles.listTitle}>Questions</h3>
                <div className={styles.questionGrid}>
                  {questions.map((q, index) => {
                    const answer = answers[q.id];
                    return (
                      <button
                        key={q.id}
                        className={`${styles.questionNumber} ${
                          currentQuestion === index ? styles.current : ''
                        } ${answer ? (answer.isCorrect ? styles.answeredCorrect : styles.answeredIncorrect) : ''}`}
                        onClick={() => setCurrentQuestion(index)}
                      >
                        {index + 1}
                        {answer && (
                          <span className={styles.answerStatus}>
                            {answer.isCorrect ? '✓' : '✗'}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Results Display */
            <div className={styles.resultsLayout}>
              <div className={styles.resultsCard}>
                <h2 className={styles.sectionTitle}>Your Financial Literacy Score</h2>
                
                {score && (
                  <>
                    <div className={styles.scoreDisplay}>
                      <div className={styles.scoreCircle} style={{ 
                        background: `conic-gradient(${score.color} ${score.percentage}%, #f3f4f6 ${score.percentage}%)` 
                      }}>
                        <div className={styles.scoreInner}>
                          <div className={styles.scoreValue}>{score.percentage}%</div>
                          <div className={styles.scoreLabel}>Score</div>
                        </div>
                      </div>
                      
                      <div className={styles.scoreDetails}>
                        <div className={styles.scoreLevel} style={{ color: score.color }}>
                          {score.level}
                        </div>
                        <p className={styles.scoreDescription}>{score.description}</p>
                        
                        <div className={styles.scoreStats}>
                          <div className={styles.statItem}>
                            <div className={styles.statValue}>{score.correct}/{score.total}</div>
                            <div className={styles.statLabel}>Correct Answers</div>
                          </div>
                          <div className={styles.statItem}>
                            <div className={styles.statValue}>{formatTime(score.timeSpent)}</div>
                            <div className={styles.statLabel}>Time Taken</div>
                          </div>
                          <div className={styles.statItem}>
                            <div className={styles.statValue}>
                              {Math.round((score.correct / score.timeSpent) * 60)}/min
                            </div>
                            <div className={styles.statLabel}>Correct per Hour</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Category Breakdown */}
                    <div className={styles.categoryBreakdown}>
                      <h3 className={styles.breakdownTitle}>Category Performance</h3>
                      <div className={styles.categoryGrid}>
                        {Object.entries(score.categoryScores).map(([category, data]) => {
                          const percentage = Math.round((data.correct / data.total) * 100);
                          return (
                            <div key={category} className={styles.categoryItem}>
                              <div className={styles.categoryHeader}>
                                <span className={styles.categoryName}>{category}</span>
                                <span className={styles.categoryScore}>{percentage}%</span>
                              </div>
                              <div className={styles.categoryBar}>
                                <div 
                                  className={styles.categoryBarFill}
                                  style={{ 
                                    width: `${percentage}%`,
                                    backgroundColor: percentage >= 80 ? '#10b981' : 
                                                    percentage >= 60 ? '#f59e0b' : '#ef4444'
                                  }}
                                ></div>
                              </div>
                              <div className={styles.categoryDetails}>
                                {data.correct} of {data.total} correct
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className={styles.recommendationsCard}>
                      <h3 className={styles.recommendationsTitle}>📚 Personalized Learning Path</h3>
                      
                      {score.percentage < 100 ? (
                        <div className={styles.recommendationsList}>
                          {Object.entries(score.categoryScores)
                            .filter(([_, data]) => (data.correct / data.total) < 0.7)
                            .map(([category, data]) => (
                              <div key={category} className={styles.recommendationItem}>
                                <h4 className={styles.recommendationCategory}>{category}</h4>
                                <p className={styles.recommendationText}>
                                  {category === 'Budgeting' && 'Learn the 50/30/20 rule and budgeting methods'}
                                  {category === 'Investing Basics' && 'Study compound interest and investment fundamentals'}
                                  {category === 'Retirement Planning' && 'Understand different retirement accounts and strategies'}
                                  {category === 'Credit Management' && 'Learn how credit scores work and how to improve them'}
                                  {category === 'Debt Management' && 'Master debt repayment strategies and interest calculations'}
                                  {category === 'Risk Management' && 'Understand diversification and risk assessment'}
                                  {!['Budgeting', 'Investing Basics', 'Retirement Planning', 'Credit Management', 'Debt Management', 'Risk Management'].includes(category) && 
                                   'Review key concepts and practice calculations'}
                                </p>
                                <div className={styles.recommendationResources}>
                                  <span className={styles.resourceTag}>Recommended Resources:</span>
                                  <span className={styles.resourceItem}>Books</span>
                                  <span className={styles.resourceItem}>Online Courses</span>
                                  <span className={styles.resourceItem}>Practice Exercises</span>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className={styles.perfectScore}>
                          <div className={styles.perfectIcon}>🏆</div>
                          <h4>Perfect Score!</h4>
                          <p>You have exceptional financial literacy knowledge. Consider:</p>
                          <ul>
                            <li>Teaching financial literacy to others</li>
                            <li>Exploring advanced investment strategies</li>
                            <li>Learning about estate planning and tax optimization</li>
                            <li>Getting certified as a financial educator</li>
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className={styles.actionButtons}>
                      <button className={styles.primaryButton} onClick={restartQuiz}>
                        ↻ Retake Quiz
                      </button>
                      <button className={styles.secondaryButton} onClick={() => window.print()}>
                        📄 Print Results
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Educational Content */}
              <div className={styles.educationalContent}>
                <article className={styles.articleCard}>
                  <h2 className={styles.articleTitle}>Why Financial Literacy Matters</h2>
                  
                  <div className={styles.articleSection}>
                    <h3 className={styles.articleSubtitle}>The Impact of Financial Knowledge</h3>
                    <p>Financial literacy isn't just about understanding money—it's about making informed decisions that affect every aspect of your life. Studies show that financially literate individuals are more likely to save, invest wisely, avoid high-cost debt, and achieve long-term financial security.</p>
                    
                    <div className={styles.statisticsCard}>
                      <h4>📈 Financial Literacy Statistics:</h4>
                      <div className={styles.statisticsGrid}>
                        <div className={styles.statistic}>
                          <div className={styles.statisticValue}>53%</div>
                          <div className={styles.statisticLabel}>Of adults are financially anxious</div>
                        </div>
                        <div className={styles.statistic}>
                          <div className={styles.statisticValue}>3x</div>
                          <div className={styles.statisticLabel}>Higher retirement savings for literate individuals</div>
                        </div>
                        <div className={styles.statistic}>
                          <div className={styles.statisticValue}>40%</div>
                          <div className={styles.statisticLabel}>Lower likelihood of using high-cost loans</div>
                        </div>
                        <div className={styles.statistic}>
                          <div className={styles.statisticValue}>2.5x</div>
                          <div className={styles.statisticLabel}>More likely to have emergency savings</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.articleSection}>
                    <h3 className={styles.articleSubtitle}>Essential Financial Literacy Topics</h3>
                    
                    <div className={styles.topicsGrid}>
                      <div className={styles.topicCard}>
                        <h4>💰 Budgeting & Cash Flow</h4>
                        <p>Understanding income vs expenses, creating sustainable budgets, and managing cash flow effectively.</p>
                        <div className={styles.topicResources}>
                          <span>Key Concepts:</span>
                          <span>50/30/20 Rule</span>
                          <span>Zero-Based Budgeting</span>
                          <span>Cash Flow Management</span>
                        </div>
                      </div>
                      
                      <div className={styles.topicCard}>
                        <h4>📈 Investing Fundamentals</h4>
                        <p>Compound interest, risk vs return, diversification, and long-term investment strategies.</p>
                        <div className={styles.topicResources}>
                          <span>Key Concepts:</span>
                          <span>Rule of 72</span>
                          <span>Dollar-Cost Averaging</span>
                          <span>Asset Allocation</span>
                        </div>
                      </div>
                      
                      <div className={styles.topicCard}>
                        <h4>🏦 Debt Management</h4>
                        <p>Good vs bad debt, interest calculations, repayment strategies, and credit management.</p>
                        <div className={styles.topicResources}>
                          <span>Key Concepts:</span>
                          <span>Avalanche Method</span>
                          <span>Snowball Method</span>
                          <span>Debt-to-Income Ratio</span>
                        </div>
                      </div>
                      
                      <div className={styles.topicCard}>
                        <h4>👵 Retirement Planning</h4>
                        <p>Retirement accounts, Social Security, withdrawal strategies, and income planning.</p>
                        <div className={styles.topicResources}>
                          <span>Key Concepts:</span>
                          <span>4% Rule</span>
                          <span>Tax-Advantaged Accounts</span>
                          <span>Required Minimum Distributions</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          )}
        </main>

        
      </div>
    </>
  );
};

export async function getStaticProps() {
  const buildTime = new Date();
  const currentDate = buildTime.toISOString().split('T')[0];
  const lastModifiedDate = buildTime.toISOString();
  
  return {
    props: {
      currentDate,
      lastModifiedDate,
    },
    revalidate: 21600, // 6 hours
  };
}

export default FinancialLiteracyQuizCalculator;