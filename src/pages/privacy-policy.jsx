import React from 'react';
import { Helmet } from 'react-helmet';
import Link from 'next/link';
import styles from './privacypolicy.module.css';

const PrivacyPolicy = () => {
  const effectiveDate = new Date().toLocaleDateString();

  return (
    <>
      <Helmet>
        <title>Privacy Policy | FinanceCalculators</title>
        <meta
          name="description"
          content="We respect your privacy. Our financial calculators require no sign-up, collect no personal data, and never track or store your inputs."
        />
        <meta name="robots" content="noindex, follow" />
        <meta property="og:title" content="Privacy Policy" />
        <meta
          property="og:description"
          content="Transparent privacy policy for our free financial calculators."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className={styles.container}>
        {/* Spacer for Navbar */}
        <div className={styles.spacerTop}></div>

        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.subtitle}>
            Transparent. Simple. Respecting your financial privacy.
          </p>
        </section>

        {/* Main Content */}
        <section className={styles.infoSection}>
          <div className={styles.infoCard}>
            <p className={`${styles.paragraph} ${styles.intro}`}>
              At <strong>FinanceCalculators</strong>, we believe your financial data belongs to you — 
              and <strong>only you</strong>. This Privacy Policy explains how we handle information, 
              and why you can trust us with your calculations.
            </p>

            <h2 className={styles.heading}>Our Commitment to Your Privacy</h2>
            <p className={styles.paragraph}>
              We do <strong>not require sign-up</strong>, we do <strong>not collect personal data</strong>, 
              and we <strong>never sell or share user information</strong> with third parties. 
              Our tools are designed to be used instantly, privately, and securely — right in your browser.
            </p>

            <h2 className={styles.heading}>No Data Collection</h2>
            <p className={styles.paragraph}>
              When you use any calculator on this site:
            </p>
            <ul className={styles.list}>
              <li>You are <strong>not asked to create an account</strong></li>
              <li>We <strong>do not store</strong> your inputs, results, or device information</li>
              <li>Your calculations are processed <strong>entirely in your browser</strong></li>
              <li>No cookies or tracking scripts are used for analytics or advertising</li>
            </ul>

            <h2 className={styles.heading}>No Third-Party Sharing</h2>
            <p className={styles.paragraph}>
              We do <strong>not sell, rent, or share</strong> any user data — because we <strong>don’t collect it</strong>. 
              There is no database of user inputs, no email harvesting, and no profiling.
            </p>
            <p className={styles.paragraph}>
              The only third-party service we use is for optional contact form submissions (via EmailJS), 
              and even then, your data is sent directly to us and never stored on our servers long-term.
            </p>

            <h2 className={styles.heading}>Security & Transparency</h2>
            <p className={styles.paragraph}>
              All tools are open in their logic — we show you the formulas behind every calculation. 
              Since your data never leaves your device, you remain in full control at all times.
            </p>
            <p className={styles.paragraph}>
              We use HTTPS encryption across the site and follow best practices to keep our platform secure.
            </p>

            <h2 className={styles.heading}>Changes to This Policy</h2>
            <p className={styles.paragraph}>
              This policy is effective as of {effectiveDate} and will be updated only 
              to reflect changes in our practices. Any updates will be posted here with a new date.
            </p>

            <div className={styles.finalNote}>
              <strong>Bottom line:</strong> We built this site to help you — not to profit from your data. 
              Use our tools with confidence, knowing your financial decisions stay private.
            </div>

            <div className={styles.ctaWrapper}>
              <Link href="/suite" className={styles.ctaButton}>
                <span>Try Our Free Calculators</span>
                <span className={styles.arrow}>→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Spacer for Footer */}
        <div className={styles.spacerBottom}></div>
      </div>
    </>
  );
};

export default PrivacyPolicy;