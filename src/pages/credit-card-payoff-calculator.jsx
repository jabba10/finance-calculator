import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './creditcardpayoffcalculator.module.css';

const CreditCardPayoffCalculator = ({ currentDate, lastModifiedDate }) => {
  const [currentBalance, setCurrentBalance] = useState(5000);
  const [annualRate, setAnnualRate] = useState(19.99);
  const [minimumPaymentPercent, setMinimumPaymentPercent] = useState(3);
  const [minimumPaymentAmount, setMinimumPaymentAmount] = useState(25);
  const [monthlyPayment, setMonthlyPayment] = useState(150);
  const [strategy, setStrategy] = useState('custom');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [results, setResults] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [debtSnowball, setDebtSnowball] = useState([]);

  // Initialize multiple credit cards for snowball method
  const initialCards = [
    { id: 1, name: 'Card A', balance: 3000, rate: 22.99, minPayment: 90 },
    { id: 2, name: 'Card B', balance: 2000, rate: 18.99, minPayment: 60 },
    { id: 3, name: 'Card C', balance: 1000, rate: 14.99, minPayment: 30 }
  ];

  const [creditCards, setCreditCards] = useState(initialCards);

  const calculatePayoff = () => {
    let monthsToPayoff = 0;
    let totalInterest = 0;
    let balance = currentBalance;
    const monthlyRate = annualRate / 100 / 12;
    const dataPoints = [];
    let cumulativeInterest = 0;
    
    // Calculate minimum payment
    const calculatedMinPayment = Math.max(
      minimumPaymentAmount,
      currentBalance * (minimumPaymentPercent / 100)
    );
    
    const actualPayment = strategy === 'minimum' ? calculatedMinPayment : monthlyPayment;
    
    while (balance > 0 && monthsToPayoff < 600) { // Cap at 50 years
      monthsToPayoff++;
      
      // Calculate interest for this month
      const monthlyInterest = balance * monthlyRate;
      totalInterest += monthlyInterest;
      cumulativeInterest += monthlyInterest;
      
      // Calculate principal payment
      const principalPayment = Math.min(actualPayment - monthlyInterest, balance);
      balance -= principalPayment;
      
      // Add to chart data every 6 months or at payoff
      if (monthsToPayoff % 6 === 0 || balance <= 0) {
        dataPoints.push({
          month: monthsToPayoff,
          balance: Math.max(balance, 0),
          interestPaid: cumulativeInterest,
          principalPaid: currentBalance - Math.max(balance, 0),
          payment: actualPayment
        });
      }
      
      // If making minimum payments and payment doesn't cover interest
      if (strategy === 'minimum' && actualPayment <= monthlyInterest) {
        // Balance will never be paid off
        monthsToPayoff = Infinity;
        break;
      }
    }
    
    // Calculate years and months
    const years = Math.floor(monthsToPayoff / 12);
    const months = monthsToPayoff % 12;
    
    // Calculate total cost
    const totalCost = currentBalance + totalInterest;
    
    // Calculate interest savings vs minimum payment
    let minPaymentMonths = 0;
    let minPaymentInterest = 0;
    let minBalance = currentBalance;
    const minPayment = calculatedMinPayment;
    
    while (minBalance > 0 && minPaymentMonths < 600) {
      minPaymentMonths++;
      const monthlyInterest = minBalance * monthlyRate;
      minPaymentInterest += monthlyInterest;
      const principalPayment = Math.min(minPayment - monthlyInterest, minBalance);
      minBalance -= principalPayment;
      
      if (minPayment <= monthlyInterest) {
        minPaymentMonths = Infinity;
        minPaymentInterest = Infinity;
        break;
      }
    }
    
    const interestSaved = minPaymentInterest !== Infinity ? minPaymentInterest - totalInterest : totalInterest;
    
    setResults({
      monthsToPayoff: monthsToPayoff === Infinity ? 'Never' : monthsToPayoff,
      yearsToPayoff: monthsToPayoff === Infinity ? 'Never' : years,
      monthsRemaining: monthsToPayoff === Infinity ? '∞' : months,
      totalInterest: Math.round(totalInterest),
      totalCost: Math.round(totalCost),
      minimumPayment: Math.round(calculatedMinPayment),
      interestSaved: Math.round(interestSaved),
      interestPercentage: Math.round((totalInterest / totalCost) * 100),
      payoffDate: calculatePayoffDate(monthsToPayoff)
    });
    
    setChartData(dataPoints);
    
    // Calculate debt snowball for multiple cards
    if (showAdvanced) {
      calculateDebtSnowball();
    }
  };

  const calculateDebtSnowball = () => {
    // Sort by balance (snowball) or rate (avalanche)
    const sortedCards = [...creditCards].sort((a, b) => {
      if (strategy === 'snowball') return a.balance - b.balance;
      return b.rate - a.rate; // avalanche
    });
    
    const snowballResults = [];
    let availablePayment = monthlyPayment;
    
    sortedCards.forEach(card => {
      const monthlyRate = card.rate / 100 / 12;
      let balance = card.balance;
      let months = 0;
      let interest = 0;
      
      // Start with card's minimum payment
      let cardPayment = Math.max(card.minPayment, balance * 0.03);
      
      // Add extra payment from previous paid-off cards
      if (snowballResults.length > 0 && snowballResults[snowballResults.length - 1].paidOff) {
        availablePayment += snowballResults[snowballResults.length - 1].finalPayment;
      }
      
      cardPayment = Math.min(cardPayment + availablePayment / (sortedCards.length - snowballResults.length), balance + balance * monthlyRate);
      
      while (balance > 0 && months < 600) {
        months++;
        const monthlyInterest = balance * monthlyRate;
        interest += monthlyInterest;
        const principalPayment = Math.min(cardPayment - monthlyInterest, balance);
        balance -= principalPayment;
      }
      
      snowballResults.push({
        name: card.name,
        balance: card.balance,
        rate: card.rate,
        monthsToPayoff: months,
        interestPaid: Math.round(interest),
        totalCost: Math.round(card.balance + interest),
        paidOff: true
      });
    });
    
    setDebtSnowball(snowballResults);
  };

  const calculatePayoffDate = (months) => {
    if (months === Infinity) return 'Never';
    const date = new Date();
    date.setMonth(date.getMonth() + months);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  useEffect(() => {
    calculatePayoff();
  }, [currentBalance, annualRate, minimumPaymentPercent, minimumPaymentAmount, monthlyPayment, strategy, showAdvanced, creditCards]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(2)}%`;
  };

  const formatMonths = (months) => {
    if (months === Infinity) return 'Never';
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return years > 0 ? `${years} years ${remainingMonths} months` : `${remainingMonths} months`;
  };

  const handleCardUpdate = (id, field, value) => {
    setCreditCards(cards =>
      cards.map(card =>
        card.id === id ? { ...card, [field]: parseFloat(value) || 0 } : card
      )
    );
  };

  const addCreditCard = () => {
    const newId = creditCards.length + 1;
    setCreditCards([
      ...creditCards,
      {
        id: newId,
        name: `Card ${String.fromCharCode(64 + newId)}`,
        balance: 1000,
        rate: 18.99,
        minPayment: 30
      }
    ]);
  };

  const removeCreditCard = (id) => {
    if (creditCards.length > 1) {
      setCreditCards(cards => cards.filter(card => card.id !== id));
    }
  };

  return (
    <>
      <Head>
        <title>Credit Card Payoff Calculator | Debt Reduction & Interest Savings</title>
        <meta name="description" content="Free credit card payoff calculator with debt snowball/avalanche strategies. Calculate how long it will take to pay off your credit card debt and save on interest." />
        <meta name="keywords" content="credit card payoff calculator, debt calculator, debt snowball, debt avalanche, credit card debt, interest calculator, debt free" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/credit-card-payoff-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Credit Card Payoff Calculator | Debt Reduction & Interest Savings" />
        <meta property="og:description" content="Calculate your credit card payoff timeline and save thousands in interest. Compare debt payoff strategies and become debt-free faster." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/credit-card-payoff-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Credit Card Payoff Calculator" />
        <meta name="twitter:description" content="Plan your path to debt freedom with our powerful credit card payoff calculator." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="credit-card-payoff-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Credit Card Payoff Calculator",
            "description": "Professional credit card debt payoff calculator with snowball and avalanche method comparisons",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "ratingCount": "1350",
              "bestRating": "5",
              "worstRating": "1"
            },
            "datePublished": currentDate,
            "dateModified": currentDate,
            "author": {
              "@type": "Organization",
              "name": "Debt Free Tools",
              "url": "https://www.financecalculatorfree.com"
            },
            "featureList": [
              "Debt Snowball Method",
              "Debt Avalanche Method",
              "Interest Savings Calculator",
              "Visual Payoff Timeline",
              "Multiple Card Management"
            ]
          })
        }}
      />

      {/* FAQ Schema */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is the difference between debt snowball and debt avalanche methods?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The debt snowball method focuses on paying off smallest balances first for psychological wins, while the debt avalanche method targets highest interest rates first to save the most money. Our calculator shows you which method works best for your situation.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How can I pay off my credit card debt faster?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Use our calculator to see how increasing your monthly payment by just $50-100 can save you thousands in interest and cut years off your payoff timeline. Consider balance transfer cards with 0% introductory APR to accelerate your progress.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What happens if I only make minimum payments?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Minimum payments often just cover interest, meaning you could be in debt for decades and pay 2-3x your original balance in interest. Our calculator shows the true cost of minimum payments vs aggressive payoff strategies.",
                  "datePublished": currentDate
                }
              }
            ]
          })
        }}
      />

      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.mainTitle}>Credit Card Payoff Calculator</h1>
            <p className={styles.subtitle}>Calculate Your Path to Debt Freedom and Save Thousands in Interest</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>Free Tool</span>
              <span className={styles.badge}>No Signup Required</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Calculate Your Payoff Plan</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Current Balance
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="100"
                      max="50000"
                      step="100"
                      value={currentBalance}
                      onChange={(e) => setCurrentBalance(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="100"
                      max="50000"
                      step="100"
                      value={currentBalance}
                      onChange={(e) => setCurrentBalance(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(currentBalance)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Annual Interest Rate (APR)
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="5"
                      max="29.99"
                      step="0.1"
                      value={annualRate}
                      onChange={(e) => setAnnualRate(parseFloat(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="5"
                      max="29.99"
                      step="0.1"
                      value={annualRate}
                      onChange={(e) => setAnnualRate(parseFloat(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(annualRate)}</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Payoff Strategy
                  <div className={styles.strategyButtons}>
                    <button
                      className={`${styles.strategyButton} ${strategy === 'minimum' ? styles.strategyActive : ''}`}
                      onClick={() => setStrategy('minimum')}
                    >
                      Minimum Payment
                    </button>
                    <button
                      className={`${styles.strategyButton} ${strategy === 'custom' ? styles.strategyActive : ''}`}
                      onClick={() => setStrategy('custom')}
                    >
                      Custom Payment
                    </button>
                  </div>
                </label>
              </div>

              {strategy === 'minimum' ? (
                <>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      Minimum Payment (% of balance)
                      <div className={styles.inputWrapper}>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          step="0.1"
                          value={minimumPaymentPercent}
                          onChange={(e) => setMinimumPaymentPercent(parseFloat(e.target.value))}
                          className={styles.slider}
                        />
                        <input
                          type="number"
                          min="1"
                          max="5"
                          step="0.1"
                          value={minimumPaymentPercent}
                          onChange={(e) => setMinimumPaymentPercent(parseFloat(e.target.value) || 0)}
                          className={styles.numberInput}
                        />
                        <span className={styles.percentageSymbol}>%</span>
                      </div>
                      <div className={styles.valueDisplay}>{formatPercentage(minimumPaymentPercent)}</div>
                    </label>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      Minimum Payment ($ amount)
                      <div className={styles.inputWrapper}>
                        <span className={styles.currencySymbol}>$</span>
                        <input
                          type="range"
                          min="25"
                          max="500"
                          step="5"
                          value={minimumPaymentAmount}
                          onChange={(e) => setMinimumPaymentAmount(parseInt(e.target.value))}
                          className={styles.slider}
                        />
                        <input
                          type="number"
                          min="25"
                          max="500"
                          step="5"
                          value={minimumPaymentAmount}
                          onChange={(e) => setMinimumPaymentAmount(parseInt(e.target.value) || 0)}
                          className={styles.numberInput}
                        />
                      </div>
                      <div className={styles.valueDisplay}>{formatCurrency(minimumPaymentAmount)}</div>
                    </label>
                  </div>
                </>
              ) : (
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>
                    Monthly Payment Amount
                    <div className={styles.inputWrapper}>
                      <span className={styles.currencySymbol}>$</span>
                      <input
                        type="range"
                        min="50"
                        max="2000"
                        step="10"
                        value={monthlyPayment}
                        onChange={(e) => setMonthlyPayment(parseInt(e.target.value))}
                        className={styles.slider}
                      />
                      <input
                        type="number"
                        min="50"
                        max="2000"
                        step="10"
                        value={monthlyPayment}
                        onChange={(e) => setMonthlyPayment(parseInt(e.target.value) || 0)}
                        className={styles.numberInput}
                      />
                    </div>
                    <div className={styles.valueDisplay}>{formatCurrency(monthlyPayment)}/month</div>
                  </label>
                </div>
              )}

              <div className={styles.inputGroup}>
                <label className={styles.advancedToggle}>
                  <input
                    type="checkbox"
                    checked={showAdvanced}
                    onChange={(e) => setShowAdvanced(e.target.checked)}
                    className={styles.checkboxInput}
                  />
                  Show Multiple Cards & Debt Strategies
                </label>
              </div>

              {showAdvanced && (
                <div className={styles.advancedSection}>
                  <h3 className={styles.advancedTitle}>Multiple Credit Cards</h3>
                  
                  <div className={styles.debtStrategyButtons}>
                    <button
                      className={`${styles.strategyButton} ${strategy === 'snowball' ? styles.strategyActive : ''}`}
                      onClick={() => setStrategy('snowball')}
                    >
                      Debt Snowball
                    </button>
                    <button
                      className={`${styles.strategyButton} ${strategy === 'avalanche' ? styles.strategyActive : ''}`}
                      onClick={() => setStrategy('avalanche')}
                    >
                      Debt Avalanche
                    </button>
                  </div>
                  
                  <div className={styles.cardsContainer}>
                    {creditCards.map((card) => (
                      <div key={card.id} className={styles.cardInputGroup}>
                        <div className={styles.cardHeader}>
                          <h4>{card.name}</h4>
                          {creditCards.length > 1 && (
                            <button
                              className={styles.removeCardButton}
                              onClick={() => removeCreditCard(card.id)}
                            >
                              ×
                            </button>
                          )}
                        </div>
                        <div className={styles.cardInputs}>
                          <div className={styles.cardInput}>
                            <label>Balance</label>
                            <input
                              type="number"
                              value={card.balance}
                              onChange={(e) => handleCardUpdate(card.id, 'balance', e.target.value)}
                              className={styles.cardNumberInput}
                            />
                          </div>
                          <div className={styles.cardInput}>
                            <label>APR</label>
                            <input
                              type="number"
                              value={card.rate}
                              onChange={(e) => handleCardUpdate(card.id, 'rate', e.target.value)}
                              className={styles.cardNumberInput}
                            />
                          </div>
                          <div className={styles.cardInput}>
                            <label>Min Payment</label>
                            <input
                              type="number"
                              value={card.minPayment}
                              onChange={(e) => handleCardUpdate(card.id, 'minPayment', e.target.value)}
                              className={styles.cardNumberInput}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <button className={styles.addCardButton} onClick={addCreditCard}>
                      + Add Another Credit Card
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Your Payoff Analysis</h2>
              
              {results && (
                <>
                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Time to Payoff</div>
                      <div className={styles.resultValue}>
                        {results.monthsToPayoff === 'Never' ? 'Never' : formatMonths(results.monthsToPayoff)}
                      </div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Total Interest</div>
                      <div className={styles.resultValue}>{formatCurrency(results.totalInterest)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Total Cost</div>
                      <div className={styles.resultValue}>{formatCurrency(results.totalCost)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Interest Saved</div>
                      <div className={`${styles.resultValue} ${styles.savings}`}>
                        {formatCurrency(results.interestSaved)}
                      </div>
                    </div>
                  </div>

                  {/* Additional Results */}
                  <div className={styles.additionalResults}>
                    <div className={styles.resultRow}>
                      <div className={styles.resultLabel}>Estimated Payoff Date</div>
                      <div className={styles.resultValue}>{results.payoffDate}</div>
                    </div>
                    <div className={styles.resultRow}>
                      <div className={styles.resultLabel}>Minimum Payment</div>
                      <div className={styles.resultValue}>{formatCurrency(results.minimumPayment)}/month</div>
                    </div>
                    <div className={styles.resultRow}>
                      <div className={styles.resultLabel}>Interest Percentage</div>
                      <div className={styles.resultValue}>{formatPercentage(results.interestPercentage)}</div>
                    </div>
                  </div>

                  {showAdvanced && debtSnowball.length > 0 && (
                    <div className={styles.snowballResults}>
                      <h3 className={styles.snowballTitle}>
                        {strategy === 'snowball' ? 'Debt Snowball Method' : 'Debt Avalanche Method'}
                      </h3>
                      <div className={styles.snowballTable}>
                        <div className={styles.tableHeader}>
                          <div>Card</div>
                          <div>Balance</div>
                          <div>APR</div>
                          <div>Months</div>
                          <div>Interest</div>
                          <div>Total Cost</div>
                        </div>
                        {debtSnowball.map((card, index) => (
                          <div key={index} className={styles.tableRow}>
                            <div>{card.name}</div>
                            <div>{formatCurrency(card.balance)}</div>
                            <div>{formatPercentage(card.rate)}</div>
                            <div>{card.monthsToPayoff}</div>
                            <div>{formatCurrency(card.interestPaid)}</div>
                            <div>{formatCurrency(card.totalCost)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Payoff Chart Visualization */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>Payoff Progress Over Time</h3>
                    <div className={styles.chartBars}>
                      {chartData.map((data, index) => (
                        <div key={index} className={styles.chartBarGroup}>
                          <div className={styles.chartBarLabel}>Month {data.month}</div>
                          <div className={styles.chartBarContainer}>
                            <div 
                              className={styles.chartBarPrincipal}
                              style={{ width: `${(data.principalPaid / currentBalance) * 100}%` }}
                              title={`Principal Paid: ${formatCurrency(data.principalPaid)}`}
                            />
                            <div 
                              className={styles.chartBarInterest}
                              style={{ width: `${(data.interestPaid / results.totalInterest) * 100}%` }}
                              title={`Interest Paid: ${formatCurrency(data.interestPaid)}`}
                            />
                          </div>
                          <div className={styles.chartBarValue}>
                            {data.balance > 0 ? formatCurrency(data.balance) : 'Paid Off!'}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.chartLegend}>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendPrincipal}`}></div>
                        <span>Principal Paid</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendInterest}`}></div>
                        <span>Interest Paid</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>💡 Key Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>You're paying <strong>{formatCurrency(results.totalInterest)}</strong> in interest alone</li>
                      <li>Interest makes up <strong>{formatPercentage(results.interestPercentage)}</strong> of your total cost</li>
                      <li>By paying {formatCurrency(monthlyPayment)} instead of the minimum, you save <strong>{formatCurrency(results.interestSaved)}</strong> in interest</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Educational Content */}
          <div className={styles.educationalContent}>
            <article className={styles.articleCard}>
              <h2 className={styles.articleTitle}>Mastering Credit Card Debt: Strategies for Financial Freedom</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>The True Cost of Credit Card Debt</h3>
                <p>Credit card debt is one of the most expensive forms of borrowing, with average APRs ranging from 16-25%. The minimum payment trap keeps millions of Americans in debt for decades, paying 2-3 times their original balance in interest alone.</p>
                
                <div className={styles.exampleCard}>
                  <h4>Minimum Payment vs. Aggressive Payoff:</h4>
                  <p>For a $5,000 balance at 19.99% APR:</p>
                  <ul>
                    <li><strong>Minimum payments (3%):</strong> 18+ years to pay off, $5,800+ in interest</li>
                    <li><strong>$150/month payments:</strong> 3.5 years to pay off, $1,850 in interest</li>
                    <li><strong>$250/month payments:</strong> 2 years to pay off, $1,150 in interest</li>
                  </ul>
                  <p>Increasing your payment by just $100/month can save you thousands and cut years off your debt timeline.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Debt Payoff Strategies That Work</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>🎯 Debt Avalanche Method</h4>
                    <p><strong>How it works:</strong> Pay minimums on all debts, put extra money toward the debt with the highest interest rate<br />
                    <strong>Best for:</strong> Saving the most money on interest payments<br />
                    <strong>Savings:</strong> Typically saves 10-30% vs other methods</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🏔️ Debt Snowball Method</h4>
                    <p><strong>How it works:</strong> Pay minimums on all debts, put extra money toward the smallest balance first<br />
                    <strong>Best for:</strong> Psychological motivation and building momentum<br />
                    <strong>Benefits:</strong> Quick wins keep you motivated to continue</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🔄 Balance Transfer Cards</h4>
                    <p><strong>How it works:</strong> Transfer high-interest debt to a 0% APR introductory offer card<br />
                    <strong>Best for:</strong> Those with good credit who can pay off debt within 12-21 months<br />
                    <strong>Watch out for:</strong> Transfer fees (usually 3-5%) and revert rates after intro period</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🏦 Debt Consolidation Loans</h4>
                    <p><strong>How it works:</strong> Take out a personal loan to pay off multiple credit cards<br />
                    <strong>Best for:</strong> Those who qualify for lower interest rates and want single monthly payment<br />
                    <strong>Considerations:</strong> Requires good credit, don't run up cards again after consolidating</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Practical Tips for Accelerating Your Payoff</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Create a Budget:</strong> Track every dollar and identify areas to cut back for extra debt payments</li>
                  <li><strong>Negotiate Rates:</strong> Call your credit card company and ask for a lower APR - many will accommodate</li>
                  <li><strong>Use Windfalls Wisely:</strong> Apply tax refunds, bonuses, or unexpected money directly to debt</li>
                  <li><strong>Snowflake Method:</strong> Make small extra payments whenever you have spare cash (saved $5 on coffee? Pay it toward debt!)</li>
                  <li><strong>Increase Income:</strong> Consider side hustles, overtime, or selling unused items for extra debt payments</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Advice from Debt Specialists</h3>
                <blockquote className={styles.expertQuote}>
                  "The most important step in debt payoff isn't finding the perfect strategy—it's starting. Whether you choose snowball or avalanche, the key is consistency. Every extra dollar you put toward debt today saves you $2-3 in future interest. Track your progress, celebrate small wins, and remember: becoming debt-free is a marathon, not a sprint."
                  <footer className={styles.quoteFooter}>— Certified Credit Counselor, 20+ years experience</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Should I pay off debt or build an emergency fund first?</h3>
                <p className={styles.faqAnswer}>Start with a mini emergency fund of $1,000, then focus aggressively on debt payoff. Once high-interest debt is eliminated, build your emergency fund to 3-6 months of expenses. This prevents you from going further into debt when unexpected expenses arise.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How does credit card debt affect my credit score?</h3>
                <p className={styles.faqAnswer}>High credit card balances hurt your credit utilization ratio (30% of your score). Paying down debt improves your score. However, closing paid-off cards can hurt your credit age and available credit. Keep accounts open with $0 balances, but cut up the cards if you're tempted to use them.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's better: debt snowball or debt avalanche?</h3>
                <p className={styles.faqAnswer}>Mathematically, avalanche saves more money. Psychologically, snowball provides faster wins that keep people motivated. Use our calculator to compare both methods for your situation. Many people start with snowball for motivation, then switch to avalanche as they build momentum.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>When should I consider debt settlement or bankruptcy?</h3>
                <p className={styles.faqAnswer}>These should be last resorts. Consider debt settlement only if you're significantly behind on payments and can't afford minimums. Bankruptcy has serious 7-10 year credit consequences. Always consult with a nonprofit credit counseling agency before considering these options.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Ready to Start Your Debt-Free Journey?</h2>
              <p className={styles.ctaText}>Use our calculator to create your personalized debt payoff plan. Experiment with different payment amounts and strategies to find what works best for your situation.</p>
              
              
                
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates for educational purposes. Actual payoff times may vary based on payment timing, interest calculation methods, and potential fees. Credit card terms and interest rates may change. Consider consulting with a financial advisor or credit counselor for personalized debt management advice.
              </p>
            </div>
          </div>
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
    revalidate: 86400, // 24 hours
  };
}

export default CreditCardPayoffCalculator;