'use client';
import Link from 'next/link';
import Head from 'next/head';

const Custom404 = () => {
  return (
    <>
      <Head>
        <title>Page Not Found | FinanceCalculatorFree</title>
        <meta 
          name="description" 
          content="The page you're looking for doesn't exist. Return to our homepage to access 50+ free financial calculators for mortgages, investments, debt, and retirement." 
        />
        <meta name="robots" content="noindex, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </Head>

      <div className="notFoundPage">
        <main className="notFoundMain">
          <div className="notFoundContainer">
            
            {/* Hero Section */}
            <section className="hero">
              <div className="heroContent">
                <h1>404 - Page Not Found</h1>
                <p>Oops! The page you're looking for seems to have gone missing. Don't worry, we'll help you get back to free financial calculations.</p>
              </div>
            </section>

            {/* Mission & Vision Cards */}
            <section className="cardsSection">
              <div className="card mission">
                <h3>What Might Have Happened?</h3>
                <p>
                  The page may have been moved, deleted, or there might be a typo in the URL. 
                  We're constantly improving our site, and sometimes pages get relocated during updates.
                </p>
              </div>
              <div className="card vision">
                <h3>Get Back on Track</h3>
                <p>
                  While we fix this, why not explore our free financial tools? All calculators are 
                  completely free — no sign-ups, no ads, just accurate results.
                </p>
              </div>
            </section>

            {/* Core Values Grid */}
            <section className="valuesSection">
              <h2>Why Choose FinanceCalculatorFree?</h2>
              <div className="valuesGrid">
                <div className="valueCard">
                  <div className="icon">🔐</div>
                  <h4>Privacy First</h4>
                  <p>No tracking, no cookies, no data collection. Your inputs stay on your device.</p>
                </div>
                <div className="valueCard">
                  <div className="icon">🧮</div>
                  <h4>Transparency</h4>
                  <p>We show the formulas behind every result — because knowledge is power.</p>
                </div>
                <div className="valueCard">
                  <div className="icon">🚀</div>
                  <h4>Accessibility</h4>
                  <p>Free for all. No paywalls. No sign-ups. Just tools that work.</p>
                </div>
                <div className="valueCard">
                  <div className="icon">📈</div>
                  <h4>Accuracy</h4>
                  <p>All tools use industry-standard financial math and are regularly audited.</p>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="ctaSection">
              <div className="ctaContent">
                <h2>Ready to Take Control of Your Finances?</h2>
                <p>Explore 50+ free calculators — no login, just results.</p>
                <Link href="/suite" className="ctaButton">
                  <span className="buttonText">Try All Calculators</span>
                  <span className="arrow">→</span>
                </Link>
              </div>
            </section>

          </div>
        </main>
      </div>

      <style jsx>{`
        /* CSS Variables matching About-us page styling */
        :root {
          --primary-bg: #ffffff;
          --text-primary: #0d1b2a;
          --text-secondary: #414a4c;
          --accent-color: #0d1b2a;
          --accent-hover: #1a2d3f;
          --border-color: #e9ecef;
          --card-shadow: 0 4px 12px rgba(13, 27, 42, 0.08);
          --card-shadow-hover: 0 6px 14px rgba(13, 27, 42, 0.12);
          --light-bg: #f8f9fa;
        }

        /* Base Styles - Mobile First */
        .notFoundPage {
          background-color: var(--primary-bg);
          color: var(--text-primary);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          min-height: 100vh;
          min-height: 100dvh;
          display: flex;
          flex-direction: column;
          padding-top: 5rem;
          padding-bottom: 4rem;
        }

        .notFoundMain {
          flex: 1;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          width: 100%;
        }

        .notFoundContainer {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Hero Section */
        .hero {
          padding: 3rem 1.5rem 2rem;
          text-align: center;
          background-color: var(--light-bg);
          margin-top: 0;
        }

        .heroContent h1 {
          font-size: 1.75rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.75rem;
          line-height: 1.3;
        }

        .heroContent p {
          font-size: 0.95rem;
          color: var(--text-secondary);
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.5;
        }

        /* Mission & Vision Cards */
        .cardsSection {
          display: flex;
          gap: 1.2rem;
          padding: 1.8rem 1.5rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .card {
          flex: 1;
          min-width: 280px;
          max-width: 400px;
          padding: 1.3rem;
          border-radius: 10px;
          box-shadow: var(--card-shadow);
          background-color: white;
          border: 1px solid var(--border-color);
          transition: all 0.3s ease;
        }

        .card:hover {
          transform: translateY(-2px);
          box-shadow: var(--card-shadow-hover);
        }

        .card h3 {
          font-size: 1.1rem;
          color: var(--text-primary);
          margin-bottom: 0.7rem;
          font-weight: 600;
        }

        .card p {
          font-size: 0.88rem;
          color: var(--text-secondary);
          line-height: 1.55;
          margin: 0;
        }

        .mission {
          background: linear-gradient(to bottom, #eef5ff, white);
        }

        .vision {
          background: linear-gradient(to bottom, #f0f8f0, white);
        }

        /* Core Values Section */
        .valuesSection {
          padding: 2rem 1.5rem;
          text-align: center;
        }

        .valuesSection h2 {
          font-size: 1.3rem;
          color: var(--text-primary);
          margin-bottom: 1.4rem;
          font-weight: 600;
        }

        .valuesGrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.2rem;
          max-width: 1000px;
          margin: 0 auto;
        }

        .valueCard {
          padding: 1rem;
          border-radius: 8px;
          background-color: white;
          box-shadow: 0 3px 10px rgba(13, 27, 42, 0.06);
          border: 1px solid var(--border-color);
          text-align: center;
          transition: all 0.3s ease;
        }

        .valueCard:hover {
          transform: translateY(-2px);
          box-shadow: var(--card-shadow-hover);
        }

        .valueCard .icon {
          font-size: 1.6rem;
          margin-bottom: 0.6rem;
        }

        .valueCard h4 {
          font-size: 1rem;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .valueCard p {
          font-size: 0.82rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin: 0;
        }

        /* CTA Section */
        .ctaSection {
          padding: 2.2rem 1.5rem;
          background-color: var(--accent-color);
          color: white;
          text-align: center;
        }

        .ctaContent h2 {
          font-size: 1.35rem;
          margin-bottom: 0.6rem;
          font-weight: 600;
        }

        .ctaContent p {
          font-size: 0.9rem;
          color: #cccccc;
          margin-bottom: 1.2rem;
          line-height: 1.5;
        }

        .ctaButton {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          background: white;
          color: var(--accent-color);
          padding: 0.7rem 1.3rem;
          font-size: 0.95rem;
          font-weight: 500;
          border-radius: 6px;
          text-decoration: none;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
        }

        .ctaButton:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 14px rgba(0, 0, 0, 0.1);
          background: #f8f9fa;
        }

        .ctaButton .arrow {
          transition: transform 0.3s ease;
        }

        .ctaButton:hover .arrow {
          transform: translateX(4px);
        }

        /* ===== RESPONSIVE BREAKPOINTS ===== */

        /* Small Phones (320px - 374px) */
        @media (max-width: 374px) {
          .notFoundPage {
            padding-top: 3rem;
            padding-bottom: 2.5rem;
          }

          .hero {
            padding: 2.2rem 1rem 1.5rem;
          }

          .heroContent h1 {
            font-size: 1.4rem;
          }

          .heroContent p {
            font-size: 0.82rem;
          }

          .cardsSection {
            padding: 1.4rem 1rem;
            flex-direction: column;
            gap: 1rem;
          }

          .card {
            min-width: auto;
            max-width: none;
            padding: 1.1rem;
          }

          .card h3 {
            font-size: 1.05rem;
          }

          .valuesSection {
            padding: 1.6rem 1rem;
          }

          .valuesGrid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .ctaSection {
            padding: 1.6rem 1rem;
          }

          .ctaContent h2 {
            font-size: 1.15rem;
          }

          .ctaButton {
            font-size: 0.85rem;
            padding: 0.6rem 1rem;
          }
        }

        /* Medium Phones (375px - 424px) */
        @media (min-width: 375px) and (max-width: 424px) {
          .notFoundPage {
            padding-top: 3.5rem;
            padding-bottom: 3rem;
          }

          .heroContent h1 {
            font-size: 1.5rem;
          }

          .cardsSection {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }

          .card {
            min-width: auto;
            max-width: none;
          }
        }

        /* Large Phones (425px - 767px) */
        @media (min-width: 425px) and (max-width: 767px) {
          .notFoundPage {
            padding-top: 4rem;
            padding-bottom: 3.5rem;
          }

          .cardsSection {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }

          .card {
            min-width: auto;
            max-width: none;
          }

          .valuesGrid {
            grid-template-columns: 1fr 1fr;
          }
        }

        /* Tablets (768px - 1023px) */
        @media (min-width: 768px) and (max-width: 1023px) {
          .notFoundPage {
            padding-top: 4.5rem;
          }

          .heroContent h1 {
            font-size: 2rem;
          }

          .heroContent p {
            font-size: 1.05rem;
          }

          .cardsSection {
            gap: 1.5rem;
          }

          .valuesGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .ctaButton {
            padding: 0.8rem 1.5rem;
            font-size: 1rem;
          }
        }

        /* Desktop (1024px - 1439px) */
        @media (min-width: 1024px) and (max-width: 1439px) {
          .notFoundPage {
            padding-top: 5rem;
          }

          .heroContent h1 {
            font-size: 2.25rem;
          }

          .heroContent p {
            font-size: 1.1rem;
          }

          .valuesGrid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        /* Large Desktop (1440px and above) */
        @media (min-width: 1440px) {
          .notFoundPage {
            padding-top: 5.5rem;
          }

          .heroContent h1 {
            font-size: 2.5rem;
          }

          .heroContent p {
            font-size: 1.15rem;
          }

          .valuesGrid {
            grid-template-columns: repeat(4, 1fr);
            gap: 2rem;
          }

          .ctaButton {
            padding: 0.9rem 1.8rem;
            font-size: 1.05rem;
          }
        }

        /* ===== ACCESSIBILITY & ENHANCEMENTS ===== */

        /* Reduced Motion Support */
        @media (prefers-reduced-motion: reduce) {
          .card,
          .valueCard,
          .ctaButton {
            transition: none;
          }
          
          .card:hover,
          .valueCard:hover,
          .ctaButton:hover {
            transform: none;
          }

          .ctaButton:hover .arrow {
            transform: none;
          }
        }

        /* Dark Mode Support */
        @media (prefers-color-scheme: dark) {
          :root {
            --primary-bg: #1a1a1a;
            --text-primary: #ffffff;
            --text-secondary: #cccccc;
            --accent-color: #2d3748;
            --border-color: #374151;
            --card-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            --card-shadow-hover: 0 6px 14px rgba(0, 0, 0, 0.4);
            --light-bg: #2d3748;
          }

          .card,
          .valueCard {
            background-color: #2d3748;
            border-color: #4a5568;
          }

          .mission {
            background: linear-gradient(to bottom, #2b6cb0, #2d3748);
          }

          .vision {
            background: linear-gradient(to bottom: #22543d, #2d3748);
          }
        }

        /* High Contrast Support */
        @media (prefers-contrast: high) {
          .ctaButton {
            border: 2px solid currentColor;
          }
          
          .card,
          .valueCard {
            border-width: 2px;
          }
        }

        /* Focus States */
        .ctaButton:focus-visible {
          outline: 2px solid var(--accent-color);
          outline-offset: 2px;
        }

        /* Touch Device Optimizations */
        @media (hover: none) and (pointer: coarse) {
          .card:hover,
          .valueCard:hover,
          .ctaButton:hover {
            transform: none;
          }
          
          .ctaButton:active {
            transform: scale(0.98);
          }
        }

        /* Landscape Orientation Optimizations */
        @media (max-height: 500px) and (orientation: landscape) {
          .notFoundPage {
            padding-top: 3rem;
            padding-bottom: 2rem;
          }

          .hero {
            padding: 1.5rem 1rem 1rem;
          }

          .cardsSection {
            padding: 1rem;
          }

          .valuesSection {
            padding: 1rem;
          }

          .ctaSection {
            padding: 1.5rem 1rem;
          }
        }

        /* Safe area insets for notched devices */
        @supports(padding: max(0px)) {
          .notFoundPage {
            padding-left: max(1rem, env(safe-area-inset-left));
            padding-right: max(1rem, env(safe-area-inset-right));
            padding-top: max(5rem, env(safe-area-inset-top));
          }
        }
      `}</style>
    </>
  );
};

export default Custom404;