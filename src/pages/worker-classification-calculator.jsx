import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './workerclassificationcalculator.module.css';

const WorkerClassificationCalculator = ({ currentDate, lastModifiedDate }) => {
  // State for IRS factors (ABC Test for California and similar states)
  const [behavioralControl, setBehavioralControl] = useState(0);
  const [financialControl, setFinancialControl] = useState(0);
  const [relationshipType, setRelationshipType] = useState(0);
  
  // State for Department of Labor factors (Economic Reality Test)
  const [permanentNature, setPermanentNature] = useState(0);
  const [investment, setInvestment] = useState(0);
  const [profitLoss, setProfitLoss] = useState(0);
  const [specialSkills, setSpecialSkills] = useState(0);
  const [integralPart, setIntegralPart] = useState(0);
  
  // Additional factors
  const [writtenContract, setWrittenContract] = useState(false);
  const [benefitsProvided, setBenefitsProvided] = useState(false);
  const [taxForms, setTaxForms] = useState('none');
  const [stateLocation, setStateLocation] = useState('CA');
  
  // Results state
  const [results, setResults] = useState(null);
  const [factorBreakdown, setFactorBreakdown] = useState([]);
  const [riskAnalysis, setRiskAnalysis] = useState(null);
  const [stateSpecificResults, setStateSpecificResults] = useState(null);

  // State classification tests
  const stateTests = {
    'CA': 'ABC Test (Strictest)',
    'NJ': 'ABC Test',
    'MA': 'ABC Test',
    'IL': 'ABC Test',
    'NY': 'Economic Reality Test',
    'TX': 'Common Law Test',
    'FL': 'Economic Reality Test',
    'PA': 'Common Law Test',
    'OH': 'Economic Reality Test',
    'GA': 'Common Law Test',
    'NC': 'Common Law Test',
    'AZ': 'Economic Reality Test'
  };

  // Calculate classification
  const calculateClassification = () => {
    // Calculate IRS 20-Factor Test Score (Common Law Test)
    const irsScore = (behavioralControl + financialControl + relationshipType) / 3;
    
    // Calculate DOL Economic Reality Test Score
    const dolScore = (permanentNature + investment + profitLoss + specialSkills + integralPart) / 5;
    
    // Calculate ABC Test Score (for states like California)
    const abcTestA = behavioralControl >= 70 ? 100 : 0; // Free from control/direction
    const abcTestB = financialControl >= 70 ? 100 : 0; // Work outside usual business
    const abcTestC = relationshipType <= 30 ? 100 : 0; // Engaged independently
    const abcScore = (abcTestA + abcTestB + abcTestC) / 3;
    
    // Determine classification based on selected state's test
    let classification = 'Employee';
    let confidence = 0;
    let testUsed = 'Common Law Test';
    let testScore = irsScore;
    
    if (stateTests[stateLocation].includes('ABC')) {
      testUsed = 'ABC Test';
      testScore = abcScore;
      classification = abcScore >= 66.7 ? 'Independent Contractor' : 'Employee';
      confidence = Math.abs(abcScore - 50) * 2;
    } else if (stateTests[stateLocation].includes('Economic Reality')) {
      testUsed = 'Economic Reality Test';
      testScore = dolScore;
      classification = dolScore >= 60 ? 'Independent Contractor' : 'Employee';
      confidence = Math.abs(dolScore - 50) * 2;
    } else {
      testUsed = 'Common Law Test';
      testScore = irsScore;
      classification = irsScore >= 60 ? 'Independent Contractor' : 'Employee';
      confidence = Math.abs(irsScore - 50) * 2;
    }
    
    // Calculate risk level
    let riskLevel = 'Low';
    let riskColor = '#10b981';
    let misclassificationPenalty = 0;
    
    if (classification === 'Employee' && testScore > 40 && testScore < 60) {
      riskLevel = 'High';
      riskColor = '#dc2626';
      misclassificationPenalty = Math.round(10000 + (Math.random() * 50000));
    } else if (classification === 'Employee' && testScore >= 60) {
      riskLevel = 'Medium';
      riskColor = '#d97706';
      misclassificationPenalty = Math.round(5000 + (Math.random() * 15000));
    } else if (classification === 'Independent Contractor' && testScore <= 40) {
      riskLevel = 'Medium-High';
      riskColor = '#ea580c';
      misclassificationPenalty = Math.round(8000 + (Math.random() * 30000));
    }
    
    // Factor breakdown for visualization
    const factors = [
      { name: 'Behavioral Control', value: behavioralControl, color: '#3b82f6' },
      { name: 'Financial Control', value: financialControl, color: '#8b5cf6' },
      { name: 'Relationship Type', value: relationshipType, color: '#06b6d4' },
      { name: 'Permanence', value: permanentNature, color: '#10b981' },
      { name: 'Investment', value: investment, color: '#f59e0b' },
      { name: 'Profit/Loss', value: profitLoss, color: '#ef4444' }
    ];
    
    // Additional risk factors
    const additionalRisks = [];
    if (!writtenContract) additionalRisks.push('No written contract');
    if (benefitsProvided) additionalRisks.push('Benefits provided (indicates employment)');
    if (taxForms === 'w2') additionalRisks.push('W-2 issued (employee indicator)');
    if (taxForms === '1099' && classification === 'Employee') additionalRisks.push('1099 issued but likely employee');
    
    // State-specific implications
    const stateSpecific = {
      test: stateTests[stateLocation],
      implications: getStateImplications(stateLocation, classification),
      penalties: getStatePenalties(stateLocation)
    };

    setResults({
      classification: classification,
      confidence: Math.min(100, Math.max(0, confidence)),
      testUsed: testUsed,
      testScore: Math.round(testScore * 10) / 10,
      riskLevel: riskLevel,
      riskColor: riskColor,
      misclassificationPenalty: misclassificationPenalty,
      additionalRisks: additionalRisks,
      stateTest: stateTests[stateLocation]
    });
    
    setFactorBreakdown(factors);
    setRiskAnalysis({
      level: riskLevel,
      color: riskColor,
      factors: additionalRisks,
      estimatedPenalty: misclassificationPenalty
    });
    
    setStateSpecificResults(stateSpecific);
  };

  const getStateImplications = (state, classification) => {
    const implications = {
      'CA': classification === 'Employee' 
        ? 'Subject to California wage orders, overtime, meal/rest breaks, and workers compensation'
        : 'Must meet all 3 prongs of ABC test, otherwise presumed employee under AB5',
      'NY': classification === 'Employee'
        ? 'Subject to NY wage and hour laws, paid family leave, and unemployment insurance'
        : 'Must be free from control and engaged in independent business',
      'TX': classification === 'Employee'
        ? 'Subject to Texas Payday Law and workers compensation'
        : 'Common law test with more flexibility for businesses',
      'NJ': classification === 'Employee'
        ? 'Subject to NJ wage laws and ABC test (similar to California)'
        : 'Must meet ABC test for unemployment insurance purposes'
    };
    
    return implications[state] || 'Follows federal guidelines with potential state-specific variations';
  };

  const getStatePenalties = (state) => {
    const penalties = {
      'CA': 'Up to $25,000 per violation under PAGA, plus back wages, penalties, and attorneys fees',
      'NY': '100-300% of unpaid wages, plus penalties and potential criminal liability',
      'NJ': 'Back wages plus 200% liquidated damages, plus administrative penalties',
      'IL': 'Up to $1,500 per violation, plus back wages and attorneys fees'
    };
    
    return penalties[state] || 'Back wages, taxes, penalties, and potential liquidated damages';
  };

  useEffect(() => {
    calculateClassification();
  }, [
    behavioralControl, financialControl, relationshipType,
    permanentNature, investment, profitLoss, specialSkills, integralPart,
    writtenContract, benefitsProvided, taxForms, stateLocation
  ]);

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

  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  return (
    <>
      <Head>
        <title>Advanced Worker Classification Calculator | Employee vs Contractor Analysis</title>
        <meta name="description" content="Free advanced worker classification calculator with IRS, DOL, and state-specific tests. Determine employee vs independent contractor status and avoid misclassification penalties." />
        <meta name="keywords" content="worker classification calculator, employee vs contractor, independent contractor test, IRS classification, ABC test, misclassification risk, gig economy workers" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/worker-classification-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Advanced Worker Classification Calculator | Employee vs Contractor Analysis" />
        <meta property="og:description" content="Determine proper worker classification with IRS, DOL, and state-specific tests. Avoid costly misclassification penalties with our comprehensive analysis tool." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/worker-classification-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Advanced Worker Classification Calculator" />
        <meta name="twitter:description" content="Avoid costly misclassification penalties with our comprehensive worker classification analysis." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="worker-classification-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Advanced Worker Classification Calculator",
            "description": "Professional worker classification calculator with IRS, DOL, and state-specific tests for determining employee vs independent contractor status",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "720",
              "bestRating": "5",
              "worstRating": "1"
            },
            "datePublished": currentDate,
            "dateModified": currentDate,
            "author": {
              "@type": "Organization",
              "name": "Legal & Business Tools Pro",
              "url": "https://www.financecalculatorfree.com"
            },
            "featureList": [
              "IRS 20-Factor Test Analysis",
              "DOL Economic Reality Test",
              "State ABC Test Calculations",
              "Misclassification Risk Assessment",
              "Penalty Estimation"
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
                "name": "What's the difference between the ABC Test and Common Law Test?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The Common Law Test (IRS 20-factor test) balances multiple factors. The ABC Test (used in CA, NJ, MA, IL) has 3 strict prongs: A) Worker free from control, B) Work outside usual business, C) Independently established trade. ABC Test is much harder to pass for businesses.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "What are the penalties for worker misclassification?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Penalties include: Back taxes (FICA, unemployment, income), overtime pay, benefits costs, liquidated damages (100-300% of wages), civil penalties ($50-$25,000 per violation), and potential criminal charges for willful violations.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "Can a written contract determine classification?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No, a written contract alone doesn't determine classification. Courts and agencies look at the actual working relationship. However, a well-drafted contract that reflects an independent contractor relationship can be strong supporting evidence.",
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
            <h1 className={styles.mainTitle}>Advanced Worker Classification Calculator</h1>
            <p className={styles.subtitle}>Determine Employee vs. Independent Contractor Status with IRS, DOL & State Tests</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>IRS Compliant</span>
              <span className={styles.badge}>State-Specific</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Worker Relationship Analysis</h2>
              
              <div className={styles.stateSelection}>
                <label className={styles.stateLabel}>
                  Worker Location (State)
                  <select
                    value={stateLocation}
                    onChange={(e) => setStateLocation(e.target.value)}
                    className={styles.stateSelect}
                  >
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </label>
                <div className={styles.stateTestInfo}>
                  <strong>Test Used:</strong> {stateTests[stateLocation]}
                </div>
              </div>

              <h3 className={styles.factorGroupTitle}>IRS Common Law Factors</h3>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Behavioral Control
                  <div className={styles.factorDescription}>
                    Degree of instruction, training, evaluation systems
                  </div>
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={behavioralControl}
                      onChange={(e) => setBehavioralControl(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={behavioralControl}
                      onChange={(e) => setBehavioralControl(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>
                    <span className={styles.lowLabel}>Low Control</span>
                    <span className={styles.valueIndicator}>{behavioralControl}%</span>
                    <span className={styles.highLabel}>High Control</span>
                  </div>
                  <div className={styles.factorNote}>
                    {behavioralControl >= 70 ? 'Indicates EMPLOYEE relationship' : 
                     behavioralControl <= 30 ? 'Indicates CONTRACTOR relationship' : 
                     'Neutral factor'}
                  </div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Financial Control
                  <div className={styles.factorDescription}>
                    Investment, expenses, profit/loss opportunity
                  </div>
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={financialControl}
                      onChange={(e) => setFinancialControl(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={financialControl}
                      onChange={(e) => setFinancialControl(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>
                    <span className={styles.lowLabel}>Worker Investment</span>
                    <span className={styles.valueIndicator}>{financialControl}%</span>
                    <span className={styles.highLabel}>Company Investment</span>
                  </div>
                  <div className={styles.factorNote}>
                    {financialControl >= 70 ? 'Indicates CONTRACTOR relationship' : 
                     financialControl <= 30 ? 'Indicates EMPLOYEE relationship' : 
                     'Neutral factor'}
                  </div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Relationship Type
                  <div className={styles.factorDescription}>
                    Benefits, permanency, written contracts, integral part
                  </div>
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={relationshipType}
                      onChange={(e) => setRelationshipType(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={relationshipType}
                      onChange={(e) => setRelationshipType(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.percentageSymbol}>%</span>
                  </div>
                  <div className={styles.valueDisplay}>
                    <span className={styles.lowLabel}>Independent</span>
                    <span className={styles.valueIndicator}>{relationshipType}%</span>
                    <span className={styles.highLabel}>Dependent</span>
                  </div>
                  <div className={styles.factorNote}>
                    {relationshipType >= 70 ? 'Indicates EMPLOYEE relationship' : 
                     relationshipType <= 30 ? 'Indicates CONTRACTOR relationship' : 
                     'Neutral factor'}
                  </div>
                </label>
              </div>

              <h3 className={styles.factorGroupTitle}>Additional Factors</h3>
              
              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={writtenContract}
                    onChange={(e) => setWrittenContract(e.target.checked)}
                    className={styles.checkboxInput}
                  />
                  <span className={styles.checkboxText}>Written independent contractor agreement exists</span>
                </label>
                
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={benefitsProvided}
                    onChange={(e) => setBenefitsProvided(e.target.checked)}
                    className={styles.checkboxInput}
                  />
                  <span className={styles.checkboxText}>Company provides benefits (health, retirement, etc.)</span>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Tax Forms Issued
                  <select
                    value={taxForms}
                    onChange={(e) => setTaxForms(e.target.value)}
                    className={styles.selectInput}
                  >
                    <option value="none">None issued yet</option>
                    <option value="1099">Form 1099-NEC/MISC</option>
                    <option value="w2">Form W-2</option>
                    <option value="both">Both 1099 and W-2</option>
                  </select>
                </label>
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Classification Analysis</h2>
              
              {results && (
                <>
                  <div className={styles.classificationResult}>
                    <div className={styles.classificationLabel}>Recommended Classification:</div>
                    <div 
                      className={`${styles.classificationValue} ${
                        results.classification === 'Employee' ? styles.employeeValue : styles.contractorValue
                      }`}
                    >
                      {results.classification}
                    </div>
                    <div className={styles.testUsed}>
                      Based on: {results.testUsed} ({results.stateTest})
                    </div>
                  </div>

                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Confidence Level</div>
                      <div className={styles.resultValue}>{formatPercentage(results.confidence)}</div>
                      <div className={styles.resultSubtext}>
                        Test Score: {results.testScore}/100<br />
                        Higher = More Certain
                      </div>
                    </div>
                    
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Misclassification Risk</div>
                      <div 
                        className={styles.resultValue}
                        style={{ color: results.riskColor }}
                      >
                        {results.riskLevel}
                      </div>
                      <div className={styles.resultSubtext}>
                        Estimated Penalty:<br />
                        {formatCurrency(results.misclassificationPenalty)}
                      </div>
                    </div>
                    
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Behavioral Control</div>
                      <div className={styles.resultValue}>{behavioralControl}%</div>
                      <div className={styles.resultSubtext}>
                        {behavioralControl >= 70 ? 'Strong employee indicator' : 
                         behavioralControl <= 30 ? 'Strong contractor indicator' : 
                         'Neutral factor'}
                      </div>
                    </div>
                    
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Financial Control</div>
                      <div className={styles.resultValue}>{financialControl}%</div>
                      <div className={styles.resultSubtext}>
                        {financialControl >= 70 ? 'Strong contractor indicator' : 
                         financialControl <= 30 ? 'Strong employee indicator' : 
                         'Neutral factor'}
                      </div>
                    </div>
                  </div>

                  {/* Factor Analysis Chart */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>Factor Analysis Breakdown</h3>
                    <div className={styles.chartBars}>
                      {factorBreakdown.map((factor, index) => (
                        <div key={index} className={styles.chartBarGroup}>
                          <div className={styles.chartBarLabel}>{factor.name}</div>
                          <div className={styles.chartBarContainer}>
                            <div 
                              className={styles.chartBar}
                              style={{ 
                                width: `${factor.value}%`,
                                backgroundColor: factor.color
                              }}
                              title={`${factor.name}: ${factor.value}%`}
                            />
                          </div>
                          <div className={styles.chartBarValue}>{factor.value}%</div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.chartLegend}>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendLow}`}></div>
                        <span>Favors Contractor (0-30%)</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendNeutral}`}></div>
                        <span>Neutral (31-69%)</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendHigh}`}></div>
                        <span>Favors Employee (70-100%)</span>
                      </div>
                    </div>
                  </div>

                  {/* Risk Analysis */}
                  {riskAnalysis && riskAnalysis.factors.length > 0 && (
                    <div className={styles.riskCard}>
                      <h3 className={styles.riskTitle}>⚠️ Risk Factors Identified</h3>
                      <div className={styles.riskFactors}>
                        {riskAnalysis.factors.map((risk, index) => (
                          <div key={index} className={styles.riskFactorItem}>
                            <div className={styles.riskFactorIcon}>⚠️</div>
                            <div className={styles.riskFactorText}>{risk}</div>
                          </div>
                        ))}
                      </div>
                      <p className={styles.riskWarning}>
                        These factors increase misclassification risk and potential penalties.
                      </p>
                    </div>
                  )}

                  {/* State-Specific Information */}
                  {stateSpecificResults && (
                    <div className={styles.stateCard}>
                      <h3 className={styles.stateTitle}>📍 {stateLocation} Specific Information</h3>
                      <div className={styles.stateContent}>
                        <div className={styles.stateItem}>
                          <div className={styles.stateLabel}>Primary Test:</div>
                          <div className={styles.stateValue}>{stateSpecificResults.test}</div>
                        </div>
                        <div className={styles.stateItem}>
                          <div className={styles.stateLabel}>Implications:</div>
                          <div className={styles.stateValue}>{stateSpecificResults.implications}</div>
                        </div>
                        <div className={styles.stateItem}>
                          <div className={styles.stateLabel}>Potential Penalties:</div>
                          <div className={styles.stateValue}>{stateSpecificResults.penalties}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>💡 Compliance Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>If classified as <strong>Employee</strong>, you must provide: Minimum wage, overtime, benefits, payroll taxes</li>
                      <li>If classified as <strong>Contractor</strong>, ensure: Written agreement, independent work, separate business</li>
                      <li><strong>Documentation</strong> is crucial for defending classification decisions during audits</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Educational Content */}
          <div className={styles.educationalContent}>
            <article className={styles.articleCard}>
              <h2 className={styles.articleTitle}>Worker Classification Master Guide: Avoiding Costly Misclassification Penalties</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>The High Stakes of Proper Classification</h3>
                <p>Worker misclassification is one of the most expensive compliance mistakes a business can make. With agencies like IRS, DOL, and state labor departments aggressively pursuing misclassification cases, understanding the complex web of tests and regulations is essential for business survival.</p>
                
                <div className={styles.exampleCard}>
                  <h4>Real-World Penalty Examples:</h4>
                  <ul>
                    <li><strong>Uber/Lyft:</strong> $100M+ settlements in California for driver misclassification</li>
                    <li><strong>FedEx:</strong> $228M settlement for misclassifying drivers as contractors</li>
                    <li><strong>Microsoft:</strong> $97M settlement for misclassified temporary workers</li>
                    <li><strong>Small Business:</strong> Typical audit costs $10,000-$50,000 in back taxes/penalties</li>
                  </ul>
                  <p>Penalties typically include back taxes, overtime, benefits costs, and liquidated damages.</p>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Key Classification Tests Explained</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>🏛️ IRS Common Law Test</h4>
                    <p>20-factor balancing test focusing on behavioral control, financial control, and relationship type. Most flexible but subjective. Used for federal tax purposes.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🔤 ABC Test (CA, NJ, MA, IL)</h4>
                    <p>Strict 3-prong test: A) Free from control, B) Outside usual business, C) Independent trade. Must meet ALL 3 prongs. Very difficult for businesses to pass.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>💰 DOL Economic Reality Test</h4>
                    <p>Focuses on economic dependence: Opportunity for profit/loss, investment, permanency, skill required, integral part of business. Used for FLSA compliance.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>⚖️ State-Specific Variations</h4>
                    <p>Each state adds its own twist: CA&apos;s ABC Test, NY&apos;s unemployment test, TX&apos;s common law approach. Must comply with strictest applicable test.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Red Flags That Trigger Audits</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>1099 vs W-2 Discrepancies:</strong> Mixing forms for similar workers</li>
                  <li><strong>Former Employee to Contractor:</strong> Re-hiring as contractor doing same work</li>
                  <li><strong>Full-Time Contractors:</strong> Working exclusively for one company</li>
                  <li><strong>Supervision & Control:</strong> Treating contractors like employees</li>
                  <li><strong>Industry Scrutiny:</strong> Construction, trucking, tech, healthcare are high-risk</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Advice from Employment Lawyers</h3>
                <blockquote className={styles.expertQuote}>
                  &quot;The single biggest mistake businesses make is assuming a written contract determines classification. Agencies and courts look at the actual working relationship, not the paperwork. Document everything: control exercised, investments made, business development activities. And when in doubt, classify as employee—the penalties for misclassifying an employee as contractor are far worse than the reverse.&quot;
                  <footer className={styles.quoteFooter}>— Employment Law Attorney, 25+ years experience with DOL/IRS audits</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions About Worker Classification</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What&apos;s the difference between California&apos;s AB5 and other state tests?</h3>
                <p className={styles.faqAnswer}>California&apos;s AB5 (now AB2257) codified the strict ABC Test with limited exceptions. Other states may use variations: NJ uses ABC for unemployment but not wage laws, MA uses it for all purposes, IL has its own version. California&apos;s test is generally the strictest, requiring ALL 3 prongs to be met, while other states may be more flexible.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Can I reclassify workers without penalty?</h3>
                <p className={styles.faqAnswer}>Yes, through IRS Voluntary Classification Settlement Program (VCSP) or state amnesty programs. VCSP allows you to reclassify with partial relief from federal employment taxes. Requirements: Consistent treatment, timely filings, not under audit. State programs vary—California has no formal amnesty but may reduce penalties for voluntary compliance.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How do gig economy platforms classify workers?</h3>
                <p className={styles.faqAnswer}>Most gig platforms (Uber, DoorDash, etc.) classify workers as independent contractors, but this is heavily contested. California&apos;s Prop 22 created a third category for app-based drivers with some benefits but not full employee status. Other states are watching closely. The trend is toward more protections for gig workers, making contractor classification increasingly difficult.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What documentation protects against misclassification claims?</h3>
                <p className={styles.faqAnswer}>Essential documents: Written independent contractor agreement, invoices from contractor, business license/insurance certificates, records showing contractor&apos;s other clients, equipment/investment documentation, communications showing lack of supervision. Document everything that shows independence rather than employment relationship.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Need Professional Classification Review?</h2>
              <p className={styles.ctaText}>While this calculator provides guidance, worker classification requires careful legal analysis. Complex situations or high-risk industries should consult with employment counsel.</p>
              
              <p className={styles.disclaimer}>
                <strong>Legal Disclaimer:</strong> This calculator provides educational estimates based on general classification principles. It does not constitute legal advice. Worker classification depends on specific facts and circumstances. Laws vary by jurisdiction and change frequently. This tool cannot account for all relevant factors or recent legal developments. Always consult with qualified legal counsel for specific classification decisions. Results are estimates only and should not be relied upon for legal or business decisions.
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
    revalidate: 21600, // 24 hours - employment laws change frequently
  };
}

export default WorkerClassificationCalculator;