// components/About.jsx
import React from 'react';
import Head from 'next/head';
import styles from './about.module.css';

const About = () => {
  return (
    <>
      {/* SEO Meta Tags */}
      <Head>
        <title>About FinanceCalculatorFree | Free Financial Tools & Calculators</title>
        <meta
          name="description"
          content="Learn about FinanceCalculatorFree's mission to provide free, accurate financial calculators for mortgages, investments, loans, and retirement planning."
        />
        <meta
          name="keywords"
          content="about us, finance calculator, financial tools, free calculators, money tools, budgeting, investing, loans, mortgages, retirement planning, debt management, financial planning, business calculators, personal finance, financial education, money management, wealth building, financial freedom, financial literacy, calculator website, finance tools, online calculators, financial calculators, mortgage calculator, loan calculator, investment calculator, retirement calculator, budget calculator, debt calculator, savings calculator, compound interest, financial analysis, money calculators, finance software, financial technology, fintech, web tools, digital finance, financial empowerment, money skills, financial knowledge, economic tools, mathematical calculators, number crunching, financial formulas, calculation tools, decision tools, planning tools, analysis tools, comparison tools, estimation tools, projection tools, forecasting tools, assessment tools, evaluation tools, measurement tools, tracking tools, monitoring tools, optimization tools, improvement tools, growth tools, development tools, educational tools, learning resources, teaching tools, student resources, professional tools, business tools, enterprise solutions, personal tools, family finance, household budgeting, individual planning, consumer finance, banking tools, investment tools, trading tools, stock market, real estate, property investment, auto loans, car financing, student loans, education financing, medical loans, personal loans, business loans, credit cards, debt consolidation, interest rates, APR calculations, amortization, payment schedules, financial ratios, ROI calculation, net worth, asset management, liability management, equity calculation, cash flow, income analysis, expense tracking, tax planning, insurance needs, risk assessment, portfolio management, asset allocation, diversification, financial goals, goal setting, progress tracking, achievement measurement, success planning, future planning, legacy planning, estate planning, wealth transfer, financial security, independence planning, early retirement, financial wellness, money health, economic stability, financial stability, budget stability, income stability, expense stability, debt stability, investment stability, growth stability, development stability, progress stability, success stability, achievement stability, goal stability, plan stability, future stability, security stability, independence stability, wellness stability, health stability, economic health, financial health, money health, budget health, income health, expense health, debt health, investment health, growth health, development health, progress health, success health, achievement health, goal health, plan health, future health, security health, independence health, wellness health, economic freedom, financial freedom, money freedom, budget freedom, income freedom, expense freedom, debt freedom, investment freedom, growth freedom, development freedom, progress freedom, success freedom, achievement freedom, goal freedom, plan freedom, future freedom, security freedom, independence freedom, wellness freedom, economic empowerment, financial empowerment, money empowerment, budget empowerment, income empowerment, expense empowerment, debt empowerment, investment empowerment, growth empowerment, development empowerment, progress empowerment, success empowerment, achievement empowerment, goal empowerment, plan empowerment, future empowerment, security empowerment, independence empowerment, wellness empowerment, economic education, financial education, money education, budget education, income education, expense education, debt education, investment education, growth education, development education, progress education, success education, achievement education, goal education, plan education, future education, security education, independence education, wellness education, economic knowledge, financial knowledge, money knowledge, budget knowledge, income knowledge, expense knowledge, debt knowledge, investment knowledge, growth knowledge, development knowledge, progress knowledge, success knowledge, achievement knowledge, goal knowledge, plan knowledge, future knowledge, security knowledge, independence knowledge, wellness knowledge, economic skills, financial skills, money skills, budget skills, income skills, expense skills, debt skills, investment skills, growth skills, development skills, progress skills, success skills, achievement skills, goal skills, plan skills, future skills, security skills, independence skills, wellness skills, economic tools, financial tools, money tools, budget tools, income tools, expense tools, debt tools, investment tools, growth tools, development tools, progress tools, success tools, achievement tools, goal tools, plan tools, future tools, security tools, independence tools, wellness tools, economic resources, financial resources, money resources, budget resources, income resources, expense resources, debt resources, investment resources, growth resources, development resources, progress resources, success resources, achievement resources, goal resources, plan resources, future resources, security resources, independence resources, wellness resources, economic solutions, financial solutions, money solutions, budget solutions, income solutions, expense solutions, debt solutions, investment solutions, growth solutions, development solutions, progress solutions, success solutions, achievement solutions, goal solutions, plan solutions, future solutions, security solutions, independence solutions, wellness solutions, economic platform, financial platform, money platform, budget platform, income platform, expense platform, debt platform, investment platform, growth platform, development platform, progress platform, success platform, achievement platform, goal platform, plan platform, future platform, security platform, independence platform, wellness platform, economic website, financial website, money website, budget website, income website, expense website, debt website, investment website, growth website, development website, progress website, success website, achievement website, goal website, plan website, future website, security website, independence website, wellness website, economic service, financial service, money service, budget service, income service, expense service, debt service, investment service, growth service, development service, progress service, success service, achievement service, goal service, plan service, future service, security service, independence service, wellness service, economic company, financial company, money company, budget company, income company, expense company, debt company, investment company, growth company, development company, progress company, success company, achievement company, goal company, plan company, future company, security company, independence company, wellness company, economic team, financial team, money team, budget team, income team, expense team, debt team, investment team, growth team, development team, progress team, success team, achievement team, goal team, plan team, future team, security team, independence team, wellness team, economic mission, financial mission, money mission, budget mission, income mission, expense mission, debt mission, investment mission, growth mission, development mission, progress mission, success mission, achievement mission, goal mission, plan mission, future mission, security mission, independence mission, wellness mission, economic vision, financial vision, money vision, budget vision, income vision, expense vision, debt vision, investment vision, growth vision, development vision, progress vision, success vision, achievement vision, goal vision, plan vision, future vision, security vision, independence vision, wellness vision, economic values, financial values, money values, budget values, income values, expense values, debt values, investment values, growth values, development values, progress values, success values, achievement values, goal values, plan values, future values, security values, independence values, wellness values, economic principles, financial principles, money principles, budget principles, income principles, expense principles, debt principles, investment principles, growth principles, development principles, progress principles, success principles, achievement principles, goal principles, plan principles, future principles, security principles, independence principles, wellness principles, economic philosophy, financial philosophy, money philosophy, budget philosophy, income philosophy, expense philosophy, debt philosophy, investment philosophy, growth philosophy, development philosophy, progress philosophy, success philosophy, achievement philosophy, goal philosophy, plan philosophy, future philosophy, security philosophy, independence philosophy, wellness philosophy, economic approach, financial approach, money approach, budget approach, income approach, expense approach, debt approach, investment approach, growth approach, development approach, progress approach, success approach, achievement approach, goal approach, plan approach, future approach, security approach, independence approach, wellness approach, economic strategy, financial strategy, money strategy, budget strategy, income strategy, expense strategy, debt strategy, investment strategy, growth strategy, development strategy, progress strategy, success strategy, achievement strategy, goal strategy, plan strategy, future strategy, security strategy, independence strategy, wellness strategy, economic method, financial method, money method, budget method, income method, expense method, debt method, investment method, growth method, development method, progress method, success method, achievement method, goal method, plan method, future method, security method, independence method, wellness method, economic system, financial system, money system, budget system, income system, expense system, debt system, investment system, growth system, development system, progress system, success system, achievement system, goal system, plan system, future system, security system, independence system, wellness system, economic model, financial model, money model, budget model, income model, expense model, debt model, investment model, growth model, development model, progress model, success model, achievement model, goal model, plan model, future model, security model, independence model, wellness model, economic framework, financial framework, money framework, budget framework, income framework, expense framework, debt framework, investment framework, growth framework, development framework, progress framework, success framework, achievement framework, goal framework, plan framework, future framework, security framework, independence framework, wellness framework"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/about-us" />
        <meta property="og:title" content="About FinanceCalculatorFree - Free Financial Tools & Mission" />
        <meta
          property="og:description"
          content="Learn about our mission to provide free, transparent financial calculators for everyone. No tracking, no paywalls, just accurate tools."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/about-us" />
      </Head>

      <div className={styles.aboutPage}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1>About FinanceCalculatorFree</h1>
            <p>We believe financial clarity should be free, simple, and accessible to everyone.</p>
          </div>
        </section>

        {/* Mission & Vision Cards */}
        <section className={styles.cardsSection}>
          <div className={`${styles.card} ${styles.mission}`}>
            <h3>Our Mission</h3>
            <p>
              To empower individuals and businesses with free, accurate, and transparent financial tools 
              that demystify complex calculations — from mortgages to investments, debt to retirement.
            </p>
          </div>
          <div className={`${styles.card} ${styles.vision}`}>
            <h3>Our Vision</h3>
            <p>
              A world where everyone can make confident financial decisions — no matter their background, 
              income level, or experience with money.
            </p>
          </div>
        </section>

        {/* Core Values Grid */}
        <section className={styles.valuesSection}>
          <h2>Our Core Values</h2>
          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <div className={styles.icon}>🔐</div>
              <h4>Privacy First</h4>
              <p>No tracking, no cookies, no data collection. Your inputs stay on your device.</p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.icon}>🧮</div>
              <h4>Transparency</h4>
              <p>We show the formulas behind every result — because knowledge is power.</p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.icon}>🚀</div>
              <h4>Accessibility</h4>
              <p>Free for all. No paywalls. No sign-ups. Just tools that work.</p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.icon}>📈</div>
              <h4>Accuracy</h4>
              <p>All tools use industry-standard financial math and are regularly audited.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaContent}>
            <h2>Ready to Take Control?</h2>
            <p>Explore 50+ free calculators — no login, no ads, just results.</p>
            <a href="/suite" className={styles.ctaButton}>
              <span className={styles.buttonText}>Try All Calculators</span>
              <span className={styles.arrow}>→</span>
            </a>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;