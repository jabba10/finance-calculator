import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import Link from 'next/link';
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

  return (
    <>
      <Helmet>
        <title>Game Theory Payoff Calculator | Find Nash Equilibrium</title>
        <meta name="description" content="Analyze 2x2 strategic games, input payoffs, and instantly find Nash Equilibria. Free, responsive, and professional tool for students, economists, and strategists." />
        <meta name="keywords" content="game theory, nash equilibrium, payoff matrix, prisoner's dilemma, strategic decision, calculator" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/gametheorypayoffcalculator" />
      </Helmet>

      <div className={styles.page}>
        <div className={styles.spacerTop}></div>

        <div className={styles.contentWrapper}>
          <section className={styles.hero}>
            <h1 className={styles.title}>Game Theory Payoff Calculator</h1>
            <p className={styles.subtitle}>
              Analyze strategic decisions using payoff matrices and find Nash Equilibria.
            </p>
          </section>

          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter payoffs for each player in the 2×2 matrix (e.g., Prisoner’s Dilemma).
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

          <section className={styles.infoSection}>
            <div className={styles.container}>
              <div className={styles.infoCard}>
                <h3>Why Game Theory Matters</h3>
                <p>
                  <strong>Game Theory</strong> analyzes strategic interactions where the outcome for each participant depends on the choices of others. It's used in economics, business, politics, biology, and AI to model competition, cooperation, and negotiation.
                </p>

                <h4>How to Use This Calculator</h4>
                <p>
                  Enter the payoffs for two players in a 2×2 decision matrix (e.g., Cooperate/Defect). The calculator evaluates each outcome to find <strong>Nash Equilibria</strong> — stable strategy pairs where neither player benefits from changing their move alone.
                </p>

                <h4>The Nash Equilibrium Concept</h4>
                <div className={styles.formula}>
                  <code>
                    A strategy profile is a Nash Equilibrium if no player can gain by changing their strategy while others keep theirs fixed.
                  </code>
                </div>
                <p>
                  This helps predict stable outcomes in competitive scenarios, even when cooperation would yield better collective results (like in the <strong>Prisoner’s Dilemma</strong>).
                </p>

                <h4>Example Games</h4>
                <ul className={styles.list}>
                  <li><strong>Prisoner’s Dilemma:</strong> Both defecting is the equilibrium, even though mutual cooperation is better.</li>
                  <li><strong>Chicken:</strong> Two equilibria exist — one where each player swerves.</li>
                  <li><strong>Coordination Game:</strong> Multiple equilibria where both players choose the same action.</li>
                </ul>

                <h4>Real-World Applications</h4>
                <ul className={styles.list}>
                  <li><strong>Pricing Wars:</strong> Predict competitor pricing strategies</li>
                  <li><strong>Negotiations:</strong> Find stable bargaining outcomes</li>
                  <li><strong>Auctions:</strong> Model bidder behavior</li>
                  <li><strong>AI & Robotics:</strong> Multi-agent decision systems</li>
                </ul>
              </div>
            </div>
          </section>

          <section className={styles.ctaSection}>
            <h2>Free Financial Planning Tools: Budget, Invest & Plan Retirement</h2>
            <p>Free Financial Planning Tools – Try Now</p>
            {/* ✅ FIXED: Removed <a> tag — Link now renders as <a> directly */}
            <Link
              href="/suite"
              className={styles.ctaButton}
              ref={ctaButtonRef}
              onMouseMove={handleMouseMove}
            >
              <span className={styles.btnText}>Explore All Calculators</span>
              <span className={styles.arrow}>→</span>
            </Link>
          </section>
        </div>

        <div className={styles.spacerBottom}></div>
      </div>
    </>
  );
};

export default GameTheoryPayoffCalculator;