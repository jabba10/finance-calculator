import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './markupcalculator.module.css';

const MarkupCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [cost, setCost] = useState('');
  const [markupPercent, setMarkupPercent] = useState('');
  const [result, setResult] = useState(null);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const costValue = parseFloat(cost);
    const markupValue = parseFloat(markupPercent);

    // Validation
    if (isNaN(costValue) || isNaN(markupValue)) {
      alert("Please enter valid numbers in all fields");
      return;
    }

    if (costValue <= 0) {
      alert("Cost must be greater than zero.");
      return;
    }

    if (markupValue < 0) {
      alert("Markup percentage cannot be negative.");
      return;
    }

    // Calculations
    const markupAmount = (costValue * markupValue) / 100;
    const sellingPrice = costValue + markupAmount;
    const grossProfit = sellingPrice - costValue;
    const marginPercent = (grossProfit / sellingPrice) * 100;

    setResult({
      cost: costValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      markupPercent: markupValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      markupAmount: markupAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      sellingPrice: sellingPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      grossProfit: grossProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      marginPercent: marginPercent.toFixed(2)
    });
  };

  // Magnetic effect on CTA button
  const handleMouseMove = (e) => {
    const el = ctaButtonRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--x', `${x}px`);
    el.style.setProperty('--y', `${y}px`);
  };

  // SEO Metadata - Enhanced with comprehensive markup keywords
  const siteUrl = 'https://www.financecalculatorfree.com';
  const pageTitle = 'Free Markup Calculator 2024 | Selling Price & Profit Margin Tool';
  const pageDescription = 'Calculate product markup, selling price, and profit margin instantly. Free markup calculator for retail, wholesale, and service businesses.';

  // Comprehensive SEO Keywords Collections for Markup Calculator
  const singleKeywords = [
    'markup', 'calculator', 'pricing', 'profit', 'margin', 'cost', 'price', 
    'selling', 'retail', 'wholesale', 'percentage', 'amount', 'gross', 
    'net', 'revenue', 'income', 'expense', 'overhead', 'labor', 'materials', 
    'product', 'service', 'business', 'commerce', 'trade', 'merchandise', 
    'inventory', 'stock', 'sku', 'cogs', 'margin', 'markup', 'discount', 
    'sale', 'clearance', 'promotion', 'strategy', 'competitive', 'market', 
    'value', 'premium', 'economy', 'luxury', 'budget', 'affordable', 
    'expensive', 'cheap', 'wholesale', 'retail', 'distributor', 'manufacturer',
    'supplier', 'vendor', 'reseller', 'retailer', 'ecommerce', 'online',
    'brick', 'mortar', 'storefront', 'boutique', 'chain', 'franchise'
  ];

  const twoWordKeywords = [
    'markup calculator', 'profit margin', 'selling price', 'pricing strategy', 
    'cost price', 'retail price', 'wholesale price', 'gross profit', 
    'net profit', 'profit percentage', 'margin calculator', 'pricing calculator', 
    'retail markup', 'wholesale markup', 'product pricing', 'service pricing', 
    'business pricing', 'competitive pricing', 'value pricing', 'premium pricing', 
    'economy pricing', 'discount pricing', 'sale pricing', 'clearance pricing', 
    'promotional pricing', 'dynamic pricing', 'psychological pricing', 
    'price optimization', 'price setting', 'price calculation', 'cost analysis', 
    'profit analysis', 'margin analysis', 'pricing model', 'pricing structure', 
    'price point', 'break even', 'cost plus', 'keystone pricing', 'manufacturer pricing',
    'distributor pricing', 'reseller pricing', 'retailer pricing', 'ecommerce pricing',
    'online pricing', 'brick and mortar', 'store pricing', 'boutique pricing',
    'chain store', 'franchise pricing', 'inventory pricing', 'stock pricing',
    'sku pricing', 'product cost', 'service cost', 'labor cost', 'material cost',
    'overhead cost', 'operating cost', 'fixed cost', 'variable cost', 'direct cost',
    'indirect cost', 'total cost', 'unit cost', 'average cost', 'marginal cost'
  ];

  const longTailKeywords = [
    'free online markup calculator for small business',
    'how to calculate markup percentage on cost',
    'retail markup calculator for clothing store',
    'wholesale markup calculator for distributors',
    'restaurant menu pricing calculator with food cost',
    'ecommerce product pricing calculator with shipping',
    'manufacturing markup calculator with labor costs',
    'service business pricing calculator hourly rate',
    'how to calculate selling price from cost and margin',
    'profit margin calculator for retail products',
    'markup vs margin calculator difference explained',
    'free pricing calculator for startup business',
    'retail store markup calculator inventory management',
    'wholesale distributor markup calculator bulk pricing',
    'manufacturer suggested retail price calculator MSRP',
    'service industry markup calculator for contractors',
    'consulting business pricing calculator per hour',
    'freelance pricing calculator for self-employed',
    'product pricing calculator for Shopify store',
    'Amazon FBA pricing calculator with fees',
    'Etsy pricing calculator for handmade products',
    'ebay pricing calculator with shipping costs',
    'online course pricing calculator for digital products',
    'software pricing calculator for SaaS business',
    'mobile app pricing calculator for developers',
    'digital product pricing calculator for creators',
    'physical product pricing calculator with manufacturing',
    'import export pricing calculator with duties',
    'dropshipping pricing calculator with supplier costs',
    'print on demand pricing calculator for custom products',
    'subscription box pricing calculator monthly cost',
    'membership site pricing calculator for online community',
    'coaching business pricing calculator for packages',
    'agency pricing calculator for marketing services',
    'legal services pricing calculator for law firms',
    'medical practice pricing calculator for healthcare',
    'dental services pricing calculator for procedures',
    'veterinary services pricing calculator for pet care',
    'home services pricing calculator for contractors',
    'cleaning services pricing calculator per hour',
    'landscaping pricing calculator for yard work',
    'construction pricing calculator for projects',
    'remodeling pricing calculator for home improvement',
    'plumbing services pricing calculator for repairs',
    'electrical services pricing calculator for installations',
    'auto repair pricing calculator for mechanics',
    'beauty services pricing calculator for salon',
    'spa services pricing calculator for treatments',
    'fitness services pricing calculator for trainers',
    'yoga studio pricing calculator for classes',
    'photography pricing calculator for sessions',
    'videography pricing calculator for projects',
    'graphic design pricing calculator for freelance',
    'web design pricing calculator for websites',
    'SEO services pricing calculator for agencies',
    'digital marketing pricing calculator for campaigns',
    'social media pricing calculator for management',
    'content creation pricing calculator for writers',
    'translation services pricing calculator for languages',
    'tutoring services pricing calculator for education',
    'music lessons pricing calculator for instructors',
    'art classes pricing calculator for workshops',
    'event planning pricing calculator for weddings',
    'catering services pricing calculator for events',
    'bakery pricing calculator for baked goods',
    'coffee shop pricing calculator for beverages',
    'food truck pricing calculator for mobile business',
    'farmers market pricing calculator for produce',
    'craft fair pricing calculator for handmade items',
    'flea market pricing calculator for resellers',
    'antique store pricing calculator for vintage items',
    'consignment shop pricing calculator for used goods',
    'thrift store pricing calculator for secondhand',
    'pawn shop pricing calculator for loans',
    'jewelry store pricing calculator for precious metals',
    'watch store pricing calculator for luxury items',
    'electronics store pricing calculator for gadgets',
    'furniture store pricing calculator for home goods',
    'appliance store pricing calculator for home electronics',
    'sporting goods pricing calculator for equipment',
    'book store pricing calculator for publications',
    'toy store pricing calculator for children items',
    'pet store pricing calculator for animal supplies',
    'garden center pricing calculator for plants',
    'hardware store pricing calculator for tools',
    'auto parts pricing calculator for vehicles',
    'pharmacy pricing calculator for medications',
    'convenience store pricing calculator for quick items',
    'grocery store pricing calculator for food items',
    'liquor store pricing calculator for beverages',
    'smoke shop pricing calculator for tobacco',
    'gun store pricing calculator for firearms',
    'outdoor store pricing calculator for camping',
    'fashion boutique pricing calculator for clothing',
    'shoe store pricing calculator for footwear',
    'accessory store pricing calculator for jewelry',
    'beauty supply pricing calculator for cosmetics',
    'vitamin store pricing calculator for supplements',
    'office supply pricing calculator for stationery',
    'art supply pricing calculator for materials',
    'music store pricing calculator for instruments',
    'game store pricing calculator for entertainment',
    'comic store pricing calculator for collectibles',
    'hobby store pricing calculator for crafts'
  ];

  const allKeywords = [...singleKeywords, ...twoWordKeywords, ...longTailKeywords].join(', ');

  return (
    <>
      <Head>
        {/* Basic Meta */}
        <html lang="en" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={allKeywords} />
        <meta name="author" content="Calci Financial Tools" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        
        {/* Additional Meta Tags */}
        <meta name="subject" content="Markup Calculator & Pricing Strategy" />
        <meta name="classification" content="Business, Retail, Pricing, Calculators, Profit Analysis" />
        <meta name="topic" content="Product Pricing and Markup Calculation" />
        <meta name="summary" content="Free online markup calculator for product and service pricing" />
        <meta name="url" content={`${siteUrl}/markup-calculator`} />
        
        {/* Verification & Ownership */}
        <meta name="google-site-verification" content="your_verification_code" />
        <meta name="msvalidate.01" content="your_bing_verification" />
        
        {/* Location & Business */}
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="United States" />
        <meta name="geo.position" content="39.8283;-98.5795" />
        <meta name="ICBM" content="39.8283, -98.5795" />
        
        {/* Canonical */}
        <link rel="canonical" href={`${siteUrl}/markup-calculator`} />
        
        {/* Alternate Languages */}
        <link rel="alternate" href={`${siteUrl}/markup-calculator`} hrefLang="x-default" />
        <link rel="alternate" href={`${siteUrl}/markup-calculator`} hrefLang="en" />
        <link rel="alternate" href={`${siteUrl}/es/markup-calculator`} hrefLang="es" />
        
        {/* Preload & Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/markup-calculator`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={`${siteUrl}/images/markup-calculator-preview.jpg`} />
        <meta property="og:image:alt" content="Markup Calculator Interface for Pricing Strategy" />
        <meta property="og:site_name" content="Calci Financial Calculators" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:see_also" content={siteUrl} />
        
        {/* Facebook */}
        <meta property="fb:app_id" content="your_facebook_app_id" />
        <meta property="fb:pages" content="your_facebook_page_id" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@calcifinance" />
        <meta name="twitter:creator" content="@calcifinance" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={`${siteUrl}/images/markup-calculator-preview.jpg`} />
        <meta name="twitter:image:alt" content="Free Markup Calculator for Business Pricing" />
        
        {/* Additional Social */}
        <meta name="pinterest" content="nopin" description="Free markup calculator for product pricing" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: pageTitle,
            description: pageDescription,
            url: `${siteUrl}/markup-calculator`,
            mainEntity: {
              '@type': 'SoftwareApplication',
              name: 'Markup Calculator',
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'Any',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD'
              },
              description: 'Free online markup calculator for calculating selling prices, profit margins, and optimal pricing strategies for products and services.',
              featureList: [
                'Markup percentage calculation',
                'Selling price determination',
                'Profit margin analysis',
                'Multiple pricing strategies',
                'Industry benchmark comparisons'
              ],
              processorRequirements: 'Web browser',
              permission: 'No special permissions required'
            },
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
                { '@type': 'ListItem', position: 2, name: 'Markup Calculator', item: `${siteUrl}/markup-calculator` }
              ]
            },
            publisher: {
              '@type': 'Organization',
              name: 'Calci Financial Tools',
              url: siteUrl,
              logo: `${siteUrl}/images/logo.png`,
              sameAs: [
                'https://twitter.com/calcifinance',
                'https://www.linkedin.com/company/calci-finance',
                'https://www.facebook.com/calcifinance'
              ]
            }
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowToTool',
            name: 'Markup Calculator',
            description: 'A tool for calculating product markup, selling prices, and profit margins',
            url: `${siteUrl}/markup-calculator`,
            step: [
              {
                '@type': 'HowToStep',
                name: 'Enter Product Cost',
                text: 'Input your total cost to produce or purchase the product including materials, labor, and overhead'
              },
              {
                '@type': 'HowToStep',
                name: 'Set Markup Percentage',
                text: 'Enter your desired markup percentage based on industry standards and profit goals'
              },
              {
                '@type': 'HowToStep',
                name: 'Calculate Pricing',
                text: 'View your optimal selling price, markup amount, and profit margin percentage'
              },
              {
                '@type': 'HowToStep',
                name: 'Compare Strategies',
                text: 'Analyze different markup percentages to find your ideal pricing strategy'
              }
            ],
            tool: ['Cost calculator', 'Markup percentage selector', 'Price optimizer', 'Margin analyzer'],
            about: {
              '@type': 'Thing',
              name: 'Product Pricing Strategy'
            },
            audience: {
              '@type': 'Audience',
              audienceType: ['Retailers', 'Wholesalers', 'Manufacturers', 'Service Providers', 'Ecommerce Sellers']
            }
          })}
        </script>

        {/* Additional FAQ Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'Is this markup calculator completely free to use?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes, our markup calculator is 100% free with no hidden costs, registration requirements, or usage limits. You can calculate pricing for as many products as needed.'
                }
              },
              {
                '@type': 'Question',
                name: 'What is the difference between markup and margin?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Markup is the percentage added to the cost price to determine selling price, while margin is the percentage of the selling price that represents profit. A 50% markup equals a 33% margin.'
                }
              },
              {
                '@type': 'Question',
                name: 'Can I use this calculator for service-based businesses?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Absolutely! For service businesses, consider your hourly rate or project cost as the "product cost" and apply your desired markup to determine your service pricing.'
                }
              },
              {
                '@type': 'Question',
                name: 'How do I determine the right markup percentage for my business?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Consider your industry benchmarks, competitor pricing, target profit margins, overhead costs, and market positioning. Most businesses use 20-50% markup, but this varies widely by industry.'
                }
              },
              {
                '@type': 'Question',
                name: 'Does this calculator account for all business expenses?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'This calculator focuses on direct product costs and markup. For comprehensive pricing, ensure your cost includes all direct expenses, and your markup should also cover indirect overhead and desired profit.'
                }
              },
              {
                '@type': 'Question',
                name: 'Can I save my pricing calculations?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'All calculations are performed locally in your browser session. For permanent storage, we recommend recording your results in your business records or spreadsheet.'
                }
              },
              {
                '@type': 'Question',
                name: 'What markup should I use for my specific industry?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Markup varies by industry: Retail clothing 50-100%, Electronics 15-30%, Restaurants 60-300%, Manufacturing 20-50%. Research your specific industry for accurate benchmarks.'
                }
              }
            ]
          })}
        </script>
      </Head>

      {/* Gap above content (from navbar) */}
      <div className={styles.spacerTop}></div>

      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Markup Calculator</h1>
          <p className={styles.subtitle}>
            Calculate your selling price, markup amount, and profit margin for optimal pricing strategy.
          </p>
        </section>

        {/* Calculator Section */}
        <section>
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter your product cost and desired markup percentage.
              </p>

              <div className={styles.inputGroup}>
                <label htmlFor="cost" className={styles.label}>
                  Product Cost ($)
                </label>
                <input
                  id="cost"
                  type="number"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  placeholder="e.g. 50.00"
                  className={styles.input}
                  min="0.01"
                  step="any"
                  required
                />
                <small className={styles.note}>
                  The cost to produce or purchase the product
                </small>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="markupPercent" className={styles.label}>
                  Markup Percentage (%)
                </label>
                <input
                  id="markupPercent"
                  type="number"
                  value={markupPercent}
                  onChange={(e) => setMarkupPercent(e.target.value)}
                  placeholder="e.g. 30"
                  className={styles.input}
                  min="0"
                  step="any"
                  required
                />
                <small className={styles.note}>
                  The percentage you want to add to the cost
                </small>
              </div>

              <button type="submit" className={styles.submitBtn}>
                <span className="taxpro-btn-label">Calculate Markup</span>
                <span className="taxpro-btn-arrow">→</span>
              </button>
            </form>

            {result && (
              <div className={styles.resultSection}>
                <h3>Markup Calculation Results</h3>
                <div className={styles.resultGrid}>
                  <div className={styles.resultItem}>
                    <strong>Cost:</strong> ${result.cost}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Markup %:</strong> {result.markupPercent}%
                  </div>
                  <div className={`${styles.resultItem} ${styles.highlight}`}>
                    <strong>Selling Price:</strong> ${result.sellingPrice}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Markup Amount:</strong> ${result.markupAmount}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Gross Profit:</strong> ${result.grossProfit}
                  </div>
                  <div className={styles.resultItem}>
                    <strong>Profit Margin:</strong> {result.marginPercent}%
                  </div>
                </div>
                <div className={styles.note}>
                  At a {result.markupPercent}% markup, your profit margin is <strong>{result.marginPercent}%</strong> of the selling price.
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h3>Why Markup Matters</h3>
            <p>
              <strong>Markup pricing</strong> is essential for ensuring your business remains profitable. It helps you determine the right selling price by adding a percentage to your product cost. Understanding markup vs. margin helps you <strong>price competitively, cover overhead, and achieve desired profitability</strong>.
            </p>

            <h4>How to Use This Calculator</h4>
            <ul className={styles.list}>
              <li><strong>Product Cost:</strong> Your cost to produce or purchase the item (materials, labor, shipping, etc.)</li>
              <li><strong>Markup Percentage:</strong> The percentage you want to add to the cost to determine selling price</li>
              <li>Click "Calculate Markup" to see your selling price and profit margin</li>
            </ul>

            <h4>Formulas Used</h4>
            <div className={styles.formula}>
              <code>Selling Price = Cost + (Cost × Markup Percentage / 100)</code>
            </div>
            <div className={styles.formula}>
              <code>Profit Margin = (Selling Price - Cost) / Selling Price × 100</code>
            </div>
            <p>
              <strong>Example:</strong> $50 cost with 30% markup → $50 + ($50 × 0.30) = <strong>$65 selling price</strong>
              <br />
              Profit Margin = ($65 - $50) / $65 × 100 = <strong>23.08% margin</strong>
            </p>

            <h4>Markup vs. Margin</h4>
            <p>
              While often confused, markup and margin are different:
            </p>
            <ul className={styles.list}>
              <li><strong>Markup</strong> is the amount added to the cost price to determine selling price</li>
              <li><strong>Margin</strong> is the percentage of the selling price that is profit</li>
              <li>A 50% markup equals a 33% margin (on $100 cost: $150 selling price → $50 profit is 33% of $150)</li>
            </ul>

            <h4>Industry Benchmarks (Typical Markups)</h4>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Industry</th>
                  <th>Average Markup</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Retail (Clothing)</td>
                  <td>50-100%</td>
                </tr>
                <tr>
                  <td>Electronics</td>
                  <td>15-30%</td>
                </tr>
                <tr>
                  <td>Restaurants</td>
                  <td>60-300%</td>
                </tr>
                <tr>
                  <td>Manufacturing</td>
                  <td>20-50%</td>
                </tr>
                <tr>
                  <td>Jewelry</td>
                  <td>100-500%</td>
                </tr>
              </tbody>
            </table>

            <h4>Pricing Strategy Tips</h4>
            <ul className={styles.list}>
              <li>✅ <strong>Know your costs</strong> — include all expenses (materials, labor, overhead)</li>
              <li>✅ <strong>Research competitors</strong> — price competitively but don't race to the bottom</li>
              <li>✅ <strong>Consider value-based pricing</strong> — charge what customers are willing to pay</li>
              <li>✅ <strong>Adjust for volume</strong> — lower markup for high-volume products</li>
              <li>✅ <strong>Review regularly</strong> — update prices as costs and market conditions change</li>
            </ul>

            <h4>Advanced Pricing Considerations</h4>
            <p>
              For more sophisticated pricing strategies:
            </p>
            <ul className={styles.list}>
              <li><strong>Psychological pricing:</strong> $9.99 instead of $10</li>
              <li><strong>Tiered pricing:</strong> Different prices for different versions/quantities</li>
              <li><strong>Bundle pricing:</strong> Discounts for purchasing multiple items together</li>
              <li><strong>Dynamic pricing:</strong> Adjust prices based on demand, time, or customer</li>
            </ul>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <h2 className={styles.ctaSectionHeading}>
            Free Financial Planning Tools: Budget, Invest & Plan Retirement
          </h2>
          <p className={styles.ctaSectionSubtext}>
            Free Financial Planning Tools – Try Now
          </p>
          <Link href="/suite" passHref legacyBehavior>
            <a
              className={styles.ctaButton}
              ref={ctaButtonRef}
              onMouseMove={handleMouseMove}
            >
              <span className="btn-label">Explore All Calculators</span>
              <span className="btn-icon" aria-hidden="true">→</span>
            </a>
          </Link>
        </section>
      </div>

      {/* Gap below content (before footer) */}
      <div className={styles.spacerBottom}></div>
    </>
  );
};

export default MarkupCalculator;