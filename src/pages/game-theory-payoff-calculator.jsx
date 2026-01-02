import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './gametheorypayoffcalculator.module.css';

const GameTheoryPayoffCalculator = () => {
  const ctaButtonRef = useRef(null);

  const [payoffs, setPayoffs] = useState({
    TL: { A: 3, B: 3 },
    TR: { A: 0, B: 5 },
    BL: { A: 5, B: 0 },
    BR: { A: 1, B: 1 }
  });

  const [result, setResult] = useState(null);

  const handleChange = (cell, player, value) => {
    const numValue = parseFloat(value) || 0;
    setPayoffs(prev => ({
      ...prev,
      [cell]: { ...prev[cell], [player]: numValue }
    }));
  };

  const findNashEquilibrium = () => {
    const { TL, TR, BL, BR } = payoffs;

    const cells = [
      { name: 'CC', payoffs: TL, aMove: 'C', bMove: 'C' },
      { name: 'CD', payoffs: TR, aMove: 'C', bMove: 'D' },
      { name: 'DC', payoffs: BL, aMove: 'D', bMove: 'C' },
      { name: 'DD', payoffs: BR, aMove: 'D', bMove: 'D' }
    ];

    const nash = [];

    for (let cell of cells) {
      const { payoffs: P, aMove, bMove } = cell;

      const aBetter =
        (aMove === 'C' && BL.A > P.A) ||
        (aMove === 'D' && TL.A > P.A);

      const bBetter =
        (bMove === 'C' && TR.B > P.B) ||
        (bMove === 'D' && BR.B > P.B);

      if (!aBetter && !bBetter) {
        nash.push({
          strategy: `${aMove === 'C' ? 'Cooperate' : 'Defect'} vs ${bMove === 'C' ? 'Cooperate' : 'Defect'}`,
          payoffA: P.A,
          payoffB: P.B
        });
      }
    }

    setResult(nash.length > 0 ? nash : []);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    findNashEquilibrium();
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

  // Game Theory Payoff Calculator History Data
  const gameTheoryHistory = [
    {
      id: 1,
      title: "History & Discovery of Game Theory",
      points: [
        "1928: John von Neumann proved minimax theorem, founding modern game theory",
        "1944: Von Neumann & Oskar Morgenstern published 'Theory of Games and Economic Behavior'",
        "1950: John Nash formalized Nash Equilibrium concept for Nobel Prize-winning work",
        "1960s: Reinhard Selten & John Harsanyi expanded to extensive-form and Bayesian games",
        "1970s: Evolutionary game theory applied to biology by John Maynard Smith",
        "1980s: Behavioral game theory integrated psychology into strategic analysis",
        "1990s: Game theory revolutionized auction design and telecom spectrum auctions"
      ]
    },
    {
      id: 2,
      title: "Country Origins & Scientific Purpose",
      points: [
        "Germany: Oskar Morgenstern co-founded mathematical game theory at Princeton",
        "United States: John Nash at Princeton University developed equilibrium concepts",
        "Hungary: John von Neumann established mathematical foundations of game theory",
        "United Kingdom: Evolutionary game theory developed at Cambridge University",
        "Israel: Robert Aumann advanced repeated games and correlated equilibrium",
        "Purpose: Analyze strategic decision-making where outcomes depend on others' choices"
      ]
    },
    {
      id: 3,
      title: "Key Industries & Monthly Applications",
      points: [
        "Investment Banking: Daily auction design and bidding strategies",
        "Telecommunications: Monthly spectrum auction optimization",
        "Tech Companies: Weekly platform competition and pricing strategies",
        "Retail: Continuous price matching and promotion timing analysis",
        "Sports: Game strategy optimization and player contract negotiations",
        "Politics: Campaign strategy and voting system analysis",
        "Military: Strategic planning and conflict resolution modeling"
      ]
    },
    {
      id: 4,
      title: "Problem Solving & Strategic Impact",
      points: [
        "Increases auction revenue by 30-50% through optimal bidding strategies",
        "Improves pricing profits by 20-40% through competitive analysis",
        "Reduces negotiation deadlocks by 60-80% through cooperative game solutions",
        "Enhances military strategy success rates by 25-45% through game-theoretic planning",
        "Improves sports team performance by 15-30% through optimal play calling",
        "Increases political campaign effectiveness by 35-55% through strategic messaging",
        "Reduces business competition losses by 40-60% through preemptive strategies"
      ]
    },
    {
      id: 5,
      title: "Revenue Generation Applications",
      points: [
        "Consulting Firms: Charge $100,000-$1M for game theory strategy implementations",
        "Academic Research: Secure $500,000-$5M grants for game theory applications",
        "Investment Banks: Generate $10M-$100M through optimal auction designs",
        "Sports Analytics: Teams pay $500,000-$2M annually for game theory analysis",
        "Tech Platforms: Increase ad revenue by 20-40% through auction optimization",
        "Government: Save $100M+ through efficient spectrum and resource auctions",
        "Legal Strategy: Law firms charge 15-25% higher fees for game theory-based negotiations"
      ]
    },
    {
      id: 6,
      title: "Ordinary People Game Theory Calculator Uses",
      points: [
        "Salary Negotiations: Calculating optimal offers and counteroffers with employers",
        "Auctions: Determining bidding strategies for eBay or property auctions",
        "Business Partnerships: Analyzing profit-sharing and cooperation strategies",
        "Parenting: Understanding child behavior and incentive systems",
        "Sports: Developing game strategies for recreational team sports",
        "Social Situations: Analyzing party invitation dynamics and social networks",
        "Investment Decisions: Modeling market competition and price wars",
        "Relationship Management: Understanding cooperation and conflict resolution in personal relationships"
      ]
    }
  ];

  return (
    <>
      <Head>
        <html lang="en" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Game Theory Payoff Calculator | Find Nash Equilibrium</title>
        <meta name="description" content="Analyze 2x2 strategic games, input payoffs, and instantly find Nash Equilibria. Free tool for students, economists, and strategists." />
        <link rel="canonical" href="/gametheorypayoffcalculator" />
      </Head>

      <div className={styles.page}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Game Theory Payoff Calculator</h1>
          <p className={styles.subtitle}>
            Analyze strategic decisions using payoff matrices and find Nash Equilibria.
          </p>
        </section>

        {/* Calculator Card */}
        <div className={styles.calculatorCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.instruction}>
              Enter payoffs for each player in the 2×2 matrix (e.g., Prisoner's Dilemma).
            </p>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th></th>
                    <th>Player B: Cooperate</th>
                    <th>Player B: Defect</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Player A: Cooperate</strong></td>
                    <td>
                      <div className={styles.inputGroup}>
                        <input
                          type="number"
                          value={payoffs.TL.A}
                          onChange={(e) => handleChange('TL', 'A', e.target.value)}
                          className={styles.input}
                          step="0.1"
                        />
                        <input
                          type="number"
                          value={payoffs.TL.B}
                          onChange={(e) => handleChange('TL', 'B', e.target.value)}
                          className={styles.input}
                          step="0.1"
                        />
                      </div>
                    </td>
                    <td>
                      <div className={styles.inputGroup}>
                        <input
                          type="number"
                          value={payoffs.TR.A}
                          onChange={(e) => handleChange('TR', 'A', e.target.value)}
                          className={styles.input}
                          step="0.1"
                        />
                        <input
                          type="number"
                          value={payoffs.TR.B}
                          onChange={(e) => handleChange('TR', 'B', e.target.value)}
                          className={styles.input}
                          step="0.1"
                        />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Player A: Defect</strong></td>
                    <td>
                      <div className={styles.inputGroup}>
                        <input
                          type="number"
                          value={payoffs.BL.A}
                          onChange={(e) => handleChange('BL', 'A', e.target.value)}
                          className={styles.input}
                          step="0.1"
                        />
                        <input
                          type="number"
                          value={payoffs.BL.B}
                          onChange={(e) => handleChange('BL', 'B', e.target.value)}
                          className={styles.input}
                          step="0.1"
                        />
                      </div>
                    </td>
                    <td>
                      <div className={styles.inputGroup}>
                        <input
                          type="number"
                          value={payoffs.BR.A}
                          onChange={(e) => handleChange('BR', 'A', e.target.value)}
                          className={styles.input}
                          step="0.1"
                        />
                        <input
                          type="number"
                          value={payoffs.BR.B}
                          onChange={(e) => handleChange('BR', 'B', e.target.value)}
                          className={styles.input}
                          step="0.1"
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button type="submit" className={styles.submitBtn}>
              <span>Find Nash Equilibrium</span>
              <span className={styles.arrow}>→</span>
            </button>
          </form>

          {result !== null && (
            <div className={styles.resultSection}>
              <h3>Nash Equilibrium(s) Found</h3>
              {result.length === 0 ? (
                <p className={styles.resultItem}>
                  <strong>No Nash Equilibrium</strong> exists in pure strategies for this game.
                </p>
              ) : (
                <ul className={styles.list}>
                  {result.map((eq, i) => (
                    <li key={i} className={styles.resultItem}>
                      <strong>{eq.strategy}:</strong> Player A gets <em>{eq.payoffA}</em>, Player B gets <em>{eq.payoffB}</em>
                    </li>
                  ))}
                </ul>
              )}
              <p className={styles.note}>
                A Nash Equilibrium is a strategy pair where no player can improve their payoff by unilaterally changing their decision.
              </p>
            </div>
          )}
        </div>

        {/* History Cards Section */}
        <section className={styles.historySection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h2>Game Theory Payoff Calculator History & Global Applications</h2>
              <p className={styles.sectionSubtitle}>
                Explore the evolution and worldwide impact of game theory calculation tools
              </p>
            </div>
            
            <div className={styles.cardsGrid}>
              {gameTheoryHistory.map((card) => (
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
            <Link
              href="/suite"
              className={styles.ctaButton}
              ref={ctaButtonRef}
              onMouseMove={handleMouseMove}
            >
              <span className={styles.buttonText}>Explore All Calculators</span>
              <span className={styles.arrow}>→</span>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default GameTheoryPayoffCalculator;