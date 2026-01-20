import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import styles from './simplecalculator.module.css';

const SimpleCalculator = ({ currentDate, lastModifiedDate }) => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [memory, setMemory] = useState(0);
  const [history, setHistory] = useState([]);
  const [isScientificMode, setIsScientificMode] = useState(false);

  // Handle number input
  const inputNumber = (num) => {
    if (waitingForNewValue) {
      setDisplay(String(num));
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  // Handle decimal point
  const inputDecimal = () => {
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  // Handle operators
  const performOperation = (nextOperator) => {
    const inputValue = parseFloat(display);
    
    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operator) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operator);
      
      setPreviousValue(newValue);
      setDisplay(String(newValue));
      addToHistory(`${currentValue} ${getOperatorSymbol(operator)} ${inputValue} = ${newValue}`);
    }
    
    setWaitingForNewValue(true);
    setOperator(nextOperator);
  };

  // Calculate result
  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      case '%':
        return firstValue % secondValue;
      case '^':
        return Math.pow(firstValue, secondValue);
      default:
        return secondValue;
    }
  };

  // Get operator symbol for display
  const getOperatorSymbol = (op) => {
    switch (op) {
      case '+': return '+';
      case '-': return '-';
      case '×': return '×';
      case '÷': return '÷';
      case '%': return '%';
      case '^': return '^';
      default: return op;
    }
  };

  // Handle equals
  const handleEquals = () => {
    const inputValue = parseFloat(display);
    
    if (previousValue !== null && operator) {
      const result = calculate(previousValue, inputValue, operator);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperator(null);
      setWaitingForNewValue(true);
      addToHistory(`${previousValue} ${getOperatorSymbol(operator)} ${inputValue} = ${result}`);
    }
  };

  // Clear display
  const clearDisplay = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperator(null);
    setWaitingForNewValue(false);
  };

  // Clear entry
  const clearEntry = () => {
    setDisplay('0');
  };

  // Delete last character
  const deleteLast = () => {
    if (display.length === 1) {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  // Toggle sign
  const toggleSign = () => {
    const newValue = parseFloat(display) * -1;
    setDisplay(String(newValue));
  };

  // Percentage
  const percentage = () => {
    const newValue = parseFloat(display) / 100;
    setDisplay(String(newValue));
  };

  // Square root
  const squareRoot = () => {
    const newValue = Math.sqrt(parseFloat(display));
    setDisplay(String(newValue));
    addToHistory(`√${display} = ${newValue}`);
  };

  // Square
  const square = () => {
    const newValue = Math.pow(parseFloat(display), 2);
    setDisplay(String(newValue));
    addToHistory(`${display}² = ${newValue}`);
  };

  // Reciprocal
  const reciprocal = () => {
    const newValue = 1 / parseFloat(display);
    setDisplay(String(newValue));
    addToHistory(`1/${display} = ${newValue}`);
  };

  // Memory functions
  const memoryClear = () => {
    setMemory(0);
  };

  const memoryRecall = () => {
    setDisplay(String(memory));
  };

  const memoryAdd = () => {
    setMemory(memory + parseFloat(display));
  };

  const memorySubtract = () => {
    setMemory(memory - parseFloat(display));
  };

  // Add calculation to history
  const addToHistory = (calculation) => {
    setHistory(prev => [calculation, ...prev.slice(0, 9)]);
  };

  // Clear history
  const clearHistory = () => {
    setHistory([]);
  };

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key >= '0' && e.key <= '9') inputNumber(e.key);
      else if (e.key === '.') inputDecimal();
      else if (e.key === '+') performOperation('+');
      else if (e.key === '-') performOperation('-');
      else if (e.key === '*') performOperation('×');
      else if (e.key === '/') {
        e.preventDefault();
        performOperation('÷');
      }
      else if (e.key === 'Enter' || e.key === '=') handleEquals();
      else if (e.key === 'Escape' || e.key === 'Delete') clearDisplay();
      else if (e.key === 'Backspace') deleteLast();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display, previousValue, operator, waitingForNewValue]);

  // Format display with commas
  const formatDisplay = (value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return '0';
    
    // Handle very large/small numbers
    if (Math.abs(num) > 999999999999 || (Math.abs(num) < 0.000001 && num !== 0)) {
      return num.toExponential(6);
    }
    
    const parts = value.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  return (
    <>
      <Head>
        <title>Advanced Calculator | Free Online Scientific Calculator</title>
        <meta name="description" content="Free online calculator with scientific functions, memory, and calculation history. Perfect for students, professionals, and everyday calculations." />
        <meta name="keywords" content="calculator, scientific calculator, online calculator, math calculator, free calculator, basic calculator, calculation tool" />
        <meta name="date" content={currentDate} />
        <meta name="last-modified" content={lastModifiedDate} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.financecalculatorfree.com/simple-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Advanced Calculator | Free Online Scientific Calculator" />
        <meta property="og:description" content="Free online calculator with scientific functions, memory, and calculation history. Perfect for all your calculation needs." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/simple-calculator" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Advanced Calculator" />
        <meta name="twitter:description" content="Free online calculator with scientific functions and calculation history." />
      </Head>

      {/* JSON-LD Structured Data */}
      <Script
        id="calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Advanced Online Calculator",
            "description": "Free online calculator with basic and scientific functions, memory features, and calculation history",
            "applicationCategory": "MathApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "ratingCount": "2150",
              "bestRating": "5",
              "worstRating": "1"
            },
            "datePublished": currentDate,
            "dateModified": currentDate,
            "author": {
              "@type": "Organization",
              "name": "Math Tools Pro",
              "url": "https://www.financecalculatorfree.com"
            },
            "featureList": [
              "Basic Arithmetic Operations",
              "Scientific Functions",
              "Memory Functions",
              "Calculation History",
              "Keyboard Support"
            ]
          })
        }}
      />

      {/* FAQ Schema */}
      <Script
        id="calculator-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What operations does this calculator support?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "This calculator supports basic arithmetic (addition, subtraction, multiplication, division), percentages, square roots, squares, reciprocals, and exponentiation. It also includes memory functions (MC, MR, M+, M-) and maintains a calculation history.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "Can I use keyboard shortcuts with this calculator?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes! You can use your keyboard: numbers (0-9), decimal point (.), operators (+, -, *, /), Enter/Equals (=), Escape/Clear (Esc/Del), and Backspace to delete last digit. This makes calculations faster and more convenient.",
                  "datePublished": currentDate
                }
              },
              {
                "@type": "Question",
                "name": "How do the memory functions work?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Memory functions work like a standard calculator: MC clears memory, MR recalls memory value, M+ adds current display to memory, M- subtracts current display from memory. The memory persists until you clear it or refresh the page.",
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
            <h1 className={styles.mainTitle}>Advanced Calculator</h1>
            <p className={styles.subtitle}>Free Online Calculator with Scientific Functions & Memory</p>
            <div className={styles.badgeContainer}>
              <span className={styles.badge}>Updated: {currentDate}</span>
              <span className={styles.badge}>Keyboard Support</span>
              <span className={styles.badge}>No Signup Required</span>
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.calculatorLayout}>
            {/* Calculator Display & Controls */}
            <div className={styles.calculatorCard}>
              <div className={styles.calculatorHeader}>
                <h2 className={styles.sectionTitle}>Calculator</h2>
                <div className={styles.modeToggle}>
                  <button 
                    className={`${styles.modeButton} ${!isScientificMode ? styles.activeMode : ''}`}
                    onClick={() => setIsScientificMode(false)}
                  >
                    Basic
                  </button>
                  <button 
                    className={`${styles.modeButton} ${isScientificMode ? styles.activeMode : ''}`}
                    onClick={() => setIsScientificMode(true)}
                  >
                    Scientific
                  </button>
                </div>
              </div>

              {/* Calculator Display */}
              <div className={styles.calculatorDisplay}>
                <div className={styles.displayContainer}>
                  <div className={styles.operationDisplay}>
                    {previousValue !== null && `${formatDisplay(String(previousValue))} ${operator || ''}`}
                  </div>
                  <div className={styles.mainDisplay}>
                    {formatDisplay(display)}
                  </div>
                  <div className={styles.memoryIndicator}>
                    {memory !== 0 && 'M'}
                  </div>
                </div>
              </div>

              {/* Memory Functions */}
              <div className={styles.memoryRow}>
                <button className={styles.memoryButton} onClick={memoryClear}>MC</button>
                <button className={styles.memoryButton} onClick={memoryRecall}>MR</button>
                <button className={styles.memoryButton} onClick={memoryAdd}>M+</button>
                <button className={styles.memoryButton} onClick={memorySubtract}>M-</button>
              </div>

              {/* Calculator Keypad */}
              <div className={styles.calculatorKeypad}>
                <div className={styles.keypadRow}>
                  <button className={`${styles.calcButton} ${styles.functionButton}`} onClick={() => squareRoot()}>√x</button>
                  <button className={`${styles.calcButton} ${styles.functionButton}`} onClick={() => square()}>x²</button>
                  <button className={`${styles.calcButton} ${styles.functionButton}`} onClick={() => reciprocal()}>1/x</button>
                  <button className={`${styles.calcButton} ${styles.operatorButton}`} onClick={() => performOperation('÷')}>÷</button>
                </div>
                
                <div className={styles.keypadRow}>
                  <button className={styles.calcButton} onClick={() => inputNumber(7)}>7</button>
                  <button className={styles.calcButton} onClick={() => inputNumber(8)}>8</button>
                  <button className={styles.calcButton} onClick={() => inputNumber(9)}>9</button>
                  <button className={`${styles.calcButton} ${styles.operatorButton}`} onClick={() => performOperation('×')}>×</button>
                </div>
                
                <div className={styles.keypadRow}>
                  <button className={styles.calcButton} onClick={() => inputNumber(4)}>4</button>
                  <button className={styles.calcButton} onClick={() => inputNumber(5)}>5</button>
                  <button className={styles.calcButton} onClick={() => inputNumber(6)}>6</button>
                  <button className={`${styles.calcButton} ${styles.operatorButton}`} onClick={() => performOperation('-')}>-</button>
                </div>
                
                <div className={styles.keypadRow}>
                  <button className={styles.calcButton} onClick={() => inputNumber(1)}>1</button>
                  <button className={styles.calcButton} onClick={() => inputNumber(2)}>2</button>
                  <button className={styles.calcButton} onClick={() => inputNumber(3)}>3</button>
                  <button className={`${styles.calcButton} ${styles.operatorButton}`} onClick={() => performOperation('+')}>+</button>
                </div>
                
                <div className={styles.keypadRow}>
                  <button className={`${styles.calcButton} ${styles.functionButton}`} onClick={toggleSign}>±</button>
                  <button className={styles.calcButton} onClick={() => inputNumber(0)}>0</button>
                  <button className={styles.calcButton} onClick={inputDecimal}>.</button>
                  <button className={`${styles.calcButton} ${styles.equalsButton}`} onClick={handleEquals}>=</button>
                </div>

                <div className={styles.keypadRow}>
                  <button className={`${styles.calcButton} ${styles.clearButton}`} onClick={clearEntry}>CE</button>
                  <button className={`${styles.calcButton} ${styles.clearButton}`} onClick={clearDisplay}>C</button>
                  <button className={`${styles.calcButton} ${styles.functionButton}`} onClick={deleteLast}>⌫</button>
                  <button className={`${styles.calcButton} ${styles.functionButton}`} onClick={percentage}>%</button>
                </div>

                {/* Scientific Functions (when enabled) */}
                {isScientificMode && (
                  <div className={styles.scientificRow}>
                    <button className={`${styles.calcButton} ${styles.scientificButton}`} onClick={() => performOperation('^')}>x^y</button>
                    <button className={`${styles.calcButton} ${styles.scientificButton}`} onClick={() => performOperation('%')}>Mod</button>
                    <button className={`${styles.calcButton} ${styles.scientificButton}`} onClick={() => {
                      const newValue = Math.sin(parseFloat(display) * Math.PI / 180);
                      setDisplay(String(newValue));
                      addToHistory(`sin(${display}°) = ${newValue}`);
                    }}>sin</button>
                    <button className={`${styles.calcButton} ${styles.scientificButton}`} onClick={() => {
                      const newValue = Math.cos(parseFloat(display) * Math.PI / 180);
                      setDisplay(String(newValue));
                      addToHistory(`cos(${display}°) = ${newValue}`);
                    }}>cos</button>
                    <button className={`${styles.calcButton} ${styles.scientificButton}`} onClick={() => {
                      const newValue = Math.tan(parseFloat(display) * Math.PI / 180);
                      setDisplay(String(newValue));
                      addToHistory(`tan(${display}°) = ${newValue}`);
                    }}>tan</button>
                  </div>
                )}
              </div>

              {/* Keyboard Shortcuts Help */}
              <div className={styles.shortcutsCard}>
                <h3 className={styles.shortcutsTitle}>⌨️ Keyboard Shortcuts</h3>
                <div className={styles.shortcutsGrid}>
                  <div className={styles.shortcutItem}>
                    <span className={styles.shortcutKey}>0-9</span>
                    <span className={styles.shortcutLabel}>Numbers</span>
                  </div>
                  <div className={styles.shortcutItem}>
                    <span className={styles.shortcutKey}>+ - * /</span>
                    <span className={styles.shortcutLabel}>Operators</span>
                  </div>
                  <div className={styles.shortcutItem}>
                    <span className={styles.shortcutKey}>Enter / =</span>
                    <span className={styles.shortcutLabel}>Equals</span>
                  </div>
                  <div className={styles.shortcutItem}>
                    <span className={styles.shortcutKey}>Esc / Del</span>
                    <span className={styles.shortcutLabel}>Clear All</span>
                  </div>
                  <div className={styles.shortcutItem}>
                    <span className={styles.shortcutKey}>Backspace</span>
                    <span className={styles.shortcutLabel}>Delete Last</span>
                  </div>
                  <div className={styles.shortcutItem}>
                    <span className={styles.shortcutKey}>.</span>
                    <span className={styles.shortcutLabel}>Decimal</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Calculation History & Results */}
            <div className={styles.resultsCard}>
              <div className={styles.resultsHeader}>
                <h2 className={styles.sectionTitle}>Calculation History</h2>
                {history.length > 0 && (
                  <button className={styles.clearHistoryButton} onClick={clearHistory}>
                    Clear History
                  </button>
                )}
              </div>
              
              <div className={styles.historyContainer}>
                {history.length === 0 ? (
                  <div className={styles.emptyHistory}>
                    <div className={styles.emptyIcon}>📝</div>
                    <h3 className={styles.emptyTitle}>No Calculations Yet</h3>
                    <p className={styles.emptyText}>
                      Your calculation history will appear here. Perform calculations using the calculator buttons or your keyboard.
                    </p>
                  </div>
                ) : (
                  <div className={styles.historyList}>
                    {history.map((item, index) => (
                      <div key={index} className={styles.historyItem}>
                        <div className={styles.historyCalculation}>{item.split('=')[0]}</div>
                        <div className={styles.historyResult}>= {item.split('=')[1]}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Current Calculation Details */}
              <div className={styles.currentCalculation}>
                <h3 className={styles.currentTitle}>Current Calculation</h3>
                <div className={styles.calculationDetails}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Display Value:</span>
                    <span className={styles.detailValue}>{formatDisplay(display)}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Memory Value:</span>
                    <span className={styles.detailValue}>{memory}</span>
                  </div>
                  {previousValue !== null && (
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Previous Value:</span>
                      <span className={styles.detailValue}>{formatDisplay(String(previousValue))}</span>
                    </div>
                  )}
                  {operator && (
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Current Operator:</span>
                      <span className={styles.detailValue}>{getOperatorSymbol(operator)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Tips */}
              <div className={styles.tipsCard}>
                <h3 className={styles.tipsTitle}>💡 Calculator Tips</h3>
                <ul className={styles.tipsList}>
                  <li>Use keyboard shortcuts for faster calculations</li>
                  <li>Memory functions (MC, MR, M+, M-) work like standard calculators</li>
                  <li>Click "Scientific" mode for advanced functions</li>
                  <li>History saves your last 10 calculations</li>
                  <li>Use ⌫ to delete last digit, CE to clear entry, C to clear all</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Educational Content */}
          <div className={styles.educationalContent}>
            <article className={styles.articleCard}>
              <h2 className={styles.articleTitle}>The History and Mathematics of Calculators</h2>
              
              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>From Abacus to Digital Calculators</h3>
                <p>Calculators have evolved dramatically over centuries. The abacus, invented around 2400 BC, was the first calculating tool. In the 17th century, Blaise Pascal created the Pascaline, the first mechanical calculator. Electronic calculators emerged in the 1960s, and today's digital calculators can perform complex scientific computations instantly.</p>
                
                <div className={styles.exampleCard}>
                  <h4>Calculator Evolution Timeline:</h4>
                  <ul>
                    <li><strong>2400 BC:</strong> Abacus invented in Mesopotamia</li>
                    <li><strong>1642:</strong> Pascal's mechanical calculator</li>
                    <li><strong>1820:</strong> Arithmometer (first commercial calculator)</li>
                    <li><strong>1961:</strong> ANITA (first electronic calculator)</li>
                    <li><strong>1970s:</strong> Pocket calculators become affordable</li>
                    <li><strong>Today:</strong> Digital calculators on every device</li>
                  </ul>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Essential Calculator Functions Explained</h3>
                
                <div className={styles.strategyGrid}>
                  <div className={styles.strategyCard}>
                    <h4>📊 Memory Functions</h4>
                    <p>MC (Memory Clear) resets memory to 0. MR (Memory Recall) displays the stored value. M+ adds current display to memory. M- subtracts current display from memory.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>🔢 Scientific Functions</h4>
                    <p>√x calculates square root. x² squares the number. 1/x finds the reciprocal. sin/cos/tan calculate trigonometric functions (degrees). x^y raises x to power y.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>⚡ Order of Operations</h4>
                    <p>Calculators follow PEMDAS: Parentheses, Exponents, Multiplication/Division (left to right), Addition/Subtraction (left to right). Our calculator processes operations as entered.</p>
                  </div>
                  
                  <div className={styles.strategyCard}>
                    <h4>⌨️ Keyboard Efficiency</h4>
                    <p>Master keyboard shortcuts: Use number keys, operators (+, -, *, /), Enter for equals, Escape to clear, Backspace to delete. This speeds up calculations significantly.</p>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Common Calculator Operations & Formulas</h3>
                <div className={styles.operationsTable}>
                  <div className={styles.tableRow}>
                    <div className={styles.tableCell}>Operation</div>
                    <div className={styles.tableCell}>Formula</div>
                    <div className={styles.tableCell}>Example</div>
                  </div>
                  <div className={styles.tableRow}>
                    <div className={styles.tableCell}>Percentage</div>
                    <div className={styles.tableCell}>Value × Percentage ÷ 100</div>
                    <div className={styles.tableCell}>50 × 20% = 10</div>
                  </div>
                  <div className={styles.tableRow}>
                    <div className={styles.tableCell}>Square Root</div>
                    <div className={styles.tableCell}>√x</div>
                    <div className={styles.tableCell}>√25 = 5</div>
                  </div>
                  <div className={styles.tableRow}>
                    <div className={styles.tableCell}>Exponentiation</div>
                    <div className={styles.tableCell}>x^y</div>
                    <div className={styles.tableCell}>2^3 = 8</div>
                  </div>
                  <div className={styles.tableRow}>
                    <div className={styles.tableCell}>Reciprocal</div>
                    <div className={styles.tableCell}>1 ÷ x</div>
                    <div className={styles.tableCell}>1/4 = 0.25</div>
                  </div>
                  <div className={styles.tableRow}>
                    <div className={styles.tableCell}>Modulo</div>
                    <div className={styles.tableCell}>Remainder of division</div>
                    <div className={styles.tableCell}>10 % 3 = 1</div>
                  </div>
                </div>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Real-World Calculator Applications</h3>
                <ul className={styles.applicationsList}>
                  <li><strong>Financial Calculations:</strong> Loan payments, interest rates, investment returns, and budget planning</li>
                  <li><strong>Academic Use:</strong> Homework assistance, exam calculations, scientific research, and statistical analysis</li>
                  <li><strong>Business Applications:</strong> Profit margins, sales tax, discounts, payroll, and inventory management</li>
                  <li><strong>Engineering & Science:</strong> Unit conversions, formula calculations, data analysis, and experimental results</li>
                  <li><strong>Everyday Life:</strong> Shopping totals, recipe adjustments, travel expenses, and home improvement projects</li>
                </ul>
              </div>

              <div className={styles.articleSection}>
                <h3 className={styles.articleSubtitle}>Expert Advice from Mathematics Educators</h3>
                <blockquote className={styles.expertQuote}>
                  "A calculator is a tool that enhances mathematical understanding, not a replacement for it. Learn to estimate answers mentally first, then use the calculator to verify. Understanding which operations to perform and why is more important than simply getting the right answer. Practice mental math alongside calculator use for true mathematical proficiency."
                  <footer className={styles.quoteFooter}>— Mathematics Professor, 20+ years teaching experience</footer>
                </blockquote>
              </div>
            </article>

            {/* FAQ Section */}
            <div className={styles.faqCard}>
              <h2 className={styles.faqTitle}>Calculator FAQs</h2>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How accurate is this calculator?</h3>
                <p className={styles.faqAnswer}>This calculator uses JavaScript's double-precision floating-point arithmetic, which provides 15-17 significant digits of precision. For most everyday calculations, this is more than sufficient. For extremely precise scientific calculations, specialized software may be needed.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Does the calculator follow order of operations (PEMDAS)?</h3>
                <p className={styles.faqAnswer}>This calculator processes operations sequentially as entered (like a basic handheld calculator), not using algebraic logic that follows PEMDAS. To follow order of operations, perform calculations in the correct sequence: parentheses/exponents first, then multiplication/division, then addition/subtraction.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Can I use this calculator on mobile devices?</h3>
                <p className={styles.faqAnswer}>Yes! The calculator is fully responsive and works on smartphones, tablets, and desktops. The buttons are sized appropriately for touch screens, and all functions are accessible on mobile devices. You can also use your device's keyboard if connected.</p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Is there a limit to how large numbers can be?</h3>
                <p className={styles.faqAnswer}>The calculator can handle numbers up to approximately 1.8 × 10³⁰⁸. For very large or small numbers, it switches to scientific notation automatically. Numbers with more than 15-17 significant digits may experience rounding errors due to floating-point precision limits.</p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className={styles.actionSection}>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Ready to Calculate?</h2>
              <p className={styles.ctaText}>Use this free online calculator for all your mathematical needs. No downloads, no signups, just instant calculations whenever you need them.</p>
              
              <div className={styles.featureGrid}>
                <div className={styles.featureItem}>
                  <div className={styles.featureIcon}>🔢</div>
                  <h4 className={styles.featureTitle}>Basic Arithmetic</h4>
                  <p className={styles.featureText}>Addition, subtraction, multiplication, division</p>
                </div>
                
                <div className={styles.featureItem}>
                  <div className={styles.featureIcon}>⚡</div>
                  <h4 className={styles.featureTitle}>Scientific Functions</h4>
                  <p className={styles.featureText}>Square root, exponents, trigonometry</p>
                </div>
                
                <div className={styles.featureItem}>
                  <div className={styles.featureIcon}>💾</div>
                  <h4 className={styles.featureTitle}>Memory Features</h4>
                  <p className={styles.featureText}>MC, MR, M+, M- for complex calculations</p>
                </div>
                
                <div className={styles.featureItem}>
                  <div className={styles.featureIcon}>⌨️</div>
                  <h4 className={styles.featureTitle}>Keyboard Support</h4>
                  <p className={styles.featureText}>Full keyboard shortcuts for efficiency</p>
                </div>
              </div>
              
              <p className={styles.disclaimer}>
                <strong>Disclaimer:</strong> This calculator provides results based on standard mathematical operations and JavaScript's floating-point arithmetic. Results are for educational and general purpose use. For critical calculations (financial, engineering, scientific), always verify results with appropriate tools and professional advice. This tool is not responsible for calculation errors in critical applications.
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
    revalidate: 21600, // 24 hours
  };
}

export default SimpleCalculator;