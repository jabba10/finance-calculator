// components/About.jsx
import React from 'react';
import styles from './aboutus.module.css';

const About = () => {
  return (
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
  );
};

export default About;