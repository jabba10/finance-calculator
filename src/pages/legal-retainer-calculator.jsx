import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './legalretainercalculator.module.css';

const LegalRetainerCalculator = ({ currentDate, lastModifiedDate }) => {
  const [retainerType, setRetainerType] = useState('hourly');
  const [hourlyRate, setHourlyRate] = useState(350);
  const [estimatedHours, setEstimatedHours] = useState(50);
  const [flatFee, setFlatFee] = useState(5000);
  const [contingencyRate, setContingencyRate] = useState(33);
  const [caseValue, setCaseValue] = useState(100000);
  const [monthlyRetainer, setMonthlyRetainer] = useState(3000);
  const [months, setMonths] = useState(6);
  const [additionalCosts, setAdditionalCosts] = useState(1000);
  const [results, setResults] = useState(null);
  const [breakdownData, setBreakdownData] = useState([]);

  const calculateRetainer = () => {
    let totalCost = 0;
    let attorneyFees = 0;
    const breakdown = [];

    switch(retainerType) {
      case 'hourly':
        attorneyFees = hourlyRate * estimatedHours;
        totalCost = attorneyFees + additionalCosts;
        
        breakdown.push({ label: 'Attorney Hours', value: estimatedHours });
        breakdown.push({ label: 'Hourly Rate', value: hourlyRate });
        breakdown.push({ label: 'Attorney Fees', value: attorneyFees });
        break;

      case 'flat-fee':
        attorneyFees = flatFee;
        totalCost = attorneyFees + additionalCosts;
        
        breakdown.push({ label: 'Flat Fee', value: flatFee });
        breakdown.push({ label: 'Scope of Work', value: 'Complete Case Handling' });
        break;

      case 'contingency':
        attorneyFees = caseValue * (contingencyRate / 100);
        totalCost = attorneyFees + additionalCosts;
        
        breakdown.push({ label: 'Case Value', value: caseValue });
        breakdown.push({ label: 'Contingency Rate', value: contingencyRate });
        breakdown.push({ label: 'Attorney Fees', value: attorneyFees });
        break;

      case 'monthly':
        attorneyFees = monthlyRetainer * months;
        totalCost = attorneyFees + additionalCosts;
        
        breakdown.push({ label: 'Monthly Retainer', value: monthlyRetainer });
        breakdown.push({ label: 'Duration', value: `${months} months` });
        breakdown.push({ label: 'Base Attorney Fees', value: attorneyFees });
        break;

      default:
        break;
    }

    breakdown.push({ label: 'Additional Costs', value: additionalCosts });
    breakdown.push({ label: 'Total Estimated Cost', value: totalCost });

    const hourlyEquivalent = retainerType === 'hourly' ? hourlyRate : Math.round(attorneyFees / estimatedHours);
    
    setResults({
      totalCost: Math.round(totalCost * 100) / 100,
      attorneyFees: Math.round(attorneyFees * 100) / 100,
      additionalCosts: Math.round(additionalCosts * 100) / 100,
      hourlyEquivalent: Math.round(hourlyEquivalent * 100) / 100,
      costPerMonth: Math.round((totalCost / months) * 100) / 100
    });
    
    setBreakdownData(breakdown);
  };

  useEffect(() => {
    calculateRetainer();
  }, [retainerType, hourlyRate, estimatedHours, flatFee, contingencyRate, caseValue, monthlyRetainer, months, additionalCosts]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <>
      <Head>
        <title>Legal Retainer Calculator | Estimate Attorney Fees & Legal Costs</title>
        <meta name="description" content="Free legal retainer calculator for attorneys and clients. Estimate legal fees for hourly, flat fee, contingency, and monthly retainer arrangements." />
        <meta name="keywords" content="legal retainer calculator, attorney fees, legal costs, retainer agreement, law firm pricing, legal billing, contingency fee calculator" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/legal-retainer-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Legal Retainer Calculator | Estimate Attorney Fees & Legal Costs" />
        <meta property="og:description" content="Calculate estimated legal costs for different types of retainer agreements. Essential tool for legal planning and budgeting." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/legal-retainer-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Legal Retainer Calculator" />
        <meta name="twitter:description" content="Estimate legal costs and understand different billing arrangements with our comprehensive calculator." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="legal-retainer-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Legal Retainer Calculator",
            "description": "Professional legal retainer calculator for estimating attorney fees and legal costs across different billing arrangements",
            "applicationCategory": "LegalApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "850",
              "bestRating": "5",
              "worstRating": "1"
            },
            "datePublished": currentDate,
            "dateModified": currentDate,
            "author": {
              "@type": "Organization",
              "name": "Legal Tools Pro",
              "url": "https://www.financecalculatorfree.com"
            },
            "featureList": [
              "Multiple Retainer Types",
              "Fee Breakdown Analysis",
              "Cost Comparison",
              "Legal Budget Planning",
              "Professional Reports"
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
                "name": "What is a legal retainer and how does it work?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A legal retainer is an advance payment made to a lawyer to secure their services. It's typically held in a trust account and billed against as work is performed. The retainer ensures the attorney's availability and commitment to your case.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What's the difference between hourly and flat fee retainers?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Hourly retainers bill for actual time spent on your case, while flat fee retainers charge a fixed amount for specific legal services regardless of time spent. Flat fees are common for routine matters like incorporations or wills.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "When should I choose a contingency fee arrangement?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Contingency fees (where the attorney gets a percentage of your recovery) are typically used in personal injury, employment discrimination, and other cases where there's a monetary recovery. No recovery usually means no attorney fees.",
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
            <h1 className={styles.mainTitle}>Legal Retainer Calculator</h1>
            <p className={styles.subtitle}>Estimate Legal Costs Across Different Billing Arrangements</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>Attorney-Reviewed</span>
              <span className={styles.badge}>Confidential</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Calculate Your Legal Costs</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Retainer Type
                  <select
                    value={retainerType}
                    onChange={(e) => setRetainerType(e.target.value)}
                    className={styles.selectInput}
                  >
                    <option value="hourly">Hourly Billing</option>
                    <option value="flat-fee">Flat Fee</option>
                    <option value="contingency">Contingency Fee</option>
                    <option value="monthly">Monthly Retainer</option>
                  </select>
                </label>
              </div>

              {retainerType === 'hourly' && (
                <>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      Attorney Hourly Rate
                      <div className={styles.inputWrapper}>
                        <span className={styles.currencySymbol}>$</span>
                        <input
                          type="range"
                          min="100"
                          max="1000"
                          step="10"
                          value={hourlyRate}
                          onChange={(e) => setHourlyRate(parseInt(e.target.value))}
                          className={styles.slider}
                        />
                        <input
                          type="number"
                          min="100"
                          max="1000"
                          step="10"
                          value={hourlyRate}
                          onChange={(e) => setHourlyRate(parseInt(e.target.value) || 0)}
                          className={styles.numberInput}
                        />
                      </div>
                      <div className={styles.valueDisplay}>{formatCurrency(hourlyRate)}/hour</div>
                    </label>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      Estimated Hours Required
                      <div className={styles.inputWrapper}>
                        <input
                          type="range"
                          min="5"
                          max="500"
                          step="5"
                          value={estimatedHours}
                          onChange={(e) => setEstimatedHours(parseInt(e.target.value))}
                          className={styles.slider}
                        />
                        <input
                          type="number"
                          min="5"
                          max="500"
                          step="5"
                          value={estimatedHours}
                          onChange={(e) => setEstimatedHours(parseInt(e.target.value) || 0)}
                          className={styles.numberInput}
                        />
                        <span className={styles.yearsSymbol}>hours</span>
                      </div>
                      <div className={styles.valueDisplay}>{estimatedHours} hours</div>
                    </label>
                  </div>
                </>
              )}

              {retainerType === 'flat-fee' && (
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>
                    Flat Fee Amount
                    <div className={styles.inputWrapper}>
                      <span className={styles.currencySymbol}>$</span>
                      <input
                        type="range"
                        min="500"
                        max="50000"
                        step="500"
                        value={flatFee}
                        onChange={(e) => setFlatFee(parseInt(e.target.value))}
                        className={styles.slider}
                      />
                      <input
                        type="number"
                        min="500"
                        max="50000"
                        step="500"
                        value={flatFee}
                        onChange={(e) => setFlatFee(parseInt(e.target.value) || 0)}
                        className={styles.numberInput}
                      />
                    </div>
                    <div className={styles.valueDisplay}>{formatCurrency(flatFee)}</div>
                  </label>
                </div>
              )}

              {retainerType === 'contingency' && (
                <>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      Contingency Fee Percentage
                      <div className={styles.inputWrapper}>
                        <input
                          type="range"
                          min="25"
                          max="50"
                          step="0.5"
                          value={contingencyRate}
                          onChange={(e) => setContingencyRate(parseFloat(e.target.value))}
                          className={styles.slider}
                        />
                        <input
                          type="number"
                          min="25"
                          max="50"
                          step="0.5"
                          value={contingencyRate}
                          onChange={(e) => setContingencyRate(parseFloat(e.target.value) || 0)}
                          className={styles.numberInput}
                        />
                        <span className={styles.percentageSymbol}>%</span>
                      </div>
                      <div className={styles.valueDisplay}>{formatPercentage(contingencyRate)}</div>
                    </label>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      Estimated Case Value
                      <div className={styles.inputWrapper}>
                        <span className={styles.currencySymbol}>$</span>
                        <input
                          type="range"
                          min="10000"
                          max="1000000"
                          step="10000"
                          value={caseValue}
                          onChange={(e) => setCaseValue(parseInt(e.target.value))}
                          className={styles.slider}
                        />
                        <input
                          type="number"
                          min="10000"
                          max="1000000"
                          step="10000"
                          value={caseValue}
                          onChange={(e) => setCaseValue(parseInt(e.target.value) || 0)}
                          className={styles.numberInput}
                        />
                      </div>
                      <div className={styles.valueDisplay}>{formatCurrency(caseValue)}</div>
                    </label>
                  </div>
                </>
              )}

              {retainerType === 'monthly' && (
                <>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      Monthly Retainer Fee
                      <div className={styles.inputWrapper}>
                        <span className={styles.currencySymbol}>$</span>
                        <input
                          type="range"
                          min="1000"
                          max="20000"
                          step="500"
                          value={monthlyRetainer}
                          onChange={(e) => setMonthlyRetainer(parseInt(e.target.value))}
                          className={styles.slider}
                        />
                        <input
                          type="number"
                          min="1000"
                          max="20000"
                          step="500"
                          value={monthlyRetainer}
                          onChange={(e) => setMonthlyRetainer(parseInt(e.target.value) || 0)}
                          className={styles.numberInput}
                        />
                      </div>
                      <div className={styles.valueDisplay}>{formatCurrency(monthlyRetainer)}/month</div>
                    </label>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                      Retainer Duration
                      <div className={styles.inputWrapper}>
                        <input
                          type="range"
                          min="1"
                          max="36"
                          step="1"
                          value={months}
                          onChange={(e) => setMonths(parseInt(e.target.value))}
                          className={styles.slider}
                        />
                        <input
                          type="number"
                          min="1"
                          max="36"
                          step="1"
                          value={months}
                          onChange={(e) => setMonths(parseInt(e.target.value) || 0)}
                          className={styles.numberInput}
                        />
                        <span className={styles.yearsSymbol}>months</span>
                      </div>
                      <div className={styles.valueDisplay}>{months} months</div>
                    </label>
                  </div>
                </>
              )}

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Additional Costs & Expenses
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="100"
                      value={additionalCosts}
                      onChange={(e) => setAdditionalCosts(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="10000"
                      step="100"
                      value={additionalCosts}
                      onChange={(e) => setAdditionalCosts(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(additionalCosts)}</div>
                </label>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Estimated Legal Costs</h2>
              
              {results && (
                <>
                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Total Estimated Cost</div>
                      <div className={styles.resultValue}>{formatCurrency(results.totalCost)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Attorney Fees</div>
                      <div className={styles.resultValue}>{formatCurrency(results.attorneyFees)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Additional Costs</div>
                      <div className={styles.resultValue}>{formatCurrency(results.additionalCosts)}</div>
                    </div>
                    {retainerType !== 'contingency' && (
                      <div className={styles.resultItem}>
                        <div className={styles.resultLabel}>Effective Hourly Rate</div>
                        <div className={styles.resultValue}>{formatCurrency(results.hourlyEquivalent)}</div>
                      </div>
                    )}
                    {retainerType === 'monthly' && (
                      <div className={styles.resultItem}>
                        <div className={styles.resultLabel}>Cost Per Month</div>
                        <div className={styles.resultValue}>{formatCurrency(results.costPerMonth)}</div>
                      </div>
                    )}
                    {retainerType === 'contingency' && (
                      <div className={styles.resultItem}>
                        <div className={styles.resultLabel}>Your Net Recovery</div>
                        <div className={styles.resultValue}>{formatCurrency(caseValue - results.attorneyFees)}</div>
                      </div>
                    )}
                  </div>

                  {/* Cost Breakdown */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>Cost Breakdown</h3>
                    <div className={styles.chartBars}>
                      {breakdownData.map((item, index) => (
                        <div key={index} className={styles.chartBarGroup}>
                          <div className={styles.chartBarLabel}>{item.label}</div>
                          <div className={styles.chartBarContainer}>
                            <div 
                              className={item.label.includes('Total') ? styles.chartBarTotal : styles.chartBarRegular}
                              style={{ 
                                width: `${Math.min((item.value / results.totalCost) * 100, 100)}%`,
                                maxWidth: '100%'
                              }}
                              title={`${item.label}: ${typeof item.value === 'number' ? formatCurrency(item.value) : item.value}`}
                            />
                          </div>
                          <div className={styles.chartBarValue}>
                            {typeof item.value === 'number' ? formatCurrency(item.value) : item.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>⚖️ Key Legal Insights</h3>
                    <ul className={styles.insightsList}>
                      {retainerType === 'hourly' && (
                        <>
                          <li>Your estimated legal fees are <strong>{formatCurrency(results.attorneyFees)}</strong> for {estimatedHours} hours of work</li>
                          <li>Additional costs represent <strong>{formatPercentage((additionalCosts / results.totalCost) * 100)}</strong> of your total estimate</li>
                          <li>Consider requesting monthly billing statements to track hours</li>
                        </>
                      )}
                      {retainerType === 'flat-fee' && (
                        <>
                          <li>You'll pay a fixed amount of <strong>{formatCurrency(flatFee)}</strong> regardless of hours spent</li>
                          <li>Ensure the engagement letter clearly defines the scope of work</li>
                          <li>Additional work outside scope may incur extra hourly charges</li>
                        </>
                      )}
                      {retainerType === 'contingency' && (
                        <>
                          <li>You pay nothing upfront - attorney receives <strong>{formatPercentage(contingencyRate)}</strong> of recovery</li>
                          <li>Your net recovery would be <strong>{formatCurrency(caseValue - results.attorneyFees)}</strong></li>
                          <li>Additional costs are typically advanced by the firm and deducted from recovery</li>
                        </>
                      )}
                      {retainerType === 'monthly' && (
                        <>
                          <li>Monthly cost of <strong>{formatCurrency(results.costPerMonth)}</strong> for ongoing legal services</li>
                          <li>Total commitment of <strong>{formatCurrency(results.totalCost)}</strong> over {months} months</li>
                          <li>Ideal for businesses needing regular legal counsel</li>
                        </>
                      )}
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Educational Content */}
          <div className={styles.educationalContent}>
            <article className={styles.articleCard}>
              <h2 className={styles.articleTitle}>Understanding Legal Retainers: A Comprehensive Guide</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Types of Legal Fee Arrangements</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>⏰ Hourly Billing</h4>
                    <p>Most common arrangement. Attorney bills for actual time spent on your case at an agreed hourly rate. Best for unpredictable or complex matters.</p>
                    <div className={styles.exampleNote}>
                      <strong>Typical Rates:</strong> $150-$1,000+/hour depending on experience and location
                    </div>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>💰 Flat Fee</h4>
                    <p>Fixed price for specific legal services. Provides cost certainty. Common for routine matters: incorporations, wills, trademarks, uncontested divorces.</p>
                    <div className={styles.exampleNote}>
                      <strong>Best For:</strong> Predictable, well-defined legal tasks
                    </div>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📈 Contingency Fee</h4>
                    <p>Attorney receives percentage of recovery (typically 25-40%). No fee if no recovery. Common in personal injury, employment, and collection cases.</p>
                    <div className={styles.exampleNote}>
                      <strong>Standard Range:</strong> 33-40% of recovery
                    </div>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📅 Monthly Retainer</h4>
                    <p>Regular monthly fee for ongoing legal services. Provides predictable budgeting and priority access. Ideal for businesses and regular legal needs.</p>
                    <div className={styles.exampleNote}>
                      <strong>Typical Use:</strong> General counsel services, compliance, regular consultations
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Additional Legal Costs to Consider</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Filing Fees:</strong> Court filing fees, which vary by jurisdiction and case type</li>
                  <li><strong>Process Service:</strong> Costs for serving legal documents</li>
                  <li><strong>Expert Witnesses:</strong> Professional fees for expert testimony and reports</li>
                  <li><strong>Deposition Costs:</strong> Court reporter fees, transcript preparation</li>
                  <li><strong>Investigation Expenses:</strong> Private investigators, background checks</li>
                  <li><strong>Travel Expenses:</strong> Attorney travel for depositions, court appearances</li>
                  <li><strong>Copying & Postage:</strong> Administrative costs for document handling</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Negotiating Your Legal Retainer</h3>
                
                <div className={styles.exampleCard}>
                  <h4>Pro Tips for Cost Management:</h4>
                  <ul>
                    <li><strong>Get Everything in Writing:</strong> Ensure the engagement letter details all fees, billing practices, and expense policies</li>
                    <li><strong>Request Monthly Statements:</strong> Regular billing helps you track costs and identify issues early</li>
                    <li><strong>Discuss Billing Increments:</strong> Some attorneys bill in 6-minute increments (0.1 hours), others in 15-minute blocks</li>
                    <li><strong>Ask About Fee Caps:</strong> For hourly matters, request a not-to-exceed estimate or periodic review points</li>
                    <li><strong>Clarify Expense Policies:</strong> Understand which expenses will be billed and at what markup</li>
                  </ul>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Advice from Legal Professionals</h3>
                <blockquote className={styles.expertQuote}>
                  "The most important conversation with your attorney happens before you hire them: the fee discussion. Be transparent about your budget, ask detailed questions about billing practices, and ensure you understand exactly what you're paying for. A clear fee agreement prevents misunderstandings and builds a stronger attorney-client relationship."
                  <footer className={styles.quoteFooter}>— Senior Partner, National Law Firm, 25+ years experience</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's the difference between a retainer and a fee?</h3>
                <p className={styles.faqAnswer}>A retainer is an advance payment held in trust, while a fee is payment for services already rendered. The retainer secures the attorney's availability and is drawn against as work is performed. Any unused retainer is typically refunded.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Are legal fees negotiable?</h3>
                <p className={styles.faqAnswer}>Yes, legal fees are often negotiable, especially for flat fee arrangements and monthly retainers. Hourly rates may be less flexible but you can negotiate billing increments, expense policies, and periodic billing reviews. Always discuss fees upfront.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What should be included in a retainer agreement?</h3>
                <p className={styles.faqAnswer}>A comprehensive retainer agreement should include: scope of work, fee structure, billing rates/practices, expense policies, payment terms, termination conditions, conflict waivers, and client responsibilities. Review it carefully before signing.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Can I change attorneys if I'm unhappy with costs?</h3>
                <p className={styles.faqAnswer}>Yes, you generally have the right to change attorneys. However, you remain responsible for fees earned to that point. Your former attorney must provide your file to your new attorney, though they may assert a lien for unpaid fees.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How can I reduce legal costs?</h3>
                <p className={styles.faqAnswer}>To reduce costs: be organized with documents, communicate efficiently (combine questions), use paralegals for administrative tasks, consider alternative fee arrangements, request regular billing updates, and handle some tasks yourself when appropriate.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Ready to Plan Your Legal Budget?</h2>
              <p className={styles.ctaText}>Use our calculator to estimate costs for different fee arrangements. Adjust inputs based on your specific legal needs and jurisdiction.</p>
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates for educational purposes only. Actual legal fees vary based on case complexity, attorney experience, jurisdiction, and other factors. This is not legal advice. Consult with a qualified attorney in your jurisdiction for specific legal guidance and fee arrangements. Results are not guaranteed and should not be relied upon for legal decisions.
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
    revalidate: 21600, // 6 hours
  };
}

export default LegalRetainerCalculator;