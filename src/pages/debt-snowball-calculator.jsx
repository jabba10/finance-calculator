import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import Link from 'next/link';
import styles from './debtsnowballcalculator.module.css';

const DebtSnowballCalculator = () => {
  const ctaButtonRef = useRef(null);

  const [debts, setDebts] = useState([
    { name: 'Credit Card', balance: '5000', interestRate: '18.9', minPayment: '150' },
    { name: 'Student Loan', balance: '25000', interestRate: '5.6', minPayment: '200' },
    { name: 'Car Loan', balance: '15000', interestRate: '7.5', minPayment: '300' }
  ]);

  const [inputs, setInputs] = useState({
    extraPayment: '500',
    strategy: 'snowball'
  });

  const [results, setResults] = useState(null);

  const calculateDebtPayoff = () => {
    const extraPayment = parseFloat(inputs.extraPayment) || 0;
    const strategy = inputs.strategy;

    let debtList = debts
      .map((debt) => ({
        name: debt.name,
        balance: parseFloat(debt.balance) || 0,
        interestRate: (parseFloat(debt.interestRate) || 0) / 100,
        minPayment: parseFloat(debt.minPayment) || 0,
        totalPaid: 0,
        interestPaid: 0,
        months: 0
      }))
      .filter((debt) => debt.balance > 0);

    if (strategy === 'snowball') {
      debtList.sort((a, b) => a.balance - b.balance);
    } else {
      debtList.sort((a, b) => b.interestRate - a.interestRate);
    }

    let month = 0;
    let totalInterestPaid = 0;
    let monthlyBreakdown = [];
    let currentExtraPayment = extraPayment;

    while (debtList.length > 0) {
      month++;
      let monthlyInterest = 0;
      let monthlyPrincipal = 0;

      for (let i = 1; i < debtList.length; i++) {
        const debt = debtList[i];
        const interest = (debt.balance * debt.interestRate) / 12;
        let payment = Math.min(debt.minPayment, debt.balance + interest);
        let principal = payment - interest;

        debt.balance -= principal;
        debt.totalPaid += payment;
        debt.interestPaid += interest;
        monthlyInterest += interest;
        monthlyPrincipal += principal;

        if (debt.balance <= 0.01) {
          debtList.splice(i, 1);
          i--;
        }
      }

      if (debtList.length > 0) {
        const firstDebt = debtList[0];
        const interest = (firstDebt.balance * firstDebt.interestRate) / 12;
        let payment = firstDebt.minPayment + currentExtraPayment;
        payment = Math.min(payment, firstDebt.balance + interest);
        let principal = payment - interest;

        firstDebt.balance -= principal;
        firstDebt.totalPaid += payment;
        firstDebt.interestPaid += interest;
        firstDebt.months = month;
        monthlyInterest += interest;
        monthlyPrincipal += principal;

        if (firstDebt.balance <= 0.01) {
          currentExtraPayment += firstDebt.minPayment;
          debtList.shift();
        }
      }

      totalInterestPaid += monthlyInterest;
      monthlyBreakdown.push({
        month,
        interestPaid: monthlyInterest.toFixed(2),
        principalPaid: monthlyPrincipal.toFixed(2),
        remainingDebts: debtList.length,
        totalPaid: (monthlyInterest + monthlyPrincipal).toFixed(2)
      });

      if (month > 600) break;
    }

    setResults({
      totalMonths: month,
      totalInterestPaid: totalInterestPaid.toFixed(2),
      monthlyBreakdown,
      strategy,
      extraPayment
    });
  };

  const handleDebtChange = (index, field, value) => {
    const newDebts = [...debts];
    newDebts[index][field] = value;
    setDebts(newDebts);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const addDebt = () => {
    setDebts([...debts, { name: '', balance: '', interestRate: '', minPayment: '' }]);
  };

  const removeDebt = (index) => {
    const newDebts = [...debts];
    newDebts.splice(index, 1);
    setDebts(newDebts);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateDebtPayoff();
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
        <title>Debt Snowball Calculator | Pay Off Debt Faster with Snowball or Avalanche</title>
        <meta
          name="description"
          content="Create a personalized debt payoff plan using the snowball (smallest first) or avalanche (highest interest first) method. Estimate time to debt freedom."
        />
        <meta
          name="keywords"
          content="debt snowball calculator, debt avalanche, payoff debt faster, debt free journey, debt repayment plan"
        />
        <meta property="og:title" content="Debt Snowball Calculator" />
        <meta
          property="og:description"
          content="Calculate how fast you can become debt-free using the snowball or avalanche method."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className={styles.container}>
        {/* Spacer for Navbar */}
        <div className={styles.spacerTop}></div>

        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Debt Snowball Calculator</h1>
          <p className={styles.subtitle}>
            Create a personalized debt payoff plan using the snowball or avalanche method.
          </p>
        </section>

        {/* Calculator Section */}
        <section>
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <h3 className={styles.formSectionTitle}>Your Debts</h3>
              {debts.map((debt, index) => (
                <div key={index} className={styles.debtRow}>
                  <div className={styles.debtInputGroup}>
                    <label className={styles.debtLabel}>Debt Name</label>
                    <input
                      type="text"
                      value={debt.name}
                      onChange={(e) => handleDebtChange(index, 'name', e.target.value)}
                      placeholder="e.g. Credit Card"
                      className={styles.debtInput}
                    />
                  </div>
                  <div className={styles.debtInputGroup}>
                    <label className={styles.debtLabel}>Balance ($)</label>
                    <input
                      type="number"
                      value={debt.balance}
                      onChange={(e) => handleDebtChange(index, 'balance', e.target.value)}
                      placeholder="e.g. 5000"
                      step="any"
                      className={styles.debtInput}
                    />
                  </div>
                  <div className={styles.debtInputGroup}>
                    <label className={styles.debtLabel}>Interest Rate (%)</label>
                    <input
                      type="number"
                      value={debt.interestRate}
                      onChange={(e) => handleDebtChange(index, 'interestRate', e.target.value)}
                      placeholder="e.g. 18.9"
                      step="any"
                      className={styles.debtInput}
                    />
                  </div>
                  <div className={styles.debtInputGroup}>
                    <label className={styles.debtLabel}>Min. Payment ($)</label>
                    <input
                      type="number"
                      value={debt.minPayment}
                      onChange={(e) => handleDebtChange(index, 'minPayment', e.target.value)}
                      placeholder="e.g. 150"
                      step="any"
                      className={styles.debtInput}
                    />
                  </div>
                  <button
                    type="button"
                    className={styles.debtRemoveBtn}
                    onClick={() => removeDebt(index)}
                    aria-label="Remove debt"
                  >
                    ×
                  </button>
                </div>
              ))}

              <button type="button" className={styles.addDebtBtn} onClick={addDebt}>
                + Add Another Debt
              </button>

              <div className={styles.inputGroup}>
                <label htmlFor="extraPayment" className={styles.label}>
                  Extra Monthly Payment ($)
                </label>
                <input
                  type="number"
                  id="extraPayment"
                  name="extraPayment"
                  value={inputs.extraPayment}
                  onChange={handleInputChange}
                  placeholder="e.g. 500"
                  step="any"
                  className={styles.input}
                />
                <p className={styles.note}>Amount you can pay beyond minimum payments</p>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="strategy" className={styles.label}>
                  Payoff Strategy
                </label>
                <select
                  id="strategy"
                  name="strategy"
                  value={inputs.strategy}
                  onChange={handleInputChange}
                  className={styles.input}
                >
                  <option value="snowball">Snowball Method (Smallest Balances First)</option>
                  <option value="avalanche">Avalanche Method (Highest Interest First)</option>
                </select>
              </div>

              <button type="submit" className={styles.submitBtn}>
                <span>Calculate Payoff Plan</span>
                <span className={styles.arrow}>→</span>
              </button>
            </form>

            {results && (
              <div className={styles.resultSection}>
                <h3>Debt Payoff Projection</h3>
                <div className={styles.resultGrid}>
                  <div className={`${styles.resultItem} ${styles.highlight}`}>
                    <strong>Time to Debt Freedom:</strong>{' '}
                    {Math.floor(results.totalMonths / 12)} years {results.totalMonths % 12} months
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Total Interest Paid:</strong> ${results.totalInterestPaid}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Strategy Used:</strong>{' '}
                    {results.strategy === 'snowball' ? 'Snowball Method' : 'Avalanche Method'}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Extra Monthly Payment:</strong> ${results.extraPayment}
                  </div>
                </div>

                <h4 className={styles.resultSubheading}>Monthly Breakdown</h4>
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Month</th>
                        <th>Principal Paid</th>
                        <th>Interest Paid</th>
                        <th>Total Paid</th>
                        <th>Debts Remaining</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.monthlyBreakdown.slice(0, 12).map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.month}</td>
                          <td>${item.principalPaid}</td>
                          <td>${item.interestPaid}</td>
                          <td>${item.totalPaid}</td>
                          <td>{item.remainingDebts}</td>
                        </tr>
                      ))}
                      {results.monthlyBreakdown.length > 12 && (
                        <tr>
                          <td colSpan="5" className={styles.tableNote}>
                            ...showing first 12 months of {results.totalMonths} total months
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <p className={styles.note}>
                  {results.strategy === 'snowball'
                    ? 'The snowball method focuses on paying off smallest debts first for psychological wins.'
                    : 'The avalanche method saves you the most money by targeting high-interest debts first.'}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h3>Understanding Debt Payoff Strategies</h3>
            <p>
              Getting out of debt requires a solid plan. The <strong>debt snowball</strong> and{' '}
              <strong>debt avalanche</strong> methods are two proven approaches to eliminate debt efficiently.
            </p>

            <h4>Debt Snowball Method</h4>
            <ul className={styles.list}>
              <li>
                <strong>How it works:</strong> Pay minimums on all debts, then put extra money toward the{' '}
                <strong>smallest balance</strong> first
              </li>
              <li>
                <strong>Advantage:</strong> Quick wins keep you motivated as you eliminate entire debts
              </li>
              <li>
                <strong>Best for:</strong> People who need psychological encouragement to stay on track
              </li>
              <li>
                <strong>Example:</strong> Pay off a $500 medical bill before a $2,000 credit card
              </li>
            </ul>

            <h4>Debt Avalanche Method</h4>
            <ul className={styles.list}>
              <li>
                <strong>How it works:</strong> Pay minimums on all debts, then put extra money toward the{' '}
                <strong>highest interest rate</strong> debt first
              </li>
              <li>
                <strong>Advantage:</strong> Saves you the most money in interest payments
              </li>
              <li>
                <strong>Best for:</strong> People motivated by math and saving money
              </li>
              <li>
                <strong>Example:</strong> Pay off a 20% APR credit card before a 5% student loan
              </li>
            </ul>

            <h4>Key Benefits of Becoming Debt-Free</h4>
            <div className={styles.benefitsGrid}>
              <div className={styles.benefitItem}>
                <h5>Financial Freedom</h5>
                <p>More money available for savings, investments, and life goals</p>
              </div>
              <div className={styles.benefitItem}>
                <h5>Reduced Stress</h5>
                <p>Eliminate the mental burden of owing money</p>
              </div>
              <div className={styles.benefitItem}>
                <h5>Improved Credit</h5>
                <p>Lower credit utilization raises your credit score</p>
              </div>
              <div className={styles.benefitItem}>
                <h5>Better Opportunities</h5>
                <p>Qualify for better rates on mortgages and loans</p>
              </div>
            </div>

            <h4>Debt Payoff Tips</h4>
            <ul className={styles.list}>
              <li><strong>Track spending</strong> to find extra money for debt payments</li>
              <li><strong>Negotiate rates</strong> - call creditors to ask for lower interest</li>
              <li><strong>Consider balance transfers</strong> to 0% APR cards (if disciplined)</li>
              <li><strong>Celebrate milestones</strong> to stay motivated</li>
              <li><strong>Automate payments</strong> to avoid missed payments</li>
              <li><strong>Increase income</strong> with side gigs to pay debt faster</li>
            </ul>

            <h4>Debt Payoff vs. Investing</h4>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Consideration</th>
                  <th>Pay Debt First</th>
                  <th>Invest First</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>When it makes sense</td>
                  <td>High interest debt (greater than 6-8%)</td>
                  <td>Low interest debt (less than 4-5%)</td>
                </tr>
                <tr>
                  <td>Risk Level</td>
                  <td>Guaranteed "return" (interest saved)</td>
                  <td>Market risk but potential growth</td>
                </tr>
                <tr>
                  <td>Best For</td>
                  <td>Those with high-interest consumer debt</td>
                  <td>Those with low-rate mortgages/student loans</td>
                </tr>
              </tbody>
            </table>

            <h4>Common Debt Payoff Mistakes</h4>
            <ul className={styles.list}>
              <li><strong>Not changing spending habits</strong> - continuing to accumulate new debt</li>
              <li><strong>Paying randomly</strong> - without a clear strategy</li>
              <li><strong>Ignoring small debts</strong> - which can be quick wins</li>
              <li><strong>Not tracking progress</strong> - leading to loss of motivation</li>
              <li><strong>Giving up too soon</strong> - debt payoff is a marathon, not a sprint</li>
            </ul>
          </div>
        </section>

        {/* CTA Section — Fixed for Next.js 13+ */}
        <section className={styles.ctaSection}>
          <h2>Free Financial Planning Tools: Budget, Invest & Plan Retirement</h2>
          <p>Free Financial Planning Tools – Try Now</p>
          <Link
            href="/suite"
            className={styles.ctaButton}
            ref={ctaButtonRef}
            onMouseMove={handleMouseMove}
          >
            <span>Explore All Financial Tools</span>
            <span className={styles.arrow}>→</span>
          </Link>
        </section>

        {/* Spacer for Footer */}
        <div className={styles.spacerBottom}></div>
      </div>
    </>
  );
};

export default DebtSnowballCalculator;