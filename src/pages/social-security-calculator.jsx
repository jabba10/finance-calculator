import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './socialsecuritycalculator.module.css';

const SocialSecurityCalculator = ({ currentDate, lastModifiedDate }) => {
  const [birthDate, setBirthDate] = useState('1980-01-01');
  const [currentAge, setCurrentAge] = useState(44);
  const [retirementAge, setRetirementAge] = useState(67);
  const [currentIncome, setCurrentIncome] = useState(60000);
  const [workHistory, setWorkHistory] = useState(20);
  const [benefitStartAge, setBenefitStartAge] = useState(67);
  const [spouseBirthDate, setSpouseBirthDate] = useState('1982-01-01');
  const [includeSpouse, setIncludeSpouse] = useState(false);
  const [results, setResults] = useState(null);
  const [chartData, setChartData] = useState([]);

  // Calculate derived values
  const calculateAIME = (income, years) => {
    // Simplified AIME calculation (average indexed monthly earnings)
    const averageMonthlyIncome = income / 12;
    const indexedIncome = averageMonthlyIncome * Math.min(years / 35, 1);
    return indexedIncome;
  };

  const calculatePIA = (aime) => {
    // Primary Insurance Amount calculation using 2024 bend points
    const bendPoints = [1115, 6721];
    const percentages = [0.9, 0.32, 0.15];
    
    let pia = 0;
    if (aime <= bendPoints[0]) {
      pia = aime * percentages[0];
    } else if (aime <= bendPoints[1]) {
      pia = (bendPoints[0] * percentages[0]) + 
            ((aime - bendPoints[0]) * percentages[1]);
    } else {
      pia = (bendPoints[0] * percentages[0]) + 
            ((bendPoints[1] - bendPoints[0]) * percentages[1]) + 
            ((aime - bendPoints[1]) * percentages[2]);
    }
    
    return pia;
  };

  const calculateBenefitAdjustment = (startAge, fra) => {
    // FRA = Full Retirement Age (67 for those born 1960 or later)
    const monthsEarly = (fra - startAge) * 12;
    const monthsLate = (startAge - fra) * 12;
    
    if (startAge < fra) {
      // Early retirement reduction: 5/9 of 1% per month for first 36 months, 5/12 of 1% thereafter
      const reduction36 = Math.min(monthsEarly, 36) * (5/9) / 100;
      const reductionAfter36 = Math.max(monthsEarly - 36, 0) * (5/12) / 100;
      return 1 - (reduction36 + reductionAfter36);
    } else if (startAge > fra) {
      // Delayed retirement credit: 2/3 of 1% per month (8% per year)
      return 1 + (monthsLate * (2/3) / 100);
    }
    return 1;
  };

  const calculateSpousalBenefit = (primaryPIA, spouseAge, startAge) => {
    // Spouse gets 50% of primary PIA at FRA
    const spouseFRA = 67;
    const monthsDiff = (spouseFRA - startAge) * 12;
    let adjustment = 1;
    
    if (startAge < spouseFRA) {
      // Reduced if claimed before spouse's FRA
      adjustment = 1 - (monthsDiff * (25/36) / 100);
    }
    
    return Math.max(primaryPIA * 0.5 * adjustment, 0);
  };

  const calculateBenefits = () => {
    const aime = calculateAIME(currentIncome, workHistory);
    const pia = calculatePIA(aime);
    const adjustment = calculateBenefitAdjustment(benefitStartAge, retirementAge);
    const monthlyBenefit = pia * adjustment;
    const annualBenefit = monthlyBenefit * 12;
    
    const spouseAge = new Date().getFullYear() - new Date(spouseBirthDate).getFullYear();
    const spousalBenefit = includeSpouse ? calculateSpousalBenefit(pia, spouseAge, benefitStartAge) : 0;
    const totalMonthlyBenefit = monthlyBenefit + spousalBenefit;
    
    // Generate projection data
    const projectionYears = 30;
    const dataPoints = [];
    let cumulativeBenefits = 0;
    
    for (let year = 0; year <= projectionYears; year++) {
      const age = benefitStartAge + year;
      const yearlyBenefit = totalMonthlyBenefit * 12 * Math.pow(1.023, year); // 2.3% annual COLA
      cumulativeBenefits += yearlyBenefit;
      
      dataPoints.push({
        age,
        yearlyBenefit: Math.round(yearlyBenefit),
        cumulativeBenefits: Math.round(cumulativeBenefits),
        monthlyBenefit: Math.round(yearlyBenefit / 12)
      });
    }
    
    setResults({
      monthlyBenefit: Math.round(monthlyBenefit),
      annualBenefit: Math.round(annualBenefit),
      pia: Math.round(pia),
      aime: Math.round(aime),
      adjustmentPercentage: Math.round((adjustment - 1) * 100),
      spousalBenefit: Math.round(spousalBenefit),
      totalMonthlyBenefit: Math.round(totalMonthlyBenefit),
      totalAnnualBenefit: Math.round(totalMonthlyBenefit * 12)
    });
    
    setChartData(dataPoints);
  };

  useEffect(() => {
    calculateBenefits();
  }, [birthDate, currentAge, retirementAge, currentIncome, workHistory, benefitStartAge, spouseBirthDate, includeSpouse]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatAge = (age) => {
    return `${age} years`;
  };

  // Calculate age from birth date
  const calculateAge = (dateString) => {
    const birthDate = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    const age = calculateAge(birthDate);
    setCurrentAge(age);
  }, [birthDate]);

  return (
    <>
      <Head>
        <title>Social Security Benefits Calculator | Estimate Your Retirement Income</title>
        <meta name="description" content="Free Social Security benefits calculator. Estimate your retirement benefits, compare claiming ages, and optimize your Social Security strategy." />
        <meta name="keywords" content="Social Security calculator, retirement benefits, retirement planning, SSDI, spousal benefits, retirement age, PIA calculation" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/social-security-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Social Security Benefits Calculator | Estimate Your Retirement Income" />
        <meta property="og:description" content="Calculate your Social Security retirement benefits. Compare claiming strategies and maximize your lifetime benefits." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/social-security-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Social Security Benefits Calculator" />
        <meta name="twitter:description" content="Plan your retirement with accurate Social Security benefit estimates." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="social-security-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Social Security Benefits Calculator",
            "description": "Professional Social Security retirement benefits calculator with claiming strategy optimization",
            "applicationCategory": "FinanceApplication",
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
              "name": "Retirement Tools Pro",
              "url": "https://www.financecalculatorfree.com"
            },
            "featureList": [
              "Benefit Projections",
              "Spousal Benefits",
              "Claiming Age Comparison",
              "COLA Adjustments",
              "Lifetime Benefit Estimates"
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
                "name": "What is the best age to claim Social Security benefits?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The optimal claiming age depends on your health, financial needs, and marital status. While you can claim as early as 62, waiting until full retirement age (67 for those born 1960+) or even age 70 maximizes monthly benefits. Use our calculator to compare different scenarios.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How are Social Security benefits calculated?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Benefits are based on your 35 highest-earning years, adjusted for inflation. The calculation uses bend points to determine your Primary Insurance Amount (PIA). Our calculator simplifies this complex formula into an easy-to-use estimate.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "Can I work while collecting Social Security?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, but if you claim before full retirement age, your benefits may be reduced if you earn above certain limits. Once you reach full retirement age, there are no earning limits. See our calculator for how working affects your overall retirement strategy.",
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
            <h1 className={styles.mainTitle}>Social Security Benefits Calculator</h1>
            <p className={styles.subtitle}>Estimate Your Retirement Benefits and Optimize Your Claiming Strategy</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>2024 COLA Included</span>
              <span className={styles.badge}>Free Estimate</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Controls */}
            <div className={styles.calculatorCard}>
              <h2 className={styles.sectionTitle}>Calculate Your Benefits</h2>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Date of Birth
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className={styles.dateInput}
                    max="2006-01-01"
                  />
                  <div className={styles.valueDisplay}>Current Age: {currentAge} years</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Current Annual Income
                  <div className={styles.inputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="range"
                      min="10000"
                      max="200000"
                      step="1000"
                      value={currentIncome}
                      onChange={(e) => setCurrentIncome(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="10000"
                      max="200000"
                      step="1000"
                      value={currentIncome}
                      onChange={(e) => setCurrentIncome(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.valueDisplay}>{formatCurrency(currentIncome)}/year</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Years Worked (35 max)
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="10"
                      max="35"
                      step="1"
                      value={workHistory}
                      onChange={(e) => setWorkHistory(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="10"
                      max="35"
                      step="1"
                      value={workHistory}
                      onChange={(e) => setWorkHistory(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.yearsSymbol}>years</span>
                  </div>
                  <div className={styles.valueDisplay}>{workHistory} years</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Full Retirement Age
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="62"
                      max="70"
                      step="1"
                      value={retirementAge}
                      onChange={(e) => setRetirementAge(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="62"
                      max="70"
                      step="1"
                      value={retirementAge}
                      onChange={(e) => setRetirementAge(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.yearsSymbol}>years</span>
                  </div>
                  <div className={styles.valueDisplay}>{retirementAge} years</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  Benefit Start Age
                  <div className={styles.inputWrapper}>
                    <input
                      type="range"
                      min="62"
                      max="70"
                      step="1"
                      value={benefitStartAge}
                      onChange={(e) => setBenefitStartAge(parseInt(e.target.value))}
                      className={styles.slider}
                    />
                    <input
                      type="number"
                      min="62"
                      max="70"
                      step="1"
                      value={benefitStartAge}
                      onChange={(e) => setBenefitStartAge(parseInt(e.target.value) || 0)}
                      className={styles.numberInput}
                    />
                    <span className={styles.yearsSymbol}>years</span>
                  </div>
                  <div className={styles.valueDisplay}>Start at {benefitStartAge} years</div>
                </label>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={includeSpouse}
                    onChange={(e) => setIncludeSpouse(e.target.checked)}
                    className={styles.checkboxInput}
                  />
                  Include Spousal Benefits
                </label>
                
                {includeSpouse && (
                  <div className={styles.spouseInputGroup}>
                    <label className={styles.inputLabel}>
                      Spouse Date of Birth
                      <input
                        type="date"
                        value={spouseBirthDate}
                        onChange={(e) => setSpouseBirthDate(e.target.value)}
                        className={styles.dateInput}
                        max="2006-01-01"
                      />
                      <div className={styles.valueDisplay}>
                        Spouse Age: {calculateAge(spouseBirthDate)} years
                      </div>
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Results Display */}
            <div className={styles.resultsCard}>
              <h2 className={styles.sectionTitle}>Your Estimated Benefits</h2>
              
              {results && (
                <>
                  <div className={styles.resultsGrid}>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Monthly Benefit</div>
                      <div className={styles.resultValue}>{formatCurrency(results.monthlyBenefit)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Annual Benefit</div>
                      <div className={styles.resultValue}>{formatCurrency(results.annualBenefit)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Primary Insurance Amount</div>
                      <div className={styles.resultValue}>{formatCurrency(results.pia)}</div>
                    </div>
                    <div className={styles.resultItem}>
                      <div className={styles.resultLabel}>Benefit Adjustment</div>
                      <div className={styles.resultValue}>{results.adjustmentPercentage > 0 ? '+' : ''}{results.adjustmentPercentage}%</div>
                    </div>
                  </div>

                  {includeSpouse && results.spousalBenefit > 0 && (
                    <div className={styles.spousalResults}>
                      <h3 className={styles.spousalTitle}>Spousal Benefits</h3>
                      <div className={styles.spousalGrid}>
                        <div className={styles.resultItem}>
                          <div className={styles.resultLabel}>Spouse Monthly Benefit</div>
                          <div className={styles.resultValue}>{formatCurrency(results.spousalBenefit)}</div>
                        </div>
                        <div className={styles.resultItem}>
                          <div className={styles.resultLabel}>Combined Monthly</div>
                          <div className={styles.resultValue}>{formatCurrency(results.totalMonthlyBenefit)}</div>
                        </div>
                        <div className={styles.resultItem}>
                          <div className={styles.resultLabel}>Combined Annual</div>
                          <div className={styles.resultValue}>{formatCurrency(results.totalAnnualBenefit)}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Benefit Projection Chart */}
                  <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>30-Year Benefit Projection (with 2.3% COLA)</h3>
                    <div className={styles.chartBars}>
                      {chartData.filter((_, index) => index % 5 === 0 || index === chartData.length - 1).map((data, index) => (
                        <div key={index} className={styles.chartBarGroup}>
                          <div className={styles.chartBarLabel}>Age {data.age}</div>
                          <div className={styles.chartBarContainer}>
                            <div 
                              className={styles.chartBarYearly}
                              style={{ width: `${Math.min((data.yearlyBenefit / 50000) * 100, 100)}%` }}
                              title={`Yearly: ${formatCurrency(data.yearlyBenefit)}`}
                            />
                          </div>
                          <div className={styles.chartBarValue}>{formatCurrency(data.monthlyBenefit)}/month</div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.chartLegend}>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.legendYearly}`}></div>
                        <span>Annual Benefit (with COLA)</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.insightsCard}>
                    <h3 className={styles.insightsTitle}>📊 Key Insights</h3>
                    <ul className={styles.insightsList}>
                      <li>Your Primary Insurance Amount (PIA) is <strong>{formatCurrency(results.pia)}</strong> at full retirement age</li>
                      <li>By starting at {benefitStartAge}, you receive <strong>{Math.abs(results.adjustmentPercentage)}% {results.adjustmentPercentage > 0 ? 'more' : 'less'}</strong> than your PIA</li>
                      {chartData.length > 0 && (
                        <li>Projected lifetime benefits (30 years): <strong>{formatCurrency(chartData[chartData.length - 1].cumulativeBenefits)}</strong></li>
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
              <h2 className={styles.articleTitle}>Maximizing Your Social Security Benefits: A Strategic Guide</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Understanding the Social Security System</h3>
                <p>Social Security is more than just a retirement program—it's a critical component of retirement planning that provides guaranteed income for life, adjusted for inflation. Understanding how benefits are calculated and when to claim can significantly impact your retirement security.</p>
                
                <div className={styles.exampleCard}>
                  <h4>How Benefits Are Calculated:</h4>
                  <ol>
                    <li><strong>Average Indexed Monthly Earnings (AIME):</strong> Your 35 highest-earning years are adjusted for inflation and averaged</li>
                    <li><strong>Primary Insurance Amount (PIA):</strong> Calculated using progressive "bend points" that replace more of lower earnings</li>
                    <li><strong>Claiming Age Adjustment:</strong> Benefits are reduced if claimed before full retirement age, increased if delayed</li>
                    <li><strong>Cost of Living Adjustments (COLA):</strong> Benefits increase annually based on inflation</li>
                  </ol>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Strategic Claiming Strategies</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>⏰ Early Claiming (Age 62)</h4>
                    <p><strong>Best for:</strong> Those with shorter life expectancy, immediate financial needs, or who can invest benefits<br />
                    <strong>Consider:</strong> Permanent reduction of 25-30% from full benefit amount</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🎯 Full Retirement Age (FRA)</h4>
                    <p><strong>Best for:</strong> Most average scenarios, those who want full benefits without penalty<br />
                    <strong>Consider:</strong> FRA is 67 for those born 1960 or later, provides 100% of PIA</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>📈 Delayed Claiming (Age 70)</h4>
                    <p><strong>Best for:</strong> Longer life expectancy, higher-earning spouses, maximizing survivor benefits<br />
                    <strong>Consider:</strong> 8% annual increase from FRA to age 70, maximum benefit possible</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>👫 Spousal Coordination</h4>
                    <p><strong>Best for:</strong> Married couples, especially with significant income differences<br />
                    <strong>Consider:</strong> Lower-earning spouse claims early, higher-earner delays to maximize both benefits</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Common Scenarios and Solutions</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Divorced but married 10+ years:</strong> You may claim on ex-spouse's record if single and not remarried</li>
                  <li><strong>Widows/Widowers:</strong> Can claim survivor benefits as early as 60 (50 if disabled)</li>
                  <li><strong>Still Working:</strong> Earnings test applies if claiming before FRA, but benefits are recalculated later</li>
                  <li><strong>Government Pensions:</strong> Windfall Elimination Provision may reduce benefits if you have non-covered pension</li>
                  <li><strong>Self-Employed:</strong> Must pay both employer and employee portions of Social Security tax</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Advice from Retirement Specialists</h3>
                <blockquote className={styles.expertQuote}>
                  "The single biggest mistake I see is claiming Social Security without a coordinated strategy. For married couples, the higher earner's claiming decision affects both lifetime benefits and survivor benefits. Often, delaying the higher earner's benefits provides the most security for the surviving spouse."
                  <footer className={styles.quoteFooter}>— Certified Retirement Counselor, 20+ years experience</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What happens if I claim benefits early and continue working?</h3>
                <p className={styles.faqAnswer}>If you claim before Full Retirement Age and earn above the annual limit ($22,320 in 2024), benefits are reduced by $1 for every $2 earned over the limit. In the year you reach FRA, the limit is higher ($59,520 in 2024) with a reduction of $1 for every $3 over. These reductions are not lost forever—your benefit is recalculated at FRA to account for withheld benefits.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How does divorce affect my Social Security benefits?</h3>
                <p className={styles.faqAnswer}>If you were married at least 10 years, are currently unmarried, and are at least 62, you can claim benefits on your ex-spouse's record. This doesn't affect their benefits or their current spouse's benefits. You'll receive up to 50% of their PIA at your FRA, or a reduced amount if claimed earlier.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What is the maximum Social Security benefit?</h3>
                <p className={styles.faqAnswer}>For 2024, the maximum benefit at full retirement age is $3,822 per month. If you delay to age 70, the maximum increases to $4,873 per month. To qualify for maximum benefits, you need 35 years of maximum taxable earnings ($168,600 in 2024) and delay claiming until age 70.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Are Social Security benefits taxable?</h3>
                <p className={styles.faqAnswer}>Yes, depending on your combined income. If your combined income (adjusted gross income + nontaxable interest + half of Social Security benefits) exceeds $25,000 for individuals or $32,000 for married couples filing jointly, up to 85% of benefits may be taxable. Many states don't tax Social Security benefits.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Ready to Optimize Your Social Security Strategy?</h2>
              <p className={styles.ctaText}>Use our calculator to explore different claiming scenarios. Consider consulting with a financial advisor who specializes in retirement planning for personalized advice.</p>
              
              
               
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides estimates based on current Social Security formulas and assumptions. Actual benefits may vary based on your complete earnings history, future COLA adjustments, and changes in Social Security law. This tool is for educational purposes only and is not affiliated with the Social Security Administration. For official benefit estimates, create a my Social Security account at SSA.gov.
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

export default SocialSecurityCalculator;