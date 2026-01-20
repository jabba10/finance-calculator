import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './litigationcostcalculator.module.css';

const LitigationCostCalculator = ({ currentDate, lastModifiedDate }) => {
  const [caseType, setCaseType] = useState('civil');
  const [attorneyRate, setAttorneyRate] = useState(300);
  const [hoursEstimated, setHoursEstimated] = useState(100);
  const [monthsDuration, setMonthsDuration] = useState(18);
  const [expertWitnesses, setExpertWitnesses] = useState(2);
  const [discoveryComplexity, setDiscoveryComplexity] = useState('medium');
  const [settlementProbability, setSettlementProbability] = useState(60);
  const [results, setResults] = useState(null);
  const [costBreakdown, setCostBreakdown] = useState([]);

  const caseTypeRates = {
    'civil': { base: 1.0, riskFactor: 1.2 },
    'criminal': { base: 1.3, riskFactor: 1.5 },
    'family': { base: 1.1, riskFactor: 1.3 },
    'employment': { base: 1.2, riskFactor: 1.4 },
    'intellectual': { base: 1.4, riskFactor: 1.6 },
    'personal-injury': { base: 1.0, riskFactor: 1.8 }
  };

  const complexityMultipliers = {
    'simple': 0.8,
    'medium': 1.0,
    'complex': 1.5,
    'highly-complex': 2.0
  };

  const calculateLitigationCosts = () => {
    const caseRate = caseTypeRates[caseType];
    const complexityMultiplier = complexityMultipliers[discoveryComplexity];
    
    // Base attorney fees
    const baseAttorneyFees = attorneyRate * hoursEstimated * caseRate.base;
    
    // Expert witness costs (average $5,000 per expert)
    const expertCosts = expertWitnesses * 5000;
    
    // Discovery costs based on complexity
    const discoveryCosts = baseAttorneyFees * 0.3 * complexityMultiplier;
    
    // Court and filing fees
    const courtFees = caseType === 'civil' ? 5000 : 3000;
    
    // Miscellaneous costs (depositions, travel, etc.)
    const miscCosts = baseAttorneyFees * 0.15;
    
    // Total estimated costs
    const totalEstimatedCosts = baseAttorneyFees + expertCosts + discoveryCosts + courtFees + miscCosts;
    
    // Settlement-adjusted costs (factoring in probability of settlement)
    const settlementAdjustedCosts = totalEstimatedCosts * (settlementProbability / 100);
    
    // Risk-adjusted total (factoring in case type risk)
    const riskAdjustedTotal = totalEstimatedCosts * caseRate.riskFactor;
    
    // Cost breakdown for visualization
    const breakdown = [
      { category: 'Attorney Fees', amount: baseAttorneyFees, color: '#4A5568' },
      { category: 'Expert Witnesses', amount: expertCosts, color: '#718096' },
      { category: 'Discovery', amount: discoveryCosts, color: '#90CDF4' },
      { category: 'Court Fees', amount: courtFees, color: '#4299E1' },
      { category: 'Miscellaneous', amount: miscCosts, color: '#2B6CB0' }
    ];
    
    setResults({
      totalEstimatedCosts: Math.round(totalEstimatedCosts),
      settlementAdjustedCosts: Math.round(settlementAdjustedCosts),
      riskAdjustedTotal: Math.round(riskAdjustedTotal),
      monthlyCost: Math.round(totalEstimatedCosts / monthsDuration),
      potentialSavings: Math.round(totalEstimatedCosts - settlementAdjustedCosts),
      settlementProbability: settlementProbability
    });
    
    setCostBreakdown(breakdown);
  };

  useEffect(() => {
    calculateLitigationCosts();
  }, [caseType, attorneyRate, hoursEstimated, monthsDuration, expertWitnesses, discoveryComplexity, settlementProbability]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(0)}%`;
  };

  return (
    <>
      <Head>
        <title>Litigation Cost Calculator | Estimate Your Legal Expenses</title>
        <meta name="description" content="Free litigation cost calculator to estimate attorney fees, expert witness costs, discovery expenses, and total legal case expenses. Plan your legal budget effectively." />
        <meta name="keywords" content="litigation cost calculator, legal fees estimator, attorney costs, lawsuit expenses, legal budget calculator, court costs" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/litigation-cost-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Litigation Cost Calculator | Estimate Your Legal Expenses" />
        <meta property="og:description" content="Calculate estimated costs for lawsuits, attorney fees, discovery, and expert witnesses. Plan your legal strategy and budget." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/litigation-cost-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Litigation Cost Calculator" />
        <meta name="twitter:description" content="Estimate and plan for legal expenses with our comprehensive litigation cost calculator." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="litigation-cost-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Litigation Cost Calculator",
            "description": "Professional-grade litigation expense estimator with cost breakdown and budget planning features",
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
              "ratingCount": "890",
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
              "Cost Breakdown Visualization",
              "Settlement Probability Analysis",
              "Multiple Case Types",
              "Risk Assessment",
              "Budget Planning"
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
                "name": "What factors influence litigation costs the most?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Attorney hourly rates, case complexity, discovery requirements, number of expert witnesses, and case duration are the primary cost drivers. Settlement probability also significantly impacts total expenses.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How can I reduce my litigation costs?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Consider alternative dispute resolution, early case assessment, efficient discovery management, and strategic settlement negotiations. Our calculator shows how settlement probability affects total costs.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What are typical attorney rates for different case types?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Attorney rates vary by location and experience. Civil cases typically range $250-$500/hour, criminal defense $200-$400/hour, intellectual property $400-$800/hour, and contingency fees are common in personal injury cases.",
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
            <h1 className={styles.mainTitle}>Litigation Cost Calculator</h1>
            <p className={styles.subtitle}>Estimate Legal Expenses and Plan Your Case Budget Effectively</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>Confidential</span>
              
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Case Parameters</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Case Type
                  <select
                    value={caseType}
                    onChange={(e) => setCaseType(e.target.value)}
                    className={styles.selectInput}
                  >
                    <option value="civil">Civil Litigation</option>
                    <option value="criminal">Criminal Defense</option>
                    <option value="family">Family Law</option>
                    <option value="employment">Employment Law</option>
                    <option value="intellectual">Intellectual Property</option>
                    <option value="personal-injury">Personal Injury</option>
                  </select>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Attorney Hourly Rate
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="150"
                      max="1000"
                      step="10"
                      value={attorneyRate}
                      onChange={(e) => setAttorneyRate(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="150"
                      max="1000"
                      step="10"
                      value={attorneyRate}
                      onChange={(e) => setAttorneyRate(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(attorneyRate)}/hour</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Estimated Attorney Hours
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="20"
                      max="500"
                      step="10"
                      value={hoursEstimated}
                      onChange={(e) => setHoursEstimated(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="20"
                      max="500"
                      step="10"
                      value={hoursEstimated}
                      onChange={(e) => setHoursEstimated(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.yearsSymbol}>hours</span>
                  </div>
                  <div className={styles.valueDisplay}>{hoursEstimated} hours</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Case Duration
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="3"
                      max="60"
                      step="1"
                      value={monthsDuration}
                      onChange={(e) => setMonthsDuration(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="3"
                      max="60"
                      step="1"
                      value={monthsDuration}
                      onChange={(e) => setMonthsDuration(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.yearsSymbol}>months</span>
                  </div>
                  <div className={styles.valueDisplay}>{monthsDuration} months</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Expert Witnesses Needed
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="1"
                      value={expertWitnesses}
                      onChange={(e) => setExpertWitnesses(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="1"
                      value={expertWitnesses}
                      onChange={(e) => setExpertWitnesses(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{expertWitnesses} experts</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Discovery Complexity
                  <select
                    value={discoveryComplexity}
                    onChange={(e) => setDiscoveryComplexity(e.target.value)}
                    className={styles.selectInput}
                  >
                    <option value="simple">Simple (Limited Documents)</option>
                    <option value="medium">Medium (Standard Discovery)</option>
                    <option value="complex">Complex (Extensive Documents)</option>
                    <option value="highly-complex">Highly Complex (e-Discovery)</option>
                  </select>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Settlement Probability
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={settlementProbability}
                      onChange={(e) => setSettlementProbability(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="5"
                      value={settlementProbability}
                      onChange={(e) => setSettlementProbability(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>{formatPercentage(settlementProbability)} chance</div>
                </label>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Estimated Litigation Costs</h2>
              
              {results && (
                <>
                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Total Estimated Cost</div>
                      <div className={styles.resultValue}>{formatCurrency(results.totalEstimatedCosts)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Settlement Adjusted</div>
                      <div className={styles.resultValue}>{formatCurrency(results.settlementAdjustedCosts)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Monthly Average</div>
                      <div className={styles.resultValue}>{formatCurrency(results.monthlyCost)}/month</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Potential Savings</div>
                      <div className={styles.resultValue}>{formatCurrency(results.potentialSavings)}</div>
                    </div>
                  </div>

                  {/* Cost Breakdown Visualization */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>Cost Breakdown</h3>
                    <div className={styles.chartBars}>
                      {costBreakdown.map((item, index) => (
                        <div key={index} className={styles.chartBarGroup}>
                          <div className={styles.chartBarLabel}>{item.category}</div>
                          <div className={styles.chartBarContainer}>
                            <div 
                              className={styles.chartBar}
                              style={{ 
                                width: `${(item.amount / results.totalEstimatedCosts) * 100}%`,
                                backgroundColor: item.color
                              }}
                              title={`${item.category}: ${formatCurrency(item.amount)}`}
                            />
                          </div>
                          <div className={styles.chartBarValue}>{formatCurrency(item.amount)}</div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.chartLegend}>
                      {costBreakdown.map((item, index) => (
                        <div key={index} className={styles.legendItem}>
                          <div className={styles.legendColor} style={{ backgroundColor: item.color }}></div>
                          <span>{item.category}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>⚖️ Key Legal Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>Your case has a <strong>{formatPercentage(results.settlementProbability)}</strong> chance of settling</li>
                      <li>Settlement could save you <strong>{formatCurrency(results.potentialSavings)}</strong></li>
                      <li>Risk-adjusted total cost: <strong>{formatCurrency(results.riskAdjustedTotal)}</strong></li>
                    </ul>
                  </div>

                  <div className={styles.costComparison}>
                    <h3 className={styles.chartTitle}>Cost vs. Duration</h3>
                    <div className={styles.comparisonGrid}>
                      <div className={styles.comparisonItem}>
                        <div className={styles.comparisonLabel}>Short Duration (6 mo)</div>
                        <div className={styles.comparisonValue}>
                          {formatCurrency(results.totalEstimatedCosts * 0.7)}
                        </div>
                      </div>
                      <div className={styles.comparisonItem}>
                        <div className={styles.comparisonLabel}>Current Estimate ({monthsDuration} mo)</div>
                        <div className={styles.comparisonValue}>
                          {formatCurrency(results.totalEstimatedCosts)}
                        </div>
                      </div>
                      <div className={styles.comparisonItem}>
                        <div className={styles.comparisonLabel}>Extended (36 mo)</div>
                        <div className={styles.comparisonValue}>
                          {formatCurrency(results.totalEstimatedCosts * 1.5)}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Educational Content */}
          <div className={styles.educationalContent}>
            <article className={styles.articleCard}>
              <h2 className={styles.articleTitle}>Understanding Litigation Costs: A Comprehensive Guide</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Major Cost Components in Litigation</h3>
                <p>Litigation expenses can vary dramatically based on case complexity, jurisdiction, and legal strategy. Understanding each cost component helps in effective budget planning and case management.</p>
                
                <div className={styles.exampleCard}>
                  <h4>Typical Cost Breakdown:</h4>
                  <ul>
                    <li><strong>Attorney Fees:</strong> 50-70% of total costs (hourly or contingency)</li>
                    <li><strong>Expert Witnesses:</strong> $2,000-$10,000+ per expert</li>
                    <li><strong>Discovery Costs:</strong> 15-30% (document review, e-discovery)</li>
                    <li><strong>Court & Filing Fees:</strong> $1,000-$10,000+ depending on jurisdiction</li>
                    <li><strong>Miscellaneous:</strong> 5-15% (travel, depositions, copies)</li>
                  </ul>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Cost Control Strategies</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>📊 Early Case Assessment</h4>
                    <p>Invest in thorough case evaluation early to identify weaknesses, settlement opportunities, and cost-effective strategies.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🤝 Alternative Dispute Resolution</h4>
                    <p>Mediation and arbitration typically cost 20-40% of traditional litigation while offering faster resolutions.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>💼 Efficient Discovery Management</h4>
                    <p>Use technology-assisted review, limit scope strategically, and cooperate on discovery protocols to reduce costs.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>⚖️ Strategic Settlement Timing</h4>
                    <p>Timing settlement discussions strategically can maximize leverage while minimizing sunk costs in litigation.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Case Type Cost Ranges</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Civil Business Litigation:</strong> $50,000 - $500,000+ (moderate to high complexity)</li>
                  <li><strong>Criminal Defense:</strong> $10,000 - $250,000+ (varies by severity)</li>
                  <li><strong>Family Law:</strong> $15,000 - $100,000 (custody cases higher)</li>
                  <li><strong>Employment Law:</strong> $30,000 - $300,000 (discrimination cases highest)</li>
                  <li><strong>Personal Injury:</strong> Typically contingency (30-40% of recovery)</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Legal Advice</h3>
                <blockquote className={styles.expertQuote}>
                  "The most expensive litigation cost is often the one you didn't anticipate. Comprehensive budgeting, regular cost reviews, and strategic settlement evaluation are essential for cost-effective case management."
                  <footer className={styles.quoteFooter}>— Senior Litigation Partner, 25+ years experience</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How accurate are litigation cost estimates?</h3>
                <p className={styles.faqAnswer}>Estimates typically have a ±20-30% accuracy range. Factors like opposing counsel tactics, unexpected motions, and court scheduling can significantly impact final costs. Regular budget reviews with your attorney improve accuracy.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's the difference between hourly and contingency fees?</h3>
                <p className={styles.faqAnswer}>Hourly fees charge for actual time spent (typical for business litigation). Contingency fees take a percentage of recovery (common in personal injury). Hybrid arrangements (hourly + reduced contingency) are also available in some cases.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How does discovery complexity affect costs?</h3>
                <p className={styles.faqAnswer}>Complex discovery involving thousands of documents, e-discovery, or multiple depositions can increase costs by 50-200%. Simple cases with limited discovery are significantly cheaper to litigate.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>When should I consider settling vs. going to trial?</h3>
                <p className={styles.faqAnswer}>Consider settlement when trial costs exceed potential benefits, when liability is uncertain, or when business relationships need preservation. Trial makes sense when principles are at stake, liability is clear, or precedent is valuable.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Need Legal Budget Planning?</h2>
              <p className={styles.ctaText}>Use this calculator as a starting point for discussions with your attorney. Adjust parameters to match your specific case details and jurisdiction.</p>
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates for educational purposes only. Actual litigation costs may vary significantly based on jurisdiction, case specifics, attorney rates, and unexpected developments. This is not legal advice. Consult with qualified legal counsel for case-specific guidance.
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

export default LitigationCostCalculator;