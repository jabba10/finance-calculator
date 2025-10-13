import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

const Footer = () => {
  

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          {/* About Section */}
          <div className={styles.footerSection}>
            <h3 className={styles.sectionTitle}>About FinanceCalculatorFree</h3>
            <p className={styles.sectionText}>
              We provide free, accurate, and transparent financial tools to help individuals and businesses 
              make smarter decisions — no sign-up, just results.
            </p>
          </div>

          {/* Quick Links */}
          <div className={styles.footerSection}>
            <h3 className={styles.sectionTitle}>Quick Links</h3>
            <ul className={styles.linkList}>
              <li><Link href="/" className={styles.footerLink}>Home</Link></li>
              <li><Link href="/suite" className={styles.footerLink}>All Calculators</Link></li>
              <li><Link href="/blog" className={styles.footerLink}>Blog & Guides</Link></li>
              <li><Link href="/aboutus" className={styles.footerLink}>About Us</Link></li>
              <li><Link href="/contactus" className={styles.footerLink}>Contact</Link></li>
            </ul>
          </div>

          {/* Tools */}
          <div className={styles.footerSection}>
            <h3 className={styles.sectionTitle}>Popular Tools</h3>
            <ul className={styles.linkList}>
              <li><Link href="/mortgage-calculator" className={styles.footerLink}>Mortgage Calculator</Link></li>
              <li><Link href="/compound-interest-calculator" className={styles.footerLink}>Compound Interest</Link></li>
              <li><Link href="/retirement-calculator" className={styles.footerLink}>Retirement Calculator</Link></li>
              <li><Link href="/roi-calculator" className={styles.footerLink}>ROI Calculator</Link></li>
              <li><Link href="/debt-snowball-calculator" className={styles.footerLink}>Debt Snowball/Avalanche</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div className={styles.footerSection}>
            <h3 className={styles.sectionTitle}>Stay Connected</h3>
            <p className={styles.sectionText}>For questions, feedback, or just to say hello, <Link href="/contactus" className={styles.footerLink}>contact us</Link>.</p>
            
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.footerBottom}>
          <p className={styles.copyright}>&copy; {new Date().getFullYear()} FinanceCalculatorFree. All rights reserved.</p>
          <div className={styles.legalLinks}>
            <Link href="/privacy-policy" className={styles.legalLink}>Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;