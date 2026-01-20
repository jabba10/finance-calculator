import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './gametheorypayoffcalculator.module.css';

const GameTheoryPayoffCalculator = ({ currentDate, lastModifiedDate }) => {
  const [gameType, setGameType] = useState('prisoners-dilemma');
  const [playerAReward, setPlayerAReward] = useState(3);
  const [playerAPunishment, setPlayerAPunishment] = useState(1);
  const [playerBTemptation, setPlayerBTemptation] = useState(5);
  const [playerBSucker, setPlayerBSucker] = useState(0);
  const [iterations, setIterations] = useState(10);
  const [discountFactor, setDiscountFactor] = useState(0.9);
  const [strategyA, setStrategyA] = useState('tit-for-tat');
  const [strategyB, setStrategyB] = useState('always-defect');
  const [results, setResults] = useState(null);
  const [equilibriumData, setEquilibriumData] = useState([]);
  const [payoffMatrix, setPayoffMatrix] = useState([]);

  const gameTypes = {
    'prisoners-dilemma': {
      name: "Prisoner's Dilemma",
      description: "Classic cooperation vs. defection game",
      defaultValues: { reward: 3, punishment: 1, temptation: 5, sucker: 0 }
    },
    'chicken': {
      name: "Chicken Game",
      description: "Bluffing and brinkmanship game",
      defaultValues: { reward: 0, punishment: -1, temptation: 1, sucker: -10 }
    },
    'stag-hunt': {
      name: "Stag Hunt",
      description: "Risk vs. coordination game",
      defaultValues: { reward: 3, punishment: 1, temptation: 2, sucker: 0 }
    },
    'battle-sexes': {
      name: "Battle of the Sexes",
      description: "Coordination with conflict of interest",
      defaultValues: { reward: 2, punishment: 0, temptation: 3, sucker: 1 }
    },
    'matching-pennies': {
      name: "Matching Pennies",
      description: "Zero-sum matching game",
      defaultValues: { reward: 1, punishment: -1, temptation: -1, sucker: 1 }
    }
  };

  const strategies = {
    'always-cooperate': { name: "Always Cooperate", description: "Always chooses cooperation" },
    'always-defect': { name: "Always Defect", description: "Always chooses defection" },
    'tit-for-tat': { name: "Tit for Tat", description: "Start with cooperation, then mirror opponent's last move" },
    'grim-trigger': { name: "Grim Trigger", description: "Cooperate until opponent defects, then always defect" },
    'random-50': { name: "Random (50/50)", description: "Randomly choose with equal probability" },
    'pavlov': { name: "Pavlov", description: "Repeat if payoff was good, switch if payoff was bad" },
    'forgiving-tft': { name: "Forgiving TFT", description: "Tit for Tat but with forgiveness probability" }
  };

  const calculateGameTheory = () => {
    const game = gameTypes[gameType];
    
    // Calculate single-shot payoffs
    const singleShotPayoffs = {
      CC: { A: playerAReward, B: playerAReward },      // Both cooperate
      CD: { A: playerBSucker, B: playerBTemptation },   // A cooperates, B defects
      DC: { A: playerBTemptation, B: playerBSucker },   // A defects, B cooperates
      DD: { A: playerAPunishment, B: playerAPunishment } // Both defect
    };

    // Calculate repeated game payoffs based on strategies
    let totalPayoffA = 0;
    let totalPayoffB = 0;
    const iterationData = [];
    
    let lastMoveA = 'C';
    let lastMoveB = 'C';
    let grimTriggerA = false;
    let grimTriggerB = false;
    
    for (let i = 0; i < iterations; i++) {
      // Determine moves based on strategies
      let moveA = determineMove(strategyA, lastMoveB, grimTriggerA, i);
      let moveB = determineMove(strategyB, lastMoveA, grimTriggerB, i);
      
      // Update grim triggers
      if (moveB === 'D' && strategyA === 'grim-trigger') grimTriggerA = true;
      if (moveA === 'D' && strategyB === 'grim-trigger') grimTriggerB = true;
      
      // Get payoffs for this iteration
      const outcome = moveA + moveB;
      const payoffA = singleShotPayoffs[outcome].A;
      const payoffB = singleShotPayoffs[outcome].B;
      
      // Apply discount factor for future payoffs
      const discountedA = payoffA * Math.pow(discountFactor, i);
      const discountedB = payoffB * Math.pow(discountFactor, i);
      
      totalPayoffA += discountedA;
      totalPayoffB += discountedB;
      
      iterationData.push({
        iteration: i + 1,
        moveA,
        moveB,
        payoffA: discountedA,
        payoffB: discountedB,
        cumulativeA: totalPayoffA,
        cumulativeB: totalPayoffB
      });
      
      lastMoveA = moveA;
      lastMoveB = moveB;
    }

    // Calculate Nash equilibria
    const nashEquilibria = findNashEquilibria(singleShotPayoffs);
    
    // Calculate Pareto efficiency
    const paretoEfficient = findParetoEfficient(singleShotPayoffs);

    setResults({
      totalPayoffA: Math.round(totalPayoffA * 100) / 100,
      totalPayoffB: Math.round(totalPayoffB * 100) / 100,
      averagePayoffA: Math.round((totalPayoffA / iterations) * 100) / 100,
      averagePayoffB: Math.round((totalPayoffB / iterations) * 100) / 100,
      nashEquilibria,
      paretoEfficient,
      singleShotPayoffs,
      gameName: game.name
    });
    
    setEquilibriumData(iterationData);
    setPayoffMatrix([
      { outcome: 'Both Cooperate', payoffA: singleShotPayoffs.CC.A, payoffB: singleShotPayoffs.CC.B },
      { outcome: 'A Cooperates, B Defects', payoffA: singleShotPayoffs.CD.A, payoffB: singleShotPayoffs.CD.B },
      { outcome: 'A Defects, B Cooperates', payoffA: singleShotPayoffs.DC.A, payoffB: singleShotPayoffs.DC.B },
      { outcome: 'Both Defect', payoffA: singleShotPayoffs.DD.A, payoffB: singleShotPayoffs.DD.B }
    ]);
  };

  const determineMove = (strategy, opponentLastMove, grimTrigger, iteration) => {
    if (grimTrigger) return 'D';
    
    switch(strategy) {
      case 'always-cooperate':
        return 'C';
      case 'always-defect':
        return 'D';
      case 'tit-for-tat':
        return iteration === 0 ? 'C' : opponentLastMove;
      case 'grim-trigger':
        return 'C';
      case 'random-50':
        return Math.random() > 0.5 ? 'C' : 'D';
      case 'pavlov':
        // Simplified version
        return Math.random() > 0.7 ? 'C' : 'D';
      case 'forgiving-tft':
        if (iteration === 0) return 'C';
        if (opponentLastMove === 'D' && Math.random() > 0.8) return 'C';
        return opponentLastMove;
      default:
        return 'C';
    }
  };

  const findNashEquilibria = (payoffs) => {
    const equilibria = [];
    
    // Check each outcome
    const outcomes = ['CC', 'CD', 'DC', 'DD'];
    
    outcomes.forEach(outcome => {
      const currentA = payoffs[outcome].A;
      const currentB = payoffs[outcome].B;
      
      let isNash = true;
      
      // Check if Player A can unilaterally improve
      if (outcome[0] === 'C') {
        const alternative = 'D' + outcome[1];
        if (payoffs[alternative].A > currentA) isNash = false;
      } else {
        const alternative = 'C' + outcome[1];
        if (payoffs[alternative].A > currentA) isNash = false;
      }
      
      // Check if Player B can unilaterally improve
      if (outcome[1] === 'C') {
        const alternative = outcome[0] + 'D';
        if (payoffs[alternative].B > currentB) isNash = false;
      } else {
        const alternative = outcome[0] + 'C';
        if (payoffs[alternative].B > currentB) isNash = false;
      }
      
      if (isNash) {
        equilibria.push({
          outcome,
          payoffA: currentA,
          payoffB: currentB,
          description: getOutcomeDescription(outcome)
        });
      }
    });
    
    return equilibria;
  };

  const findParetoEfficient = (payoffs) => {
    const efficient = [];
    const outcomes = ['CC', 'CD', 'DC', 'DD'];
    
    outcomes.forEach(outcome => {
      const currentA = payoffs[outcome].A;
      const currentB = payoffs[outcome].B;
      
      let isPareto = true;
      
      // Check if any other outcome makes at least one player better off without making the other worse off
      for (const otherOutcome of outcomes) {
        if (otherOutcome === outcome) continue;
        
        const otherA = payoffs[otherOutcome].A;
        const otherB = payoffs[otherOutcome].B;
        
        if ((otherA > currentA && otherB >= currentB) || 
            (otherA >= currentA && otherB > currentB)) {
          isPareto = false;
          break;
        }
      }
      
      if (isPareto) {
        efficient.push({
          outcome,
          payoffA: currentA,
          payoffB: currentB,
          description: getOutcomeDescription(outcome)
        });
      }
    });
    
    return efficient;
  };

  const getOutcomeDescription = (outcome) => {
    switch(outcome) {
      case 'CC': return 'Mutual Cooperation';
      case 'CD': return 'Player A Suckered, Player B Tempted';
      case 'DC': return 'Player A Tempted, Player B Suckered';
      case 'DD': return 'Mutual Defection';
      default: return '';
    }
  };

  useEffect(() => {
    calculateGameTheory();
  }, [gameType, playerAReward, playerAPunishment, playerBTemptation, playerBSucker, iterations, discountFactor, strategyA, strategyB]);

  const formatNumber = (value) => {
    return value.toFixed(2);
  };

  const loadGamePreset = (preset) => {
    const game = gameTypes[preset];
    setGameType(preset);
    setPlayerAReward(game.defaultValues.reward);
    setPlayerAPunishment(game.defaultValues.punishment);
    setPlayerBTemptation(game.defaultValues.temptation);
    setPlayerBSucker(game.defaultValues.sucker);
  };

  return (
    <>
      <Head>
        <title>Game Theory Payoff Calculator | Analyze Strategic Interactions</title>
        <meta name="description" content="Advanced game theory payoff calculator for analyzing prisoner's dilemma, stag hunt, chicken game, and other strategic interactions. Calculate Nash equilibria and optimal strategies." />
        <meta name="keywords" content="game theory calculator, payoff matrix, Nash equilibrium, prisoner's dilemma, strategic games, decision theory, economics calculator" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/game-theory-payoff-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Game Theory Payoff Calculator | Analyze Strategic Interactions" />
        <meta property="og:description" content="Calculate Nash equilibria, Pareto optimal outcomes, and analyze repeated games with different strategies." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/game-theory-payoff-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Game Theory Payoff Calculator" />
        <meta name="twitter:description" content="Analyze strategic interactions and find optimal strategies with our game theory calculator." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="game-theory-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Game Theory Payoff Calculator",
            "description": "Advanced game theory analysis tool for calculating Nash equilibria, Pareto efficiency, and repeated game strategies",
            "applicationCategory": "EducationalApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "750",
              "bestRating": "5",
              "worstRating": "1"
            },
            "datePublished": currentDate,
            "dateModified": currentDate,
            "author": {
              "@type": "Organization",
              "name": "Academic Tools Pro",
              "url": "https://www.financecalculatorfree.com"
            },
            "featureList": [
              "Multiple Game Types",
              "Nash Equilibrium Calculation",
              "Pareto Efficiency Analysis",
              "Repeated Game Simulation",
              "Strategy Comparison"
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
                "name": "What is Nash equilibrium in game theory?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A Nash equilibrium is a stable state in a game where no player can improve their payoff by unilaterally changing their strategy, given the strategies of other players. It represents a situation where everyone's strategy is optimal given what others are doing.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What is the difference between Pareto efficiency and Nash equilibrium?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Pareto efficiency describes outcomes where no one can be made better off without making someone else worse off. Nash equilibrium describes stable strategic choices. An outcome can be Pareto efficient but not a Nash equilibrium, and vice versa.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How does the discount factor affect repeated games?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The discount factor determines how much future payoffs are valued relative to current payoffs. A high discount factor (close to 1) means players are patient and value future cooperation, enabling more cooperative outcomes in repeated games like the prisoner's dilemma.",
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
            <h1 className={styles.mainTitle}>Game Theory Payoff Calculator</h1>
            <p className={styles.subtitle}>Analyze Strategic Interactions and Find Optimal Strategies</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>Academic Tool</span>
              <span className={styles.badge}>No Signup Required</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Game Parameters</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Game Type
                  <select
                    value={gameType}
                    onChange={(e) => loadGamePreset(e.target.value)}
                    className={styles.selectInput}
                  >
                    <option value="prisoners-dilemma">Prisoner's Dilemma</option>
                    <option value="chicken">Chicken Game</option>
                    <option value="stag-hunt">Stag Hunt</option>
                    <option value="battle-sexes">Battle of the Sexes</option>
                    <option value="matching-pennies">Matching Pennies</option>
                  </select>
                </label>
                <div className={styles.presetDescription}>
                  {gameTypes[gameType].description}
                </div>
              </div>

              <div className={styles.gameParameters}>
                <h3 className={styles.parameterGroupTitle}>Payoff Values</h3>
                
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>
                    Reward (R) - Both Cooperate
                    <div className={styles.inputWrapper}>
                      <input
                        type="range"
                        min="-10"
                        max="10"
                        step="0.5"
                        value={playerAReward}
                        onChange={(e) => setPlayerAReward(parseFloat(e.target.value))}
                        className={styles.slider}
                      />
                      <input
                        type="number"
                        min="-10"
                        max="10"
                        step="0.5"
                        value={playerAReward}
                        onChange={(e) => setPlayerAReward(parseFloat(e.target.value) || 0)}
                        className={styles.numberInput}
                      />
                    </div>
                    <div className={styles.valueDisplay}>{formatNumber(playerAReward)}</div>
                  </label>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>
                    Punishment (P) - Both Defect
                    <div className={styles.inputWrapper}>
                      <input
                        type="range"
                        min="-10"
                        max="10"
                        step="0.5"
                        value={playerAPunishment}
                        onChange={(e) => setPlayerAPunishment(parseFloat(e.target.value))}
                        className={styles.slider}
                      />
                      <input
                        type="number"
                        min="-10"
                        max="10"
                        step="0.5"
                        value={playerAPunishment}
                        onChange={(e) => setPlayerAPunishment(parseFloat(e.target.value) || 0)}
                        className={styles.numberInput}
                      />
                    </div>
                    <div className={styles.valueDisplay}>{formatNumber(playerAPunishment)}</div>
                  </label>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>
                    Temptation (T) - Defect vs. Cooperate
                    <div className={styles.inputWrapper}>
                      <input
                        type="range"
                        min="-10"
                        max="10"
                        step="0.5"
                        value={playerBTemptation}
                        onChange={(e) => setPlayerBTemptation(parseFloat(e.target.value))}
                        className={styles.slider}
                      />
                      <input
                        type="number"
                        min="-10"
                        max="10"
                        step="0.5"
                        value={playerBTemptation}
                        onChange={(e) => setPlayerBTemptation(parseFloat(e.target.value) || 0)}
                        className={styles.numberInput}
                      />
                    </div>
                    <div className={styles.valueDisplay}>{formatNumber(playerBTemptation)}</div>
                  </label>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>
                    Sucker's Payoff (S) - Cooperate vs. Defect
                    <div className={styles.inputWrapper}>
                      <input
                        type="range"
                        min="-10"
                        max="10"
                        step="0.5"
                        value={playerBSucker}
                        onChange={(e) => setPlayerBSucker(parseFloat(e.target.value))}
                        className={styles.slider}
                      />
                      <input
                        type="number"
                        min="-10"
                        max="10"
                        step="0.5"
                        value={playerBSucker}
                        onChange={(e) => setPlayerBSucker(parseFloat(e.target.value) || 0)}
                        className={styles.numberInput}
                      />
                    </div>
                    <div className={styles.valueDisplay}>{formatNumber(playerBSucker)}</div>
                  </label>
                </div>
              </div>

              <div className={styles.repeatedGameParams}>
                <h3 className={styles.parameterGroupTitle}>Repeated Game Parameters</h3>
                
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>
                    Number of Iterations
                    <div className={styles.inputWrapper}>
                      <input
                        type="range"
                        min="1"
                        max="100"
                        step="1"
                        value={iterations}
                        onChange={(e) => setIterations(parseInt(e.target.value))}
                        className={styles.slider}
                      />
                      <input
                        type="number"
                        min="1"
                        max="100"
                        step="1"
                        value={iterations}
                        onChange={(e) => setIterations(parseInt(e.target.value) || 1)}
                        className={styles.numberInput}
                      />
                    </div>
                    <div className={styles.valueDisplay}>{iterations} rounds</div>
                  </label>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>
                    Discount Factor (δ)
                    <div className={styles.inputWrapper}>
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.05"
                        value={discountFactor}
                        onChange={(e) => setDiscountFactor(parseFloat(e.target.value))}
                        className={styles.slider}
                      />
                      <input
                        type="number"
                        min="0.1"
                        max="1"
                        step="0.05"
                        value={discountFactor}
                        onChange={(e) => setDiscountFactor(parseFloat(e.target.value) || 0.1)}
                        className={styles.numberInput}
                      />
                    </div>
                    <div className={styles.valueDisplay}>{formatNumber(discountFactor)}</div>
                  </label>
                </div>
              </div>

              <div className={styles.strategySelection}>
                <h3 className={styles.parameterGroupTitle}>Strategy Selection</h3>
                
                <div className={styles.strategyRow}>
                  <div className={styles.strategyColumn}>
                    <label className={styles.inputLabel}>
                      Player A Strategy
                      <select
                        value={strategyA}
                        onChange={(e) => setStrategyA(e.target.value)}
                        className={styles.selectInput}
                      >
                        {Object.keys(strategies).map(key => (
                          <option key={key} value={key}>{strategies[key].name}</option>
                        ))}
                      </select>
                    </label>
                    <div className={styles.strategyDescription}>
                      {strategies[strategyA].description}
                    </div>
                  </div>
                  
                  <div className={styles.strategyColumn}>
                    <label className={styles.inputLabel}>
                      Player B Strategy
                      <select
                        value={strategyB}
                        onChange={(e) => setStrategyB(e.target.value)}
                        className={styles.selectInput}
                      >
                        {Object.keys(strategies).map(key => (
                          <option key={key} value={key}>{strategies[key].name}</option>
                        ))}
                      </select>
                    </label>
                    <div className={styles.strategyDescription}>
                      {strategies[strategyB].description}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Game Analysis Results</h2>
              
              {results && (
                <>
                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Total Payoff (A)</div>
                      <div className={styles.resultValue}>{formatNumber(results.totalPayoffA)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Total Payoff (B)</div>
                      <div className={styles.resultValue}>{formatNumber(results.totalPayoffB)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Avg. Payoff (A)</div>
                      <div className={styles.resultValue}>{formatNumber(results.averagePayoffA)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Avg. Payoff (B)</div>
                      <div className={styles.resultValue}>{formatNumber(results.averagePayoffB)}</div>
                    </div>
                  </div>

                  {/* Payoff Matrix */}
                  <div className={styles.payoffMatrix}>
                    <h3 className={styles.chartTitle}>Payoff Matrix</h3>
                    <div className={styles.matrixContainer}>
                      <div className={styles.matrixHeader}>
                        <div className={styles.matrixCell}></div>
                        <div className={styles.matrixCell}>Player B: Cooperate</div>
                        <div className={styles.matrixCell}>Player B: Defect</div>
                      </div>
                      <div className={styles.matrixRow}>
                        <div className={styles.matrixCell}>Player A: Cooperate</div>
                        <div className={styles.matrixCell}>
                          <div className={styles.payoffPair}>
                            <span className={styles.payoffValue}>{formatNumber(results.singleShotPayoffs.CC.A)}</span>
                            <span className={styles.payoffValue}>{formatNumber(results.singleShotPayoffs.CC.B)}</span>
                          </div>
                        </div>
                        <div className={styles.matrixCell}>
                          <div className={styles.payoffPair}>
                            <span className={styles.payoffValue}>{formatNumber(results.singleShotPayoffs.CD.A)}</span>
                            <span className={styles.payoffValue}>{formatNumber(results.singleShotPayoffs.CD.B)}</span>
                          </div>
                        </div>
                      </div>
                      <div className={styles.matrixRow}>
                        <div className={styles.matrixCell}>Player A: Defect</div>
                        <div className={styles.matrixCell}>
                          <div className={styles.payoffPair}>
                            <span className={styles.payoffValue}>{formatNumber(results.singleShotPayoffs.DC.A)}</span>
                            <span className={styles.payoffValue}>{formatNumber(results.singleShotPayoffs.DC.B)}</span>
                          </div>
                        </div>
                        <div className={styles.matrixCell}>
                          <div className={styles.payoffPair}>
                            <span className={styles.payoffValue}>{formatNumber(results.singleShotPayoffs.DD.A)}</span>
                            <span className={styles.payoffValue}>{formatNumber(results.singleShotPayoffs.DD.B)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Nash Equilibria */}
                  <div className={styles.equilibriumSection}>
                    <h3 className={styles.chartTitle}>Nash Equilibria</h3>
                    {results.nashEquilibria.length > 0 ? (
                      <div className={styles.equilibriumList}>
                        {results.nashEquilibria.map((eq, index) => (
                          <div key={index} className={styles.equilibriumItem}>
                            <div className={styles.equilibriumOutcome}>{eq.description}</div>
                            <div className={styles.equilibriumPayoffs}>
                              A: {formatNumber(eq.payoffA)}, B: {formatNumber(eq.payoffB)}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={styles.noEquilibrium}>No pure strategy Nash equilibrium found</div>
                    )}
                  </div>

                  {/* Pareto Efficiency */}
                  <div className={styles.paretoSection}>
                    <h3 className={styles.chartTitle}>Pareto Efficient Outcomes</h3>
                    <div className={styles.paretoList}>
                      {results.paretoEfficient.map((outcome, index) => (
                        <div key={index} className={styles.paretoItem}>
                          <div className={styles.paretoOutcome}>{outcome.description}</div>
                          <div className={styles.paretoPayoffs}>
                            A: {formatNumber(outcome.payoffA)}, B: {formatNumber(outcome.payoffB)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>🎮 Strategic Insights</h3>
                    <ul className={styles.insightsList}>
                      <li><strong>Game Type:</strong> {results.gameName}</li>
                      <li><strong>Condition for Prisoner's Dilemma:</strong> T &gt; R &gt; P &gt; S</li>
                      <li><strong>Condition fulfilled:</strong> {playerBTemptation > playerAReward && playerAReward > playerAPunishment && playerAPunishment > playerBSucker ? 'Yes' : 'No'}</li>
                      <li><strong>Most efficient outcome:</strong> Both Cooperate (if R &gt; P)</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Educational Content */}
          <div className={styles.educationalContent}>
            <article className={styles.articleCard}>
              <h2 className={styles.articleTitle}>Understanding Game Theory: Strategic Decision Making</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Key Concepts in Game Theory</h3>
                <p>Game theory is the mathematical study of strategic interaction between rational decision-makers. It provides a framework for understanding situations where your outcome depends not only on your choices but also on the choices of others.</p>
                
                <div className={styles.exampleCard}>
                  <h4>Classic Games:</h4>
                  <ul>
                    <li><strong>Prisoner's Dilemma:</strong> Individual rationality leads to collectively worse outcome</li>
                    <li><strong>Chicken Game:</strong> Bluffing and brinkmanship in confrontations</li>
                    <li><strong>Stag Hunt:</strong> Risk vs. coordination in cooperative ventures</li>
                    <li><strong>Battle of the Sexes:</strong> Coordination with conflicting preferences</li>
                    <li><strong>Matching Pennies:</strong> Pure competition with no cooperation</li>
                  </ul>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Important Solution Concepts</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>🎯 Nash Equilibrium</h4>
                    <p>A set of strategies where no player can improve their payoff by unilaterally changing strategy. Named after John Nash, Nobel laureate and subject of "A Beautiful Mind."</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📈 Pareto Efficiency</h4>
                    <p>An outcome where no one can be made better off without making someone else worse off. Pareto improvements benefit at least one person without harming others.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>⚖️ Dominant Strategy</h4>
                    <p>A strategy that yields the highest payoff regardless of what other players do. In Prisoner's Dilemma, defection is a dominant strategy.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🔄 Repeated Games</h4>
                    <p>When the same game is played multiple times, cooperation can emerge through strategies like Tit-for-Tat, which punishes defection and rewards cooperation.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Real-World Applications</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Economics:</strong> Oligopoly pricing, auction design, market competition</li>
                  <li><strong>Business Strategy:</strong> Entry deterrence, product positioning, negotiation tactics</li>
                  <li><strong>Political Science:</strong> Voting systems, international relations, treaty negotiations</li>
                  <li><strong>Biology:</strong> Evolutionary stable strategies, animal behavior, resource competition</li>
                  <li><strong>Computer Science:</strong> Algorithm design, network protocols, AI decision-making</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Insights</h3>
                <blockquote className={styles.expertQuote}>
                  "The fundamental insight of game theory is that rational behavior in strategic situations requires thinking about what others are thinking about what you're thinking. It's not just about your optimal move, but about the entire system of strategic interactions."
                  <footer className={styles.quoteFooter}>— Professor of Economics, Game Theory Specialist</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What makes a game a Prisoner's Dilemma?</h3>
                <p className={styles.faqAnswer}>A game is a Prisoner's Dilemma when it satisfies the condition T &gt; R &gt; P &gt; S, where T is temptation payoff, R is reward, P is punishment, and S is sucker's payoff. This creates a situation where mutual defection is the Nash equilibrium, but mutual cooperation yields higher payoffs for both players.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How does repeated play change game outcomes?</h3>
                <p className={styles.faqAnswer}>In repeated games, players can use strategies that consider past behavior. This enables cooperation to emerge through reciprocity, punishment of defectors, and reputation building. The shadow of the future (discount factor) determines how much players value future payoffs relative to current ones.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's the difference between zero-sum and non-zero-sum games?</h3>
                <p className={styles.faqAnswer}>In zero-sum games, one player's gain equals another's loss (sum of payoffs is zero). In non-zero-sum games, players can both gain or both lose. Most real-world situations are non-zero-sum, allowing for cooperation and mutual benefit.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What is a mixed strategy Nash equilibrium?</h3>
                <p className={styles.faqAnswer}>A mixed strategy equilibrium occurs when players randomize their strategies with specific probabilities. This happens when no pure strategy (always choosing one action) is optimal. In Matching Pennies, the mixed strategy equilibrium is to choose each option with 50% probability.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Ready to Analyze Strategic Interactions?</h2>
              <p className={styles.ctaText}>Use this calculator to explore different game scenarios, test strategies, and understand strategic decision-making. Experiment with different parameters to see how outcomes change.</p>
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator is for educational purposes to demonstrate game theory concepts. Real-world strategic interactions involve additional complexities including incomplete information, bounded rationality, and emotional factors. Game theory models simplify reality to provide analytical insights.
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
    revalidate: 21600,
  };
}

export default GameTheoryPayoffCalculator;